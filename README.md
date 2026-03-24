# MrHaveFood.com

Smart Layer for Savvy Eaters.

This project is a full `Next.js` foundation for `MrHaveFood.com`, designed around:

- Meta-price comparison across major delivery apps
- Receipt-driven truth with AI/OCR verification
- Visual worth-it heatmap for each district
- A phased roadmap from SEO wedge to retention and monetization

## Stack

- `Next.js 16` with App Router
- `Tailwind CSS 4`
- `TypeScript`
- `Zustand`
- `Auth.js / next-auth`
- `Prisma`
- `Supabase Postgres`
- `next/font`
- `manifest.webmanifest` for PWA groundwork

## Local development

```bash
npm install
npm run db:generate
npm run dev
```

The development script uses `webpack` because this environment cannot use Turbopack native bindings reliably.

## Production build

```bash
npm run build
npm start
```

## Authentication

Auth.js foundation is wired with:

- `next-auth` route handler at `app/api/auth/[...nextauth]/route.ts`
- custom sign-in page at `/sign-in`
- protected member page at `/member`
- optional Google OAuth via env vars
- demo credentials flow for local prototype testing

## Database

Member persistence is backed by Supabase Postgres through Prisma, and the current schema now uses normalized tables for:

- compare scenarios and platform offers
- member profiles
- favorites
- price alerts
- receipt submissions

This repo now uses a single local env file: `.env`

Run migration and seed with:

```bash
npm run db:migrate
npm run db:seed
```

Demo member credentials default to:

```bash
member@mrhavefood.com
mrhavefood-demo
```

## Current scope

The current implementation includes:

- A cinematic landing page with full-page scrolling sections
- Branded visual system inspired by the provided reference
- Sections for vision, compare, receipt truth, heatmap, ecosystem, and roadmap
- SEO compare routes and dynamic compare detail pages
- Authenticated member area with Supabase-backed favorites, alerts, points, and receipt history
- Prisma migration and seed flow for Supabase mock data
- SEO metadata and manifest basics for future PWA expansion

## Suggested next steps

1. Split the homepage into reusable components under `components/`
2. Replace UI compare routes to read from Supabase instead of in-file mock data
3. Add receipt upload API, OCR processing, and moderation queues
4. Build merchant and platform dashboards as authenticated routes
5. Add affiliate link tracking and price-drop jobs
