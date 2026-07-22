'use client';

import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, Users, Building2, Package, Calendar, CreditCard, Star, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalListings: number;
  publishedListings: number;
  totalBookings: number;
  totalRevenue: number;
  pendingVendors: number;
  recentBookings: {
    id: string;
    contact_name: string;
    listing_title: string;
    total_amount: number;
    status: string;
    created_at: string;
  }[];
  listingsByStatus: { status: string; count: number }[];
  recentUsers: { id: string; name: string; email: string; role: string; created_at: string }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const supabase = getBrowserClient();

        const [
          { count: totalUsers },
          { count: totalVendors },
          { count: pendingVendors },
          { count: totalListings },
          { count: publishedListings },
          { count: totalBookings },
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
          supabase.from('vendors').select('*', { count: 'exact', head: true }),
          supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('listings').select('*', { count: 'exact', head: true }),
          supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
        ]);

        const { data: revenueData } = await supabase
          .from('bookings')
          .select('total_amount')
          .neq('status', 'cancelled');
        const totalRevenue = (revenueData ?? []).reduce((s: number, b: any) => s + Number(b.total_amount), 0);

        const { data: recentBookings } = await supabase
          .from('bookings')
          .select('id, contact_name, listing_id, total_amount, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: listingsStatus } = await supabase
          .from('listings')
          .select('status');
        const statusCounts = new Map<string, number>();
        (listingsStatus ?? []).forEach((l: any) => {
          statusCounts.set(l.status, (statusCounts.get(l.status) ?? 0) + 1);
        });
        const listingsByStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count }));

        const { data: recentUsers } = await supabase
          .from('profiles')
          .select('id, name, email, role, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        const titleMap = new Map<string, string>();
        const listingIds = [...new Set((recentBookings ?? []).map((b: any) => b.listing_id).filter(Boolean))];
        if (listingIds.length > 0) {
          const { data: listings } = await supabase
            .from('listings')
            .select('id, title')
            .in('id', listingIds);
          (listings ?? []).forEach((l: any) => titleMap.set(l.id, l.title));
        }

        setStats({
          totalUsers: totalUsers ?? 0,
          totalVendors: totalVendors ?? 0,
          totalListings: totalListings ?? 0,
          publishedListings: publishedListings ?? 0,
          totalBookings: totalBookings ?? 0,
          totalRevenue,
          pendingVendors: pendingVendors ?? 0,
          recentBookings: (recentBookings ?? []).map((b: any) => ({
            id: b.id,
            contact_name: b.contact_name,
            listing_title: titleMap.get(b.listing_id) ?? '—',
            total_amount: Number(b.total_amount),
            status: b.status,
            created_at: b.created_at,
          })),
          listingsByStatus,
          recentUsers: (recentUsers ?? []).map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            created_at: u.created_at,
          })),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load admin dashboard.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading dashboard…
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

  const statCards = [
    { title: 'Total Users', value: String(stats?.totalUsers ?? 0), icon: Users, color: 'bg-blue-100 text-blue-600', href: '/admin/users' },
    { title: 'Vendors', value: String(stats?.totalVendors ?? 0), icon: Building2, color: 'bg-purple-100 text-purple-600', href: '/admin/vendors', badge: stats?.pendingVendors ? `${stats.pendingVendors} pending` : undefined },
    { title: 'Listings', value: String(stats?.totalListings ?? 0), icon: Package, color: 'bg-green-100 text-green-600', href: '/admin/vendors', subtitle: `${stats?.publishedListings ?? 0} published` },
    { title: 'Bookings', value: String(stats?.totalBookings ?? 0), icon: Calendar, color: 'bg-orange-100 text-orange-600', href: '/admin/bookings' },
    { title: 'Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, icon: CreditCard, color: 'bg-primary-100 text-primary-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">Platform overview at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon size={20} />
                </div>
                {card.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">{card.badge}</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              {card.subtitle && <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>}
              {card.href && (
                <Link href={card.href} className="mt-3 inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View <ArrowUpRight size={14} className="ml-1" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
              <p className="text-sm text-gray-500">Latest transactions across the platform</p>
            </div>
            <Link href="/admin/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View all <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{b.contact_name}</p>
                  <p className="text-xs text-gray-500">{b.listing_title}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{b.total_amount.toLocaleString('en-IN')}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(b.status)}`}>
                    {b.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
              <p className="text-center py-8 text-gray-400 text-sm">No bookings yet</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
              <p className="text-sm text-gray-500">Latest registrations</p>
            </div>
            <Link href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View all <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full ${
                    u.role === 'vendor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <p className="text-center py-8 text-gray-400 text-sm">No users yet</p>
            )}
          </div>
        </div>
      </div>

      {stats?.listingsByStatus && stats.listingsByStatus.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Listings by Status</h2>
          <div className="flex gap-6">
            {stats.listingsByStatus.map((s) => (
              <div key={s.status} className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-600">{s.status}</span>
                  <span className="font-semibold text-gray-900">{s.count}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.status === 'published' ? 'bg-green-500' : s.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${stats.totalListings > 0 ? (s.count / stats.totalListings) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
