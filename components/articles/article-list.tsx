import Link from "next/link";

import { safeUrl } from "@/components/articles/safe-markdown";
import { Badge } from "@/components/ui/badge";
import { articlePath, TYPE_LABELS, type Article } from "@/lib/autopost/article";

export function ArticleList({ articles, empty }: { articles: Article[]; empty: string }) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 text-center">
        <p className="text-sm font-semibold text-brand-primary">{empty}</p>
        <Link href="/#platforms" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-primary">
          ดูโปรล่าสุดทุกแอประหว่างนี้ →
        </Link>
      </div>
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {articles.map((a) => {
        const cover = a.cover_image ? safeUrl(a.cover_image.url) : "";
        return (
          <li key={a.id}>
            <Link href={articlePath(a)} className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-border-strong">
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element -- storage host varies by environment
                <img src={cover} alt="" loading="lazy" className="aspect-[1200/630] w-full object-cover" />
              )}
              <span className="flex flex-1 flex-col gap-2 p-4">
                <span className="flex flex-wrap gap-1">
                  <Badge variant="secondary">{TYPE_LABELS[a.type]}</Badge>
                  {a.category && <Badge variant="muted">{a.category}</Badge>}
                </span>
                <span className="font-display text-lg leading-snug text-brand-primary">{a.title}</span>
                {a.excerpt && <span className="line-clamp-3 text-sm text-ink-muted">{a.excerpt}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Category chips linking to the category hub pages. */
export function CategoryLinks({ articles }: { articles: Article[] }) {
  const categories = [...new Set(articles.map((a) => a.category).filter((c): c is string => Boolean(c)))];
  if (categories.length === 0) return null;
  return (
    <nav aria-label="หมวดหมู่บทความ">
      <ul className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <li key={c}>
            <Link href={`/articles/category/${encodeURIComponent(c)}`} className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold text-brand-primary">
              {c}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
