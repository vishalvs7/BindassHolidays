export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountBearer: 'vendor' | 'platform';
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number;
  usageLimitPerUser: number;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface CouponUsage {
  id: string;
  couponId: string;
  bookingId: string;
  userEmail: string;
  discountAmount: number;
  createdAt: string;
}

export interface CouponValidationResult {
  valid: boolean;
  discountAmount?: number;
  finalAmount?: number;
  discountBearer?: 'vendor' | 'platform';
  error?: string;
  coupon?: Coupon;
}
