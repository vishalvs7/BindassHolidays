'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import Link from 'next/link';

const CITIES = [
  { name: 'Manali', tagline: 'Snow-capped peaks & pine forests', gradient: 'from-emerald-600 to-teal-800', link: '/packages?cat=to:manali', icon: '🏔️' },
  { name: 'Goa', tagline: 'Sun, sand & endless nights', gradient: 'from-amber-500 to-orange-700', link: '/packages?cat=to:goa', icon: '🏖️' },
  { name: 'Rishikesh', tagline: 'Rivers, rapids & yoga', gradient: 'from-primary-600 to-fuchsia-700', link: '/packages?cat=to:rishikesh', icon: '🚣' },
  { name: 'Kerala', tagline: 'Backwaters & tea gardens', gradient: 'from-green-600 to-emerald-900', link: '/packages?cat=to:kerala', icon: '🌴' },
  { name: 'Jaipur', tagline: 'Forts, culture & bazaars', gradient: 'from-rose-600 to-pink-800', link: '/packages?cat=to:jaipur', icon: '🏰' },
  { name: 'Andaman', tagline: 'Crystal waters & coral', gradient: 'from-cyan-600 to-blue-800', link: '/packages?cat=to:andaman', icon: '🐠' },
];

export function CityCards() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="px-4 py-16">
      <div className="mx-auto w-full max-w-[1500px] px-4 xl:max-w-[1400px]">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Explore India by city</h2>
          <p className="mt-2 text-gray-500">Handpicked weekend destinations for every kind of traveler.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((city, i) => (
            <Link
              key={city.name}
              href={city.link}
              className={`group relative h-64 overflow-hidden rounded-3xl bg-gradient-to-br ${city.gradient} p-6 text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                inView ? 'animate-fade-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-white/10 blur-2xl transition-all duration-500 group-hover:scale-150" />
              <div className="absolute bottom-6 left-6 z-10">
                <span className="text-5xl">{city.icon}</span>
                <h3 className="mt-3 text-3xl font-extrabold">{city.name}</h3>
                <p className="mt-1 text-sm text-white/80">{city.tagline}</p>
              </div>
              <div className="absolute bottom-6 right-6 z-10 translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <span className="text-sm font-medium text-white/90">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
