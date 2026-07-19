import Link from 'next/link';

const columns = [
  {
    title: 'Travelers',
    links: [
      { label: 'Browse Packages', href: '/packages' },
      { label: 'Explore Activities', href: '/activities' },
      { label: 'Custom Package', href: '/custom' },
      { label: 'Corporate Travel', href: '/corporate' },
    ],
  },
  {
    title: 'Vendors',
    links: [
      { label: 'Become a Vendor', href: '/register/vendor' },
      { label: 'Vendor Benefits', href: '/vendor-benefits' },
      { label: 'Vendor Login', href: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white text-lg font-extrabold">
                BH
              </span>
              Bindass Holiday
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              Weekend escapes for India&apos;s working professionals. Leave Friday night,
              return Monday morning — zero leaves, zero planning.
            </p>
            <div className="mt-6 flex gap-3">
              {['IG', 'YT', 'X', 'IN'].map((s) => (
                <span key={s} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-xs font-semibold text-gray-400 hover:border-primary-500 hover:text-primary-400 transition">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">{col.title}</h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 transition hover:text-primary-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Bindass Holiday. All rights reserved.</p>
          <p>Made in India 🇮🇳 for weekend wanderers.</p>
        </div>
      </div>
    </footer>
  );
}
