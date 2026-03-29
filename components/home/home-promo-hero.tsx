"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { platformMeta, fallbackPromotions } from "@/lib/promotions-data";
import type { Promotion } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const thaiDays = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];

const foodCategories = [
  { id: "all", label: "ทั้งหมด", emoji: "🔥" },
  { id: "burger", label: "เบอร์เกอร์", emoji: "🍔" },
  { id: "pizza", label: "พิซซ่า", emoji: "🍕" },
  { id: "sushi", label: "ซูชิ", emoji: "🍱" },
  { id: "noodle", label: "ก๋วยเตี๋ยว", emoji: "🍜" },
  { id: "rice", label: "ข้าวจาน", emoji: "🍚" },
  { id: "chicken", label: "ไก่ทอด", emoji: "🍗" },
  { id: "bbq", label: "ปิ้งย่าง", emoji: "🥩" },
  { id: "seafood", label: "ซีฟู้ด", emoji: "🦐" },
  { id: "dimsum", label: "ติ่มซำ", emoji: "🥟" },
  { id: "ramen", label: "ราเมน", emoji: "🍝" },
  { id: "steak", label: "สเต็ก", emoji: "🥩" },
  { id: "salad", label: "สลัด", emoji: "🥗" },
  { id: "sandwich", label: "แซนวิช", emoji: "🥪" },
  { id: "hotdog", label: "ฮอทด็อก", emoji: "🌭" },
  { id: "dessert", label: "ของหวาน", emoji: "🍰" },
  { id: "icecream", label: "ไอศกรีม", emoji: "🍦" },
  { id: "coffee", label: "กาแฟ", emoji: "☕" },
  { id: "bubble-tea", label: "ชานม", emoji: "🧋" },
  { id: "smoothie", label: "สมูทตี้", emoji: "🥤" },
];

type HomePromoHeroProps = {
  promotions: Promotion[];
};

export function HomePromoHero({ promotions }: HomePromoHeroProps) {
  const items = promotions.length > 0 ? promotions : fallbackPromotions;
  const [current, setCurrent] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const slide = items[current];
  const meta = platformMeta[slide.platform] ?? {
    color: "#00437C",
    webUrl: "#",
  };

  const hasCode =
    slide.promo_code &&
    slide.promo_code !== "ลดอัตโนมัติ ไม่ต้องใช้รหัส" &&
    slide.promo_code !== "เก็บคูปองในแอป";

  return (
    <section id="main" data-section-id="main" className="w-full min-w-0">
      {/* Search bar */}
      <div className="px-3 pb-3 pt-2 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e3dddd] bg-white px-4 py-2.5">
            <SearchIcon className="size-5 shrink-0 text-[#8d8d8d]" />
            <span className="flex-1 text-[14px] text-[#8d8d8d]">
              ค้นหาโปรโมชั่น...
            </span>
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: meta.color + "18" }}
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: meta.color }}
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hero banner — full-image card */}
      <div className="px-3 pb-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ height: "clamp(250px, 52vw, 380px)" }}
          >
            {/* Background image */}
            <Image
              src="/assets/banner.png"
              alt=""
              fill
              className="object-cover transition-opacity duration-500"
              priority
            />

            {/* Dark + platform tint overlay */}
            <div
              className="absolute inset-0 transition-colors duration-500"
              style={{
                background: `linear-gradient(100deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.48) 55%, ${meta.color}55 100%)`,
              }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 lg:p-8">
              <div className="max-w-[85%] sm:max-w-[65%]">
                {/* Platform badge */}
                <div
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                  style={{ backgroundColor: meta.color + "33" }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                    {slide.platform}
                  </span>
                </div>

                {/* Promo code badge */}
                {hasCode && (
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] text-white/75">
                    ใช้โค้ด
                    <span
                      className="rounded-md px-2 py-0.5 font-mono text-[11px] font-bold"
                      style={{ backgroundColor: "white", color: meta.color }}
                    >
                      {slide.promo_code}
                    </span>
                    ตอนนี้เลย!
                  </div>
                )}

                {/* Campaign name */}
                <h2 className="font-display text-[clamp(1rem,3.5vw,1.75rem)] font-black uppercase leading-tight text-white">
                  {slide.campaign_name}
                </h2>

                {/* Conditions */}
                {slide.conditions && (
                  <p className="mt-1.5 text-[11px] text-white/60 sm:text-xs">
                    {slide.conditions}
                  </p>
                )}

                {/* CTA */}
                <a
                  href={meta.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center rounded-full px-5 py-2 text-[13px] font-bold"
                  style={{ backgroundColor: meta.color, color: "white" }}
                >
                  เปิด {slide.platform}
                </a>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === current ? "w-5 bg-white" : "w-1.5 bg-white/35",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Category */}
      <div className="bg-white px-3 pb-4 pt-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Badge variant="secondary" className="mb-1.5">{thaiDays[new Date().getDay()]}</Badge>
          <p className="mb-2 font-display text-base font-bold text-(--brand-primary)">
            กินอะไรดี มีโปรวันนี้ ?
          </p>
          <div className="flex gap-3 overflow-x-auto pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {foodCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex min-w-15 flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full text-xl transition-all duration-200",
                      isActive
                        ? "bg-[#e8f0f8] ring-2 ring-(--brand-primary)"
                        : "bg-[#f2f2f2]",
                    )}
                  >
                    {cat.emoji}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-semibold transition-colors",
                      isActive ? "text-(--brand-primary)" : "text-[#333]",
                    )}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
