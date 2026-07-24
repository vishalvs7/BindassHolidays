-- ============================================================
-- Add notification_preferences to profiles table
-- Stores customer notification toggle preferences as JSONB
-- ============================================================

alter table public.profiles
  add column if not exists notification_preferences jsonb default '{
    "email": true,
    "sms": false,
    "promotions": true,
    "bookingUpdates": true,
    "priceAlerts": false
  }'::jsonb;
