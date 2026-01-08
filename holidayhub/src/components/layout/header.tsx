import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-primary">
            Bindass Holiday
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/packages" className="text-sm font-medium hover:text-primary">
              Packages
            </Link>
            <Link href="/activities" className="text-sm font-medium hover:text-primary">
              Activities
            </Link>
            <Link href="/corporate" className="text-sm font-medium hover:text-primary">
              Corporate
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register/customer">
            <Button>Sign Up</Button>
          </Link>
          <Link href="/register/vendor">
            <Button variant="outline">Join as Vendor</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}