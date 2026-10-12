import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/articles/article-view";
import { ContentShell } from "@/components/site/site-header";

import { articleMetadata } from "./metadata";
import { getArticleForPage } from "./queries";

export type DetailProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Shared generateMetadata + page for /articles/[slug] and /reviews/[slug]. */
export function detailRoute(section: "articles" | "reviews") {
  async function load({ params, searchParams }: DetailProps) {
    const [{ slug }, sp] = await Promise.all([params, searchParams]);
    return getArticleForPage(slug, section, first(sp.preview));
  }

  async function generateMetadata(props: DetailProps): Promise<Metadata> {
    const found = await load(props);
    return found ? articleMetadata(found.article, found.isPreview) : { robots: { index: false } };
  }

  async function Page(props: DetailProps) {
    const found = await load(props);
    if (!found) notFound();
    return (
      <ContentShell>
        <ArticleView article={found.article} isPreview={found.isPreview} />
      </ContentShell>
    );
  }

  return { generateMetadata, Page };
}
