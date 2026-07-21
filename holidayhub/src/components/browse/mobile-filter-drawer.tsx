"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export function MobileFilterDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
