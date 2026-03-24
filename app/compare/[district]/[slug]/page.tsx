import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { CompareDetailInteractions } from "@/components/compare/compare-detail-interactions";
import { ReviewPanel } from "@/components/community/review-panel";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  formatBaht,
  getBestOffer,
  heatZones,
} from "@/lib/home-content";
import {
  getAllCompareScenarios,
  getCompareScenarioByRoute,
} from "@/lib/compare-data";
import {
  getDistrictSlug,
  getScenarioHref,
  getScenarioSlug,
} from "@/lib/compare-routes";

type CompareDetailPageProps = {
  params: Promise<{
    district: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const scenarios = await getAllCompareScenarios();

  return scenarios.map((scenario) => ({
    district: getDistrictSlug(scenario.district),
    slug: getScenarioSlug(scenario),
  }));
}

export async function generateMetadata({
  params,
}: CompareDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const scenario = await getCompareScenarioByRoute(resolvedParams);

  if (!scenario) {
    return {
      title: "Compare Page Not Found",
    };
  }

  const bestOffer = getBestOffer(scenario);
  const canonicalPath = getScenarioHref(scenario);

  return {
    title: `${scenario.title} ใน ${scenario.district}`,
    description: `เปรียบเทียบราคา ${scenario.title} จาก ${scenario.restaurant} ใน ${scenario.district} ระหว่าง Grab, LINE MAN และ ShopeeFood เริ่มต้นที่ ${formatBaht(bestOffer.totalPrice)}.`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${scenario.title} ใน ${scenario.district} | MrHaveFood.com`,
      description: `ดู net price comparison ของ ${scenario.title} จาก ${scenario.restaurant} พร้อม ETA, fees และ alert hooks.`,
      url: `https://mrhavefood.com${canonicalPath}`,
    },
  };
}

export default async function CompareDetailPage({
  params,
}: CompareDetailPageProps) {
  const resolvedParams = await params;
  const [scenario, allScenarios] = await Promise.all([
    getCompareScenarioByRoute(resolvedParams),
    getAllCompareScenarios(),
  ]);

  if (!scenario) {
    notFound();
  }

  const bestOffer = getBestOffer(scenario);
  const sortedOffers = scenario.platforms
    .slice()
    .sort((offerA, offerB) => offerA.totalPrice - offerB.totalPrice);
  const worthZone = heatZones.find((zone) => zone.name === scenario.district);
  const relatedScenarios = allScenarios
    .filter((item) => item.id !== scenario.id)
    .slice(0, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: `${scenario.title} ใน ${scenario.district}`,
    description: `Compare ${scenario.title} from ${scenario.restaurant} across major delivery platforms.`,
    mainEntity: {
      "@type": "MenuItem",
      name: scenario.title,
      description: scenario.summary,
      offers: sortedOffers.map((offer) => ({
        "@type": "Offer",
        priceCurrency: "THB",
        price: offer.totalPrice,
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: offer.platform,
        },
      })),
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f3e6_0%,#efe6d1_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <BackgroundBeams className="opacity-70" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#ff8d33,#274d32)] font-display text-sm font-bold text-white">
              MF
            </span>
            <div>
              <p className="font-display text-[0.95rem] font-semibold text-[#121517]">
                MrHaveFood.com
              </p>
              <p className="text-[0.72rem] tracking-[0.22em] text-[#5d6157] uppercase">
                Smart Layer for Savvy Eaters
              </p>
            </div>
          </Link>

          <AuthNavActions />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-[#5b6458]">
          <Link href="/" className="rounded-full bg-white/75 px-4 py-2 font-semibold text-[#111111]">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/compare"
            className="rounded-full bg-white/75 px-4 py-2 font-semibold text-[#111111]"
          >
            Compare
          </Link>
          <span>/</span>
          <span className="rounded-full border border-[#111111]/10 bg-white/55 px-4 py-2 font-semibold text-[#111111]">
            {scenario.title}
          </span>
        </div>

        <section className="glass-panel rounded-[2.8rem] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="section-kicker">SEO Compare Detail</p>
              <h1 className="type-display-page mt-4 font-display font-semibold tracking-[-0.05em] text-[#111111]">
                {scenario.title}
              </h1>
              <p className="type-heading-sm mt-4 font-display text-[#243024]">
                {scenario.restaurant} • {scenario.district}
              </p>
              <p className="type-body mt-5 max-w-2xl text-[#4d584d]">
                {scenario.summary} หน้านี้ถูกวางให้เป็น compare landing รายเมนูสำหรับ organic traffic
                และเป็นจุดเชื่อมไปยัง alert, favorite และ receipt verification flow
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {scenario.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#111111]/8 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#60685c]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <BentoGrid className="auto-rows-[minmax(11rem,auto)] md:grid-cols-2">
              <BentoGridItem
                title="Best net price"
                description={bestOffer.note}
                header={<p className="type-stat text-[#111111]">{formatBaht(bestOffer.totalPrice)}</p>}
              />
              <BentoGridItem
                title="Restaurant rating"
                description={scenario.cuisine}
                header={<p className="type-stat text-[#111111]">{scenario.rating.toFixed(1)}</p>}
              />
              <BentoGridItem
                title="Distance"
                description="เหมาะกับ delivery window สั้น"
                header={<p className="type-stat text-[#111111]">{scenario.distanceKm.toFixed(1)} km</p>}
              />
              <BentoGridItem
                title="Worth-it zone"
                description={worthZone ? `${worthZone.name} ${worthZone.delta}` : "Local price signal"}
                header={<p className="type-stat text-[#111111]">{worthZone?.score ?? "8.0"}</p>}
              />
            </BentoGrid>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.94fr]">
          <div className="grid gap-6">
            <article className="soft-card rounded-[2rem] p-6 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Platform comparison</p>
                  <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
                    Breakdown ต่อแอป
                  </h2>
                </div>
                <span className="rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
                  3-platform snapshot
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {sortedOffers.map((offer, index) => (
                  <article
                    key={offer.platform}
                    className="rounded-[1.6rem] border border-[#111111]/8 bg-white/80 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <span className="grid size-12 place-items-center rounded-2xl bg-[#111111] text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">
                            {offer.platform}
                          </p>
                          <p className="type-stat-sm mt-1 font-display font-semibold text-[#111111]">
                            {formatBaht(offer.totalPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-[#566156]">{offer.note}</p>
                        <p className="mt-2 text-sm font-semibold text-[#111111]">
                          ETA {offer.etaMinutes} min
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-4">
                      <div className="rounded-[1.2rem] bg-[#fff9ef] px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Food</p>
                        <p className="font-data mt-2 text-[#111111]">
                          {formatBaht(offer.foodPrice)}
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] bg-[#fff9ef] px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Delivery</p>
                        <p className="font-data mt-2 text-[#111111]">
                          {formatBaht(offer.deliveryFee)}
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] bg-[#fff9ef] px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Service</p>
                        <p className="font-data mt-2 text-[#111111]">
                          {formatBaht(offer.serviceFee)}
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] bg-[#eef5dd] px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#60704d]">Discount</p>
                        <p className="font-data mt-2 text-[#2a4418]">
                          -{formatBaht(offer.discount)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="glass-panel rounded-[2rem] p-6 sm:p-7">
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Receipt-driven truth angle</p>
              <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
                หน้านี้พร้อมต่อ receipt verification แล้ว
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.4rem] bg-white/70 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Expected proof</p>
                  <p className="mt-2 text-sm leading-[1.7] text-[#566156]">
                    ใบเสร็จจาก {scenario.title} ใน {scenario.district}
                  </p>
                </div>
                <div className="rounded-[1.4rem] bg-white/70 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Truth signal</p>
                  <p className="mt-2 text-sm leading-[1.7] text-[#566156]">
                    ใช้ราคา net + เวลา + platform เป็น source of truth
                  </p>
                </div>
                <div className="rounded-[1.4rem] bg-white/70 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Member loop</p>
                  <p className="mt-2 text-sm leading-[1.7] text-[#566156]">
                    favorite, alert และ receipt points ยังคงเชื่อมเข้ากับ store เดิม
                  </p>
                </div>
              </div>
            </article>
          </div>

          <CompareDetailInteractions scenario={scenario} />
        </section>

        <section className="mt-8">
          <ReviewPanel scenarioId={scenario.id} scenarioTitle={scenario.title} />
        </section>

        <section className="surface-dark mt-8 rounded-[2.4rem] bg-[#111111] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.18em] text-white/55">Related compare pages</p>
              <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
                Internal links สำหรับ SEO cluster
              </h2>
              <p className="type-body mt-3 text-white/72">
                แตกไปยังเมนูอื่นเพื่อสร้าง cluster ของ compare intent และเพิ่ม internal discovery
              </p>
            </div>
            <Link
              href="/compare"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111111]"
            >
              Browse all compare pages
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {relatedScenarios.map((item) => {
              const itemBestOffer = getBestOffer(item);

              return (
                <Link
                  key={item.id}
                  href={getScenarioHref(item)}
                  className="rounded-[1.7rem] border border-white/10 bg-white/7 p-5 transition-colors hover:bg-white/10"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">{item.district}</p>
                  <h3 className="type-heading-md mt-2 font-display font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="font-display mt-2 text-sm leading-[1.7] text-white/68">{item.restaurant}</p>
                  <p className="mt-4 text-sm font-semibold text-[#c8ff89]">
                    Starts at {formatBaht(itemBestOffer.totalPrice)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
