import { couponStore } from './store';
import type { CouponValidationResult } from './types';

export function validateCoupon(
  code: string,
  orderAmount: number,
  userEmail?: string
): CouponValidationResult {
  const coupon = couponStore.getByCode(code);
  if (!coupon) return { valid: false, error: 'Invalid coupon code.' };
  if (!coupon.isActive) return { valid: false, error: 'This coupon is no longer active.' };

  const now = Date.now();
  if (coupon.startsAt && now < new Date(coupon.startsAt).getTime()) {
    return { valid: false, error: 'This coupon is not yet valid.' };
  }
  if (coupon.expiresAt && now > new Date(coupon.expiresAt).getTime()) {
    return { valid: false, error: 'This coupon has expired.' };
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: 'This coupon has reached its usage limit.' };
  }

  if (orderAmount < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required.`,
    };
  }

  if (userEmail && coupon.usageLimitPerUser > 0) {
    const userUses = couponStore.getUsageByEmail(userEmail, coupon.id);
    if (userUses >= coupon.usageLimitPerUser) {
      return { valid: false, error: 'You have already used this coupon the maximum number of times.' };
    }
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round(orderAmount * (coupon.discountValue / 100));
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  discountAmount = Math.min(discountAmount, orderAmount);
  const finalAmount = orderAmount - discountAmount;

  return {
    valid: true,
    discountAmount,
    finalAmount,
    discountBearer: coupon.discountBearer,
    coupon,
  };
}
