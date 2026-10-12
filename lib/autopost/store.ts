import { isTestMode } from "@/lib/farm/store";
import { createSupabaseAdmin } from "@/lib/supabase";

import type { Article } from "./article";

const BUCKET = "autopost-media";

export type IdempotencyRecord = { key: string; body_hash: string; status_code: number; response: unknown };

export interface ArticlesStore {
  byExternalId(externalId: string): Promise<Article | null>;
  bySlug(slug: string): Promise<Article | null>;
  /** Published only, newest first. */
  listPublished(opts?: { types?: Article["type"][]; category?: string; limit?: number }): Promise<Article[]>;
  save(article: Omit<Article, "id"> & { id?: string }): Promise<Article>;
  setStatus(externalId: string, status: Article["status"]): Promise<Article | null>;
  getIdempotency(key: string): Promise<IdempotencyRecord | null>;
  putIdempotency(record: IdempotencyRecord): Promise<void>;
  /** Stores an image and returns its public URL. */
  putMedia(path: string, bytes: Buffer, contentType: string): Promise<string>;
}

function supabaseStore(): ArticlesStore {
  const db = createSupabaseAdmin();
  const one = async (column: string, value: string) => {
    const { data, error } = await db.from("articles").select("*").eq(column, value).maybeSingle();
    if (error) throw error;
    return (data as Article | null) ?? null;
  };
  return {
    byExternalId: (id) => one("external_id", id),
    bySlug: (slug) => one("slug", slug),
    async listPublished({ types, category, limit = 200 } = {}) {
      let q = db.from("articles").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(limit);
      if (types?.length) q = q.in("type", types);
      if (category) q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Article[];
    },
    async save(article) {
      const { data, error } = await db.from("articles").upsert(article, { onConflict: "external_id" }).select("*").single();
      if (error) throw error;
      return data as Article;
    },
    async setStatus(externalId, status) {
      const { data, error } = await db.from("articles").update({ status }).eq("external_id", externalId).select("*").maybeSingle();
      if (error) throw error;
      return (data as Article | null) ?? null;
    },
    async getIdempotency(key) {
      const { data, error } = await db.from("autopost_idempotency").select("*").eq("key", key).maybeSingle();
      if (error) throw error;
      return (data as IdempotencyRecord | null) ?? null;
    },
    async putIdempotency(record) {
      const { error } = await db.from("autopost_idempotency").upsert(record, { onConflict: "key" });
      if (error) throw error;
    },
    async putMedia(path, bytes, contentType) {
      const { error } = await db.storage.from(BUCKET).upload(path, bytes, { contentType, upsert: true, cacheControl: "31536000" });
      if (error) throw error;
      return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },
  };
}

// ── Local test mode (PROMOTIONS_TEST_MODE=1, never on Vercel production) ──────────
type Memory = { articles: Article[]; idem: Map<string, IdempotencyRecord>; media: Map<string, { bytes: Buffer; type: string }> };
const g = globalThis as typeof globalThis & { __mrhfAutopost?: Memory };
const mem: Memory = (g.__mrhfAutopost ??= { articles: [], idem: new Map(), media: new Map() });

export function memoryMedia(path: string) {
  return mem.media.get(path) ?? null;
}

function memoryStore(): ArticlesStore {
  const copy = (a: Article | undefined) => (a ? structuredClone(a) : null);
  return {
    byExternalId: async (id) => copy(mem.articles.find((a) => a.external_id === id)),
    bySlug: async (slug) => copy(mem.articles.find((a) => a.slug === slug)),
    async listPublished({ types, category, limit = 200 } = {}) {
      return mem.articles
        .filter((a) => a.status === "published" && (!types?.length || types.includes(a.type)) && (!category || a.category === category))
        .sort((a, b) => (a.published_at < b.published_at ? 1 : -1))
        .slice(0, limit)
        .map((a) => structuredClone(a));
    },
    async save(article) {
      const i = mem.articles.findIndex((a) => a.external_id === article.external_id);
      const row: Article = { ...article, id: i >= 0 ? mem.articles[i].id : crypto.randomUUID() };
      if (i >= 0) mem.articles[i] = row;
      else mem.articles.push(row);
      return structuredClone(row);
    },
    async setStatus(externalId, status) {
      const row = mem.articles.find((a) => a.external_id === externalId);
      if (!row) return null;
      row.status = status;
      return structuredClone(row);
    },
    getIdempotency: async (key) => mem.idem.get(key) ?? null,
    async putIdempotency(record) {
      mem.idem.set(record.key, record);
    },
    async putMedia(path, bytes, contentType) {
      mem.media.set(path, { bytes, type: contentType });
      return `/api/autopost/media/${path}`;
    },
  };
}

export function getArticlesStore(): ArticlesStore {
  return isTestMode() ? memoryStore() : supabaseStore();
}
