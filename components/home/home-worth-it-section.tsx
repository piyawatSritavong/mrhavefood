import Link from "next/link";

import { HeatmapCanvas } from "@/components/heatmap/heatmap-canvas";
import { formatBaht, heatZones, type CompareScenario, type ScenarioPlatformOffer } from "@/lib/home-content";
import type { PersonalizedRouteStop } from "@/lib/product-types";

type HomeWorthItSectionProps = {
  featuredScenario: CompareScenario;
  featuredScenarioOffer: ScenarioPlatformOffer;
  routePlan: PersonalizedRouteStop[];
  worthItIndex: number;
};

export function HomeWorthItSection({
  featuredScenario,
  featuredScenarioOffer,
  routePlan,
  worthItIndex,
}: HomeWorthItSectionProps) {
  return (
    <section
      id="worth-it"
      data-section-id="worth-it"
      className="section-shell home-section-worth scroll-mt-24"
    >
      <div className="section-frame max-w-7xl space-y-10 sm:space-y-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="type-display-page text-[#111111]">
            คุ้มสุดในพื้นที่ของคุณ ปัก Map เลย
          </h2>
          <p className="type-body text-[#556054]">
            ค้นหาร้านสุดคุ้มในพื้นที่ของคุณ หา worth-it score และเส้นทางกินแบบประหยัดที่สุดในที่เดียว
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-start">
          <div className="pixel-map-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <h3 className="type-heading-lg text-[#111111]">
                  คุ้มที่สุดในพื้นที่ของคุณ
                </h3>
              </div>
              <span className="rounded-full bg-[#fff1d7] px-4 py-2 text-sm text-[#9b5e16]">
                Google Map Embed
              </span>
            </div>

            <div className="pixel-map-stage mt-8">
              <div className="pixel-map-grid" aria-hidden="true" />
              <div className="relative z-10 mx-auto max-w-[38rem]">
                <HeatmapCanvas zones={heatZones} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <article className="rounded-[1.7rem] border border-[#111111]/8 bg-[#f8fafb] px-5 py-5">
              <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                Featured worth-it score
              </p>
              <p className="type-stat mt-3 text-[#111111]">{worthItIndex}</p>
              <p className="type-heading-sm mt-2 text-[#111111]">
                {featuredScenario.title}
              </p>
              <p className="type-body mt-2 text-[#556054]">
                {featuredScenario.restaurant} • {featuredScenario.district} • ดีลสุทธิ{" "}
                {formatBaht(featuredScenarioOffer.totalPrice)}
              </p>
            </article>

            <div className="space-y-3">
              {routePlan.map((stop) => (
                <article
                  key={stop.id}
                  className="flex flex-col gap-3 rounded-[1.4rem] border border-[#111111]/8 bg-[#f8fafb] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm text-[#667161]">
                      {stop.time} • {stop.district}
                    </p>
                    <p className="type-heading-sm mt-1 text-[#111111]">{stop.item}</p>
                    <p className="type-body mt-1 text-[#556054]">{stop.reason}</p>
                  </div>
                  <span className="rounded-full bg-[#111111] px-4 py-2 text-sm text-white">
                    Save {formatBaht(stop.saving)}
                  </span>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/heatmap"
                className="rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
              >
                เปิดแผนที่เต็ม
              </Link>
              <Link
                href="/member"
                className="rounded-full border border-[#111111]/10 bg-white px-5 py-3 text-sm font-semibold text-[#111111]"
              >
                ดู route ของฉัน
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
