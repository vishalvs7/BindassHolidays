-- Ensure batch_slots vendor manage policy exists (re-pointed to listings).
drop policy if exists batch_slots_vendor_all on public.batch_slots;

create policy "batch_slots_vendor_all" on public.batch_slots
  for all using (
    exists (
      select 1 from public.batch_dates bd
      join public.listings l on l.id = bd.listing_id
      where bd.id = batch_slots.batch_date_id and l.vendor_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.batch_dates bd
      join public.listings l on l.id = bd.listing_id
      where bd.id = batch_slots.batch_date_id and l.vendor_id = auth.uid()
    )
  );

-- Recreate packages/activities vendor policies under the listings name is unnecessary;
-- but ensure listings has vendor + admin coverage (already created in 0005).
