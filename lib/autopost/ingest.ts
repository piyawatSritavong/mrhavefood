import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";

import { SITE_URL } from "@/lib/site";

import { articlePath, type Article, type UpsertInput } from "./article";
import { getArticlesStore } from "./store";

export type IngestResponse = { status: number; body: Record<string, unknown> };

export function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function refreshCaches(paths: string[]) {
  for (const p of new Set(paths)) {
    try {
      revalidatePath(p);
    } catch (err) {
      console.warn("[autopost] revalidate failed for", p, err);
    }
  }
}

const LISTING_PATHS = ["/", "/articles", "/reviews", "/sitemap.xml", "/rss.xml", "/llms.txt"];

export async function upsertArticle(input: UpsertInput, bodyHash: string): Promise<IngestResponse> {
  const store = getArticlesStore();

  const owner = await store.bySlug(input.slug);
  if (owner && owner.external_id !== input.external_id) {
    return { status: 409, body: { error: "slug_taken" } };
  }
  const existing = owner ?? (await store.byExternalId(input.external_id));

  // Inline images → storage, then rewrite asset:// references to their public URLs.
  const folder = `articles/${sha256(input.external_id).slice(0, 16)}`;
  const urls = new Map<string, string>();
  for (const img of input.images) {
    urls.set(img.name, await store.putMedia(`${folder}/${img.name}`, img.bytes, img.content_type));
  }
  const rewrite = (s: string) => s.replace(/asset:\/\/([A-Za-z0-9._-]+)/g, (_, name: string) => urls.get(name) ?? "");
  const { images: _images, ...fields } = input;
  void _images;

  const row: Omit<Article, "id"> = {
    ...fields,
    body_markdown: rewrite(fields.body_markdown),
    cover_image: fields.cover_image ? { ...fields.cover_image, url: rewrite(fields.cover_image.url) } : null,
    body_hash: bodyHash,
  };
  const saved = await store.save(existing ? { ...row, id: existing.id } : row);

  const path = articlePath(saved);
  const stale = existing && existing.slug !== saved.slug ? [articlePath(existing)] : [];
  refreshCaches([...LISTING_PATHS, path, ...stale, ...(saved.category ? [`/articles/category/${encodeURIComponent(saved.category)}`] : [])]);

  return {
    status: existing ? 200 : 201,
    body: { id: saved.id, url: `${SITE_URL}${path}`, status: saved.status, updated: Boolean(existing) },
  };
}

export async function unpublishArticle(externalId: string): Promise<IngestResponse> {
  const store = getArticlesStore();
  const row = await store.setStatus(externalId, "unpublished");
  if (row) refreshCaches([...LISTING_PATHS, articlePath(row)]);
  return {
    status: 200,
    body: { id: row?.id ?? null, url: row ? `${SITE_URL}${articlePath(row)}` : null, status: "unpublished", updated: Boolean(row) },
  };
}
