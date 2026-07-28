-- Atomic slot reservation to prevent overbooking via race conditions.
-- Returns the reserved slot row if successful, NULL if not enough availability.

create or replace function public.reserve_slot(
  p_slot_id uuid,
  p_qty int
)
returns table (
  id uuid,
  total_slots int,
  booked_slots int,
  price_override numeric,
  batch_date_id uuid
)
language plpgsql
security definer
as $$
begin
  return query
  update public.batch_slots
  set booked_slots = batch_slots.booked_slots + p_qty
  where batch_slots.id = p_slot_id
    and (batch_slots.total_slots - batch_slots.booked_slots) >= p_qty
  returning
    batch_slots.id,
    batch_slots.total_slots,
    batch_slots.booked_slots,
    batch_slots.price_override,
    batch_slots.batch_date_id;
end;
$$;
