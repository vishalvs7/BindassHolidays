import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupon/validate';

export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount, userEmail } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ ok: false, error: 'Coupon code is required.' }, { status: 400 });
    }
    if (!orderAmount || typeof orderAmount !== 'number') {
      return NextResponse.json({ ok: false, error: 'Order amount is required.' }, { status: 400 });
    }

    const result = validateCoupon(code, orderAmount, userEmail);
    return NextResponse.json({ ok: result.valid, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
