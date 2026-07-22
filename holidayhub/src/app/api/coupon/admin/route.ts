import { NextRequest, NextResponse } from 'next/server';
import { couponStore } from '@/lib/coupon/store';
import type { Coupon } from '@/lib/coupon/types';

export async function GET() {
  const coupons = couponStore.getAll();
  return NextResponse.json({ ok: true, coupons });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<Coupon>;

    if (!body.code || !body.discountType || body.discountValue == null) {
      return NextResponse.json({ ok: false, error: 'code, discountType, and discountValue are required.' }, { status: 400 });
    }

    if (!['percentage', 'fixed'].includes(body.discountType)) {
      return NextResponse.json({ ok: false, error: 'discountType must be percentage or fixed.' }, { status: 400 });
    }

    const existing = couponStore.getByCode(body.code);
    if (existing) {
      return NextResponse.json({ ok: false, error: 'A coupon with this code already exists.' }, { status: 409 });
    }

    const coupon = couponStore.create({
      code: body.code.toUpperCase(),
      description: body.description || '',
      discountType: body.discountType as 'percentage' | 'fixed',
      discountValue: body.discountValue,
      discountBearer: body.discountBearer || 'vendor',
      minOrderAmount: body.minOrderAmount || 0,
      maxDiscount: body.maxDiscount || null,
      usageLimit: body.usageLimit || 0,
      usageLimitPerUser: body.usageLimitPerUser || 0,
      isActive: body.isActive ?? true,
      startsAt: body.startsAt || null,
      expiresAt: body.expiresAt || null,
    });

    return NextResponse.json({ ok: true, coupon });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Coupon id is required.' }, { status: 400 });
    }
    const deleted = couponStore.delete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Coupon not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json();
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Coupon id is required.' }, { status: 400 });
    }
    if (action === 'toggle') {
      const coupon = couponStore.toggleActive(id);
      if (!coupon) {
        return NextResponse.json({ ok: false, error: 'Coupon not found.' }, { status: 404 });
      }
      return NextResponse.json({ ok: true, coupon });
    }
    return NextResponse.json({ ok: false, error: 'Unknown action.' }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
