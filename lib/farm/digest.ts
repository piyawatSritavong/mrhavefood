import { hasForbiddenWords } from "@/lib/farm/sources";
import { getPlatformMeta, isRealPromoCode } from "@/lib/promotions-data";
import { SITE_URL } from "@/lib/site";
import type { Promotion } from "@/lib/supabase";
import { digestSlot } from "@/lib/time";

const PUBLISHER = "facebook:mrhavefood";
const MAX_LINES = 5;

export type FarmItem = {
  kind: "mrhavefood.promo";
  title: string;
  summary: string;
  dedupe_key: string;
  preview_url: string;
  files: { path: string; role: "image" }[];
  targets: { publisher: string; text: string; link: string; data?: Record<string, unknown> }[];
  data: Record<string, unknown>;
};

/** Best promos first: fresh ones, then ones with a real code, then those ending soonest. */
export function rankForDigest(promos: Promotion[], newIds: Set<string>): Promotion[] {
  return [...promos]
    .filter((p) => !hasForbiddenWords(`${p.campaign_name} ${p.conditions ?? ""}`))
    .sort((a, b) => {
      const n = Number(newIds.has(b.id)) - Number(newIds.has(a.id));
      if (n) return n;
      const c = Number(isRealPromoCode(b.promo_code)) - Number(isRealPromoCode(a.promo_code));
      if (c) return c;
      return (a.end_date ?? "9999") < (b.end_date ?? "9999") ? -1 : 1;
    });
}

/**
 * At most one card per slot (am 06:00–14:59 / pm 15:00–05:59, Bangkok). The farm keeps
 * the first item per dedupe_key, so the 6-hourly runs inside one slot collapse to one post.
 */
export function buildDigestItem(
  active: Promotion[],
  newRows: Promotion[],
  { now = new Date(), imageBaseUrl = SITE_URL }: { now?: Date; imageBaseUrl?: string } = {},
): FarmItem | null {
  if (active.length === 0) return null;
  const slot = digestSlot(now);
  const ranked = rankForDigest(active, new Set(newRows.map((p) => p.id)));
  if (ranked.length === 0) return null;

  const platforms = [...new Set(ranked.map((p) => getPlatformMeta(p.platform).label))];
  const top = ranked[0];
  const title = `โปรเด็ด${slot.period === "am" ? "วันนี้" : "มื้อเย็น"} ${platforms.length} แอป · ${top.campaign_name}`.slice(0, 120);

  const link = `${SITE_URL}/?utm_source=facebook&utm_medium=farm&utm_campaign=digest-${slot.id}`;
  const lines = ranked.slice(0, MAX_LINES).map((p) => {
    const code = isRealPromoCode(p.promo_code) ? ` โค้ด ${p.promo_code}` : "";
    return `• ${getPlatformMeta(p.platform).label}: ${p.campaign_name}${code}`;
  });
  const more = ranked.length > MAX_LINES ? `\nและอีก ${ranked.length - MAX_LINES} โปรบนเว็บ` : "";
  const text = [
    `🍜 ${title}`,
    "",
    ...lines,
    more.trim(),
    "",
    `เช็กเงื่อนไขและโค้ดทั้งหมด 👉 ${link}`,
    "",
    "#โค้ดส่วนลด #โปรส่งอาหาร #MrHaveFood",
  ]
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n");

  return {
    kind: "mrhavefood.promo",
    title,
    summary: `${ranked.length} โปรที่ยังใช้ได้ (${platforms.join(", ")}) · ใหม่ ${newRows.length}`,
    dedupe_key: `mrhavefood:digest:${slot.date}:${slot.period}`,
    preview_url: SITE_URL,
    files: [{ path: `${imageBaseUrl}/api/og/digest/${slot.id}`, role: "image" }],
    targets: [{ publisher: PUBLISHER, text, link }],
    data: { slot: slot.id, promo_ids: ranked.slice(0, MAX_LINES).map((p) => p.id) },
  };
}
