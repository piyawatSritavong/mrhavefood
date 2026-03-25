import { HomeCategoriesSection } from "@/components/home/home-categories-section";
import { HomeDiscoverSection } from "@/components/home/home-discover-section";
import { HomeFooterSection } from "@/components/home/home-footer-section";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { HomeShell } from "@/components/home/home-shell";
import {
  getFilteredCategorySections,
  type HomeQuickFilterId,
  type HomeZoneId,
} from "@/lib/home-experience";

type HomePageProps = {
  activeQuickFilter: HomeQuickFilterId;
  selectedZoneId: HomeZoneId;
};

export function HomePage({
  activeQuickFilter,
  selectedZoneId,
}: HomePageProps) {
  const sections = getFilteredCategorySections(selectedZoneId, activeQuickFilter);

  return (
    <HomeShell>
      <HomeHeroSection selectedZoneId={selectedZoneId} />
      <HomeDiscoverSection
        activeQuickFilter={activeQuickFilter}
        selectedZoneId={selectedZoneId}
      />
      <HomeCategoriesSection
        activeQuickFilter={activeQuickFilter}
        sections={sections}
        selectedZoneId={selectedZoneId}
      />
      <HomeFooterSection />
    </HomeShell>
  );
}
