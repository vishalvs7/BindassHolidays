-- ============================================================
-- HolidayHub — Catalog Schema (packages & activities)
-- Same shape for both; filtered by `type` / `vertical` / `tags`.
-- Includes the weekend-batch scheduling + slot-hold (moat).
-- ============================================================

-- Vertical / vibe taxonomy
create type public.vertical as enum ('solo_explorer', 'adrenaline', 'wellness', 'crew');
create type public.listing_status as enum ('draft', 'published', 'archived');
create type public.batch_status as enum ('open', 'closed', 'cancelled');

-- Shared listing shape used by both packages and activities.
create table public.packages (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid not null references public.vendors (id) on delete cascade,
  title           text not null,
  slug            text not null,
  summary         text,
  description     text,
  vertical        public.vertical not null default 'crew',
  source_hub      text not null,                 -- e.g. "Bangalore"
  destination     text not null,                 -- e.g. "Rishikesh"
  cover_image     text,
  gallery         text[] default '{}',
  price           numeric(10,2) not null check (price >= 0),
  currency        text not null default 'INR',
  duration_hours  int,
  duration_days   int default 2,                 -- weekend = 2 nights / ~3 days
  meeting_point   text,
  meeting_time    text,
  inclusions      text[] default '{}',
  exclusions      text[] default '{}',
  itinerary       jsonb default '[]',            -- [{day, title, time?, description}]
  tags            text[] default '{}',           -- free-form filters
  faqs            jsonb default '[]',            -- [{question, answer}]
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

create table public.activities (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid not null references public.vendors (id) on delete cascade,
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
  duration_days   int default 1,
  meeting_point   text,
  meeting_time    text,
  inclusions      text[] default '{}',
  exclusions      text[] default '{}',
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

-- Weekend departure instances (the Fri-night -> Mon-morning batches)
create table public.batch_dates (
  id           uuid primary key default gen_random_uuid(),
  package_id   uuid references public.packages (id) on delete cascade,
  activity_id  uuid references public.activities (id) on delete cascade,
  depart_at    timestamptz not null,             -- Friday ~8 PM
  return_at    timestamptz not null,             -- Monday ~6 AM
  status       public.batch_status not null default 'open',
  created_at   timestamptz not null default now(),
  check (
    (package_id is not null and activity_id is null)
    or (package_id is null and activity_id is not null)
  )
);

-- Slot inventory per batch date — holds the 10-minute reservation (moat)
create table public.batch_slots (
  id              uuid primary key default gen_random_uuid(),
  batch_date_id   uuid not null references public.batch_dates (id) on delete cascade,
  total_slots     int not null check (total_slots >= 0),
  booked_slots    int not null default 0 check (booked_slots >= 0),
  reserved_at     timestamptz,                   -- set on checkout start; expires in 10 min
  price_override  numeric(10,2) check (price_override >= 0),
  created_at      timestamptz not null default now()
);

-- updated_at triggers
create trigger packages_set_updated_at before update on public.packages
  for each row execute function public.set_updated_at();
create trigger activities_set_updated_at before update on public.activities
  for each row execute function public.set_updated_at();

-- RLS: vendors manage their own listings; everyone can read published.
alter table public.packages enable row level security;
alter table public.activities enable row level security;
alter table public.batch_dates enable row level security;
alter table public.batch_slots enable row level security;

-- Public read of published listings
create policy "packages_read_published" on public.packages
  for select using (status = 'published');
create policy "activities_read_published" on public.activities
  for select using (status = 'published');

-- Vendor full control of own listings
create policy "packages_vendor_all" on public.packages
  for all using (auth.uid() = vendor_id) with check (auth.uid() = vendor_id);
create policy "activities_vendor_all" on public.activities
  for all using (auth.uid() = vendor_id) with check (auth.uid() = vendor_id);

-- Batch dates readable publicly when open; vendor manages own
create policy "batch_dates_read_open" on public.batch_dates
  for select using (status = 'open');
create policy "batch_dates_vendor_all" on public.batch_dates
  for all using (
    exists (select 1 from public.packages p where p.id = batch_dates.package_id and p.vendor_id = auth.uid())
    or exists (select 1 from public.activities a where a.id = batch_dates.activity_id and a.vendor_id = auth.uid())
  ) with check (
    exists (select 1 from public.packages p where p.id = batch_dates.package_id and p.vendor_id = auth.uid())
    or exists (select 1 from public.activities a where a.id = batch_dates.activity_id and a.vendor_id = auth.uid())
  );

-- Slot read (public, to show availability) + vendor manage
create policy "batch_slots_read" on public.batch_slots
  for select using (true);
create policy "batch_slots_vendor_all" on public.batch_slots
  for all using (
    exists (
      select 1 from public.batch_dates bd
      left join public.packages p on p.id = bd.package_id
      left join public.activities a on a.id = bd.activity_id
      where bd.id = batch_slots.batch_date_id
      and (p.vendor_id = auth.uid() or a.vendor_id = auth.uid())
    )
  ) with check (
    exists (
      select 1 from public.batch_dates bd
      left join public.packages p on p.id = bd.package_id
      left join public.activities a on a.id = bd.activity_id
      where bd.id = batch_slots.batch_date_id
      and (p.vendor_id = auth.uid() or a.vendor_id = auth.uid())
    )
  );

-- Admin override
create policy "packages_admin_all" on public.packages for all using (public.is_admin()) with check (public.is_admin());
create policy "activities_admin_all" on public.activities for all using (public.is_admin()) with check (public.is_admin());
create policy "batch_dates_admin_all" on public.batch_dates for all using (public.is_admin()) with check (public.is_admin());
create policy "batch_slots_admin_all" on public.batch_slots for all using (public.is_admin()) with check (public.is_admin());
