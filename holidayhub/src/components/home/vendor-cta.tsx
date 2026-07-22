'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building, Plane, TrendingUp, ShieldCheck, Wallet } from 'lucide-react';
import { useInView } from '@/lib/hooks/use-in-view';

export function VendorCTA() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-r from-primary-900 via-purple-900 to-indigo-900 px-4 py-20 text-white">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className={`mx-auto w-full max-w-[1500px] px-4 xl:max-w-[1400px] transition-all duration-700 ${inView ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <Plane className="h-12 w-12 text-primary-300" />
            <h2 className="mt-6 text-3xl font-bold md:text-5xl">Run trips?<br />Join as a vendor.</h2>
            <p className="mt-4 max-w-lg text-lg text-primary-100">
              List your weekend batches to thousands of high-intent travelers. Minimal backend,
              zero upfront risk — we fill your unsold slots.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link href="/register/vendor">
                <Button size="lg" className="bg-white px-8 py-6 text-lg text-primary-700 hover:bg-gray-100">
                  <Building className="mr-2 h-5 w-5" /> Become a Vendor
                </Button>
              </Link>
              <Link href="/vendor-benefits">
                <Button size="lg" variant="outline" className="border-white/40 px-8 py-6 text-lg text-white hover:bg-white/10">
                  See Benefits
                </Button>
              </Link>
            </div>
          </div>

          {/* Right — Benefits grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, title: 'Grow revenue', desc: 'Reach thousands of weekend travelers looking for curated trips.' },
              { icon: ShieldCheck, title: 'Verified platform', desc: 'Background-checked vendors get a trust badge & priority ranking.' },
              { icon: Wallet, title: 'Zero upfront cost', desc: 'List for free. Pay only when you get bookings. No hidden fees.' },
              { icon: Plane, title: 'Smart dashboard', desc: 'Manage batches, track slots & view real-time analytics.' },
            ].map((b, i) => (
              <div
                key={b.title}
                className={`rounded-2xl bg-white/5 p-5 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 ${
                  inView ? 'animate-slide-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <b.icon className="h-6 w-6 text-primary-300" />
                <h4 className="mt-3 text-sm font-bold">{b.title}</h4>
                <p className="mt-1 text-xs text-white/60">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
