import type { Metadata } from "next";
import Link from "next/link";

import { ArticleList, CategoryLinks } from "@/components/articles/article-list";
import { JsonLd } from "@/components/articles/json-ld";
import { ContentShell } from "@/components/site/site-header";
import { articlePath } from "@/lib/autopost/article";
import { ARTICLE_LIST_TYPES, listPublishedArticles } from "@/lib/autopost/queries";
import { platformMeta } from "@/lib/promotions-data";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "บทความโปรส่งอาหาร เคล็ดลับประหยัดค่าส่ง",
  description: "บทความและคู่มือใช้โค้ดส่วนลด GrabFood, LINE MAN, ShopeeFood และ Robinhood อ้างอิงจากหน้าโปรทางการ",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesHub() {
  const articles = await listPublishedArticles({ types: ARTICLE_LIST_TYPES });
  return (
    <ContentShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `บทความ | ${SITE_NAME}`,
          url: `${SITE_URL}/articles`,
          hasPart: articles.slice(0, 20).map((a) => ({ "@type": "Article", headline: a.title, url: `${SITE_URL}${articlePath(a)}` })),
        }}
      />
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="space-y-1">
          <h1 className="text-2xl text-brand-primary sm:text-3xl">บทความโปรส่งอาหาร</h1>
          <p className="text-sm text-ink-muted">คู่มือคิดยอดสุทธิ ใช้โค้ด และวางงบสั่งอาหาร ตรวจราคาและสิทธิของบัญชีในแอปก่อนสั่งทุกครั้ง</p>
        </header>
        <CategoryLinks articles={articles} />
        <ArticleList articles={articles} empty="ยังไม่มีบทความ — บทความแรกกำลังมา" />
        <section aria-labelledby="by-app" className="space-y-2">
          <h2 id="by-app" className="text-base text-brand-primary">โปรแยกตามแอป</h2>
          <ul className="flex flex-wrap gap-2">
            {Object.values(platformMeta).map((m) => (
              <li key={m.slug}>
                <Link href={`/promo/${m.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold" style={{ color: m.color }}>
                  โค้ด {m.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/reviews" className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold text-brand-primary">
                รีวิวทั้งหมด
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </ContentShell>
  );
}
