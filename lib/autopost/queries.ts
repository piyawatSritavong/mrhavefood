import { articlePath, type Article } from "./article";
import { getArticlesStore } from "./store";
import { parseSecrets, verifyPreviewToken } from "./verify";
import { isPublicationDue } from "./publication";
import { repositoryArticles } from "./scheduled";

export const REVIEW_TYPES: Article["type"][] = ["review", "comparison"];
export const ARTICLE_LIST_TYPES: Article["type"][] = ["article", "guide", "news", "advertorial"];

/** Published articles; never throws (pages render an empty state instead). */
export async function listPublishedArticles(opts?: Parameters<ReturnType<typeof getArticlesStore>["listPublished"]>[0]): Promise<Article[]> {
  let stored: Article[] = [];
  try {
    stored = await getArticlesStore().listPublished(opts);
  } catch (err) {
    console.error("[articles] list failed:", err instanceof Error ? err.message : err);
  }
  const articles = new Map(repositoryArticles().map(article => [article.external_id, article]));
  for (const article of stored) articles.set(article.external_id, article);
  const now = Date.now();
  return [...articles.values()]
    .filter(article => isPublicationDue(article, now)
      && (!opts?.types?.length || opts.types.includes(article.type))
      && (!opts?.category || article.category === opts.category))
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
    .slice(0, opts?.limit ?? 200);
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
  article = repositoryArticles().find(entry => entry.slug === slug) ?? null;
  if (!article) {
    try {
      article = await getArticlesStore().bySlug(slug);
    } catch (err) {
      console.error("[articles] load failed:", err instanceof Error ? err.message : err);
      return null;
    }
  }
  if (!article || !articlePath(article).startsWith(`/${section}/`)) return null;
  if (isPublicationDue(article)) return { article, isPreview: false };
  if (article.status === "draft" && verifyPreviewToken(parseSecrets(process.env.AUTOPOST_SITE_SECRET), article.external_id, preview)) {
    return { article, isPreview: true };
  }
  return null;
}

export function categoryPath(category: string): string {
  return `/articles/category/${encodeURIComponent(category)}`;
}
