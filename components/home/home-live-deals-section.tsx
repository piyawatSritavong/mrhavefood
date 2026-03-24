import { HomeLiveDealsBrowser } from "@/components/home/home-live-deals-browser";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import type { CompareScenario } from "@/lib/home-content";
import type { HomeLiveDealItem } from "@/lib/home-view-models";

type HomeLiveDealsSectionProps = {
  liveDealItems: HomeLiveDealItem[];
  scenarios: CompareScenario[];
};

export function HomeLiveDealsSection({
  liveDealItems,
  scenarios,
}: HomeLiveDealsSectionProps) {
  return (
    <section
      id="live-deals"
      data-section-id="live-deals"
      className="section-shell home-section-live scroll-mt-24"
    >
      <div className="section-frame max-w-7xl space-y-10 sm:space-y-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="type-display-page text-[#111111]">
            Live Deals สุดคุ้ม แบบ Real-Time
          </h2>
          <p className="type-body text-[#556054]">
            สั่งตามได้เลย Rush Hours สุดปังตลอด รีวิวทุกเมนู กับโปรสุดคุ้มที่ทุกคนสั่งตอนนี้
          </p>
        </div>

        <InfiniteMovingCards items={liveDealItems} />

        <HomeLiveDealsBrowser scenarios={scenarios} />
      </div>
    </section>
  );
}
