import { platformMeta } from "@/lib/promotions-data";

/**
 * Affiliate links per platform come from env (never hardcoded):
 * AFFILIATE_URL_GRABFOOD, AFFILIATE_URL_LINEMAN, AFFILIATE_URL_SHOPEEFOOD, AFFILIATE_URL_ROBINHOOD.
 * Server-only: call from server components and pass the result down.
 */
export function getAffiliateUrl(platform: string): string | null {
  const slug = platformMeta[platform]?.slug;
  if (!slug) return null;
  const raw = process.env[`AFFILIATE_URL_${slug.toUpperCase()}`];
  if (!raw) return null;
  try {
    return new URL(raw).protocol === "https:" ? raw : null;
  } catch {
    return null;
  }
}

/** Map of platform name → affiliate URL for the platforms that have one configured. */
export function getAffiliateLinks(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const platform of Object.keys(platformMeta)) {
    const url = getAffiliateUrl(platform);
    if (url) out[platform] = url;
  }
  return out;
}
