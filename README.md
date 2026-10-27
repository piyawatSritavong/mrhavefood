# MrHaveFood.com

รวมโค้ดส่วนลดส่งอาหาร GrabFood · LINE MAN · ShopeeFood · Robinhood ไว้ที่เดียว

Live: https://www.mrhavefood.com

## What it does

- **Promotions** — daily list of active promo codes from the four delivery platforms, searchable, with copy-code buttons. Data lives in the Supabase `promotions` table and is refreshed by `/api/promotions/fetch` (Gemini + Google Search).
- **Mr.AI chat** — floating assistant backed by Gemini (`/api/chat`), rate limited per IP.
- **Restaurant partners** — `/register-restaurant` saves sign-ups to `restaurant_applications`; approved restaurants are shown from the `restaurants` table and order through their LINE OA.

## Stack

Next.js 16 (App Router) · Tailwind CSS 4 · TypeScript · Zustand · Supabase · Gemini (`@google/generative-ai`) · framer-motion

Design tokens (color, fonts, radius, shadow) are defined once in `app/globals.css`; components use the generated utilities (`bg-surface`, `text-ink-muted`, `border-border`, `shadow-card` …) instead of hex values.

## Environment

Copy `.env.example` to `.env.local` and fill in:

| Variable | Used by |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | all Supabase access |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | reserved for client reads |
| `SUPABASE_SERVICE_ROLE_KEY` | server reads/writes (never expose) |
| `GEMINI_CHAT_API_KEY` | `/api/chat` |
| `GEMINI_PROMOTIONS_API_KEY` | `/api/promotions/fetch` |
| `CRON_SECRET` | required `Authorization: Bearer` token for `/api/promotions/fetch` |
| `DATABASE_URL` | Prisma scripts only |

## Database setup

Run `supabase/restaurant_applications.sql` once in the Supabase SQL editor to create the registration table (RLS on, server-only access). The `promotions` / `restaurants` table definitions are in `lib/supabase.ts`.

## Refreshing promotions

```bash
curl -X POST https://www.mrhavefood.com/api/promotions/fetch -H "Authorization: Bearer $CRON_SECRET"
```

To automate it, add a Vercel Cron job pointing at `/api/promotions/fetch` (Vercel sends `CRON_SECRET` as the bearer token on GET).

## AI Automation Farm (engine `mrhavefood`, Web SEO round)

- **Farm endpoint** `POST /api/promotions/fetch` (`Authorization: Bearer $CRON_SECRET`, body `{"farm_job_id","trigger","payload","dry_run"}`)
  refreshes promotions from official promo pages / affiliate feeds only (`lib/farm/sources.ts`), hides expired rows
  (never deletes) and answers `{"items", "cost_usd", "stats"}`. Items are `mrhavefood.info` facts handed to
  Auto-Content (`lib/farm/facts.ts`): a weekly per-app roundup and single-code explainers, every fact with a public URL.
  `dry_run` only means "publish nothing outside the site" — this route never posts.
- **SPP v1 receiver** `POST /api/autopost/v1/articles` + signed `GET /api/autopost/v1/health`
  (HMAC `AUTOPOST_SITE_SECRET`, ±300 s window, `Idempotency-Key` replay, `asset://` images → Supabase Storage,
  untrusted Markdown rendered without raw HTML). Pages: `/articles`, `/articles/[slug]`, `/articles/category/[c]`,
  `/reviews`, `/reviews/[slug]`, plus `/rss.xml`, `/llms.txt`, sitemap and JSON-LD (Article/Review, FAQPage, BreadcrumbList).
- **Health** `GET /api/health` (checks Supabase).
- **Migration** `prisma/migrations/20261013000000_autopost_articles/migration.sql` — run in the Supabase SQL editor
  only after approval.

### Tests

```bash
npm test
```

```bash
PROMOTIONS_TEST_MODE=1 AUTOPOST_SITE_SECRET=<test> CRON_SECRET=<test> PORT=3125 npx next start
```

```bash
BASE_URL=http://localhost:3125 AUTOPOST_SITE_SECRET=<test> CRON_SECRET=<test> npm run test:e2e
```

```bash
BASE_URL=http://localhost:3125 AUTOPOST_SITE_SECRET=<test> ../AI-Automation-Farm/.venv/bin/python scripts/verify_farm_publisher.py
```

`PROMOTIONS_TEST_MODE=1` swaps Gemini for a fixture and Supabase for an in-memory store (refused on Vercel production).

## Development

### Site-owned publishing schedule

`data/scheduled-articles.json` contains the owned editorial queue. Article times use
explicit UTC offsets. Public pages, article lists, category lists, RSS, sitemap,
and llms.txt filter out entries until `published_at` is due. These routes render
per request, so a previously cached page cannot reveal future content or delay
the scheduled release by an ISR window. No model call, browser worker, database
write, or incoming publishing credential is needed at publication time.

The read-only `/api/publishing/health` identifies this mode. The separately signed
SPP receiver remains closed unless `AUTOPOST_SITE_SECRET` is configured. Enabling
that optional receiver is not required for the site-owned schedule. Repository
articles remain available when the optional `articles` database table is absent.

Times in this queue are release times. A release becomes visible on the first
request at or after that instant. Actual platform verification belongs in the
posting checklist and must not be inferred merely from a queued record.

```bash
npm install
npm run dev
```

`dev` and `build` use webpack (`--webpack`).

```bash
npm run build
npm start
```
