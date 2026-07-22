import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

import { createHmac, timingSafeEqual } from "crypto";

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ ok: false, error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(body, signature, webhookSecret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    const supabase = serviceClient();

    const { data: booking, error: findErr } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("razorpay_order_id", orderId)
      .single();

    if (findErr || !booking) {
      console.error("[webhook] Booking not found for order:", orderId);
      return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "pending_payment") {
      const { error: updateErr } = await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          razorpay_payment_id: paymentId,
        })
        .eq("id", booking.id);

      if (updateErr) {
        console.error("[webhook] Failed to update booking:", updateErr);
        return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
