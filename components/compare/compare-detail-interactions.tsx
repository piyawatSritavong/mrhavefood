"use client";

import Link from "next/link";
import { useEffect } from "react";

import { TrackedDeepLinkButton } from "@/components/affiliate/tracked-deep-link-button";
import {
  comparisonApps,
  formatBaht,
  getBestOffer,
  getOfferForPlatform,
  type CompareScenario,
} from "@/lib/home-content";
import { useHomeStore } from "@/lib/stores/use-home-store";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type CompareDetailInteractionsProps = {
  scenario: CompareScenario;
};

export function CompareDetailInteractions({
  scenario,
}: CompareDetailInteractionsProps) {
  const selectedPlatform = useHomeStore((state) => state.selectedPlatform);
  const favoriteScenarioIds = useHomeStore((state) => state.favoriteScenarioIds);
  const priceAlerts = useHomeStore((state) => state.priceAlerts);
  const setSelectedScenario = useHomeStore((state) => state.setSelectedScenario);
  const setSelectedPlatform = useHomeStore((state) => state.setSelectedPlatform);
  const toggleFavoriteScenario = useHomeStore((state) => state.toggleFavoriteScenario);
  const createPriceAlert = useHomeStore((state) => state.createPriceAlert);
  const removePriceAlert = useHomeStore((state) => state.removePriceAlert);
  const togglePriceAlertEnabled = useHomeStore((state) => state.togglePriceAlertEnabled);

  useEffect(() => {
    setSelectedScenario(scenario.id);
  }, [scenario.id, setSelectedScenario]);

  const bestOffer = getBestOffer(scenario);
  const selectedOffer =
    getOfferForPlatform(scenario, selectedPlatform) ?? bestOffer;
  const selectedMeta =
    comparisonApps.find((app) => app.key === selectedOffer.platform) ??
    comparisonApps[0];
  const isFavorite = favoriteScenarioIds.includes(scenario.id);
  const scenarioAlerts = priceAlerts.filter(
    (alert) => alert.scenarioId === scenario.id,
  );
  const alertPresets = Array.from(
    new Set(
      [bestOffer.totalPrice - 8, bestOffer.totalPrice - 16, bestOffer.totalPrice - 24].filter(
        (price) => price > 79,
      ),
    ),
  );

  return (
    <div className="grid gap-5">
      <div className="glass-panel rounded-[2rem] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Member actions</p>
            <h3 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
              Personal savings controls
            </h3>
          </div>
          <button
            type="button"
            onClick={() => toggleFavoriteScenario(scenario.id)}
            aria-pressed={isFavorite}
            className={classes(
              "rounded-full px-4 py-2 text-sm font-semibold transition-all",
              isFavorite
                ? "bg-[#111111] text-white"
                : "border border-[#111111]/10 bg-white text-[#111111]",
            )}
          >
            {isFavorite ? "Saved to favorites" : "Save favorite"}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {scenario.platforms
            .slice()
            .sort((offerA, offerB) => offerA.totalPrice - offerB.totalPrice)
            .map((offer) => {
              const meta =
                comparisonApps.find((app) => app.key === offer.platform) ??
                comparisonApps[0];

              return (
                <button
                  key={offer.platform}
                  type="button"
                  onClick={() => setSelectedPlatform(offer.platform)}
                  className={classes(
                    "flex w-full items-center justify-between gap-4 rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                    selectedOffer.platform === offer.platform
                      ? "border-[#111111]/18 bg-[#fff9ef] shadow-[0_16px_40px_rgba(31,28,22,0.08)]"
                      : "border-[#111111]/8 bg-white/70 hover:bg-white",
                  )}
                >
                  <div>
                    <p className="text-sm text-[#6b705f]">{meta.name}</p>
                    <p className="type-heading-md type-price mt-1 font-data text-[#111111]">
                      {formatBaht(offer.totalPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#566156]">{offer.etaMinutes} min</p>
                    <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.tone}`}>
                      {offer.note}
                    </span>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="surface-dark mt-5 rounded-[1.5rem] bg-[#111111] p-5 text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">Current focus</p>
          <p className="mt-3 text-base leading-[1.7] text-white/82">
            {selectedMeta.name} สุทธิ {formatBaht(selectedOffer.totalPrice)} จากอาหาร{" "}
            {formatBaht(selectedOffer.foodPrice)} + ค่าส่ง {formatBaht(selectedOffer.deliveryFee)} +
            service {formatBaht(selectedOffer.serviceFee)} - ส่วนลด {formatBaht(selectedOffer.discount)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <TrackedDeepLinkButton
              platform={selectedOffer.platform}
              scenarioId={scenario.id}
              surface="compare-detail"
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#111111]"
            >
              {selectedMeta.cta}
            </TrackedDeepLinkButton>
            <Link
              href="/#truth"
              className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Upload receipt proof
            </Link>
            <Link
              href="/rewards"
              className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Open rewards loop
            </Link>
          </div>
        </div>
      </div>

      <div className="dark-panel rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-white/55">Price drop alerts</p>
            <h3 className="type-heading-lg mt-2 font-display font-semibold text-white">
              Alert engine prototype
            </h3>
          </div>
          <span className="rounded-full bg-[#c8ff89] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1f2813]">
            {scenarioAlerts.length} active
          </span>
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
                    scenarioId: scenario.id,
                    platform: selectedOffer.platform,
                    targetPrice,
                  })
                }
                className={classes(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-all",
                  alreadyExists
                    ? "bg-[#c8ff89] text-[#1f2813]"
                    : "border border-white/12 bg-white/8 text-white",
                )}
              >
                Alert below {formatBaht(targetPrice)}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-3">
          {scenarioAlerts.length ? (
            scenarioAlerts.map((alert) => {
              const platformMeta =
                comparisonApps.find((app) => app.key === alert.platform) ??
                comparisonApps[0];

              return (
                <div
                  key={alert.id}
                  className="rounded-[1.3rem] border border-white/10 bg-white/7 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {platformMeta.name} • {formatBaht(alert.targetPrice)}
                      </p>
                      <p className="mt-1 text-sm text-white/62">
                        Active watcher for {scenario.title}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => togglePriceAlertEnabled(alert.id)}
                        className={classes(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          alert.enabled
                            ? "bg-[#c8ff89] text-[#1f2813]"
                            : "border border-white/12 text-white",
                        )}
                      >
                        {alert.enabled ? "On" : "Off"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePriceAlert(alert.id)}
                        className="rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-[1.3rem] border border-white/10 bg-white/7 px-4 py-4 text-sm text-white/72">
              ยังไม่มี alert สำหรับหน้านี้ ลองกด preset ด้านบน
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
