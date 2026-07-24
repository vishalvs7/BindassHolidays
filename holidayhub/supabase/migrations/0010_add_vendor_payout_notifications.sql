-- ============================================================
-- Add payout & notification columns to vendors table
-- bank_account, upi_id for payment tab
-- notification_preferences for notifications tab
-- ============================================================

alter table public.vendors
  add column if not exists bank_account text,
  add column if not exists upi_id text,
  add column if not exists notification_preferences jsonb default '{
    "email": true,
    "sms": false,
    "bookingAlerts": true,
    "newBookings": true,
    "payoutAlerts": true
  }'::jsonb;
