import { notFound } from "next/navigation";
import Link from "next/link";
import { getListing, type ListingView } from "@/lib/supabase/listing";
import { ListingBookingWidget } from "@/components/browse/listing-booking-widget";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const detailHref = listing.type === "package" ? "/packages" : "/activities";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href={detailHref} className="hover:text-primary-600">
              {listing.type === "package" ? "Packages" : "Activities"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-2/3">
            <ListingHero listing={listing} />
            <ListingDetails listing={listing} />
          </div>
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <ListingBookingWidget
                listingId={listing.id}
                title={listing.title}
                type={listing.type}
                basePrice={listing.price}
                batches={listing.batches}
                minAge={listing.minAge}
                maxAge={listing.maxAge}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingHero({ listing }: { listing: ListingView }) {
  const cover = listing.coverImage ?? listing.gallery[0];
  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="relative h-80 bg-gradient-to-r from-primary-500 to-purple-600">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl font-bold text-white">
            {listing.title}
          </div>
        )}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {listing.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-800 backdrop-blur">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
        {listing.tagline && <p className="mt-2 text-gray-600">{listing.tagline}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>📍 {listing.destination} · from {listing.sourceHub}</span>
          {listing.durationDays != null && <span>🗓 {listing.durationDays} days</span>}
          {listing.rating > 0 && <span>⭐ {listing.rating} ({listing.totalReviews})</span>}
        </div>
      </div>
    </div>
  );
}

function ListingDetails({ listing }: { listing: ListingView }) {
  return (
    <div className="mt-8 space-y-8">
      {listing.description && (
        <section className="rounded-2xl bg-white p-6">
          <h3 className="mb-3 text-xl font-bold text-gray-900">Overview</h3>
          <p className="text-gray-700">{listing.description}</p>
        </section>
      )}

      {listing.itinerary.length > 0 && (
        <section className="rounded-2xl bg-white p-6">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            {listing.type === "activity" ? "Schedule" : "Itinerary"}
          </h3>
          <ol className="relative border-l-2 border-primary-200 pl-6">
            {listing.itinerary.map((stop, i) => (
              <li key={i} className="mb-6">
                <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-primary-700">
                  {stop.time ?? stop.day ?? ""} · {stop.title}
                </p>
                {stop.description && <p className="mt-1 text-gray-700">{stop.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <ChecklistBlock
        inclusions={listing.inclusions}
        exclusions={listing.exclusions}
        thingsToCarry={listing.thingsToCarry ?? []}
      />

      {listing.faqs.length > 0 && (
        <section className="rounded-2xl bg-white p-6">
          <h3 className="mb-4 text-xl font-bold text-gray-900">FAQs</h3>
          <div className="space-y-4">
            {listing.faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-4">
                <p className="font-semibold text-gray-900">{f.question}</p>
                <p className="mt-1 text-gray-700">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {listing.cancellationPolicy && (
        <section className="rounded-2xl bg-red-50 p-6">
          <h3 className="mb-2 font-semibold text-red-900">Cancellation Policy</h3>
          <p className="text-sm text-red-700">{listing.cancellationPolicy}</p>
        </section>
      )}
    </div>
  );
}

function ChecklistBlock({
  inclusions,
  exclusions,
  thingsToCarry,
}: {
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
}) {
  const tabs = [
    { key: "incl", label: "Inclusions", items: inclusions, icon: "✓" },
    { key: "excl", label: "Exclusions", items: exclusions, icon: "✕" },
    { key: "carry", label: "Things to carry", items: thingsToCarry, icon: "•" },
  ].filter((t) => t.items.length > 0);

  if (tabs.length === 0) return null;

  return (
    <section className="rounded-2xl bg-white p-6">
      <div className="grid gap-6 sm:grid-cols-3">
        {tabs.map((tab) => (
          <div key={tab.key}>
            <h4 className="mb-3 font-semibold text-gray-900">{tab.label}</h4>
            <ul className="space-y-2">
              {tab.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className={tab.key === "excl" ? "text-red-500" : tab.key === "incl" ? "text-green-500" : "text-gray-400"}>
                    {tab.icon}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
