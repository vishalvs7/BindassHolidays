"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ShieldCheck, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ListingKind } from "@/lib/supabase/listing";

interface BatchOption {
  slotId: string;
  batchId: string;
  departAt: string;
  returnAt: string;
  totalSlots: number;
  bookedSlots: number;
  priceOverride: number | null;
}

export function ListingBookingWidget({
  listingId,
  title,
  type,
  basePrice,
  batches,
  minAge,
  maxAge,
}: {
  listingId: string;
  title: string;
  type: ListingKind;
  basePrice: number;
  batches: BatchOption[];
  minAge: number | null;
  maxAge: number | null;
}) {
  const [slotId, setSlotId] = useState<string>(batches[0]?.slotId ?? "");
  const [qty, setQty] = useState(1);

  const selected = batches.find((b) => b.slotId === slotId);
  const unit = selected?.priceOverride ?? basePrice;
  const total = unit * qty;
  const available = selected ? selected.totalSlots - selected.bookedSlots : 0;
  const soldOut = !selected || available <= 0;

  const checkoutHref = `/checkout?type=${type}&id=${listingId}&batch=${slotId}&qty=${qty}`;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-sm text-gray-500">{type === "activity" ? "From / session" : "From"}</span>
        <span className="text-2xl font-bold text-gray-900">₹{unit.toLocaleString()}</span>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {type === "activity" ? "Choose a session" : "Choose departure"}
        </label>
        {batches.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
            No open batches right now. New {type === "activity" ? "sessions" : "weekend departures"} are added weekly.
          </p>
        ) : (
          <select
            className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            value={slotId}
            onChange={(e) => setSlotId(e.target.value)}
          >
            {batches.map((b) => {
              const left = b.totalSlots - b.bookedSlots;
              return (
                <option key={b.slotId} value={b.slotId}>
                  {new Date(b.departAt).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  · {left} left
                </option>
              );
            })}
          </select>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {type === "activity" ? "Participants" : "Travelers"}
        </label>
        <div className="flex items-center justify-between rounded-xl border border-gray-300 px-3 py-2">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            <Minus size={16} />
          </button>
          <span className="font-medium">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            disabled={qty >= 10 || qty >= available}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </div>
        {(minAge != null || maxAge != null) && (
          <p className="mt-1 text-xs text-gray-400">
            Age {minAge != null ? `min ${minAge}` : ""} {maxAge != null ? `· max ${maxAge}` : ""}
          </p>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-600">Total</span>
        <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
      </div>

      {soldOut ? (
        <Button disabled className="w-full">
          Sold out
        </Button>
      ) : (
        <Link href={checkoutHref} className="block">
          <Button className="w-full" disabled={!slotId}>
            <Calendar size={18} className="mr-2" />
            {type === "activity" ? "Book session" : "Book now"}
          </Button>
        </Link>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary-50 p-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 text-primary-600" />
        <p className="text-xs text-primary-800">
          Vetted Local Operator Verified · Same-Gender Room Matching Available
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-gray-400">
        No account needed — book as a guest and pay securely.
      </p>
    </div>
  );
}
