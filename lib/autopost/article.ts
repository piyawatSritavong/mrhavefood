// SPP v1 article body: validation and normalization
// (AI-Automation-Farm docs/contracts/site-publishing.md §3). The body is untrusted.

export const ARTICLE_TYPES = ["article", "review", "guide", "comparison", "news", "advertorial"] as const;
export const REVIEW_ITEM_TYPES = ["Product", "SoftwareApplication", "LocalBusiness", "Restaurant", "Course", "Service"] as const;
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
export const MAX_IMAGES = 5;
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const MAX_RAW_BODY_BYTES = 24 * 1024 * 1024;
const SLUG_RE = /^[a-z0-9-]{3,120}$/;
const ASSET_NAME_RE = /^[A-Za-z0-9._-]{1,100}$/;

export type ArticleType = (typeof ARTICLE_TYPES)[number];
export type ArticleStatus = "published" | "draft" | "unpublished";

export type CoverImage = { url: string; alt: string; width: number | null; height: number | null };
export type InlineImage = { name: string; content_type: string; bytes: Buffer; alt: string };
export type Faq = { q: string; a: string };
export type Source = { title: string; url: string };
export type InternalLink = { anchor: string; path: string };
export type Review = {
  item_name: string;
  item_type: (typeof REVIEW_ITEM_TYPES)[number];
  rating: number | null;
  best: number;
  pros: string[];
  cons: string[];
  verdict: string;
  price_note: string | null;
  offers: { label: string; url: string; affiliate: boolean }[];
};
export type Seo = { meta_title: string | null; keywords: string[]; canonical_url: string | null; noindex: boolean };

/** Stored article (DB row shape). */
export type Article = {
  id: string;
  external_id: string;
  slug: string;
  type: ArticleType;
  status: ArticleStatus;
  locale: string;
  title: string;
  excerpt: string;
  body_markdown: string;
  cover_image: CoverImage | null;
  tags: string[];
  category: string | null;
  author: { name: string; persona: string | null };
  faq: Faq[];
  review: Review | null;
  sources: Source[];
  internal_links: InternalLink[];
  seo: Seo;
  disclosure: "affiliate" | "sponsored" | null;
  published_at: string;
  updated_at: string;
  body_hash: string;
};

export type UpsertInput = Omit<Article, "id" | "body_hash"> & { images: InlineImage[] };

export type ParseResult =
  | { action: "unpublish"; external_id: string }
  | { action: "upsert"; article: UpsertInput }
  | { error: { status: 413 | 422; code: string; detail?: unknown } };

class Invalid extends Error {
  field: string;
  constructor(field: string, message: string) {
    super(message);
    this.field = field;
  }
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);

function str(o: Obj, key: string, max: number, opts: { required?: boolean; min?: number } = {}): string | null {
  const v = o[key];
  if (v === undefined || v === null || v === "") {
    if (opts.required) throw new Invalid(key, "required");
    return null;
  }
  if (typeof v !== "string") throw new Invalid(key, "must be a string");
  const s = v.trim();
  if (s.length < (opts.min ?? (opts.required ? 1 : 0))) throw new Invalid(key, "too short");
  if (s.length > max) throw new Invalid(key, `longer than ${max}`);
  return s;
}

function httpsUrl(v: unknown, field: string): string {
  if (typeof v !== "string") throw new Invalid(field, "must be a URL");
  try {
    const u = new URL(v);
    if (u.protocol !== "https:") throw new Error();
    return u.toString();
  } catch {
    throw new Invalid(field, "must be an https URL");
  }
}

function list<T>(v: unknown, field: string, max: number, map: (item: unknown, i: number) => T): T[] {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) throw new Invalid(field, "must be an array");
  if (v.length > max) throw new Invalid(field, `at most ${max} items`);
  return v.map(map);
}

function isoDate(v: unknown, field: string, fallback: string): string {
  if (v === undefined || v === null || v === "") return fallback;
  if (typeof v !== "string" || Number.isNaN(Date.parse(v))) throw new Invalid(field, "must be an ISO-8601 date");
  return new Date(v).toISOString();
}

function parseImages(v: unknown): InlineImage[] {
  return list(v, "images", MAX_IMAGES, (raw, i) => {
    if (!isObj(raw)) throw new Invalid(`images[${i}]`, "must be an object");
    const name = str(raw, "name", 100, { required: true }) as string;
    if (!ASSET_NAME_RE.test(name)) throw new Invalid(`images[${i}].name`, "invalid file name");
    const content_type = str(raw, "content_type", 40, { required: true }) as string;
    if (!(IMAGE_TYPES as readonly string[]).includes(content_type)) throw new Invalid(`images[${i}].content_type`, "png, jpeg or webp only");
    const b64 = raw.data_base64;
    if (typeof b64 !== "string" || !/^[A-Za-z0-9+/=\s]+$/.test(b64)) throw new Invalid(`images[${i}].data_base64`, "must be base64");
    const bytes = Buffer.from(b64, "base64");
    if (bytes.length === 0) throw new Invalid(`images[${i}].data_base64`, "empty image");
    if (bytes.length > MAX_IMAGE_BYTES) throw new Invalid(`images[${i}]`, "larger than 3 MB");
    if (!matchesMagic(bytes, content_type)) throw new Invalid(`images[${i}]`, "content does not match content_type");
    return { name, content_type, bytes, alt: str(raw, "alt", 300) ?? "" };
  });
}

/** Reject files whose bytes are not really the declared image type. */
function matchesMagic(b: Buffer, type: string): boolean {
  if (type === "image/png") return b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === "image/jpeg") return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  if (type === "image/webp") return b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

function parseReview(v: unknown): Review {
  if (!isObj(v)) throw new Invalid("review", "required for review/comparison");
  const item_type = str(v, "item_type", 40, { required: true }) as string;
  if (!(REVIEW_ITEM_TYPES as readonly string[]).includes(item_type)) throw new Invalid("review.item_type", "unknown schema.org type");
  const best = v.best === undefined || v.best === null ? 5 : Number(v.best);
  if (!Number.isFinite(best) || best <= 0 || best > 100) throw new Invalid("review.best", "invalid");
  let rating: number | null = null;
  if (v.rating !== undefined && v.rating !== null) {
    rating = Number(v.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > best) throw new Invalid("review.rating", "must be between 0 and best");
  }
  const pros = list(v.pros, "review.pros", 20, (s, i) => text(s, `review.pros[${i}]`, 300));
  const cons = list(v.cons, "review.cons", 20, (s, i) => text(s, `review.cons[${i}]`, 300));
  if (pros.length === 0 || cons.length === 0) throw new Invalid("review", "pros and cons both need at least one item");
  return {
    item_name: str(v, "item_name", 200, { required: true }) as string,
    item_type: item_type as Review["item_type"],
    rating,
    best,
    pros,
    cons,
    verdict: str(v, "verdict", 1000, { required: true }) as string,
    price_note: str(v, "price_note", 300),
    offers: list(v.offers, "review.offers", 10, (o, i) => {
      if (!isObj(o)) throw new Invalid(`review.offers[${i}]`, "must be an object");
      return {
        label: str(o, "label", 100, { required: true }) as string,
        url: httpsUrl(o.url, `review.offers[${i}].url`),
        affiliate: o.affiliate === true,
      };
    }),
  };
}

function text(v: unknown, field: string, max: number): string {
  if (typeof v !== "string" || !v.trim()) throw new Invalid(field, "must be a non-empty string");
  if (v.length > max) throw new Invalid(field, `longer than ${max}`);
  return v.trim();
}

/** Parse and validate a raw SPP v1 body. Never throws. */
export function parseSppBody(rawBody: string): ParseResult {
  if (Buffer.byteLength(rawBody, "utf8") > MAX_RAW_BODY_BYTES) {
    return { error: { status: 413, code: "payload_too_large" } };
  }
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { error: { status: 422, code: "invalid_json" } };
  }
  try {
    if (!isObj(body)) throw new Invalid("body", "must be an object");
    if (body.spp !== 1) throw new Invalid("spp", "must be 1");
    const action = body.action ?? "upsert";
    const external_id = str(body, "external_id", 300, { required: true }) as string;
    if (action === "unpublish") return { action, external_id };
    if (action !== "upsert") throw new Invalid("action", "must be upsert or unpublish");

    const type = (body.type ?? "article") as ArticleType;
    if (!ARTICLE_TYPES.includes(type)) throw new Invalid("type", "unknown type");
    const status = body.status ?? "published";
    if (status !== "published" && status !== "draft") throw new Invalid("status", "published or draft");
    const slug = str(body, "slug", 120, { required: true }) as string;
    if (!SLUG_RE.test(slug)) throw new Invalid("slug", "must match [a-z0-9-]{3,120}");

    const now = new Date().toISOString();
    const published_at = isoDate(body.published_at, "published_at", now);
    const images = parseImages(body.images);

    let cover_image: CoverImage | null = null;
    if (body.cover_image !== undefined && body.cover_image !== null) {
      if (!isObj(body.cover_image)) throw new Invalid("cover_image", "must be an object");
      const url = str(body.cover_image, "url", 1000, { required: true }) as string;
      if (!url.startsWith("asset://")) httpsUrl(url, "cover_image.url");
      const dim = (k: string) => {
        const n = Number((body.cover_image as Obj)[k]);
        return Number.isInteger(n) && n > 0 && n < 10000 ? n : null;
      };
      cover_image = { url, alt: str(body.cover_image, "alt", 300) ?? "", width: dim("width"), height: dim("height") };
    }

    const author = isObj(body.author) ? body.author : {};
    const seo = isObj(body.seo) ? body.seo : {};
    const disclosure = body.disclosure ?? null;
    if (disclosure !== null && disclosure !== "affiliate" && disclosure !== "sponsored") {
      throw new Invalid("disclosure", "null, affiliate or sponsored");
    }

    const article: UpsertInput = {
      external_id,
      slug,
      type,
      status,
      locale: str(body, "locale", 10) ?? "th",
      title: str(body, "title", 200, { required: true }) as string,
      excerpt: str(body, "excerpt", 300) ?? "",
      body_markdown: str(body, "body_markdown", 200_000, { required: true }) as string,
      cover_image,
      images,
      tags: list(body.tags, "tags", 20, (t, i) => text(t, `tags[${i}]`, 60)),
      category: str(body, "category", 60),
      author: { name: str(author, "name", 100) ?? "MrHaveFood Team", persona: str(author, "persona", 40) },
      faq: list(body.faq, "faq", 20, (f, i) => {
        if (!isObj(f)) throw new Invalid(`faq[${i}]`, "must be an object");
        return { q: str(f, "q", 300, { required: true }) as string, a: str(f, "a", 2000, { required: true }) as string };
      }),
      review: type === "review" || type === "comparison" ? parseReview(body.review) : null,
      sources: list(body.sources, "sources", 30, (s, i) => {
        if (!isObj(s)) throw new Invalid(`sources[${i}]`, "must be an object");
        return { title: str(s, "title", 300, { required: true }) as string, url: httpsUrl(s.url, `sources[${i}].url`) };
      }),
      internal_links: list(body.internal_links, "internal_links", 30, (l, i) => {
        if (!isObj(l)) throw new Invalid(`internal_links[${i}]`, "must be an object");
        const path = str(l, "path", 300, { required: true }) as string;
        if (!path.startsWith("/") || path.startsWith("//")) throw new Invalid(`internal_links[${i}].path`, "must be a site path");
        return { anchor: str(l, "anchor", 120, { required: true }) as string, path };
      }),
      seo: {
        meta_title: str(seo, "meta_title", 120),
        keywords: list(seo.keywords, "seo.keywords", 20, (k, i) => text(k, `seo.keywords[${i}]`, 80)),
        canonical_url: seo.canonical_url ? httpsUrl(seo.canonical_url, "seo.canonical_url") : null,
        noindex: seo.noindex === true,
      },
      disclosure: disclosure as Article["disclosure"],
      published_at,
      updated_at: isoDate(body.updated_at, "updated_at", published_at),
    };

    // Every asset:// reference must point at an image sent in this body.
    const names = new Set(images.map((i) => i.name));
    const refs = [
      ...(cover_image?.url.startsWith("asset://") ? [cover_image.url.slice(8)] : []),
      ...[...article.body_markdown.matchAll(/asset:\/\/([A-Za-z0-9._-]+)/g)].map((m) => m[1]),
    ];
    const missing = refs.filter((r) => !names.has(r));
    if (missing.length) throw new Invalid("images", `missing asset(s): ${missing.join(", ")}`);

    return { action: "upsert", article };
  } catch (err) {
    if (err instanceof Invalid) return { error: { status: 422, code: "invalid_body", detail: { field: err.field, message: err.message } } };
    return { error: { status: 422, code: "invalid_body" } };
  }
}

/** Public path for an article: reviews and comparisons live under /reviews. */
export function articlePath(a: Pick<Article, "type" | "slug">): string {
  return a.type === "review" || a.type === "comparison" ? `/reviews/${a.slug}` : `/articles/${a.slug}`;
}

export const TYPE_LABELS: Record<ArticleType, string> = {
  article: "บทความ",
  review: "รีวิว",
  guide: "คู่มือ",
  comparison: "เปรียบเทียบ",
  news: "ข่าว",
  advertorial: "บทความสนับสนุน",
};
