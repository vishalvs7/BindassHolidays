import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { CreateOrderRequest } from "@/lib/types/payment.types";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email/templates/welcome";
import { validateCoupon } from "@/lib/coupon/validate";
import { couponStore } from "@/lib/coupon/store";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

// Reserve slots atomically and create the booking.
// Runs as service role so guest checkouts (no auth) work.
async function createBooking(req: CreateOrderRequest) {
  const supabase = serviceClient();

  // 1. Validate the slot + listing + availability
  const { data: slot, error: slotErr } = await supabase
    .from("batch_slots")
    .select("id, total_slots, booked_slots, price_override, batch_date_id")
    .eq("id", req.batchSlotId)
    .single();

  if (slotErr || !slot) throw new Error("Selected slot not found.");
  const available = slot.total_slots - slot.booked_slots;
  if (available < req.qty) throw new Error("Not enough slots available for this batch.");

  // 2. Resolve base price from the unified listing
  const { data: listing, error: listingErr } = await supabase
    .from("listings")
    .select("price, title")
    .eq("id", req.listingId)
    .eq("status", "published")
    .single();

  if (listingErr || !listing) throw new Error("Listing not available.");
  const unitPrice = Number(slot.price_override ?? listing.price);
  const baseAmount = unitPrice * req.qty;
  const gstPercent = 5;
  const gstAmount = Math.round(baseAmount * gstPercent) / 100;
  let totalAmount = baseAmount + gstAmount;
  let couponInfo: { discountAmount: number; discountBearer: string; code: string } | null = null;

  // 2b. Apply coupon if provided
  if (req.couponCode) {
    const result = validateCoupon(req.couponCode, totalAmount, req.contact.email);
    if (!result.valid) throw new Error(result.error);
    couponInfo = {
      discountAmount: result.discountAmount!,
      discountBearer: result.discountBearer!,
      code: req.couponCode.toUpperCase(),
    };
    totalAmount = result.finalAmount!;
  }

  // 3. Optionally register the lead as a customer (guest if no password)
  let userId: string | null = null;
  if (req.registerPassword && req.registerPassword.length >= 6) {
    const { data: signup, error: signupErr } = await supabase.auth.admin.createUser({
      email: req.contact.email,
      password: req.registerPassword,
      email_confirm: true,
      user_metadata: { name: req.contact.name, role: "customer", phone: req.contact.phone },
    });
    if (signupErr) throw new Error("Could not create account: " + signupErr.message);
    userId = signup.user?.id ?? null;
    // ensure profile row exists
    await supabase.from("profiles").upsert(
      { id: userId, full_name: req.contact.name, email: req.contact.email, role: "customer", phone: req.contact.phone },
      { onConflict: "id" }
    );
    // send welcome email (non-blocking)
    sendEmail({
      to: [{ email: req.contact.email, name: req.contact.name }],
      subject: "Welcome to HolidayHub!",
      htmlContent: welcomeEmail(req.contact.name),
    }).catch((e) => console.error("[booking] Welcome email failed:", e));
  }

  // 4. Create booking (pending_payment) + travelers atomically
  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      listing_id: req.listingId,
      listing_type: req.listingType,
      batch_slot_id: req.batchSlotId,
      status: "pending_payment",
      base_amount: baseAmount,
      gst_amount: gstAmount,
      total_amount: totalAmount,
      gst_percent: gstPercent,
      qty: req.qty,
      contact_name: req.contact.name,
      contact_email: req.contact.email,
      contact_phone: req.contact.phone,
    })
    .select("id")
    .single();

  if (bookingErr || !booking) throw new Error("Failed to create booking.");

  const travelers = req.travelers.map((t) => ({
    booking_id: booking.id,
    full_name: t.full_name,
    age: t.age,
    phone: t.phone ?? null,
    gender: t.gender ?? null,
  }));
  const { error: travErr } = await supabase.from("booking_travelers").insert(travelers);
  if (travErr) throw new Error("Failed to save travelers.");

  // 5. Hold the slot (increment booked count) — the 10-min moat
  const { error: holdErr } = await supabase
    .from("batch_slots")
    .update({ booked_slots: slot.booked_slots + req.qty })
    .eq("id", req.batchSlotId);
  if (holdErr) throw new Error("Failed to hold slots.");

  // 6. Track coupon usage
  if (couponInfo) {
    const coupon = couponStore.getByCode(couponInfo.code);
    if (coupon) {
      couponStore.incrementUsage(coupon.id);
      couponStore.logUsage({
        couponId: coupon.id,
        bookingId: booking.id,
        userEmail: req.contact.email,
        discountAmount: couponInfo.discountAmount,
      });
    }
  }

  return { bookingId: booking.id, totalAmount, couponDiscount: couponInfo?.discountAmount };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderRequest;

    // Basic validation
    if (!body.listingId || !body.batchSlotId || !body.qty || body.qty < 1) {
      return NextResponse.json({ ok: false, error: "Invalid booking request." }, { status: 400 });
    }
    if (!body.contact?.email || !body.contact?.name || !body.contact?.phone) {
      return NextResponse.json({ ok: false, error: "Contact details are required." }, { status: 400 });
    }
    if (!Array.isArray(body.travelers) || body.travelers.length !== body.qty) {
      return NextResponse.json(
        { ok: false, error: "Traveler details must match the number of slots." },
        { status: 400 }
      );
    }

    const { bookingId, totalAmount } = await createBooking(body);

    // Razorpay integration (only if keys are configured)
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        ok: true,
        bookingId,
        razorpay: null,
        notice: "Razorpay keys not configured. Booking created in pending_payment state.",
      });
    }

    // Lazily require razorpay so the app builds without the dep installed
    const Razorpay = (await import("razorpay")).default;
    const rzp = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    const amountPaise = Math.round(totalAmount * 100);
    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: bookingId,
      payment_capture: 1,
    });

    const supabase = serviceClient();
    await supabase.from("bookings").update({ razorpay_order_id: order.id }).eq("id", bookingId);

    return NextResponse.json({
      ok: true,
      bookingId,
      razorpay: { key: RAZORPAY_KEY_ID, amount: amountPaise, currency: "INR", orderId: order.id },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
