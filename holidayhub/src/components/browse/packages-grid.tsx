import Link from "next/link";
import type { ListingCardView } from "@/lib/supabase/listing";
import { PackageCard } from "./package-card";

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
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
      {packages.map((p) => (
        <PackageCard key={p.id} p={p} />
      ))}
    </div>
  );
}
