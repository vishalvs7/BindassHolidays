'use client';

import Link from 'next/link';
import { useInView } from '@/lib/hooks/use-in-view';
import { Star, ArrowRight, TrendingUp, MapPin, Users } from 'lucide-react';

const TRENDING_H = [
  { title: 'Rishikesh Weekend Rafting', tag: 'Adrenaline', price: 4999, rating: 4.8, reviews: 124, emoji: '🚣', desc: 'Class 3+ rapids, riverside camping & bonfire nights. Fri-Mon.', location: 'Rishikesh', slots: 6 },
  { title: 'Munnar Tea Trail Getaway', tag: 'Wellness', price: 6499, rating: 4.9, reviews: 98, emoji: '🌿', desc: 'Mist-covered tea gardens, sunrise hikes & plantation tours.', location: 'Munnar', slots: 4 },
  { title: 'Goa Beach Escape', tag: 'Crew', price: 5299, rating: 4.7, reviews: 211, emoji: '🏖️', desc: 'North Goa beach hopping, water sports & sunset parties.', location: 'Goa', slots: 8 },
  { title: 'Manali Snow Squad', tag: 'Solo', price: 7199, rating: 4.8, reviews: 156, emoji: '❄️', desc: 'Snow trekking, Solang Valley & cozy mountain stays.', location: 'Manali', slots: 3 },
];

const TRENDING_G = [
  { title: 'Andaman Dive Trip', tag: 'Adrenaline', price: 12999, rating: 4.9, reviews: 87, emoji: '🐠' },
  { title: 'Jaipur Royal Trail', tag: 'Crew', price: 3999, rating: 4.6, reviews: 143, emoji: '🏰' },
  { title: 'Kerala Backwaters', tag: 'Wellness', price: 7999, rating: 4.8, reviews: 201, emoji: '🌴' },
  { title: 'Spiti Valley Trek', tag: 'Solo', price: 9999, rating: 4.9, reviews: 64, emoji: '🏔️' },
];

export function TrendingSection() {
  const { ref: refH, inView: inViewH } = useInView();
  const { ref: refG, inView: inViewG } = useInView();

  return (
    <section className="px-4 py-16">
      <div className="mx-auto w-full max-w-[1500px] px-4 xl:max-w-[1400px]">
        {/* Section header */}
        <div className="mb-8 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Trending this weekend</h2>
            <p className="mt-1 text-gray-500">The batches filling up fastest right now.</p>
          </div>
        </div>

        {/* Row 1 — Horizontal cards (unique layout) */}
        <div ref={refH} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {TRENDING_H.map((item, i) => (
            <Link
              key={item.title}
              href="/packages"
              className={`group flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl ${
                inViewH ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Left: image area (40%) */}
              <div className="flex w-[35%] items-center justify-center bg-gradient-to-br from-primary-100 to-fuchsia-100 text-5xl sm:w-[40%]">
                {item.emoji}
              </div>
              {/* Right: content (60%) */}
              <div className="flex flex-1 flex-col justify-center p-5">
                <span className="mb-2 inline-block w-fit rounded-full bg-primary-50 px-3 py-0.5 text-xs font-medium text-primary-700">
                  {item.tag}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.desc}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{item.slots} left</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">₹{item.price.toLocaleString('en-IN')}</span>
                  <span className="flex items-center gap-1 text-sm text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" /> {item.rating}
                    <span className="text-gray-400 font-normal">({item.reviews})</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Row 2 — Grid of compact cards */}
        <div ref={refG} className="mt-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TRENDING_G.map((item, i) => (
              <Link
                key={item.title}
                href="/packages"
                className={`group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  inViewG ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-primary-50 to-fuchsia-50 text-4xl transition-transform duration-500 group-hover:scale-110">
                  {item.emoji}
                </div>
                <div className="p-4">
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700">
                    {item.tag}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-gray-900">{item.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-primary-600">₹{item.price.toLocaleString('en-IN')}</span>
                    <span className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="h-3 w-3 fill-current" /> {item.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/packages"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Browse all trips <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
