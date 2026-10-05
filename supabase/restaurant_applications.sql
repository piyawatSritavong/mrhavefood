-- Run once in the Supabase SQL editor (Project → SQL → New query).
-- Stores restaurant sign-ups from /register-restaurant.

create table if not exists public.restaurant_applications (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null check (char_length(restaurant_name) between 1 and 120),
  contact_name text not null check (char_length(contact_name) between 1 and 120),
  phone text not null check (phone ~ '^0[0-9]{8,9}$'),
  email text not null check (char_length(email) <= 254),
  category text not null,
  address text not null check (char_length(address) between 1 and 300),
  consent_accepted_at timestamptz not null,
  consent_version text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists restaurant_applications_created_at_idx
  on public.restaurant_applications (created_at desc);

-- Only the server (service role, which bypasses RLS) may read or write.
-- With RLS on and no policies, the public anon key has no access at all.
alter table public.restaurant_applications enable row level security;
