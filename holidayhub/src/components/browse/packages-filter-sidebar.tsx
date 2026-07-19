"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface FilterRow {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

const FILTER_GROUPS: FilterRow[] = [
  {
    key: "sourceHub",
    label: "Leaving from",
    options: [
      { label: "Bangalore", value: "bangalore" },
      { label: "Mumbai", value: "mumbai" },
      { label: "Delhi", value: "delhi" },
      { label: "Pune", value: "pune" },
      { label: "Hyderabad", value: "hyderabad" },
    ],
  },
  {
    key: "vertical",
    label: "Vibe",
    options: [
      { label: "Wellness", value: "wellness" },
      { label: "Adrenaline", value: "adrenaline" },
      { label: "Solo Explorer", value: "solo_explorer" },
      { label: "Crew", value: "crew" },
    ],
  },
  {
    key: "duration",
    label: "Duration",
    options: [
      { label: "Weekend (≤2 days)", value: "2" },
      { label: "Long weekend (3-4 days)", value: "4" },
      { label: "Week+ (5+ days)", value: "5" },
    ],
  },
];

export function PackagesFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState({
    min: searchParams.get("minPrice") ?? "",
    max: searchParams.get("maxPrice") ?? "",
  });

  // Keep local price inputs in sync if URL changes externally
  useEffect(() => {
    setPrice({
      min: searchParams.get("minPrice") ?? "",
      max: searchParams.get("maxPrice") ?? "",
    });
  }, [searchParams]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/packages?${params.toString()}`);
  }

  // For duration we map to minDuration
  function setDuration(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("minDuration", value);
    else params.delete("minDuration");
    router.push(`/packages?${params.toString()}`);
  }

  function applyPrice() {
    const params = new URLSearchParams(searchParams.toString());
    if (price.min) params.set("minPrice", price.min);
    else params.delete("minPrice");
    if (price.max) params.set("maxPrice", price.max);
    else params.delete("maxPrice");
    router.push(`/packages?${params.toString()}`);
  }

  function clearAll() {
    router.push("/packages");
  }

  const activeCount =
    ["sourceHub", "vertical", "minDuration", "minPrice", "maxPrice"].filter((k) =>
      searchParams.get(k)
    ).length;

  return (
    <aside className="w-full lg:w-64 lg:flex-shrink-0">
      <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Filters</h3>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs font-medium text-primary-600 hover:underline">
              Clear ({activeCount})
            </button>
          )}
        </div>

        {FILTER_GROUPS.map((group) => {
          const current =
            group.key === "duration"
              ? searchParams.get("minDuration") ?? ""
              : searchParams.get(group.key) ?? "";
          return (
            <div key={group.key} className="mb-5 border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
              <p className="mb-2 text-sm font-medium text-gray-700">{group.label}</p>
              <div className="space-y-1.5">
                {group.options.map((opt) => {
                  const checked = current === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="radio"
                        name={group.key}
                        checked={checked}
                        onChange={() =>
                          group.key === "duration"
                            ? setDuration(opt.value)
                            : setParam(group.key, opt.value)
                        }
                        className="h-4 w-4 accent-primary-600"
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Price range */}
        <div className="mb-2 border-t border-gray-100 pt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Price (₹)</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={price.min}
              onChange={(e) => setPrice((p) => ({ ...p, min: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={price.max}
              onChange={(e) => setPrice((p) => ({ ...p, max: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={applyPrice}
            className="mt-2 w-full rounded-lg bg-primary-600 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Apply
          </button>
        </div>
      </div>
    </aside>
  );
}
