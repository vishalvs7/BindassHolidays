'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Package, Building } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

export function Header() {
  const { isAuthenticated, userData, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Bindass Holiday
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/packages" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition">
              Packages
            </Link>
            <Link href="/activities" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition">
              Activities
            </Link>
            <Link href="/corporate" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition">
              Corporate
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition">
              About
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Cart Icon (Always visible) */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Button>
          </Link>

          {isAuthenticated ? (
            /* Logged in user menu */
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                {userData?.role === 'vendor' ? (
                  <Building className="h-4 w-4 text-primary-600" />
                ) : (
                  <User className="h-4 w-4 text-primary-600" />
                )}
                <span className="text-sm font-medium">
                  {userData?.name?.split(' ')[0] || 'User'}
                </span>
              </div>
              
              <Link href={
                userData?.role === 'customer' ? '/customer/bookings' :
                userData?.role === 'vendor' ? '/vendor/dashboard' : '/'
              }>
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            /* Not logged in - Show auth buttons */
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              
              <div className="hidden md:flex items-center gap-2">
                <Link href="/register/customer">
                  <Button size="sm">Sign Up</Button>
                </Link>
                <Link href="/register/vendor">
                  <Button variant="outline" size="sm">
                    Join as Vendor
                  </Button>
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Link href="/register/customer">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}