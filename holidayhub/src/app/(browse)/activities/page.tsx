import Link from "next/link";
import { HOME_TABS, resolveTab } from "@/config/tabs";
import { getListings, type ListingFilters } from "@/lib/supabase/listing";
import { PackagesGrid } from "@/components/browse/packages-grid";
import { PackagesFilterSidebar } from "@/components/browse/packages-filter-sidebar";
import { SearchBar } from "@/components/browse/search-bar";
import { MobileFilterDrawer } from "@/components/browse/mobile-filter-drawer";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    cat?: string;
    q?: string;
    tag?: string;
    vertical?: string;
    destination?: string;
    sourceHub?: string;
    minPrice?: string;
    maxPrice?: string;
    minDuration?: string;
  }>;
}) {
  const sp = await searchParams;
  const tab = resolveTab(sp.cat);

  const filters: ListingFilters = {
    type: "activity",
    q: sp.q,
    tag: sp.tag,
    vertical: sp.vertical,
    destination: sp.destination,
    sourceHub: sp.sourceHub,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    minDuration: sp.minDuration ? Number(sp.minDuration) : undefined,
  };
  if (tab) {
    if (tab.field === "tag") filters.tag = tab.value;
    if (tab.field === "vertical") filters.vertical = tab.value;
    if (tab.field === "destination") filters.destination = tab.value;
    if (tab.field === "sourceHub") filters.sourceHub = tab.value;
  }

  const packages = await getListings(filters);
  const activeCat = sp.cat ?? "";
  const query = sp.q ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Activities</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1500px] px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {query ? `Results for "${query}"` : tab ? `${tab.label} Activities` : "All Activities"}
          </h1>
          <p className="mt-2 text-gray-500">
            {packages.length} {packages.length === 1 ? "activity" : "activities"} found
          </p>
        </div>

        <SearchBar initialQuery={query} />

        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/activities"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              activeCat === ""
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-gray-300 text-gray-700 hover:border-primary-400"
            }`}
          >
            All
          </Link>
          {HOME_TABS.flatMap((r) => r.tabs).map((t) => {
            const href = `/activities?cat=${t.field === "tag" ? "to" : t.field === "vertical" ? "to" : "from"}:${t.value}`;
            const active = activeCat === `${t.field === "tag" || t.field === "vertical" ? "to" : "from"}:${t.value}`;
            return (
              <Link
                key={t.value}
                href={href}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                  active
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-gray-300 text-gray-700 hover:border-primary-400"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <PackagesFilterSidebar />
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <MobileFilterDrawer>
                <PackagesFilterSidebar />
              </MobileFilterDrawer>
            </div>
            <PackagesGrid packages={packages} />
          </div>
        </div>
      </div>
    </div>
  );
}
