'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, LogOut, Building } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

export function Header() {
  const { isAuthenticated, userData, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white text-lg font-extrabold">
            BH
          </span>
          Bindass Holiday
        </Link>

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
      </div>
    </header>
  );
}
