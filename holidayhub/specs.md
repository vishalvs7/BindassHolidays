# HolidayHub — Product & Architecture Specs

> **Living document.** This spec is the structural anchor for the build. It will be updated as the project evolves, but should always reflect the current agreed blueprint.

## 🏛️ Foundational Core

### The Mission
To solve the mid-week crisis of the Indian working professional by turning dead weekend screen time into stress-free, fully-managed offline breaks—requiring **zero corporate leaves** and **zero logistical planning**.

### The Vision
To become India's primary trust broker and data aggregator for short-term experiential travel, connecting high-intent urban spenders with specialized regional tour operators through high-touch, automated software.

## 🚀 The Product Architecture

An **Experiential Weekend Marketplace for Millennials, Gen-Z, and Solo Professionals**, built on a highly optimized, single-developer tech stack:

- **Next.js** (App Router) — frontend + API routes
- **Tailwind CSS + Shadcn UI** — premium, consistent UI
- **Supabase** — Auth, Postgres database, storage, edge functions
- **Razorpay** — UPI-first payment capture
- **Zustand** — client state
- **React Hook Form + Zod** — forms & validation

### The Time Constraint Moat
Every trip on the platform follows a strict structural window:

> **Departs Friday Night (8:00 PM onwards) → Returns Monday Morning (Before 6:00 AM)**

This consistency keeps ground logistics clean, makes marketing laser-targeted, and guarantees professionals are back in time for work.

### Same Timeline, Four Core Verticals
1. **The Solo Explorer Network** — Dedicated, social-focused batches explicitly engineered for individual travelers who want safe group environments.
2. **High-Adrenaline Escapes** — Vetted extreme sports (e.g., rafting in Rishikesh, surfing in Mulki, paragliding in Bir).
3. **Meditation & Wellness** — Strictly separated, quiet digital detox retreats (e.g., pottery, yoga, stargazing) away from rowdy tour crowds.
4. **The Crew Getaway** — Curated standard travel bookings designed for pre-existing friend groups or couples.

## 🗺️ The Complete Architecture & User Flow

```
[Targeted Meta Ad] (Tue-Thu Nights)
         │
         ▼
[Landing Page] ──► Filtered strictly by "Leaving This Friday" & "Source Hub"
         │
         ▼
[Package Details Page] ──► Displays standardized time-blocks & real-time slot counters
         │
         ▼
[Checkout (30-Sec Loop)] ──► DB Places 10-Min Transaction Reservation Hold
         │
         ▼
[Razorpay Payment Capture] ──► Webhook verifies slot validity & shifts status to 'Confirmed'
         │
         ▼
[Automated Manifest Engine] ──► Generates Customer & Agency PDFs
         │
         ▼
[Thursday 6:00 PM Handoff] ──► Automated data swap via Cron job (Direct Contact Line)
```

### Detailed Step-by-Step System Flow

#### Phase 1: User Discovery & Acquisition
- **The Mid-Week Hook:** A stressed software engineer in Bangalore or Delhi scrolls Instagram on a Wednesday night and sees a targeted reel: *"Tired of spending your weekends drinking at the same pub? Leave Friday night, return Monday morning."*
- **The High-Intent Entry:** They click through to the Next.js app. Instead of long search bars, the homepage filters primarily by **Departure Date** (*"Leaving This Friday"*) and **Source Hub** (*"Ex-Bangalore"*).

#### Phase 2: Selection & Transparency
- **Vibe Filtering:** The user picks a category (e.g., *Solo Explorer* or *Meditation*).
- **The Confidence Metrics:** The package page uses custom database logic to display social verification: **"70% Tech Professionals Booked | 50-50 Gender Split | Only 3 Slots Left"**.
- **Standardized Layout:** The schedule reads cleanly like code blocks: *Friday Night: Sleeper Bus Departure → Saturday: High-energy Activity → Sunday Evening: Return Journey*.

#### Phase 3: The Transaction Loop (The Developer's Moat)
- **The Checkout:** The user logs in via a quick authentication layout and hits the checkout page.
- **The Concurrence Hold:** The moment they hit checkout, a Supabase database constraint places a temporary `reserved_at` timestamp on that slot for **10 minutes**.
- **The Mobile-First Pay:** They complete the transaction via **Razorpay UPI Intent** on their phone in seconds.
- **The Webhook Verification:** Razorpay fires a backend `payment.captured` webhook. The code performs a final verification check against the database transaction, marks the booking as officially **Confirmed**, and releases the service-fee GST receipt splits.

#### Phase 4: Operational Automation (The Zero-Friction Handoff)
- **The Intermediary Layer:** The user instantly receives an automated WhatsApp confirmation voucher from the official business account.
- **The Thursday Cron Trigger:** On Thursday evening before departure, an automated cron service queries the Supabase tables, flips the batch status to **Closed**, and locks further edits.
- **The Data Handshake:** The cron script automatically builds two unique data packages:
  1. **For the Agency:** A Puppeteer-generated **Passenger Manifest PDF** (names, ages, phone numbers) sent to their operations email.
  2. **For the Traveler:** A personalized **Ground Support Card PDF** sent via WhatsApp with operator details, trip captain, and emergency phone line.
- **The Execution:** Traveler and agency communicate directly via call or individual broadcasts for on-ground coordination. The platform stays out of the operational line, handles financial clearing, and the trip executes seamlessly.

## 🛡️ What Makes This Defensible & Scalable

- The **vendor backend is intentionally minimal** — they don't need a complex interface, just simple tables on a secure token page.
- We wrap a clean, premium frontend and community features around the agencies' existing operations.
- As the user base grows, the network can expand to include **outside agencies** by offering to fill their unsold slots with **zero upfront financial risk** to them.

---

## 📌 Build Status & Progress (Last updated: 2026-07-20)

> **This is the resume point for the next dev session.** Read this section to know exactly where to start.

### Tech stack (current reality)
- **Next.js 15.5.4** (downgraded from 16 — Next 16's native runtime caused SIGBUS/silent death in this sandbox), React 19.2.1, Tailwind v3, Shadcn-style UI, Supabase (`@supabase/ssr` + `@supabase/supabase-js`), Zustand, React Hook Form + Zod v4, **Razorpay v2.9.5** (lazy/optional — keys NOT set in `.env.local`). Firebase fully removed.
- **Verification method:** `tsc --noEmit` (clean) + `next build` (passes). `next dev` CANNOT run in this sandbox (background process gets killed) — do not rely on it; use build + live Supabase queries.
- `.env.local` holds Supabase anon + service-role keys. `.env*` gitignored. Supabase project ref `crspmjiehmqofjikurkn`.

### Database migrations applied & verified live
- `0001_auth_foundation` + `0002_fix_admin_rls` — `profiles`, `vendors`, `is_admin()`.
- `0003_catalog` — (now DROPPED) packages/activities + batch_dates/batch_slots.
- `0004_bookings_reviews` — `bookings` (NULLABLE user_id, listing_id + listing_type FK), `booking_travelers`, `reviews`; RLS.
- `0005_unify_listings` — single **`listings`** table (type enum `package`|`activity`), dropped packages/activities, re-pointed batch_dates + bookings to listing_id/listing_type, recreated RLS.
- `0006_fix_slot_policy` — recreated `batch_slots_vendor_all` policy on `listing_id`.
- **IMPORTANT:** `bookings` has NO `booking_count` column — never select it. Booking count is computed client-side by counting rows.

### Catalog decision (locked)
- ONE `listings` table with `type` enum. `/packages` & `/activities` are **filtered URL views** over `listings` (set `type` filter). Single vendor form with a type toggle. Do NOT reintroduce separate tables.

### Completed features
1. **Auth** — customers browse WITHOUT login; shared login → role redirect. Guest checkout (contact + optional password auto-creates customer). Vendor = 2-step. Admin = placeholders. Google = placeholder.
2. **Dynamic browse** — `src/config/tabs.ts` (From/Vibe taxonomy), `src/lib/supabase/listing.ts` (`getListing(id)`, `getListings(filters)` over `listings`), `components/browse/packages-grid.tsx` (3-col, links to `/listings/[id]`), `components/browse/packages-filter-sidebar.tsx` (From/Vibe/Duration/Price URL filters). Home has dual tab rows → `/packages?cat=...`.
3. **Unified product page** — `src/app/(browse)/listings/[id]/page.tsx` + `components/browse/listing-booking-widget.tsx` (type-aware). `/packages/[id]` & `/activities/[id]` = redirects to `/listings/[id]`.
4. **Guest checkout** — `src/app/checkout/page.tsx` + `components/checkout/checkout-form.tsx` (3 steps: contact+optional password, per-traveler details, pay), GST calc, trust badge.
5. **Booking API** — `src/app/api/booking/route.ts`: validates slot availability, holds slots, optional customer registration, Razorpay lazy (graceful if no keys). Stores `listing_id` + `listing_type`. Verified live (booking + travelers insert).
6. **Vendor listing management (FULL CRUD)** —
   - `components/vendor/listing-form.tsx` — unified create/edit form (all sections; supports `initialId` for edit: prefills via browser client, updates + reconciles batches by delete/reinsert). Verified live (insert + update).
   - Routes: `/vendor/listings/new`, `/packages/new`, `/activities/new` (preset type); `/vendor/listings/{packages,activities}/edit/[id]` (edit); bare `edit/` pages redirect to list.
   - `components/vendor/vendor-listings-table.tsx` (used by `/vendor/listings/packages` & `/activities`) — live fetch by vendor_id+type, status toggle (Draft/Published), edit, delete, view. Verified live (update/list/delete).
7. **Vendor bookings view (just completed)** —
   - `components/vendor/vendor-bookings.tsx` — fetch vendor's listing IDs → bookings via `listing_id` (+ optional `type` filter); summary cards (total/pending/confirmed/revenue), status filter pills, expandable rows with lead contact + **traveler manifest** from `booking_travelers`.
   - Routes: `/vendor/bookings`, `/vendor/bookings/packages` (type=package), `/vendor/bookings/activities` (type=activity). Replaced the old ComingSoon stubs. Verified: tsc clean, build passes.
8. **UI primitives** — `components/ui/card.tsx`, `components/ui/badge.tsx` created. `src/types/razorpay.d.ts` ambient decl.
9. **Config** — `next.config.ts` `outputFileTracingRoot: import.meta.dirname`; `eslint.config.mjs` FlatCompat + overrides (no-unescaped-entities, no-empty-object-type, no-explicit-any as warnings; `prefer-const` is an ERROR — must fix).

### Known gaps / blocked
- Razorpay keys NOT set → payment shows "pending_payment, configure Razorpay" (by design).
- **Reviews UI not built** (table exists; no submission form or display on listing page).
- **Vendor dashboard** stats not built (could pull from bookings + listings).
- Booking **status actions** (vendor marking confirmed/completed) not built.
- Automated manifest PDF / WhatsApp / Thursday cron (Phase 4) not built.
- `package-booking-widget.tsx` is now unused (superseded by `listing-booking-widget.tsx`); safe to delete later.

### 🚀 Resume checklist for next session
- [ ] **Reviews section** on public listing page (`/listings/[id]`) — read `reviews` table (by listing_id), add submit form (customer-only or guest).
- [ ] **Vendor dashboard** stats — total listings, published count, total bookings, revenue from `bookings`/`listings`.
- [ ] **Booking status actions** — vendor can mark confirmed/completed/cancelled.
- [ ] Wire **Razorpay live keys** + `payment.captured` webhook verification (updates booking status, releases hold).
- [ ] (Optional cleanup) delete unused `package-booking-widget.tsx`.

---

*Status: Core transaction loop + full vendor CRUD + bookings view COMPLETE & verified. Remaining: reviews UI, vendor dashboard, booking status actions, Razorpay webhook, Phase-4 automation.*
