import { Badge } from "@/components/ui/badge";
import { HomeCategoryBrowser } from "@/components/home/home-category-browser";
import type {
  HomeCategorySection,
  HomeQuickFilterId,
  HomeZoneId,
} from "@/lib/home-experience";

type HomeCategoriesSectionProps = {
  activeQuickFilter: HomeQuickFilterId;
  sections: HomeCategorySection[];
  selectedZoneId: HomeZoneId;
};

export function HomeCategoriesSection({
  activeQuickFilter,
  sections,
  selectedZoneId,
}: HomeCategoriesSectionProps) {
  return (
    <section
      id="categories"
      data-section-id="categories"
      className="w-full min-w-0 bg-(--brand-surface) px-4 py-10 sm:snap-start sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <Badge variant="outline">Mr. All Foods</Badge>
          <div className="space-y-3">
            <h2 className="font-display text-[1.6rem] leading-tight text-(--brand-primary) sm:text-[2.1rem] lg:text-[2.5rem]">
              รวมที่สุดของทุกเมนู... คัดเฉพาะ 'โปรโมชั่น' ที่ราคาดีที่สุดมาให้คุณ
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[#5c6e7f] sm:text-base sm:leading-8">
              เลิกเสียเวลา! ให้ Auto-Filter เฉพาะแอปที่ให้ราคาถูกที่สุดของเมนูนั้นๆ มาโชว์ มั่นใจได้ว่าทุกคลิกคือ ความคุ้มค่า
            </p>
          </div>
        </div>

        <HomeCategoryBrowser
          activeQuickFilter={activeQuickFilter}
          sections={sections}
          selectedZoneId={selectedZoneId}
        />
      </div>
    </section>
  );
}
