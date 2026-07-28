import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = (await request.json()) as {
      name: string;
      email: string;
      password: string;
      phone?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: "Name, email and password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const supabase = adminClient();

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const exists = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return NextResponse.json({ ok: false, error: "An account with this email already exists. Please log in." }, { status: 409 });
    }

    // Create user with email_autoconfirm (no verification needed)
    const { data: signup, error: signupErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: "customer", phone: phone ?? null },
    });
    if (signupErr) {
      return NextResponse.json({ ok: false, error: signupErr.message }, { status: 500 });
    }

    // Upsert profile row
    await supabase.from("profiles").upsert(
      { id: signup.user.id, name: name, email, role: "customer", phone: phone ?? null },
      { onConflict: "id" }
    );

    // Sign in the user immediately (create a session)
    const { data: session, error: sessionErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (sessionErr) {
      // User created but couldn't auto-login — they can log in manually
      return NextResponse.json({ ok: true, userId: signup.user.id });
    }

    return NextResponse.json({
      ok: true,
      userId: signup.user.id,
      accessToken: session.session?.access_token,
      refreshToken: session.session?.refresh_token,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
