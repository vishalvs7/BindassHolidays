-- ============================================================
-- Add preferences to profiles table
-- Stores customer UI preferences (currency, language, theme) as JSONB
-- ============================================================

alter table public.profiles
  add column if not exists preferences jsonb default '{
    "currency": "INR",
    "language": "en",
    "theme": "system"
  }'::jsonb;
