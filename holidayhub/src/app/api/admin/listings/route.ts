import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// PATCH — toggle listing status or update fields
export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as { listingId: string; status?: string; action?: string };
    if (!body.listingId) {
      return NextResponse.json({ ok: false, error: "listingId required." }, { status: 400 });
    }

    const supabase = adminClient();

    if (body.action === "toggle") {
      // Fetch current status
      const { data: listing, error: fetchErr } = await supabase
        .from("listings")
        .select("status")
        .eq("id", body.listingId)
        .single();
      if (fetchErr || !listing) {
        return NextResponse.json({ ok: false, error: "Listing not found." }, { status: 404 });
      }
      const newStatus = listing.status === "published" ? "draft" : "published";
      const { error } = await supabase.from("listings").update({ status: newStatus }).eq("id", body.listingId);
      if (error) throw error;
      return NextResponse.json({ ok: true, status: newStatus });
    }

    if (body.status) {
      const { error } = await supabase.from("listings").update({ status: body.status }).eq("id", body.listingId);
      if (error) throw error;
      return NextResponse.json({ ok: true, status: body.status });
    }

    return NextResponse.json({ ok: false, error: "No action specified." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// DELETE — delete a listing and its related data
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    if (!listingId) {
      return NextResponse.json({ ok: false, error: "listingId required." }, { status: 400 });
    }

    const supabase = adminClient();

    // Delete batch_slots → batch_dates → listing
    const { data: batchDates } = await supabase
      .from("batch_dates")
      .select("id")
      .eq("listing_id", listingId);

    if (batchDates && batchDates.length > 0) {
      const bdIds = batchDates.map((bd) => bd.id);
      await supabase.from("batch_slots").delete().in("batch_date_id", bdIds);
      await supabase.from("batch_dates").delete().in("id", bdIds);
    }

    await supabase.from("listings").delete().eq("id", listingId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
