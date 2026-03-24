"use client";

import Link from "next/link";
import { useDeferredValue } from "react";

import { TrackedDeepLinkButton } from "@/components/affiliate/tracked-deep-link-button";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { formatBaht, getBestOffer, type CompareScenario } from "@/lib/home-content";
import { getScenarioHref } from "@/lib/compare-routes";
import { useHomeStore } from "@/lib/stores/use-home-store";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type CompareIndexClientProps = {
  scenarios: CompareScenario[];
};

export function CompareIndexClient({
  scenarios,
}: CompareIndexClientProps) {
  const searchQuery = useHomeStore((state) => state.searchQuery);
  const selectedScenarioId = useHomeStore((state) => state.selectedScenarioId);
  const favoriteScenarioIds = useHomeStore((state) => state.favoriteScenarioIds);
  const setSearchQuery = useHomeStore((state) => state.setSearchQuery);
  const setSelectedScenario = useHomeStore((state) => state.setSelectedScenario);

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredScenarios = scenarios.filter((scenario) => {
    if (!deferredQuery.trim()) {
      return true;
    }

    const haystack = [
      scenario.title,
      scenario.restaurant,
      scenario.district,
      scenario.cuisine,
      ...scenario.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(deferredQuery.trim().toLowerCase());
  });

  return (
    <div className="mt-10 grid gap-6">
      <div className="glass-panel rounded-[2rem] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Search SEO pages</p>
            <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
              Compare routes พร้อมใช้งานแล้ว
            </h2>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#111111]">
            {filteredScenarios.length} indexed pages
          </span>
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-[#111111]/10 bg-white px-4 py-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ค้นหาเมนู ย่าน หรือ tag เช่น Ari, dessert, noodle"
            className="w-full bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#818977]"
          />
        </div>
      </div>

      <BentoGrid className="auto-rows-[minmax(24rem,auto)] lg:grid-cols-2">
        {filteredScenarios.map((scenario) => {
          const bestOffer = getBestOffer(scenario);
          const isSelected = selectedScenarioId === scenario.id;
          const isSaved = favoriteScenarioIds.includes(scenario.id);

          return (
            <BentoGridItem
              key={scenario.id}
              className={isSelected ? "border-[#111111]/14 shadow-[0_26px_90px_rgba(31,28,22,0.14)]" : ""}
              contentClassName="h-full"
              title={
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      {scenario.district}
                    </span>
                    {isSaved ? (
                      <span className="rounded-full bg-[#eef5dd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#48612e]">
                        favorite
                      </span>
                    ) : null}
                    {isSelected ? (
                      <span className="rounded-full bg-[#fff1d7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c5a16]">
                        active
                      </span>
                    ) : null}
                  </div>
                  <h3 className="type-heading-lg mt-4 font-display font-semibold text-[#111111]">
                    {scenario.title}
                  </h3>
                </div>
              }
              description={
                <span>
                  <span className="font-display text-[#111111]">{scenario.restaurant}</span> • {scenario.summary}
                </span>
              }
              header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Best net price</p>
                    <p className="type-stat mt-2 text-[#111111]">{formatBaht(bestOffer.totalPrice)}</p>
                    <p className="mt-1 text-sm text-[#566156]">{bestOffer.note}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedScenario(scenario.id)}
                    className={classes(
                      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all",
                      isSelected
                        ? "bg-[#111111] text-white"
                        : "border border-[#111111]/10 bg-white text-[#111111]",
                    )}
                  >
                    {isSelected ? "Active scenario" : "Set active"}
                  </button>
                </div>
              }
              footer={
                <div className="mt-auto space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {scenario.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#111111]/8 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#60685c]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {scenario.platforms.map((offer) => (
                      <div key={offer.platform} className="rounded-[1.25rem] bg-white/70 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">
                          {offer.platform}
                        </p>
                        <p className="type-heading-md type-price mt-2 font-data text-[#111111]">
                          {formatBaht(offer.totalPrice)}
                        </p>
                        <p className="mt-1 text-sm text-[#566156]">{offer.etaMinutes} min</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={getScenarioHref(scenario)}
                      onClick={() => setSelectedScenario(scenario.id)}
                      className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
                    >
                      Open compare page
                    </Link>
                    <TrackedDeepLinkButton
                      platform={bestOffer.platform}
                      scenarioId={scenario.id}
                      surface="compare-index"
                      className="inline-flex items-center justify-center rounded-full border border-[#111111]/10 bg-[#fff9ef] px-5 py-3 text-sm font-semibold text-[#111111]"
                    >
                      Launch best app
                    </TrackedDeepLinkButton>
                  </div>
                </div>
              }
            />
          );
        })}
      </BentoGrid>
    </div>
  );
}
