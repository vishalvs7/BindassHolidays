import type { Coupon, CouponUsage } from './types';

// In-memory store — swap to database when DDL access is available
const coupons: Map<string, Coupon> = new Map();
const usageLog: CouponUsage[] = [];

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

function seed() {
  const entries: Coupon[] = [
    {
      id: uid(), code: 'WEEKEND50', description: '50% off on all weekend packages',
      discountType: 'percentage', discountValue: 50, discountBearer: 'vendor',
      minOrderAmount: 2000, maxDiscount: 3000, usageLimit: 100, usageLimitPerUser: 1,
      usedCount: 0, isActive: true, startsAt: null, expiresAt: '2026-12-31T23:59:59Z', createdAt: now(),
    },
    {
      id: uid(), code: 'FLAT500', description: 'Flat ₹500 off on any trip',
      discountType: 'fixed', discountValue: 500, discountBearer: 'platform',
      minOrderAmount: 3000, maxDiscount: null, usageLimit: 50, usageLimitPerUser: 1,
      usedCount: 0, isActive: true, startsAt: null, expiresAt: '2026-09-30T23:59:59Z', createdAt: now(),
    },
    {
      id: uid(), code: 'SOLO10', description: 'Extra 10% off for solo travelers',
      discountType: 'percentage', discountValue: 10, discountBearer: 'vendor',
      minOrderAmount: 0, maxDiscount: 1000, usageLimit: 200, usageLimitPerUser: 2,
      usedCount: 0, isActive: true, startsAt: null, expiresAt: '2026-06-30T23:59:59Z', createdAt: now(),
    },
    {
      id: uid(), code: 'WELCOME20', description: '20% off your first booking',
      discountType: 'percentage', discountValue: 20, discountBearer: 'platform',
      minOrderAmount: 1000, maxDiscount: 1500, usageLimit: 500, usageLimitPerUser: 1,
      usedCount: 0, isActive: true, startsAt: null, expiresAt: '2026-12-31T23:59:59Z', createdAt: now(),
    },
  ];
  for (const c of entries) coupons.set(c.id, c);
}
seed();

export const couponStore = {
  getAll(): Coupon[] {
    return Array.from(coupons.values());
  },

  getByCode(code: string): Coupon | undefined {
    return Array.from(coupons.values()).find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );
  },

  getById(id: string): Coupon | undefined {
    return coupons.get(id);
  },

  create(data: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>): Coupon {
    const c: Coupon = { ...data, id: uid(), usedCount: 0, createdAt: now() };
    coupons.set(c.id, c);
    return c;
  },

  delete(id: string): boolean {
    return coupons.delete(id);
  },

  toggleActive(id: string): Coupon | undefined {
    const c = coupons.get(id);
    if (!c) return undefined;
    c.isActive = !c.isActive;
    return c;
  },

  incrementUsage(couponId: string): boolean {
    const c = coupons.get(couponId);
    if (!c) return false;
    if (c.usageLimit > 0 && c.usedCount >= c.usageLimit) return false;
    c.usedCount++;
    return true;
  },

  decrementUsage(couponId: string): boolean {
    const c = coupons.get(couponId);
    if (!c) return false;
    c.usedCount = Math.max(0, c.usedCount - 1);
    return true;
  },

  logUsage(entry: Omit<CouponUsage, 'id' | 'createdAt'>): CouponUsage {
    const u: CouponUsage = { ...entry, id: uid(), createdAt: now() };
    usageLog.push(u);
    return u;
  },

  getUsageByEmail(email: string, couponId: string): number {
    return usageLog.filter((u) => u.userEmail === email && u.couponId === couponId).length;
  },

  getUsageLog(): CouponUsage[] {
    return [...usageLog];
  },
};
