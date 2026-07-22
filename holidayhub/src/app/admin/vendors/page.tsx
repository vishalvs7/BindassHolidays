'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, Building2, CheckCircle, XCircle, Mail, Phone, MapPin, Search } from 'lucide-react';

interface VendorRow {
  id: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  status: string;
  business_type: string;
  business_address: string;
  created_at: string;
  listings_count: number;
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data: v, error: ve } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      if (ve) throw ve;

      const vendorIds = (v ?? []).map((v: any) => v.id);
      const listingCounts = new Map<string, number>();
      if (vendorIds.length > 0) {
        const { data: listings } = await supabase
          .from('listings')
          .select('vendor_id')
          .in('vendor_id', vendorIds);
        (listings ?? []).forEach((l: any) => {
          listingCounts.set(l.vendor_id, (listingCounts.get(l.vendor_id) ?? 0) + 1);
        });
      }

      setVendors((v ?? []).map((r: any) => ({
        id: r.id,
        business_name: r.business_name ?? '—',
        contact_person: r.contact_person ?? '—',
        email: r.email ?? '—',
        phone: r.phone ?? '—',
        status: r.status,
        business_type: r.business_type ?? '—',
        business_address: r.business_address ?? '—',
        created_at: r.created_at,
        listings_count: listingCounts.get(r.id) ?? 0,
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vendors.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const supabase = getBrowserClient();
      const { error: e } = await supabase.from('vendors').update({ status }).eq('id', id);
      if (e) throw e;
      setVendors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update vendor status.');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return vendors;
    const q = search.toLowerCase();
    return vendors.filter(v =>
      v.business_name.toLowerCase().includes(q) ||
      v.contact_person.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.phone.includes(q)
    );
  }, [vendors, search]);

  useEffect(() => { fetchVendors(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading vendors…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-4 w-4" /> {error}
        <button onClick={fetchVendors} className="ml-auto text-red-700 underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
        <p className="mt-1 text-gray-500">{filtered.length} of {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((v) => (
          <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{v.business_name}</h3>
                  <p className="text-sm text-gray-500">{v.contact_person}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Mail size={14} /> {v.email}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {v.phone}</span>
                    {v.business_address !== '—' && (
                      <span className="flex items-center gap-1"><MapPin size={14} /> {v.business_address}</span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-2 text-sm">
                    <span className="text-gray-500">Type: <span className="font-medium text-gray-700">{v.business_type}</span></span>
                    <span className="text-gray-500">Listings: <span className="font-medium text-gray-700">{v.listings_count}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {v.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(v.id, 'approved')}
                      disabled={updating === v.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(v.id, 'rejected')}
                      disabled={updating === v.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${
                  v.status === 'approved' ? 'bg-green-100 text-green-800' :
                  v.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {v.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{search ? 'No vendors match your search' : 'No vendors registered yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
