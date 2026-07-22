import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { bookingConfirmationEmail } from "@/lib/email/templates/booking-confirmation";
import { generateBookingPDF } from "@/lib/pdf/generate";
import { BookingConfirmationPDF } from "@/lib/pdf/booking-confirmation";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { order_id, payment_id, signature, booking_id } = await request.json();

    if (!order_id || !payment_id || !signature) {
      return NextResponse.json({ ok: false, error: "Missing payment details" }, { status: 400 });
    }

    if (!verifySignature(order_id, payment_id, signature)) {
      return NextResponse.json({ ok: false, error: "Signature mismatch" }, { status: 400 });
    }

    const supabase = serviceClient();

    if (booking_id) {
      const { error: updateErr } = await supabase
        .from("bookings")
        .update({ status: "confirmed", razorpay_payment_id: payment_id })
        .eq("id", booking_id)
        .eq("razorpay_order_id", order_id);

      if (updateErr) {
        console.error("[verify] Failed to update booking:", updateErr);
        return NextResponse.json({ ok: false, error: "Failed to confirm booking" }, { status: 500 });
      }

      // Send confirmation email with PDF
      try {
        const { data: booking } = await supabase
          .from("bookings")
          .select("*, listing:listings!listing_id(title), batch_slot:batch_slots!batch_slot_id(batch_date_id)")
          .eq("id", booking_id)
          .single();

        if (booking) {
          const { data: travelers } = await supabase
            .from("booking_travelers")
            .select("full_name, age, gender, phone")
            .eq("booking_id", booking_id);

          const { data: batchDate } = await supabase
            .from("batch_dates")
            .select("depart_at, return_at")
            .eq("id", booking.batch_slot?.batch_date_id)
            .single();

          const tList = (travelers ?? []).map((t: any) => ({
            full_name: t.full_name,
            age: t.age,
            gender: t.gender ?? "other",
            phone: t.phone ?? undefined,
          }));

          const pdfBuffer = await generateBookingPDF(
            BookingConfirmationPDF({
              bookingId: booking.id,
              contactName: booking.contact_name,
              contactEmail: booking.contact_email,
              contactPhone: booking.contact_phone,
              listingTitle: booking.listing?.title ?? "—",
              listingType: booking.listing_type,
              departAt: batchDate?.depart_at ?? "",
              returnAt: batchDate?.return_at ?? "",
              travelers: tList,
              baseAmount: Number(booking.base_amount),
              gstAmount: Number(booking.gst_amount),
              gstPercent: Number(booking.gst_percent),
              totalAmount: Number(booking.total_amount),
              status: "confirmed",
            })
          );

          await sendEmail({
            to: [{ email: booking.contact_email, name: booking.contact_name }],
            subject: `Booking Confirmed — ${booking.listing?.title ?? "Trip"}`,
            htmlContent: bookingConfirmationEmail({
              contactName: booking.contact_name,
              listingTitle: booking.listing?.title ?? "—",
              departAt: batchDate?.depart_at ?? "",
              returnAt: batchDate?.return_at ?? "",
              travelers: tList,
              totalAmount: Number(booking.total_amount),
              bookingId: booking.id,
            }),
            attachments: [{
              name: `booking-${booking.id.slice(0, 8)}.pdf`,
              content: pdfBuffer.toString("base64"),
              contentType: "application/pdf",
            }],
          });
        }
      } catch (emailErr) {
        console.error("[verify] Failed to send confirmation email:", emailErr);
      }
    }

    return NextResponse.json({ ok: true, message: "Payment verified and booking confirmed" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
