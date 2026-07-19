-- ============================================================
-- HolidayHub — Booking + Reviews schema
-- Guest-friendly: bookings.user_id is nullable so a customer
-- can check out without logging in (registered on submit if they
-- supply a password, otherwise treated as a guest lead).
-- ============================================================

create type public.booking_status as enum (
  'pending_payment',
  'confirmed',
  'cancelled',
  'completed'
);

create type public.gender as enum ('male', 'female', 'other');

-- A booking is for EITHER a package OR an activity (uniform shape).
create table public.bookings (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users (id) on delete set null,
  package_id        uuid references public.packages (id) on delete set null,
  activity_id       uuid references public.activities (id) on delete set null,
  batch_slot_id     uuid not null references public.batch_slots (id) on delete restrict,
  status            public.booking_status not null default 'pending_payment',
  base_amount       numeric(10,2) not null check (base_amount >= 0),
  gst_amount       numeric(10,2) not null default 0 check (gst_amount >= 0),
  total_amount      numeric(10,2) not null check (total_amount >= 0),
  gst_percent      numeric(5,2) not null default 5,
  qty              int not null default 1 check (qty > 0),
  contact_name      text not null,
  contact_email     text not null,
  contact_phone     text not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (
    (package_id is not null and activity_id is null)
    or (package_id is null and activity_id is not null)
  )
);

-- One row per traveling person (used for manifest + same-gender rooming).
create table public.booking_travelers (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references public.bookings (id) on delete cascade,
  full_name   text not null,
  age         int check (age >= 0 and age <= 120),
  phone       text,
  gender      public.gender,
  created_at  timestamptz not null default now()
);

-- Reviews foundation (customers + guests can leave a rating per listing).
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null,                 -- packages.id or activities.id
  listing_type text not null check (listing_type in ('package', 'activity')),
  user_id     uuid references auth.users (id) on delete set null,
  author_name text,                          -- used for guest reviews
  rating      int not null check (rating >= 1 and rating <= 5),
  comment     text,
  created_at  timestamptz not null default now()
);

create trigger bookings_set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

-- RLS
alter table public.bookings enable row level security;
alter table public.booking_travelers enable row level security;
alter table public.reviews enable row level security;

-- Bookings: a customer sees their own; vendor sees bookings for their listings;
-- anonymous inserts are allowed (guest checkout) but restricted by trigger/route.
create policy "bookings_customer_read" on public.bookings
  for select using (auth.uid() = user_id);

create policy "bookings_vendor_read" on public.bookings
  for select using (
    exists (
      select 1 from public.batch_slots bs
      join public.batch_dates bd on bd.id = bs.batch_date_id
      left join public.packages p on p.id = bd.package_id
      left join public.activities a on a.id = bd.activity_id
      where bs.id = bookings.batch_slot_id
      and (p.vendor_id = auth.uid() or a.vendor_id = auth.uid())
    )
  );

create policy "bookings_insert" on public.bookings
  for insert with check (true);  -- route enforces ownership/guest rules

create policy "bookings_admin_all" on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- Travelers: readable by the booking owner / vendor / admin.
create policy "travelers_customer_read" on public.booking_travelers
  for select using (
    exists (select 1 from public.bookings b where b.id = booking_travelers.booking_id and b.user_id = auth.uid())
  );

create policy "travelers_vendor_read" on public.booking_travelers
  for select using (
    exists (
      select 1 from public.bookings b
      join public.batch_slots bs on bs.id = b.batch_slot_id
      join public.batch_dates bd on bd.id = bs.batch_date_id
      left join public.packages p on p.id = bd.package_id
      left join public.activities a on a.id = bd.activity_id
      where b.id = booking_travelers.booking_id
      and (p.vendor_id = auth.uid() or a.vendor_id = auth.uid())
    )
  );

create policy "travelers_insert" on public.booking_travelers
  for insert with check (true);

create policy "travelers_admin_all" on public.booking_travelers
  for all using (public.is_admin()) with check (public.is_admin());

-- Reviews: public read; insert by anyone (guest or user) — route validates listing.
create policy "reviews_read" on public.reviews
  for select using (true);

create policy "reviews_insert" on public.reviews
  for insert with check (true);

create policy "reviews_admin_all" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());
