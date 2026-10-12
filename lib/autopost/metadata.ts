import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

import { articlePath, type Article } from "./article";

export function articleMetadata(a: Article, isPreview: boolean): Metadata {
  const path = articlePath(a);
  const title = a.seo.meta_title || a.title;
  const description = (a.excerpt || a.title).slice(0, 160);
  const images = a.cover_image
    ? [{ url: a.cover_image.url, alt: a.cover_image.alt || a.title, width: a.cover_image.width ?? undefined, height: a.cover_image.height ?? undefined }]
    : undefined;
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    keywords: a.seo.keywords.length ? a.seo.keywords : undefined,
    alternates: { canonical: a.seo.canonical_url ?? path },
    robots: isPreview || a.seo.noindex ? { index: false, follow: false } : undefined,
    authors: [{ name: a.author.name }],
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "th_TH",
      publishedTime: a.published_at,
      modifiedTime: a.updated_at,
      tags: a.tags,
      ...(images ? { images } : {}),
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, ...(images ? { images: images.map((i) => i.url) } : {}) },
  };
}
