'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { User, Heart, X, Menu } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const NAV_ITEMS = [
  { href: '/packages', label: 'Explore', vertical: null },
  { href: '/packages?vertical=wellness', label: 'Retreat', vertical: 'wellness' },
  { href: '/packages?vertical=solo_explorer', label: 'Solo Travel', vertical: 'solo_explorer' },
];

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
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
          onClick={onLinkClick}
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

function MobileNavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function isActive(item: typeof NAV_ITEMS[number]) {
    if (pathname !== '/packages') return false;
    const activeVertical = searchParams.get('vertical');
    return item.vertical === activeVertical || (!item.vertical && !activeVertical);
  }

  return (
    <nav className="flex flex-col gap-2 md:hidden">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onLinkClick}
          className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            isActive(item)
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function UserButton() {
  const { isAuthenticated, userData } = useAuth();

  if (isAuthenticated) {
    return (
      <Link
        href="/customer/wishlist"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-600"
      >
        <Heart className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-600"
    >
      <User className="h-4 w-4" />
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo — just BH */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white text-lg font-extrabold">
            BH
          </span>
        </Link>

        {/* Center nav — desktop only */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <Suspense fallback={null}>
            <NavLinks />
          </Suspense>
        </div>

        {/* Right side — user icon + hamburger */}
        <div className="flex items-center gap-3">
          <Suspense fallback={null}>
            <UserButton />
          </Suspense>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile slide-in overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel — slides from right */}
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            {/* Close button */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <span className="text-sm font-semibold text-gray-900">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <Suspense fallback={null}>
                <MobileNavLinks onLinkClick={() => setMobileOpen(false)} />
              </Suspense>
            </div>

            {/* Bottom — user action */}
            <div className="border-t border-gray-100 px-5 py-4">
              <Suspense fallback={null}>
                <MobileUserAction onLinkClick={() => setMobileOpen(false)} />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileUserAction({ onLinkClick }: { onLinkClick?: () => void }) {
  const { isAuthenticated, userData, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href={userData?.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'}
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <User className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/customer/wishlist"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <Heart className="h-4 w-4" />
          Wishlist
        </Link>
        <button
          type="button"
          onClick={() => { logout(); onLinkClick?.(); }}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onLinkClick}
      className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700"
    >
      <User className="h-4 w-4" />
      Login / Sign Up
    </Link>
  );
}
