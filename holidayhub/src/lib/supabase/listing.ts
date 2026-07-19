import { createClient } from "@supabase/supabase-js";

const ANON = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

export type ListingKind = "package" | "activity";

export interface ItineraryStop {
  time?: string;
  title?: string;
  day?: number | string;
  description?: string;
}

export interface ListingView {
  id: string;
  type: ListingKind;
  title: string;
  tagline: string | null;
  description: string | null;
  coverImage: string | null;
  gallery: string[];
  destination: string;
  sourceHub: string;
  vertical: string;
  price: number;
  durationDays: number | null;
  durationHours: number | null;
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[] | null;
  itinerary: ItineraryStop[];
  tags: string[];
  faqs: { question: string; answer: string }[];
  cancellationPolicy: string | null;
  meetingPoint: string | null;
  meetingTime: string | null;
  minAge: number | null;
  maxAge: number | null;
  rating: number;
  totalReviews: number;
  batches: {
    batchId: string;
    slotId: string;
    departAt: string;
    returnAt: string;
    totalSlots: number;
    bookedSlots: number;
    priceOverride: number | null;
  }[];
}

function mapRow(row: Record<string, any>): ListingView {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    tagline: row.summary ?? null,
    description: row.description ?? null,
    coverImage: row.cover_image ?? null,
    gallery: row.gallery ?? [],
    destination: row.destination,
    sourceHub: row.source_hub,
    vertical: row.vertical,
    price: Number(row.price),
    durationDays: row.duration_days ?? null,
    durationHours: row.duration_hours ?? null,
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    thingsToCarry: row.things_to_carry ?? null,
    itinerary: (row.itinerary ?? []) as ItineraryStop[],
    tags: row.tags ?? [],
    faqs: (row.faqs ?? []) as { question: string; answer: string }[],
    cancellationPolicy: row.cancellation_policy ?? null,
    meetingPoint: row.meeting_point ?? null,
    meetingTime: row.meeting_time ?? null,
    minAge: row.min_age ?? null,
    maxAge: row.max_age ?? null,
    rating: Number(row.rating ?? 0),
    totalReviews: Number(row.total_reviews ?? 0),
    batches: [],
  };
}

export async function getListing(id: string): Promise<ListingView | null> {
  const supabase = createClient(ANON.url, ANON.key);
  const { data: row, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();
  if (error || !row) return null;

  const listing = mapRow(row as Record<string, any>);

  const { data: batches } = await supabase
    .from("batch_dates")
    .select("id, depart_at, return_at, batch_slots(id, total_slots, booked_slots, price_override)")
    .eq("listing_id", id)
    .eq("status", "open")
    .order("depart_at", { ascending: true });

  listing.batches = (batches ?? []).flatMap((b: any) =>
    (b.batch_slots ?? []).map((s: any) => ({
      batchId: b.id,
      slotId: s.id,
      departAt: b.depart_at,
      returnAt: b.return_at,
      totalSlots: s.total_slots,
      bookedSlots: s.booked_slots,
      priceOverride: s.price_override ?? null,
    }))
  );

  return listing;
}

export interface ListingCardView {
  id: string;
  type: ListingKind;
  title: string;
  tagline: string | null;
  coverImage: string | null;
  destination: string;
  sourceHub: string;
  vertical: string;
  price: number;
  tags: string[];
  rating: number;
  totalReviews: number;
  durationDays: number | null;
}

export interface ListingFilters {
  type?: ListingKind;
  tag?: string;
  vertical?: string;
  destination?: string;
  sourceHub?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
}

export async function getListings(filters: ListingFilters = {}): Promise<ListingCardView[]> {
  const supabase = createClient(ANON.url, ANON.key);
  let query = supabase
    .from("listings")
    .select(
      "id, type, title, summary, cover_image, destination, source_hub, vertical, price, tags, rating, total_reviews, duration_days"
    )
    .eq("status", "published");

  if (filters.type) query = query.eq("type", filters.type);
  if (filters.tag) query = query.contains("tags", [filters.tag]);
  if (filters.vertical) query = query.eq("vertical", filters.vertical);
  if (filters.destination) query = query.ilike("destination", `%${filters.destination}%`);
  if (filters.sourceHub) query = query.ilike("source_hub", `%${filters.sourceHub}%`);
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
  if (filters.minDuration != null) query = query.gte("duration_days", filters.minDuration);

  const { data, error } = await query.order("created_at", { ascending: false }).limit(60);
  if (error || !data) return [];

  return (data as Record<string, any>[]).map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    tagline: row.summary ?? null,
    coverImage: row.cover_image ?? null,
    destination: row.destination,
    sourceHub: row.source_hub,
    vertical: row.vertical,
    price: Number(row.price),
    tags: row.tags ?? [],
    rating: Number(row.rating ?? 0),
    totalReviews: Number(row.total_reviews ?? 0),
    durationDays: row.duration_days ?? null,
  }));
}
