"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { getBrowserClient } from "@/lib/supabase/client";
import {
  Loader2,
  AlertCircle,
  Users,
  CreditCard,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ListingKind } from "@/lib/supabase/listing";

interface BookingRow {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_type: string;
  status: string;
  qty: number;
  total_amount: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  travelers: { full_name: string; age: number | null; gender: string | null; phone: string | null }[];
}

const STATUS_STYLES: Record<string, "vibe" | "secondary"> = {
  confirmed: "vibe",
  pending_payment: "secondary",
  cancelled: "secondary",
  completed: "vibe",
};

export function VendorBookings({ type }: { type?: ListingKind }) {
  const { user } = useAuth();
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);
      try {
        const supabase = getBrowserClient();
        // Vendor's listing IDs
        const { data: listings } = await supabase
          .from("listings")
          .select("id, title, type")
          .eq("vendor_id", user.id);
        const ids = (listings ?? []).map((l: any) => l.id);
        if (ids.length === 0) {
          setRows([]);
          setLoading(false);
          return;
        }
        const titleMap = new Map<string, { title: string; type: string }>(
          (listings ?? []).map((l: any) => [l.id, { title: l.title, type: l.type }])
        );

        let q = supabase
          .from("bookings")
          .select("id, listing_id, listing_type, status, qty, total_amount, contact_name, contact_email, contact_phone, created_at")
          .in("listing_id", ids)
          .order("created_at", { ascending: false });
        if (type) q = q.eq("listing_type", type);

        const { data: bookings, error: be } = await q;
        if (be) throw new Error(be.message);

        const bookingIds = (bookings ?? []).map((b: any) => b.id);
        const travelerMap = new Map<string, any[]>();
        if (bookingIds.length) {
          const { data: travelers } = await supabase
            .from("booking_travelers")
            .select("booking_id, full_name, age, gender, phone")
            .in("booking_id", bookingIds);
          for (const t of travelers ?? []) {
            const arr = travelerMap.get(t.booking_id) ?? [];
            arr.push(t);
            travelerMap.set(t.booking_id, arr);
          }
        }

        const rows: BookingRow[] = (bookings ?? []).map((b: any) => ({
          id: b.id,
          listing_id: b.listing_id,
          listing_title: titleMap.get(b.listing_id)?.title ?? "—",
          listing_type: b.listing_type,
          status: b.status,
          qty: b.qty,
          total_amount: Number(b.total_amount),
          contact_name: b.contact_name,
          contact_email: b.contact_email,
          contact_phone: b.contact_phone,
          created_at: b.created_at,
          travelers: travelerMap.get(b.id) ?? [],
        }));
        setRows(rows);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, type]);

  async function handleStatusUpdate(bookingId: string, newStatus: string) {
    setUpdating(bookingId);
    try {
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Update failed.");
      setRows((prev) => prev.map((r) => (r.id === bookingId ? { ...r, status: newStatus } : r)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update booking status.");
    } finally {
      setUpdating(null);
    }
  }

  const filtered = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter)),
    [rows, statusFilter]
  );

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === "pending_payment").length;
    const confirmed = rows.filter((r) => r.status === "confirmed" || r.status === "completed").length;
    const revenue = rows
      .filter((r) => r.status !== "cancelled")
      .reduce((s, r) => s + r.total_amount, 0);
    return { total, pending, confirmed, revenue };
  }, [rows]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading bookings…
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
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track reservations and traveler manifests for your {type ? type + "s" : "listings"}.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Total bookings" value={stats.total} />
        <StatCard icon={Clock} label="Pending payment" value={stats.pending} />
        <StatCard icon={CheckCircle2} label="Confirmed" value={stats.confirmed} />
        <StatCard icon={CreditCard} label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} />
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending_payment", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              statusFilter === s
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-gray-300 text-gray-600 hover:border-primary-400"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <p className="text-lg font-semibold text-gray-900">No bookings yet</p>
          <p className="mt-2 text-sm text-gray-500">
            Once travelers book your listings, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-gray-50"
              >
                {expanded === r.id ? (
                  <ChevronDown size={18} className="text-gray-400" />
                ) : (
                  <ChevronRight size={18} className="text-gray-400" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{r.listing_title}</p>
                  <p className="text-xs text-gray-500">
                    {r.contact_name} · {new Date(r.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <Badge variant="secondary" className="capitalize">{r.listing_type}</Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{r.total_amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{r.qty} traveler{r.qty > 1 ? "s" : ""}</p>
                </div>
                <Badge variant={STATUS_STYLES[r.status] ?? "secondary"} className="capitalize">
                  {r.status.replace("_", " ")}
                </Badge>
              </button>

              {expanded === r.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-700">Lead contact</h4>
                      <dl className="space-y-1 text-sm text-gray-600">
                        <div className="flex gap-2"><span className="w-16 text-gray-400">Name</span>{r.contact_name}</div>
                        <div className="flex gap-2"><span className="w-16 text-gray-400">Email</span>{r.contact_email}</div>
                        <div className="flex gap-2"><span className="w-16 text-gray-400">Phone</span>{r.contact_phone}</div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                        <Users size={15} /> Traveler manifest ({r.travelers.length})
                      </h4>
                      {r.travelers.length === 0 ? (
                        <p className="text-sm text-gray-400">No traveler details recorded.</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {r.travelers.map((t, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                                {i + 1}
                              </span>
                              <span className="font-medium text-gray-800">{t.full_name}</span>
                              {t.age != null && <span className="text-gray-400">· {t.age}y</span>}
                              {t.gender && <span className="text-gray-400">· {t.gender}</span>}
                              {t.phone && <span className="text-gray-400">· {t.phone}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Status actions */}
                  {(r.status === "pending_payment" || r.status === "confirmed") && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4">
                      {r.status === "pending_payment" && (
                        <button
                          onClick={() => handleStatusUpdate(r.id, "confirmed")}
                          disabled={updating === r.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {updating === r.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                          Confirm booking
                        </button>
                      )}
                      {r.status === "confirmed" && (
                        <button
                          onClick={() => handleStatusUpdate(r.id, "completed")}
                          disabled={updating === r.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {updating === r.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                          Mark completed
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusUpdate(r.id, "cancelled")}
                        disabled={updating === r.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {updating === r.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <XCircle size={15} />
                        )}
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/listings/${r.listing_id}`}
                      className="text-sm font-medium text-primary-600 hover:underline"
                    >
                      View listing →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
