import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function userClient(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  });
  return supabase;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = userClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

    const { data, error } = await supabase
      .from("wishlists")
      .select("listing_id, created_at, listing:listings!listing_id(id, title, type, cover_image, price, rating, total_reviews, duration_days, destination, source_hub, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ ok: true, wishlist: data ?? [] });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = userClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

    const { listing_id } = await request.json();
    if (!listing_id) return NextResponse.json({ ok: false, error: "listing_id required" }, { status: 400 });

    const { error } = await supabase
      .from("wishlists")
      .insert({ user_id: user.id, listing_id });

    if (error) {
      if (error.code === "23505") return NextResponse.json({ ok: true, notice: "Already in wishlist" });
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = userClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

    const { listing_id } = await request.json();
    if (!listing_id) return NextResponse.json({ ok: false, error: "listing_id required" }, { status: 400 });

    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listing_id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
