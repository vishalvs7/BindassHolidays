"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    const params = new URLSearchParams(window.location.search);
    params.set("q", trimmed);
    router.push(`/packages?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 w-full">
      <div className="relative flex max-w-lg items-center">
        <div className="absolute left-0 z-10 flex h-full items-center rounded-l-full bg-purple-600 px-4">
          <Search className="h-5 w-5 text-white" />
        </div>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search destinations, activities, vibes…"
          className="w-full rounded-full border border-gray-300 bg-white py-3 pl-14 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
    </form>
  );
}
