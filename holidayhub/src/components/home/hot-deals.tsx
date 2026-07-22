'use client';

import Link from 'next/link';
import { useInView } from '@/lib/hooks/use-in-view';
import { ArrowRight, Tag } from 'lucide-react';

const DEALS = [
  {
    title: 'Himalayan Retreat',
    desc: 'Flat 25% off on all Manali & Kasol batches this month',
    discount: '25% OFF',
    gradient: 'from-indigo-600 to-purple-800',
    link: '/packages?cat=to:manali',
  },
  {
    title: 'Beachside Getaway',
    desc: 'Book Goa weekend packages at ₹4,999 — limited slots',
    discount: 'From ₹4,999',
    gradient: 'from-amber-500 to-red-600',
    link: '/packages?cat=to:goa',
  },
  {
    title: 'Solo Explorer Deal',
    desc: 'Extra 10% off for solo travelers on select batches',
    discount: '10% EXTRA',
    gradient: 'from-emerald-600 to-teal-700',
    link: '/packages?cat=to:solo_explorer',
  },
];

export function HotDeals() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="px-4 py-16">
      <div className="mx-auto w-full max-w-[1500px] px-4 xl:max-w-[1400px]">
        <div className="mb-8 flex items-center gap-3">
          <Tag className="h-6 w-6 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Limited Time Offers</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {DEALS.map((deal, i) => (
            <Link
              key={deal.title}
              href={deal.link}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${deal.gradient} p-7 text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                inView ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-all duration-500 group-hover:scale-150" />
              <div className="relative z-10">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wide backdrop-blur-sm">
                  {deal.discount}
                </span>
                <h3 className="mt-4 text-xl font-bold">{deal.title}</h3>
                <p className="mt-2 text-sm text-white/80">{deal.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white/90 underline-offset-2 transition-all group-hover:underline">
                  Book Now <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
