"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useParams } from "next/navigation";
import { ListingForm } from "@/components/vendor/listing-form";

export default function VendorActivitiesEditIdPage() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  if (!user?.id) return <div className="py-20 text-center text-gray-400">Loading…</div>;
  return <ListingForm vendorId={user.id} defaultType="activity" initialId={params.id} />;
}
