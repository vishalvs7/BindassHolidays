-- ============================================================
-- HolidayHub — Unify packages + activities into ONE `listings` table.
-- Keeps the same uniform shape; `type` ('package' | 'activity')
-- replaces the old two-table split. Vendors list both from one
-- form; the website filters by `type` for /packages and /activities.
-- DB has no real rows yet, so we drop the old tables safely.
-- ============================================================

create type public.listing_type as enum ('package', 'activity');

create table public.listings (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid not null references public.vendors (id) on delete cascade,
  type            public.listing_type not null,
  title           text not null,
  slug            text not null,
  summary         text,
  description     text,
  vertical        public.vertical not null default 'crew',
  source_hub      text not null,
  destination     text not null,
  cover_image     text,
  gallery         text[] default '{}',
  price           numeric(10,2) not null check (price >= 0),
  currency        text not null default 'INR',
  duration_hours  int,
  duration_days   int default 2,
  meeting_point   text,
  meeting_time    text,
  inclusions      text[] default '{}',
  exclusions      text[] default '{}',
  things_to_carry text[] default '{}',
  itinerary       jsonb default '[]',
  tags            text[] default '{}',
  faqs            jsonb default '[]',
  cancellation_policy text,
  min_age         int,
  max_age         int,
  difficulty      text check (difficulty in ('easy','moderate','hard')),
  rating          numeric(2,1) default 0,
  total_reviews   int default 0,
  status          public.listing_status not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (vendor_id, slug)
);

create trigger listings_set_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

alter table public.listings enable row level security;

create policy "listings_read_published" on public.listings
  for select using (status = 'published');

create policy "listings_vendor_all" on public.listings
  for all using (auth.uid() = vendor_id) with check (auth.uid() = vendor_id);

create policy "listings_admin_all" on public.listings
  for all using (public.is_admin()) with check (public.is_admin());

-- Drop dependent RLS policies BEFORE altering columns.
drop policy if exists batch_dates_vendor_all on public.batch_dates;
drop policy if exists batch_dates_read_open on public.batch_dates;
drop policy if exists batch_slots_vendor_all on public.batch_slots;
drop policy if exists bookings_vendor_read on public.bookings;
drop policy if exists travelers_vendor_read on public.booking_travelers;
drop policy if exists packages_vendor_all on public.packages;
drop policy if exists activities_vendor_all on public.activities;

-- Re-point batch_dates: replace package_id/activity_id with listing_id + listing_type.
alter table public.batch_dates
  drop constraint if exists batch_dates_package_id_fkey,
  drop constraint if exists batch_dates_activity_id_fkey,
  drop column if exists package_id,
  drop column if exists activity_id,
  add column listing_id uuid references public.listings (id) on delete cascade,
  add column listing_type public.listing_type;

-- Re-point bookings: same idea.
alter table public.bookings
  drop constraint if exists bookings_package_id_fkey,
  drop constraint if exists bookings_activity_id_fkey,
  drop column if exists package_id,
  drop column if exists activity_id,
  add column listing_id uuid references public.listings (id) on delete set null,
  add column listing_type public.listing_type;

-- Recreate batch_dates policies (read open + vendor all) with listing_id.
create policy "batch_dates_read_open" on public.batch_dates
  for select using (status = 'open');
create policy "batch_dates_vendor_all" on public.batch_dates
  for all using (
    exists (select 1 from public.listings l where l.id = batch_dates.listing_id and l.vendor_id = auth.uid())
  ) with check (
    exists (select 1 from public.listings l where l.id = batch_dates.listing_id and l.vendor_id = auth.uid())
  );

-- Recreate bookings vendor read with listing_id.
create policy "bookings_vendor_read" on public.bookings
  for select using (
    exists (
      select 1 from public.batch_slots bs
      join public.batch_dates bd on bd.id = bs.batch_date_id
      join public.listings l on l.id = bd.listing_id
      where bs.id = bookings.batch_slot_id and l.vendor_id = auth.uid()
    )
  );

-- Recreate travelers vendor read with listing_id.
create policy "travelers_vendor_read" on public.booking_travelers
  for select using (
    exists (
      select 1 from public.bookings b
      join public.batch_slots bs on bs.id = b.batch_slot_id
      join public.batch_dates bd on bd.id = bs.batch_date_id
      join public.listings l on l.id = bd.listing_id
      where b.id = booking_travelers.booking_id and l.vendor_id = auth.uid()
    )
  );

-- Drop the now-redundant legacy tables.
drop table if exists public.packages;
drop table if exists public.activities;
