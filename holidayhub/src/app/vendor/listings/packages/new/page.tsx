"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { ListingForm } from "@/components/vendor/listing-form";

export default function VendorPackagesNewPage() {
  const { user } = useAuth();
  if (!user?.id) return <div className="py-20 text-center text-gray-400">Loading…</div>;
  return <ListingForm vendorId={user.id} defaultType="package" />;
}
