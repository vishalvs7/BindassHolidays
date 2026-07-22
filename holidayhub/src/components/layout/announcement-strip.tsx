'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Tag, Rocket } from 'lucide-react';

const announcements = [
  { icon: Sparkles, text: 'New Year Sale! Use code NY2026 for 20% off on all packages' },
  { icon: Tag, text: 'Weekend Flash Sale — Extra ₹1,000 off on solo trips. Limited slots!' },
  { icon: Rocket, text: 'Refer a friend and both get ₹500 off your next booking' },
];

export function AnnouncementStrip() {
  const [dismissed, setDismissed] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('announcement-dismissed');
    if (stored === 'true') setDismissed(true);

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const a = announcements[current];
  const Icon = a.icon;

  return (
    <div className="relative bg-gradient-to-r from-primary-600 via-fuchsia-600 to-primary-700 text-white text-sm">
      <div className="mx-auto flex h-10 max-w-[1500px] items-center justify-center gap-2 px-4">
        <Icon size={16} className="shrink-0" />
        <span className="truncate text-xs font-medium md:text-sm">{a.text}</span>
      </div>
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem('announcement-dismissed', 'true');
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
