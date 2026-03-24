import { HomeLiveDealsSection } from "@/components/home/home-live-deals-section";
import { HomeMainSection } from "@/components/home/home-main-section";
import { HomeOrderSection } from "@/components/home/home-order-section";
import { HomeShell } from "@/components/home/home-shell";
import { HomeWorthItSection } from "@/components/home/home-worth-it-section";
import type { CompareScenario } from "@/lib/home-content";
import {
  buildLiveDealItems,
  buildOutboundOrderStats,
  getFeaturedWorthScenario,
} from "@/lib/home-view-models";
import { buildPersonalizedRoutePlan } from "@/lib/route-engine";

type HomePageProps = {
  scenarios: CompareScenario[];
};

export function HomePage({
  scenarios,
}: HomePageProps) {
  if (!scenarios.length) {
    return null;
  }

  const podiumOrderStats = buildOutboundOrderStats(scenarios);
  const liveDealItems = buildLiveDealItems(scenarios);
  const routePlan = buildPersonalizedRoutePlan({
    favoriteScenarioIds: [],
    priceAlerts: [],
    scenarios,
  });
  const featuredWorthScenario = getFeaturedWorthScenario(scenarios);

  if (!featuredWorthScenario) {
    return null;
  }

  return (
    <HomeShell>
      <HomeMainSection scenarios={scenarios} />
      <HomeOrderSection
        podiumOrderStats={podiumOrderStats}
        scenarios={scenarios}
      />
      <HomeLiveDealsSection
        liveDealItems={liveDealItems}
        scenarios={scenarios}
      />
      <HomeWorthItSection
        featuredScenario={featuredWorthScenario.scenario}
        featuredScenarioOffer={featuredWorthScenario.offer}
        routePlan={routePlan}
        worthItIndex={featuredWorthScenario.worthItIndex}
      />
    </HomeShell>
  );
}
