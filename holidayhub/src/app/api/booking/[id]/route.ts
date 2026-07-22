import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { BookingStatus } from "@/lib/types/booking.types";
import { sendEmail } from "@/lib/email";
import { bookingCancellationEmail } from "@/lib/email/templates/booking-cancellation";

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending_payment: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: [],
  completed: [],
};

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function processRazorpayRefund(paymentId: string, amount: number) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return { ok: false, error: "Razorpay not configured" };
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: Math.round(amount * 100) }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[refund] Razorpay error:", err);
    return { ok: false, error: err };
  }

  const data = await res.json();
  return { ok: true, refundId: data.id, status: data.status };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { status: string };
    const newStatus = body.status as BookingStatus;

    if (!["pending_payment", "confirmed", "cancelled", "completed"].includes(newStatus)) {
      return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
    }

    const { data: booking, error: fetchErr } = await supabase
      .from("bookings")
      .select("status, batch_slot_id, qty, razorpay_payment_id, contact_name, contact_email, total_amount, listing_id, listing_type")
      .eq("id", id)
      .single();

    if (fetchErr || !booking) {
      return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
    }

    const current = booking.status as BookingStatus;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        { ok: false, error: `Cannot transition from '${current}' to '${newStatus}'.` },
        { status: 400 }
      );
    }

    const svc = serviceClient();
    let refundResult: { ok: boolean; refundId?: string; status?: string; error?: string } | null = null;

    if (newStatus === "cancelled") {
      if (booking.batch_slot_id) {
        const { data: slot } = await svc
          .from("batch_slots")
          .select("booked_slots")
          .eq("id", booking.batch_slot_id)
          .single();
        if (slot) {
          const released = Math.max(0, slot.booked_slots - booking.qty);
          await svc
            .from("batch_slots")
            .update({ booked_slots: released })
            .eq("id", booking.batch_slot_id);
        }
      }

      if (booking.razorpay_payment_id && current === "confirmed") {
        refundResult = await processRazorpayRefund(
          booking.razorpay_payment_id,
          Number(booking.total_amount)
        );
      }
    }

    const { error: updateErr } = await svc
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (updateErr) {
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    if (newStatus === "cancelled") {
      const { data: listing } = await svc
        .from("listings")
        .select("title")
        .eq("id", booking.listing_id)
        .single();

      const { data: batchSlot } = await svc
        .from("batch_slots")
        .select("batch_date_id")
        .eq("id", booking.batch_slot_id)
        .single();

      let departAt = "";
      if (batchSlot?.batch_date_id) {
        const { data: batchDate } = await svc
          .from("batch_dates")
          .select("depart_at")
          .eq("id", batchSlot.batch_date_id)
          .single();
        departAt = batchDate?.depart_at ?? "";
      }

      const refundAmount = refundResult?.ok ? Number(booking.total_amount) : undefined;

      sendEmail({
        to: [{ email: booking.contact_email, name: booking.contact_name }],
        subject: `Booking Cancelled — ${listing?.title ?? "Trip"}`,
        htmlContent: bookingCancellationEmail({
          contactName: booking.contact_name,
          listingTitle: listing?.title ?? "—",
          departAt,
          totalAmount: Number(booking.total_amount),
          refundAmount,
          bookingId: id,
        }),
      }).catch((e) => console.error("[cancel] Cancellation email failed:", e));
    }

    return NextResponse.json({
      ok: true,
      status: newStatus,
      refund: refundResult,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
