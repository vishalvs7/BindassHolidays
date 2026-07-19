-- ============================================================
-- HolidayHub — Auth Foundation Migration
-- Roles, profiles, vendors (2-step business registration)
-- ============================================================

-- 1. Role enum -------------------------------------------------
create type public.user_role as enum ('customer', 'vendor', 'admin');

-- 2. Profiles table -------------------------------------------
-- One row per auth user. Holds the role + minimal identity.
-- Extra PII (phone, address, preferences) is collected at booking.
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  name        text not null,
  role        public.user_role not null default 'customer',
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3. Vendors table --------------------------------------------
-- 2-step registration: step 1 (basic) creates a partial row,
-- step 2 (business) fills the rest. logo/banner are nullable
-- (can be completed later).
create table public.vendors (
  id                  uuid primary key references auth.users (id) on delete cascade,
  business_name       text,
  business_type       text check (business_type in ('tour-operator', 'activity-provider', 'both')),
  contact_person      text,
  phone               text,
  email               text,
  registration_number text,
  gst_number          text,
  business_address    text,
  logo_url            text,
  banner_url          text,
  description         text,
  status              text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 4. Auto-create profile on signup ---------------------------
-- Mirrors the new auth user into public.profiles with a default
-- role of 'customer'. Vendor/business data is filled afterwards.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Keep updated_at fresh -----------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger vendors_set_updated_at before update on public.vendors
  for each row execute function public.set_updated_at();

-- 6. Row Level Security --------------------------------------
alter table public.profiles enable row level security;
alter table public.vendors  enable row level security;

-- Profiles: a user can read/write only their own row.
create policy "profiles_select_self" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

-- Vendors: the owning user can read/update their own vendor row.
create policy "vendors_select_self" on public.vendors
  for select using (auth.uid() = id);

create policy "vendors_insert_self" on public.vendors
  for insert with check (auth.uid() = id);

create policy "vendors_update_self" on public.vendors
  for update using (auth.uid() = id);

-- Admins (role = 'admin') get full access — enforced via a helper.
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

create policy "vendors_admin_all" on public.vendors
  for all using (public.is_admin()) with check (public.is_admin());
