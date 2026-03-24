import { compareScenarios, type CompareScenario } from "@/lib/home-content";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDistrictSlug(district: string) {
  return slugify(district);
}

export function getScenarioSlug(scenario: CompareScenario) {
  return scenario.id;
}

export function getScenarioHref(scenario: CompareScenario) {
  return `/compare/${getDistrictSlug(scenario.district)}/${getScenarioSlug(scenario)}`;
}

export function findScenarioByRoute(params: {
  district: string;
  slug: string;
}) {
  return compareScenarios.find(
    (scenario) =>
      getDistrictSlug(scenario.district) === params.district &&
      getScenarioSlug(scenario) === params.slug,
  );
}
