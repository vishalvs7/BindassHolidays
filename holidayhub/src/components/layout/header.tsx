'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Heart, X, Menu } from 'lucide-react';
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

function UserButton() {
  const { isAuthenticated } = useAuth();

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

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
      className="md:hidden"
    >
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />
      <nav
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '288px',
          background: '#fff',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: '#f3f4f6',
              cursor: 'pointer',
            }}
          >
            <X size={18} color="#6b7280" />
          </button>
        </div>
        <div style={{ padding: '0 20px 24px' }}>
          <MobileNavLinks onLinkClick={onClose} />
        </div>
      </nav>
    </div>,
    document.body
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onLinkClick}
          style={{
            display: 'block',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            background: isActive(item) ? '#7c3aed' : 'transparent',
            color: isActive(item) ? '#fff' : '#374151',
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white text-lg font-extrabold">
            BH
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <Suspense fallback={null}>
            <NavLinks />
          </Suspense>
        </div>

        <div className="flex items-center gap-3">
          <Suspense fallback={null}>
            <UserButton />
          </Suspense>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
