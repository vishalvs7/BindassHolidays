'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Activity, 
  Calendar,
  CreditCard, 
  BarChart3,
  Settings, 
  LogOut,
  Home,
  Building2,
  PlusCircle
} from 'lucide-react';

const vendorNavItems = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Packages', href: '/vendor/listings/packages', icon: Package },
  { name: 'Activities', href: '/vendor/listings/activities', icon: Activity },
  { name: 'Bookings', href: '/vendor/bookings', icon: Calendar },
  { name: 'Payments', href: '/vendor/payments', icon: CreditCard },
  { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/vendor/settings', icon: Settings },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userData, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userData?.role !== 'vendor')) {
      router.push('/login');
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || userData?.role !== 'vendor') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">BH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Bindass Holiday</span>
                <span className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded">Vendor</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                <Home size={20} />
                <span>Home</span>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building2 size={20} className="text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{userData?.businessName}</p>
                  <p className="text-xs text-gray-500">{userData?.name} • Vendor</p>
                </div>
              </div>
              
              <button
                onClick={() => logout()}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-2">
                {vendorNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors group"
                  >
                    <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-medium text-gray-900 mb-4">Business Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Listings</span>
                    <span className="font-bold text-purple-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Bookings</span>
                    <span className="font-bold text-purple-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Earnings</span>
                    <span className="font-bold text-purple-600">₹0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rating</span>
                    <span className="font-bold text-purple-600">--</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 space-y-3">
                <Link
                  href="/vendor/listings/packages/new"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
                >
                  <PlusCircle size={18} />
                  <span>Add Package</span>
                </Link>
                <Link
                  href="/vendor/listings/activities/new"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-white border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium transition-colors"
                >
                  <PlusCircle size={18} />
                  <span>Add Activity</span>
                </Link>
              </div>

              {/* Help Section */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Vendor Support</h4>
                <p className="text-sm text-blue-700 mb-3">Need help with your listings?</p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Contact Vendor Support
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6 min-h-[600px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}