"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { platformMeta } from "@/lib/promotions-data";
import type { Promotion } from "@/lib/supabase";

type HomePlatformSectionProps = {
  promotions: Promotion[];
};

const thaiMonths = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

function fmtDate(d: string): string {
  const dt = new Date(d);
  return `${dt.getDate()} ${thaiMonthsShort[dt.getMonth()]} ${String(dt.getFullYear() + 543).slice(2)}`;
}

function formatDateRange(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  if (start && end) return `${fmtDate(start)} – ${fmtDate(end)}`;
  if (start) return fmtDate(start);
  return fmtDate(end!);
}


const platformAbbr: Record<string, string> = {
  GrabFood: "GF",
  "LINE MAN": "LM",
  ShopeeFood: "SF",
  Robinhood: "RH",
};

export function HomePlatformSection({ promotions }: HomePlatformSectionProps) {
  const [adDuration, setAdDuration] = useState(25);
  useEffect(() => {
    const update = () => setAdDuration(window.innerWidth < 768 ? 16 : 25);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section
      id="platforms"
      data-section-id="platforms"
      className="w-full min-w-0 bg-(--brand-surface) px-3 py-8 sm:px-4 sm:py-12 lg:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Call to Action banner */}
        <div className="overflow-hidden rounded-2xl">
          <Image
            src="/assets/Call2ActionMrHaveFood.png"
            alt="MrHaveFood Call to Action"
            width={2606}
            height={246}
            className="w-full object-cover"
            style={{ height: "auto" }}
          />
        </div>

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

        {/* Compact promo list with ad banners every 7 items */}
        <div className="space-y-1.5">
          {promotions.map((promo, index) => {
            const meta = platformMeta[promo.platform];
            const showAd = index > 0 && index % 7 === 0;

            return (
              <div key={promo.id}>
                {showAd && (
                  <div className="overflow-hidden rounded-xl my-2 border border-dashed border-[#e3dddd]">
                    <motion.div
                      className="flex gap-8"
                      animate={{ x: ["0%", "-12.5%"] }}
                      transition={{ duration: adDuration, ease: "linear", repeat: Infinity }}
                    >
                      {Array(8).fill(null).map((_, i) => (
                        <Image
                          key={i}
                          src="/assets/miniAds.png"
                          alt="MrHaveFood Ads"
                          width={800}
                          height={120}
                          className="h-20 w-auto shrink-0 object-cover"
                        />
                      ))}
                    </motion.div>
                  </div>
                )}
                {meta && (
                  <a
                    href={meta.webUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
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
                        <p className="mt-0.5 text-[11px] text-[#5c6e7f]">{promo.conditions}</p>
                      )}
                      <div className="mt-1.5 flex items-end justify-between gap-2">
                        <Badge variant="secondary" className="whitespace-nowrap text-[10px] text-[#9aa5b1]">
                          {formatDateRange(promo.start_date, promo.end_date) ?? fmtDate(promo.fetched_at)}
                        </Badge>
                        {promo.promo_code &&
                          promo.promo_code !== "ลดอัตโนมัติ ไม่ต้องใช้รหัส" &&
                          promo.promo_code !== "เก็บคูปองในแอป" && (
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px] font-bold tracking-wider"
                              style={{ borderColor: meta.color, color: meta.color }}
                            >
                              {promo.promo_code}
                            </Badge>
                          )}
                      </div>
                    </div>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
