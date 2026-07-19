import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/customer', '/vendor', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  // Supabase (@supabase/ssr) stores session under cookies prefixed `sb-<ref>-auth-token`.
  // We can't verify the JWT here without the project ref, so we check for the presence
  // of any Supabase auth cookie. Full session + role enforcement happens client-side
  // in each protected layout (useAuth → redirect).
  const hasAuthCookie = Array.from(request.cookies.getAll()).some((c) =>
    c.name.startsWith('sb-') && c.name.includes('auth-token')
  );

  if (!hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/customer/:path*', '/vendor/:path*', '/admin/:path*'],
};
