import { ArrowRightIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { platformMeta } from "@/lib/promotions-data";
import type { Promotion } from "@/lib/supabase";

type HomePlatformSectionProps = {
  promotions: Promotion[];
};

const thaiMonths = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

const platformOrder = ["GrabFood", "LINE MAN", "ShopeeFood", "Robinhood"];

const platformAbbr: Record<string, string> = {
  GrabFood: "GF",
  "LINE MAN": "LM",
  ShopeeFood: "SF",
  Robinhood: "RH",
};

export function HomePlatformSection({ promotions }: HomePlatformSectionProps) {
  const grouped = platformOrder.reduce<Record<string, Promotion[]>>((acc, platform) => {
    acc[platform] = promotions.filter((p) => p.platform === platform);
    return acc;
  }, {});

  return (
    <section
      id="platforms"
      data-section-id="platforms"
      className="w-full min-w-0 bg-(--brand-surface) px-3 py-4 sm:px-4 sm:py-6 lg:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-3">
        <div>
          {(() => { const d = new Date(); return (
            <Badge variant="secondary" className="mb-1.5 bg-gray-100 text-gray-500 hover:bg-gray-100">
              {`${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`}
            </Badge>
          ); })()}
          <h2 className="font-display text-base font-bold text-(--brand-primary)">
            โปรล่าสุด ทุกแพลตฟอร์ม
          </h2>
        </div>

        {/* 2×2 feature cards → 4-col on desktop */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {platformOrder.map((platform) => {
            const meta = platformMeta[platform];
            const items = grouped[platform] ?? [];
            if (!meta) return null;

            return (
              <a
                key={platform}
                href={meta.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1.5 rounded-xl p-3 transition-opacity hover:opacity-80"
                style={{ backgroundColor: meta.bg }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                    <p className="text-[11px] font-bold" style={{ color: meta.color }}>{platform}</p>
                  </div>
                  <ArrowRightIcon className="size-3 opacity-40" />
                </div>
                <p className="text-[11px] font-semibold leading-4" style={{ color: meta.textColor }}>
                  {items.length > 0 ? items[0].campaign_name : "ยังไม่มีโปรวันนี้"}
                </p>
                <p className="text-[10px] text-[#9aa5b1]">{items.length} โปรโมชั่น</p>
              </a>
            );
          })}
        </div>

        {/* Compact promo list */}
        <div className="space-y-1.5">
          {promotions.slice(0, 8).map((promo) => {
            const meta = platformMeta[promo.platform];
            if (!meta) return null;

            return (
              <a
                key={promo.id}
                href={meta.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#ebe7e7] bg-white p-2.5"
              >
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: meta.bg }}
                >
                  <span className="font-display text-[10px] font-black" style={{ color: meta.color }}>
                    {platformAbbr[promo.platform] ?? promo.platform.slice(0, 2)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-(--brand-primary)">{promo.campaign_name}</p>
                  {promo.conditions && (
                    <p className="text-[11px] text-[#5c6e7f]">{promo.conditions}</p>
                  )}
                </div>

                {promo.promo_code &&
                  promo.promo_code !== "ลดอัตโนมัติ ไม่ต้องใช้รหัส" &&
                  promo.promo_code !== "เก็บคูปองในแอป" && (
                    <div
                      className="shrink-0 rounded-md border border-dashed px-2 py-0.5"
                      style={{ borderColor: meta.color + "60" }}
                    >
                      <span
                        className="font-mono text-[10px] font-bold tracking-wider"
                        style={{ color: meta.color }}
                      >
                        {promo.promo_code}
                      </span>
                    </div>
                  )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
