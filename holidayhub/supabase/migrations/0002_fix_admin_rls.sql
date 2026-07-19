-- ============================================================
-- Fix: admin RLS recursion (is_admin() querying profiles while
-- a policy on profiles calls is_admin()).
-- Solution: is_admin() runs SECURITY DEFINER and disables row
-- security locally so it can read profiles without re-entering
-- the policy chain.
-- ============================================================

create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Temporarily disable RLS for this function's own query to
  -- avoid infinite recursion through the profiles admin policy.
  set local row_security = off;
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;
