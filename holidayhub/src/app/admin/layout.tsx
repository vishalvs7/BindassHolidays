'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Building2, Package, Tag, Settings, LogOut, Menu, X } from 'lucide-react';

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', href: '/admin/vendors', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Packages', href: '/admin/packages', icon: Package },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { logout } = useAuth();
  return (
    <>
      <Link href="/" className="flex items-center gap-2 mb-8 px-2" onClick={onLinkClick}>
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
              onClick={onLinkClick}
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
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading, initialized } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (initialized && !loading) {
      if (!user) {
        router.replace('/login');
      } else if (userData?.role !== 'admin') {
        router.replace(userData?.role === 'vendor' ? '/vendor/dashboard' : '/customer/bookings');
      }
    }
  }, [user, userData, loading, initialized, router]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (!initialized || loading || !user || userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600"
        >
          <Menu size={18} />
        </button>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">BH</span>
          <span className="font-bold text-gray-900">Admin</span>
        </Link>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 min-h-screen bg-white shadow-sm border-r p-4">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-xl">
              <div className="flex items-center justify-end p-4">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <SidebarContent onLinkClick={() => setMobileOpen(false)} />
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
