import { HomeFooterSection } from "@/components/home/home-footer-section";
import { HomeMarqueeSection } from "@/components/home/home-marquee-section";
import { HomePromoHero } from "@/components/home/home-promo-hero";
import { HomePlatformSection } from "@/components/home/home-platform-section";
import { HomeRestaurantsSection } from "@/components/home/home-restaurants-section";
import { HomeShell } from "@/components/home/home-shell";
import { fallbackPromotions } from "@/lib/promotions-data";
import type { Promotion, Restaurant } from "@/lib/supabase";

type HomePageProps = {
  promotions: Promotion[];
  restaurants?: Restaurant[];
};

export function HomePage({ promotions, restaurants }: HomePageProps) {
  return (
    <HomeShell>
      <HomePromoHero promotions={promotions} />
      <HomePlatformSection promotions={promotions} />
      <HomeMarqueeSection />
      <HomeRestaurantsSection />
      <HomeFooterSection />
    </HomeShell>
  );
}
