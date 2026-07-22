'use client';

import Link from 'next/link';
import { HOME_TABS } from '@/config/tabs';
import { ArrowRight } from 'lucide-react';

export function BrowseTabs() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto w-full max-w-[1500px] px-4 xl:max-w-[1400px]">
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
                    className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md"
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
  );
}
