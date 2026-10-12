import type { Metadata } from "next";
import Link from "next/link";

import { ArticleList } from "@/components/articles/article-list";
import { ContentShell } from "@/components/site/site-header";
import { listPublishedArticles, REVIEW_TYPES } from "@/lib/autopost/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "รีวิวและเปรียบเทียบแอปส่งอาหาร",
  description: "รีวิวและเปรียบเทียบแอปส่งอาหาร ข้อดี ข้อสังเกต และสรุปว่าเหมาะกับใคร อ้างอิงแหล่งข้อมูลทุกชิ้น",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsHub() {
  const reviews = await listPublishedArticles({ types: REVIEW_TYPES });
  return (
    <ContentShell>
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="space-y-1">
          <h1 className="text-2xl text-brand-primary sm:text-3xl">รีวิวและเปรียบเทียบ</h1>
          <p className="text-sm text-ink-muted">ทุกรีวิวมีทั้งข้อดีและข้อสังเกต พร้อมแหล่งอ้างอิง</p>
        </header>
        <ArticleList articles={reviews} empty="ยังไม่มีรีวิว" />
        <Link href="/articles" className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-primary">อ่านบทความทั้งหมด →</Link>
      </div>
    </ContentShell>
  );
}
