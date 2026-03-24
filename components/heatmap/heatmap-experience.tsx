"use client";

import Link from "next/link";

import { HeatmapCanvas } from "@/components/heatmap/heatmap-canvas";
import { formatBaht, type CompareScenario } from "@/lib/home-content";
import { buildPersonalizedRoutePlan } from "@/lib/route-engine";
import { useHomeStore } from "@/lib/stores/use-home-store";

type HeatZone = {
  accent?: string;
  delta: string;
  name: string;
  score: string;
};

type HeatmapExperienceProps = {
  scenarios: CompareScenario[];
  zones: HeatZone[];
};

export function HeatmapExperience({
  scenarios,
  zones,
}: HeatmapExperienceProps) {
  const favoriteScenarioIds = useHomeStore((state) => state.favoriteScenarioIds);
  const priceAlerts = useHomeStore((state) => state.priceAlerts);
  const routePlan = buildPersonalizedRoutePlan({
    favoriteScenarioIds,
    priceAlerts,
    scenarios,
  });
  const totalSaving = routePlan.reduce((total, stop) => total + stop.saving, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
      <HeatmapCanvas zones={zones} />

      <div className="grid gap-6">
        <section className="dark-panel rounded-[2rem] p-6 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/55">Personal route</p>
              <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
                daily worth-it route
              </h2>
            </div>
            <span className="rounded-full bg-[#c8ff89] px-4 py-2 text-sm font-semibold text-[#1f2813]">
              Save {formatBaht(totalSaving)}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {routePlan.map((stop) => (
              <article
                key={stop.id}
                className="rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                      {stop.time}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{stop.item}</p>
                      <p className="mt-1 text-sm text-white/60">
                        {stop.district} • {stop.reason}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#c8ff89]">
                    Save {formatBaht(stop.saving)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">What changes next</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
            พร้อมต่อยอดเป็น live district intelligence
          </h2>
          <div className="mt-6 space-y-3">
            {[
              "canvas scene นี้เป็น 3D/isometric heatmap จริงโดยไม่พึ่ง external package เพิ่ม",
              "route engine ใช้ favorites และ price alerts จาก Zustand แทน route mock ตายตัว",
              "พร้อมเปลี่ยน source ของ scores และ routes จาก mock ไป Supabase เมื่อ data layer พร้อม",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.3rem] bg-white/80 px-4 py-4 text-sm text-[#566156]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/compare"
              className="rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
            >
              Open compare routes
            </Link>
            <Link
              href="/member"
              className="rounded-full border border-[#111111]/10 bg-white px-5 py-3 text-sm font-semibold text-[#111111]"
            >
              Back to member dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
