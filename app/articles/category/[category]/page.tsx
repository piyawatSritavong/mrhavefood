import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleList } from "@/components/articles/article-list";
import { ContentShell } from "@/components/site/site-header";
import { listPublishedArticles } from "@/lib/autopost/queries";

export const revalidate = 300;

type Props = { params: Promise<{ category: string }> };

const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decode((await params).category);
  if (!category) return {};
  return {
    title: `บทความหมวด ${category}`,
    description: `รวมบทความหมวด ${category} จาก MrHaveFood`,
    alternates: { canonical: `/articles/category/${encodeURIComponent(category)}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = decode((await params).category);
  if (!category) notFound();
  const articles = await listPublishedArticles({ category });
  if (articles.length === 0) notFound();
  return (
    <ContentShell>
      <div className="mx-auto max-w-5xl space-y-5">
        <nav aria-label="breadcrumb" className="text-sm">
          <Link href="/articles" className="inline-flex min-h-11 items-center font-semibold text-brand-primary">← บทความทั้งหมด</Link>
        </nav>
        <h1 className="text-2xl text-brand-primary sm:text-3xl">หมวด {category}</h1>
        <ArticleList articles={articles} empty="" />
      </div>
    </ContentShell>
  );
}
