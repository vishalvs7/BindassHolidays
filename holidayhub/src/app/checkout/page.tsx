import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getListing } from "@/lib/supabase/listing";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; id?: string; batch?: string; qty?: string }>;
}) {
  const sp = await searchParams;
  const kind = sp.type === "activity" ? "activity" : "package";
  const id = sp.id;
  const batchSlotId = sp.batch;
  const qty = Math.max(1, Math.min(10, Number(sp.qty) || 1));

  if (!id) notFound();

  const listing = await getListing(id);
  if (!listing) notFound();

  const batch = listing.batches.find((b) => b.slotId === batchSlotId) ?? null;

  if (!batch) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900">Select a departure date first</h1>
        <p className="mt-2 text-sm text-gray-500">
          Please choose your preferred batch from the listing page.
        </p>
        <Link
          href={`/${kind === "package" ? "packages" : "activities"}/${id}`}
          className="mt-6 inline-block rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white"
        >
          Back to listing
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <nav className="mb-6 text-sm text-gray-500">
          <Link
            href={`/${kind === "package" ? "packages" : "activities"}/${id}`}
            className="hover:text-primary-600"
          >
            ← Back to {listing.title}
          </Link>
        </nav>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
        <CheckoutForm
          listing={{ id: listing.id, title: listing.title, kind, unitPrice: listing.price }}
          batch={{
            slotId: batch.slotId,
            departAt: batch.departAt,
            returnAt: batch.returnAt,
            priceOverride: batch.priceOverride,
          }}
          qty={qty}
          gstPercent={5}
        />
      </div>
    </div>
  );
}
