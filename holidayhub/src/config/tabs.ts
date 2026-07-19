// Central tab taxonomy for the home page + dynamic /packages filtering.
// "field" maps to the Supabase column the filter applies to:
//   tag          -> packages.tags (array contains)
//   vertical     -> packages.vertical (enum)
//   destination  -> packages.destination (text, case-insensitive contains)
//   sourceHub    -> packages.source_hub (text, case-insensitive contains)
// "kind" groups the two home-page tab rows: "from" (origin hubs) and "to" (vibes/places).

export type FilterField = "tag" | "vertical" | "destination" | "sourceHub";

export interface TabDef {
  label: string;
  value: string;
  field: FilterField;
}

export interface TabRow {
  key: "from" | "to";
  title: string;
  tabs: TabDef[];
}

export const HOME_TABS: TabRow[] = [
  {
    key: "from",
    title: "Leaving from",
    tabs: [
      { label: "Bangalore", value: "bangalore", field: "sourceHub" },
      { label: "Mumbai", value: "mumbai", field: "sourceHub" },
      { label: "Delhi", value: "delhi", field: "sourceHub" },
      { label: "Pune", value: "pune", field: "sourceHub" },
      { label: "Hyderabad", value: "hyderabad", field: "sourceHub" },
    ],
  },
  {
    key: "to",
    title: "Weekend vibes & places",
    tabs: [
      { label: "Uttarakhand", value: "uttarakhand", field: "tag" },
      { label: "Goa", value: "goa", field: "destination" },
      { label: "Kerala", value: "kerala", field: "tag" },
      { label: "Rajasthan", value: "rajasthan", field: "tag" },
      { label: "Wellness", value: "wellness", field: "vertical" },
      { label: "Adrenaline", value: "adrenaline", field: "vertical" },
      { label: "Solo", value: "solo_explorer", field: "vertical" },
      { label: "Crew", value: "crew", field: "vertical" },
    ],
  },
];

// Resolve a single tab (used by /packages?cat=<row>:<value>) into a filter.
export function resolveTab(
  cat?: string
): { field: FilterField; value: string; label: string } | null {
  if (!cat) return null;
  const [rowKey, value] = cat.split(":");
  const row = HOME_TABS.find((r) => r.key === rowKey);
  const tab = row?.tabs.find((t) => t.value === value);
  if (!tab) return null;
  return { field: tab.field, value: tab.value, label: tab.label };
}
