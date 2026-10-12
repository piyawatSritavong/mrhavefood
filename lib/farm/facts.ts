import { hasForbiddenWords } from "@/lib/farm/sources";
import { formatPromoDates } from "@/lib/format-date";
import { getPlatformMeta, isRealPromoCode, platformMeta } from "@/lib/promotions-data";
import { SITE_URL } from "@/lib/site";
import type { Promotion } from "@/lib/supabase";
import { bangkokToday } from "@/lib/time";

// Facts for Auto-Content (AI-Automation-Farm docs/contracts/round-web-seo.md §1.3).
// Built only from promotions stored on this site, so every fact has a public URL here
// (and the official source it came from). One low-risk item per topic, no targets.

const BRAND = "mrhavefood";
const MAX_EXPLAINERS_PER_RUN = 3;
const MIN_PROMOS_FOR_ROUNDUP = 2;

export type Fact = { title: string; url: string; text: string };

export type InfoItem = {
  kind: "mrhavefood.info";
  title: string;
  summary: string;
  dedupe_key: string;
  handoff: {
    engine: "auto-content";
    payload: { brand: string; format: "article"; topic: string; facts: Fact[] };
  };
  data: { topic_slug: string; promo_ids: string[] };
};

export function promoUrl(p: Promotion): string {
  const slug = getPlatformMeta(p.platform).slug;
  return `${SITE_URL}/promo/${slug}#promo-${p.id}`;
}

function promoFacts(p: Promotion): Fact[] {
  const meta = getPlatformMeta(p.platform);
  const parts = [
    `${meta.label}: ${p.campaign_name}`,
    isRealPromoCode(p.promo_code) ? `โค้ด ${p.promo_code}` : null,
    p.conditions ? `เงื่อนไข: ${p.conditions}` : null,
    `ระยะเวลา: ${formatPromoDates(p.start_date, p.end_date)}`,
  ].filter(Boolean);
  const facts: Fact[] = [{ title: `${meta.label} — ${p.campaign_name}`, url: promoUrl(p), text: parts.join(" · ") }];
  if (p.reference_link) {
    facts.push({ title: `ประกาศทางการ: ${p.campaign_name}`, url: p.reference_link, text: `หน้าโปรโมชั่นทางการของ ${meta.label} ที่ยืนยันโปรนี้` });
  }
  return facts;
}

/** Monday (Bangkok) of the week containing `today` (YYYY-MM-DD). */
export function weekStart(today: string): string {
  const d = new Date(`${today}T00:00:00Z`);
  const offset = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

const codeSlug = (code: string) => code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

function item(topic: string, topicSlug: string, date: string, promos: Promotion[], summary: string): InfoItem {
  return {
    kind: "mrhavefood.info",
    title: `ข้อมูลใหม่: ${topic}`,
    summary,
    dedupe_key: `${BRAND}:facts:${topicSlug}:${date}`,
    handoff: {
      engine: "auto-content",
      payload: { brand: BRAND, format: "article", topic, facts: promos.flatMap(promoFacts) },
    },
    data: { topic_slug: topicSlug, promo_ids: promos.map((p) => p.id) },
  };
}

/**
 * - Weekly "best promos per app" roundup: one per app per week (dedupe date = that Monday),
 *   only when the app has at least two active promos.
 * - Single-promo explainer: for promos first seen in this run that carry a real code.
 */
export function buildFactItems(active: Promotion[], newRows: Promotion[], now = new Date()): InfoItem[] {
  const today = bangkokToday(now);
  const monday = weekStart(today);
  const usable = (p: Promotion) => !hasForbiddenWords(`${p.campaign_name} ${p.conditions ?? ""}`);
  const items: InfoItem[] = [];

  for (const meta of Object.values(platformMeta)) {
    const promos = active.filter((p) => p.platform === meta.label && usable(p));
    if (promos.length < MIN_PROMOS_FOR_ROUNDUP) continue;
    const ranked = [...promos].sort(
      (a, b) => Number(isRealPromoCode(b.promo_code)) - Number(isRealPromoCode(a.promo_code)) ||
        (a.end_date ?? "9999").localeCompare(b.end_date ?? "9999"),
    );
    items.push(
      item(
        `โปร ${meta.label} ที่ใช้ได้สัปดาห์นี้ (เริ่ม ${monday})`,
        `${meta.slug}-weekly`,
        monday,
        ranked.slice(0, 8),
        `${promos.length} โปร ${meta.label} ที่ยังใช้ได้ · หน้าอ้างอิง ${SITE_URL}/promo/${meta.slug}`,
      ),
    );
  }

  for (const p of newRows.filter((r) => isRealPromoCode(r.promo_code) && usable(r)).slice(0, MAX_EXPLAINERS_PER_RUN)) {
    const meta = getPlatformMeta(p.platform);
    const code = p.promo_code as string;
    items.push(
      item(
        `วิธีใช้โค้ด ${code} ของ ${meta.label}`,
        `${meta.slug}-code-${codeSlug(code) || p.id.slice(0, 8)}`,
        today,
        [p],
        `โปรใหม่ ${meta.label}: ${p.campaign_name}`,
      ),
    );
  }
  return items;
}
