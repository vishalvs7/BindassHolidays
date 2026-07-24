import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = serviceClient();

    // The client sends the access token in the body
    const body = await request.json().catch(() => ({}));
    const accessToken: string | undefined = body?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Missing access token.' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ ok: false, error: 'Invalid session.' }, { status: 401 });
    }

    const userId = user.id;

    // Delete user data (cascades via FK constraints where applicable)
    await supabase.from('reviews').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('id', userId);
    await supabase.from('vendors').delete().eq('id', userId);

    // Delete the auth user itself
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      return NextResponse.json({ ok: false, error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
