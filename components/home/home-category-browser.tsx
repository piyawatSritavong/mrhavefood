import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon, GridIcon, MapPinIcon, TruckIcon } from "@/components/ui/icons";
import {
  getPlatformMeta,
  homeCategorySections,
  type HomeCategorySection,
  type HomeQuickFilterId,
  type HomeZoneId,
  getZoneLabel,
  getWinningOffer,
} from "@/lib/home-experience";
import { formatBaht } from "@/lib/home-content";

type HomeCategoryBrowserProps = {
  activeQuickFilter: HomeQuickFilterId;
  sections: HomeCategorySection[];
  selectedZoneId: HomeZoneId;
};

export function HomeCategoryBrowser({
  activeQuickFilter,
  sections,
  selectedZoneId,
}: HomeCategoryBrowserProps) {
  const totalItems = sections.reduce(
    (total, section) => total + section.items.length,
    0,
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 rounded-[28px] border border-[#e3dddd] bg-white p-5 shadow-[0_12px_40px_rgba(0,67,124,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--brand-primary)]">
            Showing winners
          </p>
          <p className="mt-1 text-sm leading-6 text-[#5c6e7f]">
            {totalItems.toLocaleString("en-US")} cards ถูกคัดจาก {homeCategorySections.length} หมวด โดยเลือกเฉพาะแพลตฟอร์มที่ถูกที่สุดในแต่ละเมนู
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{getZoneLabel(selectedZoneId)}</Badge>
          <Badge variant="accent">
            {activeQuickFilter === "all" ? "All deals" : activeQuickFilter.replaceAll("-", " ")}
          </Badge>
        </div>
      </div>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="sm:snap-start space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Badge variant="outline" className="gap-1.5">
                <GridIcon className="size-3.5" />
                {section.pixelLabel}
              </Badge>
              <div className="space-y-2">
                <h3 className="font-display text-[1.4rem] leading-tight text-(--brand-primary) sm:text-[1.7rem]">
                  {section.title}
                </h3>
                <p className="max-w-2xl text-xs leading-6 text-[#5c6e7f] sm:text-sm sm:leading-7">
                  {section.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:snap-none sm:overflow-visible sm:pb-0 xl:grid-cols-4">
            {section.items.map((item) => {
              const winningOffer = getWinningOffer(item);
              const platformMeta = getPlatformMeta(winningOffer.platform);
              const savings = winningOffer.originalPrice - winningOffer.totalPrice;

              return (
                <Card key={item.id} className="w-[78vw] max-w-xs shrink-0 snap-start overflow-hidden border-[#e2dddd] sm:w-auto sm:max-w-none">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.menuName}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <Badge variant="accent" className="absolute right-4 top-4">
                      คุ้มที่สุด
                    </Badge>
                    <div className="absolute left-5 top-4 inline-flex rounded-2xl bg-white/80 px-3 py-1.5 text-sm font-display text-(--brand-primary) shadow-sm">
                      {item.pixelLabel}
                    </div>
                    <div className="absolute bottom-4 left-5">
                      <Badge variant={`platform-${winningOffer.platform}` as const}>
                        {platformMeta.name}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="space-y-5 p-5">
                    <div className="space-y-2">
                      <h4 className="font-display text-[1rem] leading-[1.3] text-(--brand-primary) sm:text-[1.15rem]">
                        {item.menuName}
                      </h4>
                      <p className="text-sm leading-6 text-[#5c6e7f]">
                        {item.restaurant}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase text-[#8a98a7]">
                            ราคาถูกสุดตอนนี้
                          </p>
                          <p className="mt-1 font-data text-[1.75rem] font-semibold leading-none text-(--brand-accent) sm:text-[2rem]">
                            {formatBaht(winningOffer.totalPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#8a98a7] line-through">
                            {formatBaht(winningOffer.originalPrice)}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-[#2f7f57]">
                            ประหยัด {formatBaht(savings)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#6a7a89]">
                        <span className="inline-flex items-center gap-1">
                          <MapPinIcon className="size-3.5" />
                          {getZoneLabel(item.zoneId)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <TruckIcon className="size-3.5" />
                          {winningOffer.etaMinutes} นาที
                        </span>
                        {winningOffer.freeDelivery ? (
                          <span className="rounded-full bg-[#eef7f2] px-2 py-1 text-[#236347]">
                            ส่งฟรี
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <Link href="/compare" className="block">
                      <Button variant="accent" size="default" className="w-full rounded-2xl">
                        ดูดีลนี้
                        <ArrowRightIcon className="size-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
