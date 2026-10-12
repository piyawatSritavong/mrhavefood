import type { MetadataRoute } from "next";

import { articlePath, indexable } from "@/lib/autopost/feeds";
import { listPublishedArticles } from "@/lib/autopost/queries";
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

  // Drafts, unpublished and noindex articles never reach the sitemap.
  const articles = (await listPublishedArticles({ limit: 1000 })).filter(indexable);

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
    { url: `${SITE_URL}/articles`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/reviews`, changeFrequency: "daily", priority: 0.6 },
    ...[...new Set(articles.map((a) => a.category).filter((c): c is string => Boolean(c)))].map((c) => ({
      url: `${SITE_URL}/articles/category/${encodeURIComponent(c)}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...articles.map((a) => ({
      url: `${SITE_URL}${articlePath(a)}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/register-restaurant`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
