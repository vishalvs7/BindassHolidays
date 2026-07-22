import Link from "next/link";
import { Star } from "lucide-react";
import type { ListingCardView } from "@/lib/supabase/listing";
import { WishlistButton } from "./wishlist-button";

export function PackageCard({ p }: { p: ListingCardView }) {
  return (
    <Link
      key={p.id}
      href={`/listings/${p.id}`}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="relative" style={{ paddingBottom: "70%" }}>
        {p.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.coverImage}
            alt={p.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-fuchsia-100">
            <span className="text-5xl">{p.type === "activity" ? "🎯" : "🏞️"}</span>
          </div>
        )}
        <div className="absolute right-2.5 top-2.5">
          <WishlistButton listingId={p.id} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium text-gray-900">{p.rating > 0 ? p.rating : "--"}</span>
          <span className="text-gray-400">
            ({p.totalReviews > 0 ? p.totalReviews : 0} {p.totalReviews === 1 ? "review" : "reviews"})
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-xl font-bold text-primary-600">
            ₹{p.price.toLocaleString("en-IN")}
          </span>
          {p.durationDays ? (
            <span className="text-xs text-gray-400"> / {p.durationDays} {p.durationDays === 1 ? "day" : "days"}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
