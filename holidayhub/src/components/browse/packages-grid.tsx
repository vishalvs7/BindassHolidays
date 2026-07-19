import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ListingCardView } from "@/lib/supabase/listing";

export function PackagesGrid({ packages }: { packages: ListingCardView[] }) {
  if (packages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
        <p className="text-lg font-semibold text-gray-900">No trips match these filters yet</p>
        <p className="mt-2 text-sm text-gray-500">
          New weekend batches drop every week. Try another vibe or check back soon.
        </p>
        <Link
          href="/packages"
          className="mt-6 inline-block rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white"
        >
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((p) => (
        <Link
          key={p.id}
          href={`/listings/${p.id}`}
          className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
        >
          <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-primary-100 to-fuchsia-100">
            {p.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" />
            ) : (
              <span className="text-5xl">{p.type === "activity" ? "🎯" : "🏞️"}</span>
            )}
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-gray-800">
              {p.type === "activity" ? "Activity" : p.vertical.replace("_", " ")}
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" /> {p.destination} · from {p.sourceHub}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">{p.title}</h3>
            {p.tagline && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{p.tagline}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold text-primary-600">
                ₹{p.price.toLocaleString()}
                {p.durationDays ? <span className="text-xs font-normal text-gray-400"> / {p.durationDays}d</span> : null}
              </span>
              {p.rating > 0 && (
                <span className="flex items-center gap-1 text-sm text-amber-500">
                  <Star className="h-4 w-4 fill-current" /> {p.rating}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
