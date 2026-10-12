import Link from "next/link";

import { JsonLd } from "@/components/articles/json-ld";
import { SafeMarkdown, safeUrl } from "@/components/articles/safe-markdown";
import { Badge } from "@/components/ui/badge";
import { articlePath, TYPE_LABELS, type Article } from "@/lib/autopost/article";
import { categoryPath } from "@/lib/autopost/queries";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DISCLOSURE_TEXT = {
  affiliate: "ลิงก์ในบทความนี้เป็น affiliate เราอาจได้รับค่าคอมมิชชันเมื่อคุณสั่งผ่านลิงก์ โดยคุณไม่ต้องจ่ายเพิ่ม",
  sponsored: "บทความนี้ได้รับการสนับสนุน",
} as const;

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Bangkok" });
}

function absolute(url: string): string {
  return url.startsWith("/") ? `${SITE_URL}${url}` : url;
}

export function articleJsonLd(a: Article) {
  const url = `${SITE_URL}${articlePath(a)}`;
  const isReview = a.review && (a.type === "review" || a.type === "comparison");
  const section = isReview ? { name: "รีวิว", path: "/reviews" } : { name: "บทความ", path: "/articles" };
  const image = a.cover_image ? [absolute(a.cover_image.url)] : undefined;
  const author = { "@type": "Person", name: a.author.name };
  const publisher = { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } };

  const main = isReview && a.review
    ? {
        "@context": "https://schema.org",
        "@type": "Review",
        name: a.title,
        description: a.excerpt,
        url,
        image,
        author,
        publisher,
        datePublished: a.published_at,
        dateModified: a.updated_at,
        reviewBody: a.review.verdict,
        itemReviewed: { "@type": a.review.item_type, name: a.review.item_name },
        ...(a.review.rating !== null
          ? { reviewRating: { "@type": "Rating", ratingValue: a.review.rating, bestRating: a.review.best, worstRating: 0 } }
          : {}),
        positiveNotes: { "@type": "ItemList", itemListElement: a.review.pros.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })) },
        negativeNotes: { "@type": "ItemList", itemListElement: a.review.cons.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c })) },
      }
    : {
        "@context": "https://schema.org",
        "@type": a.type === "news" ? "NewsArticle" : "Article",
        headline: a.title,
        description: a.excerpt,
        url,
        mainEntityOfPage: url,
        image,
        author,
        publisher,
        datePublished: a.published_at,
        dateModified: a.updated_at,
        inLanguage: a.locale,
        keywords: a.seo.keywords.join(", ") || undefined,
        citation: a.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url })),
      };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: section.name, item: `${SITE_URL}${section.path}` },
      { "@type": "ListItem", position: 3, name: a.title, item: url },
    ],
  };

  const faq = a.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;

  return [main, breadcrumbs, ...(faq ? [faq] : [])];
}

export function ArticleView({ article: a, isPreview }: { article: Article; isPreview: boolean }) {
  const isReview = a.type === "review" || a.type === "comparison";
  const section = isReview ? { name: "รีวิว", path: "/reviews" } : { name: "บทความ", path: "/articles" };
  const cover = a.cover_image ? safeUrl(a.cover_image.url) : "";

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {!isPreview && <JsonLd data={articleJsonLd(a)} />}

      <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
        <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-brand-primary">หน้าแรก</Link>
        <span aria-hidden>›</span>
        <Link href={section.path} className="inline-flex min-h-11 items-center font-semibold text-brand-primary">{section.name}</Link>
        {a.category && (
          <>
            <span aria-hidden>›</span>
            <Link href={categoryPath(a.category)} className="inline-flex min-h-11 items-center font-semibold text-brand-primary">{a.category}</Link>
          </>
        )}
      </nav>

      {isPreview && (
        <p role="status" className="rounded-xl bg-danger-surface px-4 py-3 text-sm font-semibold text-danger">
          ฉบับร่าง (preview) — ยังไม่เผยแพร่และไม่ถูกค้นหา
        </p>
      )}

      {a.disclosure && (
        <p className="rounded-xl border border-border-strong bg-surface-subtle px-4 py-3 text-sm text-ink-secondary">
          {DISCLOSURE_TEXT[a.disclosure]}
        </p>
      )}

      <header className="space-y-3">
        <Badge variant="secondary">{TYPE_LABELS[a.type]}</Badge>
        <h1 className="text-2xl leading-snug text-brand-primary sm:text-3xl">{a.title}</h1>
        {a.excerpt && <p className="text-base text-ink-muted">{a.excerpt}</p>}
        <p className="text-xs text-ink-soft">
          โดย {a.author.name} · เผยแพร่ {fmtDate(a.published_at)}
          {a.updated_at !== a.published_at && ` · อัปเดต ${fmtDate(a.updated_at)}`}
        </p>
      </header>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element -- storage host varies by environment
        <img
          src={cover}
          alt={a.cover_image?.alt || a.title}
          width={a.cover_image?.width ?? 1200}
          height={a.cover_image?.height ?? 630}
          className="h-auto w-full rounded-card"
        />
      )}

      {isReview && a.review && (
        <section aria-labelledby="review-box" className="space-y-4 rounded-card border border-border bg-surface p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="review-box" className="text-lg text-brand-primary">สรุปรีวิว: {a.review.item_name}</h2>
            {a.review.rating !== null && (
              <p className="text-lg font-bold text-brand-accent">
                {a.review.rating} / {a.review.best}
                <span className="sr-only"> คะแนน</span>
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm text-success">ข้อดี</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink">{a.review.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-sm text-danger">ข้อสังเกต</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink">{a.review.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          </div>
          <p className="text-sm text-ink"><strong>สรุป:</strong> {a.review.verdict}</p>
          {a.review.price_note && <p className="text-xs text-ink-muted">{a.review.price_note}</p>}
          {a.review.offers.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {a.review.offers.map((o, i) => (
                <li key={i}>
                  <a
                    href={o.url}
                    target="_blank"
                    rel={o.affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer nofollow"}
                    className="inline-flex min-h-11 items-center rounded-full bg-brand-primary px-4 text-sm font-semibold text-inverse"
                  >
                    {o.label}{o.affiliate && <span className="ml-1 text-xs text-inverse/70">(affiliate)</span>}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="text-base">
        <SafeMarkdown markdown={a.body_markdown} />
      </div>

      {a.faq.length > 0 && (
        <section aria-labelledby="faq" className="space-y-3">
          <h2 id="faq" className="text-xl text-brand-primary">คำถามที่พบบ่อย</h2>
          {a.faq.map((f, i) => (
            <details key={i} className="rounded-xl border border-border bg-surface p-4" open={i === 0}>
              <summary className="cursor-pointer font-semibold text-brand-primary">{f.q}</summary>
              <p className="mt-2 text-sm leading-7 text-ink">{f.a}</p>
            </details>
          ))}
        </section>
      )}

      {a.sources.length > 0 && (
        <section aria-labelledby="sources" className="space-y-2">
          <h2 id="sources" className="text-lg text-brand-primary">แหล่งอ้างอิง</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {a.sources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-block py-2 text-brand-primary underline underline-offset-2">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}

      {(a.internal_links.length > 0 || a.tags.length > 0) && (
        <section aria-labelledby="related" className="space-y-2 border-t border-border pt-4">
          <h2 id="related" className="text-base text-brand-primary">อ่านต่อ</h2>
          <ul className="flex flex-wrap gap-2">
            {a.internal_links.map((l, i) => (
              <li key={i}>
                <Link href={l.path} className="inline-flex min-h-11 items-center rounded-full bg-surface-brand px-4 text-sm font-semibold text-brand-primary">
                  {l.anchor}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#platforms" className="inline-flex min-h-11 items-center rounded-full bg-surface-brand px-4 text-sm font-semibold text-brand-primary">
                โปรล่าสุดทุกแอป
              </Link>
            </li>
          </ul>
          {a.tags.length > 0 && (
            <p className="text-xs text-ink-soft">แท็ก: {a.tags.join(" · ")}</p>
          )}
        </section>
      )}
    </article>
  );
}
