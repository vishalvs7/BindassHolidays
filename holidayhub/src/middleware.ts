import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, allow everything - we'll fix this later
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};