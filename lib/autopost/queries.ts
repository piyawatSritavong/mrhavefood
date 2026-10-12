import { articlePath, type Article } from "./article";
import { getArticlesStore } from "./store";
import { parseSecrets, verifyPreviewToken } from "./verify";

export const REVIEW_TYPES: Article["type"][] = ["review", "comparison"];
export const ARTICLE_LIST_TYPES: Article["type"][] = ["article", "guide", "news", "advertorial"];

/** Published articles; never throws (pages render an empty state instead). */
export async function listPublishedArticles(opts?: Parameters<ReturnType<typeof getArticlesStore>["listPublished"]>[0]): Promise<Article[]> {
  try {
    return await getArticlesStore().listPublished(opts);
  } catch (err) {
    console.error("[articles] list failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * Article for a public page. Published articles are public; drafts only with a valid
 * ?preview=<token>; unpublished ones are gone. `section` must match the article's own path.
 */
export async function getArticleForPage(
  slug: string,
  section: "articles" | "reviews",
  preview: string | undefined,
): Promise<{ article: Article; isPreview: boolean } | null> {
  let article: Article | null = null;
  try {
    article = await getArticlesStore().bySlug(slug);
  } catch (err) {
    console.error("[articles] load failed:", err instanceof Error ? err.message : err);
    return null;
  }
  if (!article || !articlePath(article).startsWith(`/${section}/`)) return null;
  if (article.status === "published") return { article, isPreview: false };
  if (article.status === "draft" && verifyPreviewToken(parseSecrets(process.env.AUTOPOST_SITE_SECRET), article.external_id, preview)) {
    return { article, isPreview: true };
  }
  return null;
}

export function categoryPath(category: string): string {
  return `/articles/category/${encodeURIComponent(category)}`;
}
