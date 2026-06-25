-- Partner discovery booking slots for the shareable booking page.
-- Bookings are written by the Vercel API using the Supabase service role key.

create table if not exists public.partner_discovery_bookings (
  id uuid primary key default gen_random_uuid(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'Europe/Riga',
  name text not null,
  email text not null,
  company text,
  phone text,
  notes text,
  status text not null default 'booked' check (status in ('booked', 'cancelled')),
  confirmation_error text,
  created_at timestamptz not null default now()
);

create unique index if not exists partner_discovery_bookings_start_at_booked_idx
  on public.partner_discovery_bookings (start_at)
  where status = 'booked';

alter table public.partner_discovery_bookings enable row level security;
