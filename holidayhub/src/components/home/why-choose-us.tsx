'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import { Clock, ShieldCheck, Wallet, Users, Sparkles, MapPin } from 'lucide-react';

const FEATURES = [
  { icon: Clock, title: 'Zero Leaves Needed', desc: 'Fri night out, Mon morning back. Never miss a Monday standup.' },
  { icon: ShieldCheck, title: 'Verified Operators', desc: 'Every vendor background-checked. No sketchy surprises.' },
  { icon: Wallet, title: 'Transparent Pricing', desc: 'No hidden costs. What you see is what you pay.' },
  { icon: Users, title: 'Safe Solo Batches', desc: 'Curated groups for solo travelers who want good company.' },
  { icon: Sparkles, title: 'Done-for-You Logistics', desc: 'Buses, stays, activities — we plan, you just show up.' },
  { icon: MapPin, title: 'India, Weekend-First', desc: 'Trips engineered around the Indian working week.' },
];

export function WhyChooseUs() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="px-4 py-16">
      <div className="mx-auto w-full max-w-[1500px] px-4 xl:max-w-[1400px]">
        <div className={`mb-12 text-center transition-all duration-700 ${inView ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why travelers choose us</h2>
          <p className="mt-3 text-gray-500">Built around one simple promise: your weekend, handled.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {FEATURES.map((item, i) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center transition-all duration-500 ${
                inView ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 lg:h-10 lg:w-10">
                <item.icon className="h-6 w-6 lg:h-5 lg:w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 lg:text-xs">{item.title}</h3>
              <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-gray-500 lg:max-w-[11rem] lg:text-[10px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
