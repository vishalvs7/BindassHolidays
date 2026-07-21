import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/types/booking.types";

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending_payment: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: [],
  completed: [],
};

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
      .select("status")
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

    const { error: updateErr } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (updateErr) {
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, status: newStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
