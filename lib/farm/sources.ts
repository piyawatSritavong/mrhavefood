// Source rule from the farm plan: promotions may only come from the platforms'
// own official pages or an affiliate-program feed — never from inside the apps.

/** Official domains per platform (subdomains included). */
export const OFFICIAL_DOMAINS: Record<string, string[]> = {
  GrabFood: ["grab.com"],
  "LINE MAN": ["lineman.line.me", "linemanwongnai.com"],
  ShopeeFood: ["shopee.co.th", "shopeefood.co.th"],
  Robinhood: ["robinhood.co.th", "robinhood.in.th"],
};

/** Extra affiliate-feed domains, comma separated (e.g. "feed.involve.asia,accesstrade.in.th"). */
function affiliateFeedDomains(): string[] {
  return (process.env.AFFILIATE_FEED_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export function allowedDomains(platform?: string): string[] {
  const official = platform ? OFFICIAL_DOMAINS[platform] ?? [] : Object.values(OFFICIAL_DOMAINS).flat();
  return [...official, ...affiliateFeedDomains()];
}

function hostMatches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/** True when url is https and on an allowed domain for this platform. */
export function isAllowedSource(url: string | null | undefined, platform: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    return allowedDomains(platform).some((d) => hostMatches(host, d));
  } catch {
    return false;
  }
}

// Mirrors the farm's HARD_KEYWORDS (src/farm/policy.py): any of these makes a post high-risk,
// so they must never appear in what this engine sends.
const FORBIDDEN_WORDS = [
  "เทรด", "กำไร", "ขาดทุน", "ผลตอบแทน", "ลงทุน", "หุ้น", "คริปโต", "ฟอเร็กซ์", "ปันผล",
  "trade", "trading", "profit", "invest", "crypto", "bitcoin", "forex", "xauusd", "dividend",
];

export function hasForbiddenWords(text: string): boolean {
  const t = text.toLowerCase();
  return FORBIDDEN_WORDS.some((w) => t.includes(w));
}
