'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import { Heart, CheckCircle } from 'lucide-react';

const BENEFITS = [
  'Curated batches by vibe — Adventure, Wellness, Solo, or Crew',
  'Real-time slot counters — book before they sell out',
  'WhatsApp vouchers, check-in support & instant cancellation',
];

export function Testimonial() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="px-4 py-16">
      <div className="mx-auto w-full max-w-[1500px] px-4 xl:max-w-[1400px]">
        <div className={`grid items-center gap-12 lg:grid-cols-2 transition-all duration-700 ${inView ? 'animate-fade-in' : 'opacity-0'}`}>
          {/* Left — Visual card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-purple-700 to-fuchsia-700 p-10 text-white shadow-2xl">
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-8 right-8 text-7xl opacity-30">🌄</div>
            <Heart className="relative h-8 w-8 text-pink-300" />
            <blockquote className="relative mt-4 text-2xl font-semibold leading-relaxed">
              &ldquo;The only planning I did was packing my bag. Everything else? Bindass handled it.&rdquo;
            </blockquote>
            <p className="relative mt-4 text-sm text-primary-200">
              — A solo traveler, Bangalore → Rishikesh
            </p>
            <div className="relative mt-6 flex gap-4 text-sm text-white/60">
              <span>✓ Verified booking</span>
              <span>✓ 5.0 rating</span>
            </div>
          </div>

          {/* Right — Promise */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
              <Heart className="h-4 w-4" /> The Bindass Promise
            </span>
            <h2 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
              We turn your dead weekend screen-time into real memories.
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              No group-chat chaos, no spreadsheet itineraries. Just show up Friday night and
              we&apos;ve already sorted your bus, your stay, and your people. Come back Monday
              recharged — not exhausted from planning.
            </p>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
