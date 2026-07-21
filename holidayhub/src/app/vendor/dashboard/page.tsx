'use client';

import { 
  TrendingUp, 
  CreditCard, 
  Star, 
  Calendar, 
  Package, 
  Activity, 
  ArrowUpRight,
  PlusCircle,
  BarChart3,
  Eye,
  Download,
  Bell,
  TrendingDown,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalListings: number;
  publishedListings: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  avgRating: number | null;
  totalReviews: number;
  recentBookings: {
    id: string;
    contact_name: string;
    listing_title: string;
    listing_type: string;
    qty: number;
    total_amount: number;
    status: string;
    created_at: string;
  }[];
  listingStats: {
    id: string;
    title: string;
    type: string;
    bookings: number;
    revenue: number;
    rating: number;
  }[];
}

export default function VendorDashboardPage() {
  const { user, userData } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);
      try {
        const supabase = getBrowserClient();

        // Listings
        const { data: listings, error: lErr } = await supabase
          .from("listings")
          .select("id, title, type, status, rating")
          .eq("vendor_id", user.id);
        if (lErr) throw lErr;

        const totalListings = listings?.length ?? 0;
        const publishedListings = listings?.filter((l: any) => l.status === "published").length ?? 0;

        // Bookings via batch_slots -> batch_dates -> listings
        const listingIds = (listings ?? []).map((l: any) => l.id);
        let bookings: any[] = [];
        let revenue = 0;
        if (listingIds.length > 0) {
          const { data: b, error: bErr } = await supabase
            .from("bookings")
            .select("id, listing_id, listing_type, status, total_amount, qty, contact_name, created_at")
            .in("listing_id", listingIds)
            .order("created_at", { ascending: false });
          if (bErr) throw bErr;
          bookings = b ?? [];
          revenue = (bookings as any[])
            .filter((b: any) => b.status !== "cancelled")
            .reduce((s: number, b: any) => s + Number(b.total_amount), 0);
        }

        const titleMap = new Map<string, string>((listings ?? []).map((l: any) => [l.id, l.title]));

        // Per-listing stats
        const listingBookings = new Map<string, { count: number; revenue: number }>();
        for (const l of listings ?? []) {
          listingBookings.set(l.id, { count: 0, revenue: 0 });
        }
        for (const b of bookings) {
          const cur = listingBookings.get(b.listing_id) ?? { count: 0, revenue: 0 };
          cur.count++;
          if (b.status !== "cancelled") cur.revenue += Number(b.total_amount);
          listingBookings.set(b.listing_id, cur);
        }

        const listingStats = (listings ?? []).map((l: any) => {
          const lb = listingBookings.get(l.id) ?? { count: 0, revenue: 0 };
          return {
            id: l.id,
            title: l.title,
            type: l.type,
            bookings: lb.count,
            revenue: lb.revenue,
            rating: Number(l.rating ?? 0),
          };
        });

        // Average rating from reviews on this vendor's listings
        let avgRating: number | null = null;
        let totalReviews = 0;
        if (listingIds.length > 0) {
          const { data: reviews } = await supabase
            .from("reviews")
            .select("rating")
            .in("listing_id", listingIds);
          if (reviews && reviews.length > 0) {
            totalReviews = reviews.length;
            avgRating = (reviews as any[]).reduce((s: number, r: any) => s + r.rating, 0) / reviews.length;
          }
        }

        const activeBookings = bookings.filter(
          (b: any) => b.status === "confirmed" || b.status === "pending_payment"
        ).length;

        const recentBookings = bookings.slice(0, 5).map((b: any) => ({
          id: b.id,
          contact_name: b.contact_name,
          listing_title: titleMap.get(b.listing_id as string) ?? "—",
          listing_type: b.listing_type,
          qty: b.qty,
          total_amount: Number(b.total_amount),
          status: b.status,
          created_at: b.created_at,
        }));

        setStats({
          totalListings,
          publishedListings,
          totalBookings: bookings.length,
          activeBookings,
          totalRevenue: revenue,
          avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
          totalReviews,
          recentBookings,
          listingStats: listingStats.sort((a: any, b: any) => b.bookings - a.bookings).slice(0, 4),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

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

  const dashStats = [
    { 
      title: 'Total Revenue', 
      value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, 
      change: '+0%', 
      changeType: 'increase' as const,
      icon: CreditCard, 
      color: 'bg-green-100 text-green-600',
      subtitle: 'All time'
    },
    { 
      title: 'Active Bookings', 
      value: String(stats?.activeBookings ?? 0), 
      change: `${stats?.totalBookings ?? 0} total`, 
      changeType: 'increase' as const,
      icon: Calendar, 
      color: 'bg-blue-100 text-blue-600',
      subtitle: 'Currently active'
    },
    { 
      title: 'Total Listings', 
      value: String(stats?.totalListings ?? 0), 
      change: `${stats?.publishedListings ?? 0} published`, 
      changeType: stats?.publishedListings ? 'increase' as const : 'increase' as const,
      icon: Package, 
      color: 'bg-purple-100 text-purple-600',
      subtitle: 'Packages & activities'
    },
    { 
      title: 'Customer Rating', 
      value: stats?.avgRating ? `${stats.avgRating}` : '--', 
      change: stats?.totalReviews ? `${stats.totalReviews} reviews` : 'No reviews', 
      changeType: 'increase' as const,
      icon: Star, 
      color: 'bg-yellow-100 text-yellow-600',
      subtitle: stats?.totalReviews ? `Based on ${stats.totalReviews} reviews` : 'No reviews yet'
    },
  ];

  const recentBookings = (stats?.recentBookings ?? []).length > 0
    ? (stats?.recentBookings ?? [])
    : [];

  const popularListings = (stats?.listingStats ?? []).length > 0
    ? (stats?.listingStats ?? [])
    : [];

  const notifications: {
    id: number;
    message: string;
    time: string;
    read: boolean;
  }[] = [];

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
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.businessName || userData?.name || 'Business'}!</h1>
            <p className="text-white/90">Here's what's happening with your business today</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button className="flex items-center px-4 py-2.5 bg-white/20 rounded-lg hover:bg-white/30 transition">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <button className="relative p-2.5 bg-white/20 rounded-lg hover:bg-white/30 transition">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-3">
                    {stat.changeType === 'increase' ? (
                      <TrendingUp size={16} className="text-green-500 mr-1.5" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500 mr-1.5" />
                    )}
                    <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{stat.subtitle}</span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <p className="text-gray-600 text-sm mt-1">Latest customer bookings</p>
              </div>
              <Link href="/vendor/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                View all <ArrowUpRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{booking.contact_name}</div>
                        <div className="text-sm text-gray-500">{booking.qty} guest{booking.qty > 1 ? "s" : ""}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center mr-3 ${
                            booking.listing_type === 'package' ? 'bg-purple-100' : 'bg-blue-100'
                          }`}>
                            {booking.listing_type === 'package' ? (
                              <Package size={16} className={booking.listing_type === 'package' ? 'text-purple-600' : 'text-blue-600'} />
                            ) : (
                              <Activity size={16} className={booking.listing_type === 'package' ? 'text-purple-600' : 'text-blue-600'} />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[120px]">{booking.listing_title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {new Date(booking.created_at).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">₹{booking.total_amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {recentBookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start promoting your listings to get bookings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popular Listings & Notifications */}
        <div className="space-y-8">
          {/* Popular Listings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top Listings</h2>
                <p className="text-gray-600 text-sm mt-1">Most viewed listings</p>
              </div>
              <Link href="/vendor/listings" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                Manage <ArrowUpRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {popularListings.map((listing) => (
                <div key={listing.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 mt-1 ${
                        listing.type === 'package' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {listing.type === 'package' ? (
                          <Package size={18} className={listing.type === 'package' ? 'text-purple-600' : 'text-blue-600'} />
                        ) : (
                          <Activity size={18} className={listing.type === 'package' ? 'text-purple-600' : 'text-blue-600'} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{listing.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Eye size={12} className="mr-1" />
                          {listing.bookings} booking{listing.bookings > 1 ? "s" : ""}
                          {listing.rating > 0 && (
                            <>
                              <Star size={12} className="ml-3 mr-1" />
                              {listing.rating}/5
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      listing.type === 'package' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {listing.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-600">Bookings</div>
                      <div className="font-semibold">{listing.bookings}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Revenue</div>
                      <div className="font-semibold">₹{listing.revenue.toLocaleString('en-IN')}</div>
                    </div>
                    <Link href={`/vendor/listings/${listing.type}s/edit/${listing.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}

              {popularListings.length === 0 && (
                <div className="text-center py-8">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No listings yet</p>
                  <Link
                    href="/vendor/listings/packages/new"
                    className="inline-block mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                  >
                    Create First Listing
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Mark all as read
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={`font-medium ${notification.read ? 'text-gray-900' : 'text-blue-900'}`}>
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1.5"></div>
                    )}
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/vendor/listings/packages/new"
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200">
                <PlusCircle size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add New Package</h3>
              <p className="text-sm text-gray-600">Create a new travel package listing</p>
            </Link>

            <Link
              href="/vendor/listings/activities/new"
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200">
                <Activity size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add Activity</h3>
              <p className="text-sm text-gray-600">List a new adventure activity</p>
            </Link>

            <Link
              href="/vendor/analytics"
              className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6 hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/90">
                <BarChart3 size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
              <p className="text-sm text-gray-600">Detailed business insights & reports</p>
              <div className="flex items-center mt-4 text-primary-600 font-medium text-sm">
                View dashboard
                <ArrowUpRight size={16} className="ml-1" />
              </div>
            </Link>
          </div>
        </div>

        {/* Business Goals */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Business Goals</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Monthly Revenue</span>
                <span className="text-sm text-gray-500">₹0 / ₹1,00,000</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">New Bookings</span>
                <span className="text-sm text-gray-500">0 / 10</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Listings Created</span>
                <span className="text-sm text-gray-500">0 / 5</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Overall Progress</span>
                </div>
                <span className="text-lg font-bold text-gray-900">0%</span>
              </div>
              <button className="w-full mt-4 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                Set New Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}