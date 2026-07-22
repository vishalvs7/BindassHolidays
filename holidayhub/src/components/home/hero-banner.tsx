'use client';

import { Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function HeroBanner() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/packages?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="relative flex h-[520px] items-center justify-center overflow-hidden md:h-[580px]">
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-black/65" />

      {/* Decorative orbs */}
      <div className="absolute -left-16 top-12 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-400/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 px-4 text-center text-white">
        <span className="inline-flex animate-fade-in items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="h-4 w-4" /> Weekend #1 escape plan, sorted
        </span>
        <h1 className="mt-6 animate-slide-up text-5xl font-extrabold leading-tight md:text-7xl">
          Escape. Explore.
          <br /> Return.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl animate-fade-in text-lg text-white/70">
          Stress-free weekend breaks for India&apos;s working professionals.
          Friday night depart. Monday morning back. Zero leaves needed.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-8 flex w-full max-w-lg animate-slide-up items-center">
          <div className="relative flex w-full items-center">
            <div className="absolute left-0 z-10 flex h-full items-center rounded-l-full bg-primary-600 px-4">
              <Search className="h-5 w-5 text-white" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, weekend vibes…"
              className="w-full rounded-full border border-white/20 bg-white/10 py-3.5 pl-14 pr-4 text-sm text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </form>

        {/* Trusted by strip */}
        <div className="mx-auto mt-10 flex max-w-lg animate-fade-in items-center justify-center gap-4 text-xs text-white/50">
          <span>Trusted by 5,000+ travelers</span>
          <span className="h-4 w-px bg-white/20" />
          <span>200+ weekend batches</span>
          <span className="h-4 w-px bg-white/20" />
          <span>30+ destinations</span>
        </div>
      </div>
    </section>
  );
}
