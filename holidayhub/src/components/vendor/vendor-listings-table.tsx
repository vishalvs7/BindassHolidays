"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { getBrowserClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Eye, Plus, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ListingKind } from "@/lib/supabase/listing";

interface Row {
  id: string;
  title: string;
  destination: string;
  source_hub: string;
  price: number;
  status: string;
  tags: string[];
  booking_count: number;
  rating: number;
}

export function VendorListingsTable({ type }: { type: ListingKind }) {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!user?.id) return;
    setLoading(true);
    const supabase = getBrowserClient();
    const { data, error: e } = await supabase
      .from("listings")
      .select("id, title, destination, source_hub, price, status, tags, rating")
      .eq("vendor_id", user.id)
      .eq("type", type)
      .order("created_at", { ascending: false });
    if (e) setError(e.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, type]);

  async function toggleStatus(r: Row) {
    const supabase = getBrowserClient();
    const next = r.status === "published" ? "draft" : "published";
    const { error: e } = await supabase.from("listings").update({ status: next }).eq("id", r.id);
    if (!e) setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: next } : x)));
  }

  async function remove(r: Row) {
    if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    const supabase = getBrowserClient();
    const { error: e } = await supabase.from("listings").delete().eq("id", r.id);
    if (!e) setRows((prev) => prev.filter((x) => x.id !== r.id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{type}s</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your {type} listings</p>
        </div>
        <Link href={`/vendor/listings/${type === "package" ? "packages" : "activities"}/new`}>
          <Button>
            <Plus size={16} className="mr-2" /> Add {type === "package" ? "Package" : "Activity"}
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <p className="text-lg font-semibold text-gray-900">No {type}s yet</p>
          <p className="mt-2 text-sm text-gray-500">Create your first listing to go live.</p>
          <Link
            href={`/vendor/listings/${type === "package" ? "packages" : "activities"}/new`}
            className="mt-6 inline-block rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white"
          >
            Create {type === "package" ? "Package" : "Activity"}
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Listing</th>
                <th className="px-5 py-3 font-medium">Route</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{r.title}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary">{t}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {r.source_hub} → {r.destination}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">₹{Number(r.price).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleStatus(r)} title="Toggle status">
                      <Badge variant={r.status === "published" ? "vibe" : "secondary"}>
                        {r.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/listings/${r.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                        title="View"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/vendor/listings/${type === "package" ? "packages" : "activities"}/edit/${r.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => remove(r)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
