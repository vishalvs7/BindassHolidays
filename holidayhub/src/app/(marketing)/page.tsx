'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HOME_TABS } from '@/config/tabs';
import {
  Sparkles,
  ShieldCheck,
  Wallet,
  Users,
  Clock,
  MapPin,
  ArrowRight,
  Star,
  Compass,
  Mountain,
  Plane,
  Heart,
  CalendarDays,
  Building,
} from 'lucide-react';

// ---------- Mock data (backend not wired yet) ----------
const destinations = [
  { name: 'Kerala', country: 'India', emoji: '🌴', desc: 'Backwaters & calm' },
  { name: 'Rishikesh', country: 'India', emoji: '🏞️', desc: 'Rivers & rafting' },
  { name: 'Goa', country: 'India', emoji: '🏖️', desc: 'Beaches & nights' },
  { name: 'Manali', country: 'India', emoji: '🏔️', desc: 'Snow & peaks' },
  { name: 'Andaman', country: 'India', emoji: '🐚', desc: 'Islands & dives' },
  { name: 'Jaipur', country: 'India', emoji: '🏰', desc: 'Forts & culture' },
];

const trending = [
  { title: 'Rishikesh Weekend Rafting', tag: 'Adrenaline', price: '₹4,999', rating: 4.8, emoji: '🚣' },
  { title: 'Munnar Tea Trail', tag: 'Wellness', price: '₹6,499', rating: 4.9, emoji: '🌿' },
  { title: 'Goa Beach Escape', tag: 'Crew', price: '₹5,299', rating: 4.7, emoji: '🏖️' },
  { title: 'Manali Snow Squad', tag: 'Solo', price: '₹7,199', rating: 4.8, emoji: '❄️' },
  { title: 'Andaman Dive Trip', tag: 'Adrenaline', price: '₹12,999', rating: 4.9, emoji: '🐠' },
];

const activities = [
  { title: 'Paragliding in Bir', emoji: '🪂', level: 'Thrill' },
  { title: 'Surfing in Mulki', emoji: '🏄', level: 'Chill' },
  { title: 'Pottery in Auroville', emoji: '🏺', level: 'Calm' },
  { title: 'Stargazing in Spiti', emoji: '🔭', level: 'Calm' },
  { title: 'Trek to Kedarkantha', emoji: '🥾', level: 'Thrill' },
];

const whyChoose = [
  { icon: Clock, title: 'Zero Leaves Needed', desc: 'Fri night out, Mon morning back. Never miss a Monday standup.' },
  { icon: ShieldCheck, title: 'Verified Operators', desc: 'Every vendor background-checked. No sketchy surprises.' },
  { icon: Wallet, title: 'Transparent Pricing', desc: 'No hidden costs. What you see is what you pay.' },
  { icon: Users, title: 'Safe Solo Batches', desc: 'Curated groups for solo travelers who want good company.' },
  { icon: Sparkles, title: 'Done-for-You Logistics', desc: 'Buses, stays, activities — we plan, you just show up.' },
  { icon: MapPin, title: 'India, Weekend-First', desc: 'Trips engineered around the Indian working week.' },
];

function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ===== 500px Hero Banner ===== */}
      <section className="relative flex h-[500px] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-700 via-purple-700 to-fuchsia-700">
        {/* playful moving blobs */}
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-amber-200/20 blur-2xl animate-pulse [animation-delay:2s]" />

        <div className="relative z-10 px-4 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
            <Sparkles className="h-4 w-4" /> Weekend #1 escape plan, sorted
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-7xl">
            Leave Friday.
            <br /> Return Monday.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-100">
            Stress-free, fully-managed weekend breaks for India&apos;s working professionals.
            Zero corporate leaves. Zero planning.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/packages">
              <Button size="lg" className="bg-white px-8 py-6 text-lg text-primary-700 hover:bg-gray-100">
                <Compass className="mr-2 h-5 w-5" /> Explore Weekend Trips
              </Button>
            </Link>
            {/* Disabled — custom itinerary coming later */}
            <Button
              size="lg"
              variant="outline"
              disabled
              className="cursor-not-allowed border-white/60 px-8 py-6 text-lg text-white/70 hover:bg-transparent"
              title="Coming soon"
            >
              <CalendarDays className="mr-2 h-5 w-5" /> Custom Itinerary (soon)
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Why Choose Us (icon grid, no bg/border) ===== */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why travelers choose us</h2>
            <p className="mt-3 text-gray-500">Built around one simple promise: your weekend, handled.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {whyChoose.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 max-w-[15rem] text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Destinations carousel ===== */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Destinations by region</h2>
              <p className="mt-2 text-gray-500">Swipe through weekend favorites across India.</p>
            </div>
            <Compass className="hidden h-10 w-10 text-primary-300 md:block" />
          </div>
          <Carousel>
            {destinations.map((d) => (
              <div key={d.name} className="min-w-[260px] snap-start">
                <div className="group relative h-64 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-fuchsia-600 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
                  <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="text-5xl">{d.emoji}</div>
                  <div className="absolute bottom-6 left-6">
                    <div className="text-xs uppercase tracking-wide text-white/70">{d.country}</div>
                    <div className="text-2xl font-bold">{d.name}</div>
                    <div className="text-sm text-white/80">{d.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ===== Dynamic browse tabs (From / Vibes) ===== */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Find your weekend, your way</h2>
            <p className="mt-2 text-gray-500">Pick where you&apos;re leaving from and the vibe you want.</p>
          </div>
          <div className="space-y-6">
            {HOME_TABS.map((row) => (
              <div key={row.key}>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">{row.title}</p>
                <div className="flex flex-wrap gap-2.5">
                  {row.tabs.map((t) => (
                    <Link
                      key={t.value}
                      href={`/packages?cat=${row.key}:${t.value}`}
                      className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700"
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/packages"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Browse all trips <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Trending packages ===== */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Trending this weekend</h2>
              <p className="mt-2 text-gray-500">The batches filling up fastest right now.</p>
            </div>
            <Link href="/packages" className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Carousel>
            {trending.map((p) => (
              <div key={p.title} className="min-w-[280px] snap-start">
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl">
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary-100 to-fuchsia-100 text-6xl">
                    {p.emoji}
                  </div>
                  <div className="p-5">
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">{p.tag}</span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">{p.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">{p.price}</span>
                      <span className="flex items-center gap-1 text-sm text-amber-500">
                        <Star className="h-4 w-4 fill-current" /> {p.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ===== Two-column: image + text ===== */}
      <section className="bg-primary-700 px-4 py-20 text-white">
        <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="relative order-2 overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-500 to-amber-400 p-10 lg:order-1">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl animate-pulse" />
            <div className="absolute bottom-6 right-6 text-7xl">🌄</div>
            <blockquote className="relative text-2xl font-semibold leading-relaxed">
              “The only planning I did was packing my bag. Everything else? Bindass handled it.”
            </blockquote>
            <p className="relative mt-4 text-primary-100">— A solo traveler, Bangalore → Rishikesh</p>
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              <Heart className="h-4 w-4" /> The Bindass Promise
            </span>
            <h2 className="mt-5 text-3xl font-bold md:text-4xl">We turn your dead weekend screen-time into real memories.</h2>
            <p className="mt-4 text-primary-100">
              No group-chat chaos, no spreadsheet itineraries. Just show up Friday night and
              we&apos;ve already sorted your bus, your stay, and your people. Come back Monday
              recharged — not exhausted from planning.
            </p>
            <ul className="mt-6 space-y-3">
              {['Curated batches by vibe', 'Real-time slot counters', 'WhatsApp vouchers & support'].map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Activities carousel ===== */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Activities to chase</h2>
              <p className="mt-2 text-gray-500">From calm to chaotic — pick your kind of weekend.</p>
            </div>
            <Mountain className="hidden h-10 w-10 text-primary-300 md:block" />
          </div>
          <Carousel>
            {activities.map((a) => (
              <div key={a.title} className="min-w-[240px] snap-start">
                <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-amber-100 to-primary-100 text-center shadow-sm transition-transform hover:-translate-y-1">
                  <div className="text-6xl">{a.emoji}</div>
                  <div className="text-lg font-semibold text-gray-900">{a.title}</div>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary-700">{a.level}</span>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ===== Become a Vendor CTA (end of page) ===== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-900 to-purple-900 px-4 py-20 text-white">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl animate-pulse" />
        <div className="container mx-auto max-w-4xl text-center">
          <Plane className="mx-auto h-12 w-12 text-primary-300" />
          <h2 className="mt-6 text-3xl font-bold md:text-5xl">Run trips? Join as a vendor.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            List your weekend batches to thousands of high-intent travelers. Minimal backend,
            zero upfront risk — we fill your unsold slots.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register/vendor">
              <Button size="lg" className="bg-white px-10 py-6 text-lg text-primary-700 hover:bg-gray-100">
                <Building className="mr-2 h-5 w-5" /> Become a Vendor
              </Button>
            </Link>
            <Link href="/vendor-benefits">
              <Button size="lg" variant="outline" className="border-white px-10 py-6 text-lg text-white hover:bg-white/10">
                See Vendor Benefits
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
