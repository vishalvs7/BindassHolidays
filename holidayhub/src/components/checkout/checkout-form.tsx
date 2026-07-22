"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { TravelerInput } from "@/lib/types/booking.types";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay/client";

interface CheckoutProps {
  listing: {
    id: string;
    title: string;
    kind: "package" | "activity";
    unitPrice: number;
  };
  batch: {
    slotId: string;
    departAt: string;
    returnAt: string;
    priceOverride: number | null;
  } | null;
  qty: number;
  gstPercent: number;
}

const GENDERS: { value: "male" | "female" | "other"; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export function CheckoutForm({ listing, batch, qty, gstPercent }: CheckoutProps) {
  const router = useRouter();
  const unit = batch?.priceOverride ?? listing.unitPrice;
  const base = unit * qty;
  const gst = Math.round(base * gstPercent) / 100;
  const total = base + gst;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", password: "" });
  const [travelers, setTravelers] = useState<TravelerInput[]>(
    Array.from({ length: qty }, () => ({ full_name: "", age: "", phone: "", gender: "" }))
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [couponBearer, setCouponBearer] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ bookingId: string; razorpay: unknown; verified?: boolean } | null>(null);

  const finalTotal = couponDiscount ? total - couponDiscount : total;
  const savings = couponDiscount || 0;

  const updateTraveler = (i: number, patch: Partial<TravelerInput>) =>
    setTravelers((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const leadValid =
    lead.name.trim() && /\S+@\S+\.\S+/.test(lead.email) && lead.phone.trim().length >= 8;
  const travelersValid = travelers.every(
    (t) => t.full_name.trim() && Number(t.age) > 0 && t.gender !== ""
  );

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: total, userEmail: lead.email }),
      });
      const data = await res.json();
      if (data.ok) {
        setCouponDiscount(data.discountAmount);
        setCouponBearer(data.discountBearer);
        setCouponApplied(true);
      } else {
        setCouponError(data.error || "Invalid coupon");
        setCouponDiscount(null);
        setCouponApplied(false);
      }
    } catch {
      setCouponError("Failed to validate coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  }

  function removeCoupon() {
    setCouponCode("");
    setCouponDiscount(null);
    setCouponApplied(false);
    setCouponError(null);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingType: listing.kind,
          listingId: listing.id,
          batchSlotId: batch?.slotId,
          qty,
          contact: { name: lead.name, email: lead.email, phone: lead.phone },
          travelers: travelers.map((t) => ({
            full_name: t.full_name,
            age: Number(t.age),
            phone: t.phone || undefined,
            gender: t.gender || undefined,
          })),
          registerPassword: lead.password ? lead.password : undefined,
          couponCode: couponApplied ? couponCode.trim().toUpperCase() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Booking failed.");

      if (data.razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error("Failed to load payment gateway.");

        openRazorpayCheckout({
          key: data.razorpay.key,
          amount: data.razorpay.amount,
          currency: data.razorpay.currency,
          orderId: data.razorpay.orderId,
          name: "HolidayHub",
          description: listing.title,
          contactEmail: lead.email,
          contactPhone: lead.phone,
          onSuccess: async (paymentId, orderId, signature) => {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: orderId,
                payment_id: paymentId,
                signature,
                booking_id: data.bookingId,
              }),
            });
            const verifyData = await verifyRes.json();
            setDone({ bookingId: data.bookingId, razorpay: data.razorpay, verified: verifyData.ok });
          },
          onError: (err) => {
            setError(err);
            setSubmitting(false);
          },
        });
      } else {
        setDone({ bookingId: data.bookingId, razorpay: null });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {done.verified ? "Payment Successful!" : done.razorpay ? "Payment received" : "Booking request received"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Booking ID: <span className="font-mono">{done.bookingId}</span>
        </p>
        {done.verified ? (
          <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Your booking is <strong>confirmed</strong>. A confirmation email with trip details is on the way.
          </p>
        ) : done.razorpay ? (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            Payment was received but signature verification failed. Please contact support with your booking ID.
          </p>
        ) : (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            Payment gateway is not configured yet. The booking is saved in{" "}
            <strong>pending payment</strong> state and will be confirmed once Razorpay is connected.
          </p>
        )}
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: lead contact */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-sm text-white">
              1
            </span>
            Your contact details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="jane@email.com" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="password">
                Create a password <span className="text-gray-400">(optional — skip to checkout as guest)</span>
              </Label>
              <Input id="password" type="password" value={lead.password} onChange={(e) => setLead({ ...lead, password: e.target.value })} placeholder="Min 6 characters" />
              <p className="mt-1 text-xs text-gray-400">
                Add a password to create your HolidayHub account automatically. Leave blank to book without an account.
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button disabled={!leadValid} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </Card>

        {/* Step 2: travelers */}
        {step >= 2 && (
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-sm text-white">
                2
              </span>
              Traveler details <span className="text-sm font-normal text-gray-400">({qty})</span>
            </h3>
            <div className="space-y-4">
              {travelers.map((t, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4">
                  <p className="mb-3 text-sm font-medium text-gray-700">Traveler {i + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Full name" value={t.full_name} onChange={(e) => updateTraveler(i, { full_name: e.target.value })} />
                    <Input placeholder="Age" type="number" min={0} value={t.age} onChange={(e) => updateTraveler(i, { age: e.target.value })} />
                    <Input placeholder="Phone (optional)" value={t.phone} onChange={(e) => updateTraveler(i, { phone: e.target.value })} />
                    <select
                      className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      value={t.gender}
                      onChange={(e) => updateTraveler(i, { gender: e.target.value as TravelerInput["gender"] })}
                    >
                      <option value="">Gender (for room matching)</option>
                      {GENDERS.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button disabled={!travelersValid} onClick={() => setStep(3)}>Review & pay</Button>
            </div>
          </Card>
        )}

        {/* Step 3: pay */}
        {step >= 3 && (
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-sm text-white">
                3
              </span>
              Confirm & pay
            </h3>
            <div className="flex items-start gap-3 rounded-xl bg-primary-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-primary-600" />
              <p className="text-sm text-primary-800">
                Vetted Local Operator Verified · Same-Gender Room Matching Available
              </p>
            </div>
            <Button className="mt-4 w-full" disabled={submitting} onClick={submit}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Processing…" : `Pay ₹${finalTotal.toLocaleString('en-IN')} & Book`}
            </Button>
            <button className="mt-3 text-sm text-gray-500 hover:text-gray-700" onClick={() => setStep(2)}>
              ← Edit traveler details
            </button>
          </Card>
        )}
      </div>

      {/* Summary sidebar */}
      <div>
        <Card className="sticky top-24 p-6">
          <h4 className="text-base font-semibold text-gray-900">{listing.title}</h4>
          <p className="mt-1 text-sm text-gray-500">
            {qty} × ₹{unit.toLocaleString()}
          </p>
          {batch && (
            <p className="mt-1 text-xs text-gray-400">
              Departs {new Date(batch.departAt).toLocaleString()}
            </p>
          )}
          {/* Coupon */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            {couponApplied ? (
              <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium text-green-700">Coupon applied</span>
                  <p className="text-xs text-green-600">-₹{savings.toLocaleString('en-IN')} {couponBearer === 'platform' ? '(covered by HolidayHub)' : ''}</p>
                </div>
                <button onClick={removeCoupon} className="text-xs text-green-600 underline">Remove</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                />
                <button
                  onClick={applyCoupon}
                  disabled={validatingCoupon || !couponCode.trim()}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {validatingCoupon ? '…' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
          </div>

          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Base</span><span>₹{base.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">GST ({gstPercent}%)</span><span>₹{gst.toLocaleString()}</span></div>
            {savings > 0 && (
              <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{savings.toLocaleString('en-IN')}</span></div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold"><span>Total</span><span>₹{finalTotal.toLocaleString('en-IN')}</span></div>
          </div>
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4" /> {error}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
