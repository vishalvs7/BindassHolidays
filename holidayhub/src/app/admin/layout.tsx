'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Building2, Package, Tag, Settings, LogOut } from 'lucide-react';

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', href: '/admin/vendors', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Packages', href: '/admin/packages', icon: Package },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, logout, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading) {
      if (!user) {
        router.replace('/login');
      } else if (userData?.role !== 'admin') {
        router.replace(userData?.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
      }
    }
  }, [user, userData, loading, initialized, router]);

  if (!initialized || loading || !user || userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white shadow-sm border-r p-4">
          <Link href="/" className="flex items-center gap-2 mb-8 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">BH</span>
            <span className="font-bold text-gray-900">Admin</span>
          </Link>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition"
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <button
            onClick={logout}
            className="mt-8 flex items-center gap-2 px-3 py-2.5 w-full text-gray-600 hover:text-red-600 rounded-lg transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
