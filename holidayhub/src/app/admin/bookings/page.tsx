'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, Calendar, CheckCircle, XCircle, Clock, Search, RotateCw } from 'lucide-react';

interface BookingRow {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  listing_title: string;
  listing_type: string;
  qty: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data: b, error: be } = await supabase
        .from('bookings')
        .select('id, contact_name, contact_email, contact_phone, listing_id, listing_type, qty, total_amount, status, created_at')
        .order('created_at', { ascending: false });
      if (be) throw be;

      const listingIds = [...new Set((b ?? []).map((r: any) => r.listing_id).filter(Boolean))];
      const titleMap = new Map<string, string>();
      if (listingIds.length > 0) {
        const { data: listings } = await supabase
          .from('listings')
          .select('id, title')
          .in('id', listingIds);
        (listings ?? []).forEach((l: any) => titleMap.set(l.id, l.title));
      }

      setBookings((b ?? []).map((r: any) => ({
        id: r.id,
        contact_name: r.contact_name,
        contact_email: r.contact_email,
        contact_phone: r.contact_phone,
        listing_title: titleMap.get(r.listing_id) ?? '—',
        listing_type: r.listing_type ?? '—',
        qty: r.qty,
        total_amount: Number(r.total_amount),
        status: r.status,
        created_at: r.created_at,
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to update status.');
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = useMemo(() => {
    let result = statusFilter === 'all'
      ? bookings
      : bookings.filter(b => b.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.contact_name.toLowerCase().includes(q) ||
        b.contact_email.toLowerCase().includes(q) ||
        b.listing_title.toLowerCase().includes(q)
      );
    }
    return result;
  }, [bookings, statusFilter, search]);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending_payment').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.total_amount, 0),
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending_payment': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const nextActions = (status: string) => {
    switch (status) {
      case 'pending_payment': return [{ label: 'Confirm', value: 'confirmed', color: 'text-green-600 hover:bg-green-50' }, { label: 'Cancel', value: 'cancelled', color: 'text-red-600 hover:bg-red-50' }];
      case 'confirmed': return [{ label: 'Complete', value: 'completed', color: 'text-blue-600 hover:bg-blue-50' }, { label: 'Cancel', value: 'cancelled', color: 'text-red-600 hover:bg-red-50' }];
      default: return [];
    }
  };

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
        <button onClick={() => setError(null)} className="ml-auto text-red-700 underline text-sm">Dismiss</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Oversight</h1>
          <p className="mt-1 text-gray-500">{filtered.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RotateCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
          { label: 'Completed', value: stats.completed, color: 'text-blue-600' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' },
          { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, color: 'text-primary-600' },
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
            placeholder="Search by customer, email, or listing…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending_payment', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize border transition ${
              statusFilter === s
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((b) => {
              const actions = nextActions(b.status);
              return (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{b.contact_name}</div>
                    <div className="text-xs text-gray-500">{b.contact_email}<br />{b.contact_phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-900">{b.listing_title}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                      b.listing_type === 'package' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {b.listing_type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-900">{b.qty}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">₹{b.total_amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(b.status)}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(b.status)}`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-4">
                    {actions.length > 0 ? (
                      <div className="flex gap-1">
                        {actions.map((a) => (
                          <button
                            key={a.value}
                            onClick={() => updateStatus(b.id, a.value)}
                            disabled={actionLoading === b.id}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition disabled:opacity-50 ${a.color}`}
                          >
                            {actionLoading === b.id ? '...' : a.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{search ? 'No bookings match your search' : 'No bookings found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
