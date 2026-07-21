-- Allow vendors to update bookings for their listings (status transitions).
create policy "bookings_vendor_update" on public.bookings
  for update using (
    exists (
      select 1 from public.batch_slots bs
      join public.batch_dates bd on bd.id = bs.batch_date_id
      join public.listings l on l.id = bd.listing_id
      where bs.id = bookings.batch_slot_id and l.vendor_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.batch_slots bs
      join public.batch_dates bd on bd.id = bs.batch_date_id
      join public.listings l on l.id = bd.listing_id
      where bs.id = bookings.batch_slot_id and l.vendor_id = auth.uid()
    )
  );
