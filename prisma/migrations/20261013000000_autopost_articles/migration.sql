-- SPP v1 receiver storage (AI-Automation-Farm docs/contracts/site-publishing.md).
-- Run once in the Supabase SQL editor. NOT applied automatically; do not run against production
-- until Piya approves the web-seo branch.

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique check (char_length(external_id) between 1 and 300),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,120}$'),
  type text not null check (type in ('article', 'review', 'guide', 'comparison', 'news', 'advertorial')),
  status text not null check (status in ('published', 'draft', 'unpublished')),
  locale text not null default 'th',
  title text not null,
  excerpt text not null default '',
  body_markdown text not null,
  cover_image jsonb,
  tags text[] not null default '{}',
  category text,
  author jsonb not null default '{"name": "MrHaveFood Team", "persona": null}',
  faq jsonb not null default '[]',
  review jsonb,
  sources jsonb not null default '[]',
  internal_links jsonb not null default '[]',
  seo jsonb not null default '{}',
  disclosure text check (disclosure in ('affiliate', 'sponsored')),
  published_at timestamptz not null,
  updated_at timestamptz not null,
  body_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists articles_published_idx on public.articles (status, published_at desc);
create index if not exists articles_category_idx on public.articles (category) where status = 'published';

-- Idempotency-Key replay store: same key + same body hash → the stored response.
create table if not exists public.autopost_idempotency (
  key text primary key check (char_length(key) <= 200),
  body_hash text not null,
  status_code integer not null,
  response jsonb not null,
  created_at timestamptz not null default now()
);

-- Server-only (service role bypasses RLS); the public anon key gets no access.
alter table public.articles enable row level security;
alter table public.autopost_idempotency enable row level security;

-- Public bucket for article images (written by the receiver with the service role).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('autopost-media', 'autopost-media', true, 3145728, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
