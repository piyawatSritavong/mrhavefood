import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ads/ad-slot";
import { PlatformLinks } from "@/components/promo/platform-links";
import { PromoRow } from "@/components/promo/promo-row";
import { Badge } from "@/components/ui/badge";
import { getAffiliateLinks } from "@/lib/affiliate";
import { listActivePromotions } from "@/lib/farm/refresh";
import { fmtThaiLong } from "@/lib/format-date";
import { fallbackPromotions, filterActivePromotions, getPlatformBySlug, platformMeta } from "@/lib/promotions-data";
import { SITE_NAME } from "@/lib/site";
import type { Promotion } from "@/lib/supabase";

export const revalidate = 300;

export function generateStaticParams() {
  return Object.values(platformMeta).map((m) => ({ platform: m.slug }));
}

type Props = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = getPlatformBySlug((await params).platform);
  if (!meta) return {};
  const title = `โค้ดส่วนลด ${meta.label} วันนี้ · โปรล่าสุดที่ยังใช้ได้`;
  return {
    title,
    description: `รวมโค้ดส่วนลดและโปรโมชั่น ${meta.label} ล่าสุดจากหน้าทางการ อัปเดตทุก 6 ชั่วโมง โปรหมดอายุซ่อนอัตโนมัติ`,
    alternates: { canonical: `/promo/${meta.slug}` },
    openGraph: { title: `${title} | ${SITE_NAME}`, url: `/promo/${meta.slug}` },
  };
}

async function loadPromotions(platform: string): Promise<Promotion[]> {
  let all: Promotion[] = [];
  try {
    all = await listActivePromotions();
  } catch (err) {
    console.error("[promo] failed to load promotions:", err);
  }
  if (all.length === 0) all = filterActivePromotions(fallbackPromotions);
  return all.filter((p) => p.platform === platform);
}

export default async function PlatformPromoPage({ params }: Props) {
  const meta = getPlatformBySlug((await params).platform);
  if (!meta) notFound();
  const promotions = await loadPromotions(meta.label);

  return (
    <div className="min-h-dvh bg-background px-3 pb-28 pt-4 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <nav aria-label="breadcrumb" className="text-sm">
          <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-brand-primary">
            ← MrHaveFood หน้าแรก
          </Link>
        </nav>

        <header className="space-y-1">
          <Badge variant="muted" suppressHydrationWarning>
            อัปเดต {fmtThaiLong(new Date())}
          </Badge>
          <h1 className="text-2xl leading-snug sm:text-3xl" style={{ color: meta.color }}>
            โค้ดส่วนลด {meta.label} วันนี้
          </h1>
          <p className="text-sm text-ink-muted">
            โปรที่ยังใช้ได้ {promotions.length} รายการ · ข้อมูลจากหน้าโปรโมชั่นทางการของ {meta.label} เท่านั้น
          </p>
        </header>

        {promotions.length > 0 ? (
          <ul className="space-y-1.5">
            {promotions.map((p) => (
              <li key={p.id}>
                <PromoRow promo={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <p className="text-sm font-semibold text-brand-primary">ตอนนี้ยังไม่มีโปร {meta.label} ที่ใช้ได้</p>
            <p className="mt-1 text-xs text-ink-muted">โปรหมดอายุจะถูกซ่อนอัตโนมัติ ลองดูแอปอื่นด้านล่าง</p>
          </div>
        )}

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PROMO} />

        <section aria-labelledby="other-apps" className="space-y-2">
          <h2 id="other-apps" className="text-base text-brand-primary">แอปส่งอาหารอื่น</h2>
          <PlatformLinks affiliateLinks={getAffiliateLinks()} current={meta.label} />
        </section>
      </div>
    </div>
  );
}
