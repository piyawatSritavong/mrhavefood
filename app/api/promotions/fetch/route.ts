import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { buildFactItems } from "@/lib/farm/facts";
import { refreshPromotions } from "@/lib/farm/refresh";
import { platformMeta } from "@/lib/promotions-data";

// Gemini with search grounding can take a while.
export const maxDuration = 120;

type FarmBody = { farm_job_id?: string; trigger?: string; payload?: unknown; dry_run?: boolean };

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * Farm engine endpoint (AI Automation Farm engine "mrhavefood").
 * POST body: {"farm_job_id", "trigger", "payload", "dry_run"} → {"items", "cost_usd", "stats", ...}
 * items = mrhavefood.info facts handed off to Auto-Content (lib/farm/facts.ts).
 * GET is kept for a Vercel Cron (same response, no body).
 *
 * dry_run only means "do not publish anything outside the site". This route never posts —
 * publishing is the farm's job — so the table refresh runs either way.
 */
async function handle(req: NextRequest, body: FarmBody) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  try {
    const result = await refreshPromotions();
    // Pages that show promotions (and the fact URLs below) must reflect this refresh now.
    for (const path of ["/", "/sitemap.xml", "/llms.txt", ...Object.values(platformMeta).map((m) => `/promo/${m.slug}`)]) {
      revalidatePath(path);
    }
    // Web SEO round: facts for Auto-Content only — no Facebook digest card this round.
    const items = buildFactItems(result.active, result.newRows);
    console.info(
      `[api/promotions/fetch] job=${body.farm_job_id ?? "-"} trigger=${body.trigger ?? "-"} dry_run=${Boolean(body.dry_run)}`,
      result.stats,
      `cost=$${result.costUsd}`,
      `${Date.now() - startedAt}ms`,
    );
    return NextResponse.json({
      items,
      cost_usd: result.costUsd,
      stats: result.stats,
      dry_run: Boolean(body.dry_run),
      farm_job_id: body.farm_job_id ?? null,
    });
  } catch (err) {
    console.error("[api/promotions/fetch] refresh failed:", err);
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not configured") || message.includes("Missing required environment")) {
      return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "refresh_failed" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  let body: FarmBody = {};
  try {
    const parsed = await req.json();
    if (parsed && typeof parsed === "object") body = parsed as FarmBody;
  } catch {
    // An empty body (manual curl) is fine.
  }
  return handle(req, body);
}

export async function GET(req: NextRequest) {
  return handle(req, { trigger: "vercel-cron" });
}
