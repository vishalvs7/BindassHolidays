'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, Package, Search, Eye } from 'lucide-react';
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

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = listings;
    if (typeFilter !== 'all') result = result.filter(l => l.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.vendor_name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [listings, typeFilter, search]);

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Listings</h1>
        <p className="mt-1 text-gray-500">{filtered.length} of {listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
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
                <td className="px-5 py-4 font-medium text-gray-900">{l.title}</td>
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
                <td className="px-5 py-4 text-sm text-gray-600">{l.rating > 0 ? l.rating : '—'}</td>
                <td className="px-5 py-4">
                  <Link
                    href={`/listings/${l.id}`}
                    className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Eye size={14} /> View
                  </Link>
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
