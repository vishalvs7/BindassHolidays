'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, Package, Search, Eye, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ListingRow {
  id: string;
  title: string;
  type: string;
  status: string;
  vertical: string;
  vendor_name: string;
  price: number;
  rating: number;
  created_at: string;
}

export default function AdminPackagesPage() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data: l, error: le } = await supabase
        .from('listings')
        .select('id, title, type, status, vertical, vendor_id, price, rating, created_at')
        .order('created_at', { ascending: false });
      if (le) throw le;

      const vendorIds = [...new Set((l ?? []).map((r: any) => r.vendor_id).filter(Boolean))];
      const vendorMap = new Map<string, string>();
      if (vendorIds.length > 0) {
        const { data: vendors } = await supabase
          .from('vendors')
          .select('id, business_name')
          .in('id', vendorIds);
        (vendors ?? []).forEach((v: any) => vendorMap.set(v.id, v.business_name ?? '—'));
      }

      setListings((l ?? []).map((r: any) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        status: r.status,
        vertical: r.vertical,
        vendor_name: vendorMap.get(r.vendor_id) ?? '—',
        price: Number(r.price),
        rating: Number(r.rating ?? 0),
        created_at: r.created_at,
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const toggleStatus = async (listingId: string) => {
    setActionLoading(listingId);
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, action: 'toggle' }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to toggle status.');
      setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: data.status } : l));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to toggle status.');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteListing = async (listingId: string) => {
    setActionLoading(listingId);
    try {
      const res = await fetch(`/api/admin/listings?listingId=${listingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to delete listing.');
      setListings(prev => prev.filter(l => l.id !== listingId));
      setConfirmDelete(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete listing.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = useMemo(() => {
    let result = listings;
    if (typeFilter !== 'all') result = result.filter(l => l.type === typeFilter);
    if (statusFilter !== 'all') result = result.filter(l => l.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.vendor_name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [listings, typeFilter, statusFilter, search]);

  const stats = {
    total: listings.length,
    published: listings.filter(l => l.status === 'published').length,
    draft: listings.filter(l => l.status === 'draft').length,
    packages: listings.filter(l => l.type === 'package').length,
    activities: listings.filter(l => l.type === 'activity').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading listings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-4 w-4" /> {error}
        <button onClick={() => setError(null)} className="ml-auto text-red-700 underline text-sm">Dismiss</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Listings</h1>
          <p className="mt-1 text-gray-500">{filtered.length} of {listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Published', value: stats.published, color: 'text-green-600' },
          { label: 'Drafts', value: stats.draft, color: 'text-yellow-600' },
          { label: 'Packages', value: stats.packages, color: 'text-purple-600' },
          { label: 'Activities', value: stats.activities, color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or vendor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'package', 'activity'].map((s) => (
          <button
            key={s}
            onClick={() => setTypeFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize border transition ${
              typeFilter === s
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
            }`}
          >
            {s === 'all' ? 'All Types' : s + 's'}
          </button>
        ))}
        <span className="border-l border-gray-300 mx-1" />
        {['all', 'published', 'draft'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize border transition ${
              statusFilter === s
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
            }`}
          >
            {s === 'all' ? 'All Status' : s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900 max-w-[250px] truncate">{l.title}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    l.type === 'package' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {l.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{l.vendor_name}</td>
                <td className="px-5 py-4 font-semibold text-gray-900">₹{l.price.toLocaleString('en-IN')}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    l.status === 'published' ? 'bg-green-100 text-green-800' :
                    l.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{l.rating > 0 ? `★ ${l.rating}` : '—'}</td>
                <td className="px-5 py-4">
                  {confirmDelete === l.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600 font-medium">Delete?</span>
                      <button
                        onClick={() => deleteListing(l.id)}
                        disabled={actionLoading === l.id}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoading === l.id ? '...' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/listings/${l.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition"
                        title="View listing"
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        onClick={() => toggleStatus(l.id)}
                        disabled={actionLoading === l.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition disabled:opacity-50"
                        title={l.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {l.status === 'published' ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(l.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete listing"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{search ? 'No listings match your search' : 'No listings yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
