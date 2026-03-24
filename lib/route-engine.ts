import {
  getBestOffer,
  getOfferForPlatform,
  type CompareScenario,
  type PlatformKey,
} from "@/lib/home-content";
import type { PersonalizedRouteStop } from "@/lib/product-types";
import type { PriceAlert } from "@/lib/stores/home-store-types";

const routeTimeSlots: Array<{
  time: string;
  preferredTags: string[];
}> = [
  { time: "10:45", preferredTags: ["drink", "dessert", "milk"] },
  { time: "12:30", preferredTags: ["lunch", "rice", "chicken-rice"] },
  { time: "18:40", preferredTags: ["noodle", "fried", "budget"] },
  { time: "21:10", preferredTags: ["late-night", "spicy", "dessert"] },
];

function pickPlatformForScenario(
  scenario: CompareScenario,
  alerts: PriceAlert[],
): PlatformKey {
  const matchingAlerts = alerts.filter((alert) => alert.scenarioId === scenario.id && alert.enabled);

  if (matchingAlerts.length) {
    return matchingAlerts.sort((a, b) => a.targetPrice - b.targetPrice)[0].platform;
  }

  return getBestOffer(scenario).platform;
}

export function buildPersonalizedRoutePlan(input: {
  favoriteScenarioIds: string[];
  priceAlerts: PriceAlert[];
  scenarios: CompareScenario[];
}) {
  const pool = input.favoriteScenarioIds.length
    ? input.scenarios.filter((scenario) => input.favoriteScenarioIds.includes(scenario.id))
    : input.scenarios;

  return routeTimeSlots.map((slot, index) => {
    const scenario =
      pool.find((candidate) =>
        candidate.tags.some((tag) => slot.preferredTags.includes(tag)),
      ) ?? pool[index % pool.length];
    const platform = pickPlatformForScenario(scenario, input.priceAlerts);
    const offer = getOfferForPlatform(scenario, platform) ?? getBestOffer(scenario);
    const worstOffer = [...scenario.platforms].sort(
      (offerA, offerB) => offerB.totalPrice - offerA.totalPrice,
    )[0];

    return {
      id: `${scenario.id}-${slot.time}`,
      scenarioId: scenario.id,
      district: scenario.district,
      item: scenario.title,
      time: slot.time,
      saving: Math.max(8, worstOffer.totalPrice - offer.totalPrice),
      reason:
        platform === getBestOffer(scenario).platform
          ? `best net price on ${platform}`
          : `platform chosen from your active alert on ${platform}`,
    } satisfies PersonalizedRouteStop;
  });
}
