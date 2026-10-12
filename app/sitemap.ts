import type { MetadataRoute } from "next";

import { listActivePromotions } from "@/lib/farm/refresh";
import { platformMeta } from "@/lib/promotions-data";
import { SITE_URL } from "@/lib/site";
import type { Promotion } from "@/lib/supabase";

// Rebuilt from the promotions table; robots.txt points crawlers here.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let active: Promotion[] = [];
  try {
    active = await listActivePromotions();
  } catch (err) {
    console.error("[sitemap] failed to load promotions:", err);
  }

  const latest = (rows: Promotion[]) =>
    rows.reduce<Date | undefined>((max, p) => {
      const d = new Date(p.fetched_at);
      return !max || d > max ? d : max;
    }, undefined);

  return [
    { url: SITE_URL, lastModified: latest(active) ?? new Date(), changeFrequency: "hourly", priority: 1 },
    ...Object.values(platformMeta).map((m) => ({
      url: `${SITE_URL}/promo/${m.slug}`,
      lastModified: latest(active.filter((p) => p.platform === m.label)) ?? new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/register-restaurant`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
