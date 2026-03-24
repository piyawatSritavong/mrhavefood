import {
  getBestOffer,
  getOfferForPlatform,
  type CompareScenario,
  type PlatformKey,
} from "@/lib/home-content";
import { getDistrictSlug, getScenarioSlug } from "@/lib/compare-routes";
import { getSeededScenarios } from "@/lib/mock-product-content";

function getScenarioDataset() {
  return getSeededScenarios();
}

export async function getAllCompareScenarios() {
  return getScenarioDataset();
}

export async function getCompareScenarioById(id: string) {
  return getScenarioDataset().find((scenario) => scenario.id === id) ?? null;
}

export async function getCompareScenarioByRoute(params: {
  district: string;
  slug: string;
}) {
  return getScenarioDataset().find(
    (scenario) =>
      getDistrictSlug(scenario.district) === params.district &&
      getScenarioSlug(scenario) === params.slug,
  ) ?? null;
}

export async function getCompareIndexStats() {
  const scenarios = getScenarioDataset();

  return {
    scenarioCount: scenarios.length,
    platformCount: 3,
    districtCount: new Set(scenarios.map((scenario) => scenario.district)).size,
  };
}

export function getScenarioBestOffer(scenario: CompareScenario) {
  return getBestOffer(scenario);
}

export function getScenarioOffer(
  scenario: CompareScenario,
  platform: PlatformKey,
) {
  return getOfferForPlatform(scenario, platform);
}
