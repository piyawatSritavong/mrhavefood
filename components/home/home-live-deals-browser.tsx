"use client";

import { useDeferredValue } from "react";

import { TrackedDeepLinkButton } from "@/components/affiliate/tracked-deep-link-button";
import { cn } from "@/lib/cn";
import {
  comparisonApps,
  formatBaht,
  getBestOffer,
  getOfferForPlatform,
  type CompareScenario,
} from "@/lib/home-content";
import { useHomeStore } from "@/lib/stores/use-home-store";

type HomeLiveDealsBrowserProps = {
  scenarios: CompareScenario[];
};

function findScenarioById(scenarios: CompareScenario[], scenarioId: string) {
  return scenarios.find((scenario) => scenario.id === scenarioId);
}

export function HomeLiveDealsBrowser({
  scenarios,
}: HomeLiveDealsBrowserProps) {
  const searchQuery = useHomeStore((state) => state.searchQuery);
  const selectedScenarioId = useHomeStore((state) => state.selectedScenarioId);
  const selectedPlatform = useHomeStore((state) => state.selectedPlatform);
  const favoriteScenarioIds = useHomeStore((state) => state.favoriteScenarioIds);
  const priceAlerts = useHomeStore((state) => state.priceAlerts);
  const setSearchQuery = useHomeStore((state) => state.setSearchQuery);
  const setSelectedScenario = useHomeStore((state) => state.setSelectedScenario);
  const setSelectedPlatform = useHomeStore((state) => state.setSelectedPlatform);
  const toggleFavoriteScenario = useHomeStore((state) => state.toggleFavoriteScenario);
  const createPriceAlert = useHomeStore((state) => state.createPriceAlert);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const defaultScenario = scenarios[0];

  if (!defaultScenario) {
    return null;
  }

  const filteredScenarios = scenarios.filter((scenario) => {
    if (!deferredSearchQuery.trim()) {
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

    return haystack.includes(deferredSearchQuery.trim().toLowerCase());
  });

  const visibleScenarios = filteredScenarios.slice(0, 4);
  const selectedScenario =
    findScenarioById(scenarios, selectedScenarioId) ?? visibleScenarios[0] ?? defaultScenario;
  const scenarioOffers = [...selectedScenario.platforms].sort(
    (offerA, offerB) => offerA.totalPrice - offerB.totalPrice,
  );
  const bestOffer = getBestOffer(selectedScenario);
  const selectedOffer =
    getOfferForPlatform(selectedScenario, selectedPlatform) ?? bestOffer;
  const selectedPlatformMeta =
    comparisonApps.find((app) => app.key === selectedOffer.platform) ??
    comparisonApps[0];
  const selectedScenarioIsFavorite = favoriteScenarioIds.includes(selectedScenario.id);
  const scenarioAlerts = priceAlerts.filter(
    (alert) => alert.scenarioId === selectedScenario.id,
  );
  const alertPresets = Array.from(
    new Set(
      [bestOffer.totalPrice - 8, bestOffer.totalPrice - 16, bestOffer.totalPrice - 24].filter(
        (price) => price > 79,
      ),
    ),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="soft-card rounded-[2rem] p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h3 className="type-heading-lg text-[#111111]">
              แนะนำเมนูสุดคุ้ม
            </h3>
          </div>
          <button
            type="button"
            onClick={() => toggleFavoriteScenario(selectedScenario.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-all",
              selectedScenarioIsFavorite
                ? "bg-[#111111] text-white"
                : "border border-[#111111]/10 bg-white text-[#111111]",
            )}
          >
            {selectedScenarioIsFavorite ? "saved" : "save favorite"}
          </button>
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-[#111111]/10 bg-white px-4 py-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ค้นหาเมนู, ร้าน หรือย่าน"
            className="w-full bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#7f8879]"
          />
        </div>

        <div className="mt-5 space-y-3">
          {visibleScenarios.map((scenario) => {
            const scenarioBestOffer = getBestOffer(scenario);
            const isSelected = selectedScenario.id === scenario.id;

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenario(scenario.id)}
                className={cn(
                  "flex w-full items-start justify-between gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition-all",
                  isSelected
                    ? "border-[#111111]/18 bg-[#fff8e8] shadow-[0_16px_40px_rgba(31,28,22,0.08)]"
                    : "border-[#111111]/8 bg-white/72 hover:bg-white",
                )}
              >
                <div>
                  <p className="type-heading-sm text-[#111111]">{scenario.title}</p>
                  <p className="mt-1 text-sm text-[#5d6258]">
                    {scenario.restaurant} • {scenario.district}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#7a836f]">
                    {scenario.tags.slice(0, 3).join(" • ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="type-heading-md type-price text-[#111111]">
                    {formatBaht(scenarioBestOffer.totalPrice)}
                  </p>
                  <p className="mt-1 text-sm text-[#5d6258]">
                    {scenarioBestOffer.note}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="dark-panel rounded-[2rem] p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="section-kicker text-white/60">Selected deal</p>
            <h3 className="type-heading-lg text-white">{selectedScenario.title}</h3>
          </div>
          <span className="rounded-full bg-[#c8ff89] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#1f2813]">
            {selectedScenario.district}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {scenarioOffers.map((offer) => {
            const platformMeta =
              comparisonApps.find((app) => app.key === offer.platform) ??
              comparisonApps[0];

            return (
              <button
                key={offer.platform}
                type="button"
                onClick={() => setSelectedPlatform(offer.platform)}
                className={cn(
                  "flex w-full items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                  selectedOffer.platform === offer.platform
                    ? "border-white/18 bg-white/12"
                    : "border-white/10 bg-white/7",
                )}
              >
                <div>
                  <p className="text-sm text-white/62">{platformMeta.name}</p>
                  <p className="type-heading-md type-price mt-1 text-white">
                    {formatBaht(offer.totalPrice)}
                  </p>
                </div>
                <div className="text-right text-sm text-white/74">
                  <p>{offer.note}</p>
                  <p className="mt-1">{offer.etaMinutes} min</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/7 p-4">
          <p className="type-body text-white/78">
            ตอนนี้ราคาที่เลือกคือ {formatBaht(selectedOffer.totalPrice)} บน{" "}
            {selectedPlatformMeta.name} โดยมีค่าส่ง {formatBaht(selectedOffer.deliveryFee)}{" "}
            และส่วนลด {formatBaht(selectedOffer.discount)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {alertPresets.map((targetPrice) => {
            const alreadyExists = scenarioAlerts.some(
              (alert) =>
                alert.platform === selectedOffer.platform &&
                alert.targetPrice === targetPrice,
            );

            return (
              <button
                key={targetPrice}
                type="button"
                onClick={() =>
                  createPriceAlert({
                    scenarioId: selectedScenario.id,
                    platform: selectedOffer.platform,
                    targetPrice,
                  })
                }
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition-all",
                  alreadyExists
                    ? "bg-[#c8ff89] text-[#1f2813]"
                    : "border border-white/10 bg-white/8 text-white",
                )}
              >
                Alert {formatBaht(targetPrice)}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <TrackedDeepLinkButton
            platform={selectedOffer.platform}
            scenarioId={selectedScenario.id}
            surface="home"
            className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#111111]"
          >
            {selectedPlatformMeta.cta}
          </TrackedDeepLinkButton>
        </div>
      </div>
    </div>
  );
}
