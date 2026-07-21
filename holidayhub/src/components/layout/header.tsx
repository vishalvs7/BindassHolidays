'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Building } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const NAV_ITEMS = [
  { href: '/packages', label: 'Explore', vertical: null },
  { href: '/packages?vertical=wellness', label: 'Retreat', vertical: 'wellness' },
  { href: '/packages?vertical=solo_explorer', label: 'Solo Travel', vertical: 'solo_explorer' },
];

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function isActive(item: typeof NAV_ITEMS[number]) {
    if (pathname !== '/packages') return false;
    const activeVertical = searchParams.get('vertical');
    return item.vertical === activeVertical || (!item.vertical && !activeVertical);
  }

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
            isActive(item)
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AuthSection() {
  const { isAuthenticated, userData, logout } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg sm:flex">
            {userData?.role === 'vendor' ? (
              <Building className="h-4 w-4 text-primary-600" />
            ) : (
              <User className="h-4 w-4 text-primary-600" />
            )}
            <span className="text-sm font-medium">{userData?.name?.split(' ')[0] || 'User'}</span>
          </div>
          <Link href={userData?.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'}>
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
          <Button onClick={logout} variant="ghost" size="sm" className="hidden sm:flex">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/login?tab=register">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white text-lg font-extrabold">
            BH
          </span>
          Bindass Holiday
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <Suspense fallback={null}>
            <NavLinks />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <AuthSection />
        </Suspense>
      </div>
    </header>
  );
}
