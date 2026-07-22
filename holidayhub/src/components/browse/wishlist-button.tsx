"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export function WishlistButton({ listingId }: { listingId: string }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    (async () => {
      try {
        const { data: { session } } = await (await import("@/lib/supabase/client")).getBrowserClient().auth.getSession();
        const res = await fetch("/api/wishlist", {
          headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
        });
        const data = await res.json();
        if (data.ok && data.wishlist) {
          setInWishlist(data.wishlist.some((w: any) =>
            typeof w.listing_id === "string"
              ? w.listing_id === listingId
              : w.listing_id?.id === listingId || w.listing?.id === listingId
          ));
        }
      } catch {}
    })();
  }, [isAuthenticated, user, listingId]);

  const toggle = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await (await import("@/lib/supabase/client")).getBrowserClient().auth.getSession();
      const res = await fetch("/api/wishlist", {
        method: inWishlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ listing_id: listingId }),
      });
      const data = await res.json();
      if (data.ok) setInWishlist(!inWishlist);
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      disabled={loading}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition"
    >
      <Heart
        size={18}
        className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}
      />
    </button>
  );
}
