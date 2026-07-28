import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// PATCH — update user role
export async function PATCH(request: NextRequest) {
  try {
    const { userId, role } = (await request.json()) as { userId: string; role: string };
    if (!userId || !["customer", "vendor", "admin"].includes(role)) {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const supabase = adminClient();
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// DELETE — delete user and their data
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ ok: false, error: "userId required." }, { status: 400 });
    }

    const supabase = adminClient();

    // Delete profile
    await supabase.from("profiles").delete().eq("id", userId);

    // Delete vendor row if exists
    await supabase.from("vendors").delete().eq("id", userId);

    // Delete auth user
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
