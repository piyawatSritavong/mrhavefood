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

## Development

```bash
npm install
npm run dev
```

`dev` and `build` use webpack (`--webpack`).

```bash
npm run build
npm start
```
