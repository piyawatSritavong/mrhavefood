import { GoogleGenerativeAI } from "@google/generative-ai";

import { allowedDomains, hasForbiddenWords, isAllowedSource, OFFICIAL_DOMAINS } from "@/lib/farm/sources";
import { getPromotionsStore, isTestMode, type PromotionInsert } from "@/lib/farm/store";
import type { Promotion } from "@/lib/supabase";
import { bangkokToday } from "@/lib/time";

const MODEL = "gemini-2.5-flash";
// USD per 1M tokens for gemini-2.5-flash (output includes thinking tokens).
const PRICE_INPUT_PER_M = 0.3;
const PRICE_OUTPUT_PER_M = 2.5;
// Grounding with Google Search is free up to the daily quota; set this if usage goes past it.
const GROUNDING_USD_PER_REQUEST = Number(process.env.GEMINI_GROUNDING_USD_PER_REQUEST ?? 0) || 0;
// Undated promotions that no run has seen for this long are hidden (never deleted).
const STALE_AFTER_DAYS = 14;

export type CandidatePromotion = {
  platform: string;
  campaign_name: string;
  promo_code: string | null;
  conditions: string | null;
  start_date: string | null;
  end_date: string | null;
  reference_url: string | null;
};

export type RefreshStats = { new: number; updated: number; expired: number; active: number; rejected: number };

export type RefreshResult = {
  stats: RefreshStats;
  costUsd: number;
  newRows: Promotion[];
  active: Promotion[];
};

function buildPrompt(today: string): string {
  const domains = Object.entries(OFFICIAL_DOMAINS)
    .map(([p, d]) => `- ${p}: ${d.join(", ")}`)
    .join("\n");
  const feeds = allowedDomains().filter((d) => !Object.values(OFFICIAL_DOMAINS).flat().includes(d));
  return `ค้นหาโปรโมชั่นและรหัสส่วนลดที่ยังใช้ได้ ณ วันที่ ${today} ของ GrabFood, LINE MAN, ShopeeFood และ Robinhood
กฎแหล่งข้อมูล (สำคัญที่สุด): ใช้ได้เฉพาะหน้าเว็บทางการของแต่ละแพลตฟอร์มในโดเมนต่อไปนี้เท่านั้น
${domains}${feeds.length ? `\nหรือ feed ของโปรแกรม affiliate: ${feeds.join(", ")}` : ""}
ห้ามใช้ข้อมูลจากภายในแอป เว็บข่าว บล็อก โซเชียลมีเดีย หรือเว็บรวมโค้ดอื่น ถ้าไม่มีหน้าทางการยืนยัน ให้ตัดโปรนั้นทิ้ง
ทุกโปรต้องมี reference_url เป็นลิงก์ https ตรงไปยังหน้าทางการที่ระบุโปรนั้น
ตอบกลับเป็น JSON array เท่านั้น (ห้ามมีคำเกริ่นหรือ markdown) รูปแบบ:
[{"platform": "GrabFood | LINE MAN | ShopeeFood | Robinhood", "campaign_name": "ชื่อแคมเปญ", "promo_code": "รหัส หรือ null",
  "conditions": "เงื่อนไขหลัก เช่น สั่งขั้นต่ำ 200 บาท", "start_date": "YYYY-MM-DD หรือ null", "end_date": "YYYY-MM-DD หรือ null",
  "reference_url": "https://..."}]`;
}

function parseJSON(text: string): unknown {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const asDate = (v: unknown) => (typeof v === "string" && ISO_DATE.test(v) ? v : null);
const asText = (v: unknown, max = 300) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

/** Keep only well-formed candidates from an allowed source with nothing the farm would flag. */
export function sanitizeCandidates(raw: unknown): { valid: CandidatePromotion[]; rejected: number } {
  const list = Array.isArray(raw) ? raw : [];
  const valid: CandidatePromotion[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const platform = typeof r.platform === "string" ? r.platform : "";
    const candidate: CandidatePromotion = {
      platform,
      campaign_name: asText(r.campaign_name, 160) ?? "",
      promo_code: asText(r.promo_code, 40),
      conditions: asText(r.conditions),
      start_date: asDate(r.start_date),
      end_date: asDate(r.end_date),
      reference_url: asText(r.reference_url, 500),
    };
    const ok =
      platform in OFFICIAL_DOMAINS &&
      candidate.campaign_name &&
      isAllowedSource(candidate.reference_url, platform) &&
      !hasForbiddenWords(`${candidate.campaign_name} ${candidate.conditions ?? ""}`);
    if (ok) valid.push(candidate);
  }
  return { valid, rejected: list.length - valid.length };
}

async function fetchFromGemini(today: string): Promise<{ raw: unknown; costUsd: number }> {
  const apiKey = process.env.GEMINI_PROMOTIONS_API_KEY;
  if (!apiKey) throw new Error("GEMINI_PROMOTIONS_API_KEY is not configured");
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: MODEL });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: buildPrompt(today) }] }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ googleSearch: {} }] as any,
  });
  const usage = result.response.usageMetadata as
    | { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number }
    | undefined;
  const input = usage?.promptTokenCount ?? 0;
  const output = (usage?.candidatesTokenCount ?? 0) + (usage?.thoughtsTokenCount ?? 0);
  const costUsd = (input * PRICE_INPUT_PER_M + output * PRICE_OUTPUT_PER_M) / 1_000_000 + GROUNDING_USD_PER_REQUEST;
  return { raw: parseJSON(result.response.text()), costUsd: Math.round(costUsd * 1e6) / 1e6 };
}

/** Test-mode stand-in for Gemini: realistic shape, official sources, one row that must be rejected. */
function fixtureCandidates(today: string): unknown {
  const year = today.slice(0, 4);
  return [
    { platform: "GrabFood", campaign_name: "ส่งฟรีเมื่อสั่งครบ 200", promo_code: "FREEDEL200", conditions: "สั่งขั้นต่ำ 200 บาท เฉพาะร้านที่ร่วมรายการ", start_date: today, end_date: `${year}-12-31`, reference_url: "https://www.grab.com/th/food/promo/" },
    { platform: "LINE MAN", campaign_name: "ลด 40 บาท ลูกค้าใหม่", promo_code: "NEW40", conditions: "เฉพาะผู้ใช้ใหม่ สั่งขั้นต่ำ 150 บาท", start_date: null, end_date: `${year}-12-31`, reference_url: "https://lineman.line.me/promotion" },
    { platform: "ShopeeFood", campaign_name: "โค้ดลด 25% มื้อกลางวัน", promo_code: "LUNCH25", conditions: "11:00–14:00 ลดสูงสุด 50 บาท", start_date: null, end_date: null, reference_url: "https://shopee.co.th/m/shopeefood" },
    { platform: "Robinhood", campaign_name: "ดีลดีร้านดัง", promo_code: null, conditions: "ราคาพิเศษเฉพาะร้านที่ร่วมรายการ", start_date: null, end_date: `${year}-11-30`, reference_url: "https://www.robinhood.in.th/" },
    { platform: "GrabFood", campaign_name: "โค้ดจากเว็บรวมโค้ด", promo_code: "X", conditions: null, start_date: null, end_date: null, reference_url: "https://example-coupon-site.com/grab" },
  ];
}

const keyOf = (p: { platform: string; campaign_name: string; promo_code: string | null }) =>
  [p.platform, p.campaign_name, p.promo_code ?? ""].map((s) => s.trim().toLowerCase()).join("|");

/**
 * One refresh round: fetch candidates, upsert by (platform, campaign, code), and hide
 * rows that have expired or gone stale. Nothing is ever deleted.
 */
export async function refreshPromotions(now = new Date()): Promise<RefreshResult> {
  const today = bangkokToday(now);
  const { raw, costUsd } = isTestMode()
    ? { raw: fixtureCandidates(today), costUsd: 0 }
    : await fetchFromGemini(today);
  const { valid, rejected } = sanitizeCandidates(raw);

  const store = getPromotionsStore();
  const existing = await store.listAll();
  const byKey = new Map(existing.map((p) => [keyOf(p), p]));
  const fetchedAt = now.toISOString();

  const inserts: PromotionInsert[] = [];
  const seen = new Set<string>();
  let updated = 0;
  for (const c of valid) {
    // Already over: leave any stored copy to the expiry sweep below.
    if (c.end_date && c.end_date < today) continue;
    const key = keyOf(c);
    if (seen.has(key)) continue;
    seen.add(key);
    const fields = {
      platform: c.platform,
      campaign_name: c.campaign_name,
      promo_code: c.promo_code,
      conditions: c.conditions,
      start_date: c.start_date,
      end_date: c.end_date,
      reference_link: c.reference_url,
      fetched_at: fetchedAt,
    };
    const match = byKey.get(key);
    if (match) {
      await store.update(match.id, { ...fields, is_active: true });
      updated += 1;
    } else {
      inserts.push({ ...fields, is_active: true });
    }
  }
  await store.insert(inserts);

  const staleBefore = new Date(now.getTime() - STALE_AFTER_DAYS * 86_400_000).toISOString();
  const toHide = existing
    .filter((p) => p.is_active && !seen.has(keyOf(p)))
    .filter((p) => (p.end_date ? p.end_date < today : p.fetched_at < staleBefore))
    .map((p) => p.id);
  await store.deactivate(toHide);

  const after = await store.listAll();
  const active = after.filter((p) => p.is_active && (!p.end_date || p.end_date >= today));
  const newKeys = new Set(inserts.map(keyOf));
  return {
    stats: { new: inserts.length, updated, expired: toHide.length, active: active.length, rejected },
    costUsd,
    newRows: active.filter((p) => newKeys.has(keyOf(p))),
    active,
  };
}

/** Active promotions for read paths (pages, cards) through the same store as the refresh. */
export async function listActivePromotions(now = new Date()): Promise<Promotion[]> {
  const today = bangkokToday(now);
  const rows = await getPromotionsStore().listAll();
  return rows
    .filter((p) => p.is_active && (!p.end_date || p.end_date >= today))
    .sort((a, b) => (a.fetched_at < b.fetched_at ? 1 : -1));
}
