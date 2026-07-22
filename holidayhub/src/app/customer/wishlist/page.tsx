'use client';

import { useEffect, useState } from 'react';
import { Heart, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getBrowserClient } from '@/lib/supabase/client';

interface WishlistItem {
  listing_id: string;
  created_at: string;
  listing: {
    id: string;
    title: string;
    type: string;
    cover_image: string | null;
    price: number;
    rating: number;
    total_reviews: number;
    duration_days: number | null;
    destination: string;
    slug: string;
  } | null;
}

export default function CustomerWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch('/api/wishlist', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (data.ok) setItems(data.wishlist ?? []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const removeItem = async (listingId: string) => {
    const supabase = getBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ listing_id: listingId }),
    });
    setItems(prev => prev.filter(i => i.listing_id !== listingId));
  };

  useEffect(() => { fetchWishlist(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading wishlist…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">Save packages and activities you love</p>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" size={24} />
            <span className="text-2xl font-bold text-gray-900">{items.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const l = item.listing;
          if (!l) return null;
          return (
            <div key={item.listing_id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/listings/${l.id}`}>
                <div className="relative h-40 bg-gradient-to-br from-primary-100 to-fuchsia-100">
                  {l.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.cover_image} alt={l.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      {l.type === 'activity' ? '🎯' : '🏞️'}
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    l.type === 'package' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {l.type === 'package' ? 'Package' : 'Activity'}
                  </span>
                  <button onClick={() => removeItem(l.id)} className="text-red-500 hover:text-red-600">
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
                <Link href={`/listings/${l.id}`}>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900">{l.title}</h3>
                  <p className="text-sm text-gray-500">{l.destination}</p>
                </Link>
                <div className="mt-3 flex items-center gap-1 text-sm text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium text-gray-900">{l.rating > 0 ? l.rating : '--'}</span>
                  <span className="text-gray-400">({l.total_reviews})</span>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-primary-600">₹{l.price.toLocaleString('en-IN')}</span>
                  {l.duration_days ? <span className="text-xs text-gray-400"> / {l.duration_days}d</span> : null}
                </div>
                <Link
                  href={`/checkout?type=${l.type}&id=${l.id}`}
                  className="mt-4 block w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-center text-sm"
                >
                  Book Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-block p-8 bg-red-50 rounded-full mb-6">
            <Heart size={64} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Save your favorite travel packages and activities here. They'll be waiting when you're ready to book!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/packages" className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
              Explore Packages
            </Link>
            <Link href="/activities" className="px-8 py-3 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium">
              Browse Activities
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
