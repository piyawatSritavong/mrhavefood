"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { CopyCodeButton } from "@/components/ui/copy-code-button";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { formatPromoDates, thaiDays } from "@/lib/format-date";
import { getPlatformMeta, isRealPromoCode, platformTint, promoHref } from "@/lib/promotions-data";
import { SITE_TAGLINE } from "@/lib/site";
import { useHomeStore } from "@/lib/stores/use-home-store";
import type { Promotion } from "@/lib/supabase";

const SLIDE_MS = 5000;

const foodCategories = [
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
  { id: "salad", label: "สลัด", emoji: "🥗" },
  { id: "dessert", label: "ของหวาน", emoji: "🍰" },
  { id: "coffee", label: "กาแฟ", emoji: "☕" },
  { id: "bubble-tea", label: "ชานม", emoji: "🧋" },
];

function scrollToPlatforms() {
  document.getElementById("platforms")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

type HomePromoHeroProps = {
  promotions: Promotion[];
};

export function HomePromoHero({ promotions }: HomePromoHeroProps) {
  const searchQuery = useHomeStore((s) => s.searchQuery);
  const setSearchQuery = useHomeStore((s) => s.setSearchQuery);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const count = promotions.length;

  // Re-arms on every slide change, so a manual pick always gets a full interval.
  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const timer = setTimeout(() => setCurrent((prev) => (prev + 1) % count), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [current, count, paused, reducedMotion]);

  const go = (delta: number) => setCurrent((prev) => (prev + delta + count) % count);

  const slide = count > 0 ? promotions[current % count] : null;
  const meta = slide ? getPlatformMeta(slide.platform) : null;
  const href = slide ? promoHref(slide) : null;

  return (
    <section id="main" data-section-id="main" className="w-full min-w-0">
      {/* Value proposition + search */}
      <div className="px-3 pb-3 pt-2 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl leading-snug text-brand-primary sm:text-2xl lg:text-3xl">{SITE_TAGLINE}</h1>
            <p className="text-sm text-ink-muted sm:text-base">
              เช็กโค้ดและโปรล่าสุดก่อนสั่ง ประหยัดทุกมื้อ — อัปเดตทุกวัน
            </p>
          </div>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              scrollToPlatforms();
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-border bg-surface px-4 focus-within:border-brand-primary">
              <SearchIcon className="size-5 shrink-0 text-ink-soft" />
              <span className="sr-only">ค้นหาโปรโมชั่น</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchQuery("");
                }}
                placeholder="ค้นหาโปร เช่น GrabFood, KBank, ขั้นต่ำ 200"
                maxLength={60}
                enterKeyHint="search"
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft [&::-webkit-search-cancel-button]:hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="ล้างคำค้นหา"
                  className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ink-soft hover:text-brand-primary"
                >
                  <CloseIcon className="size-4" />
                </button>
              )}
            </label>
            <button type="submit" className={buttonClasses({ size: "lg", className: "sm:w-auto" })}>
              ดูโปรทั้งหมด
            </button>
          </form>
        </div>
      </div>

      {/* Hero banner — current promotion */}
      <div className="px-3 pb-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="โปรโมชั่นแนะนำ"
            className="relative h-[clamp(260px,52vw,380px)] overflow-hidden rounded-card"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
            }}
            onKeyDown={(e) => {
              if (count < 2) return;
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
          >
            <Image
              src="/assets/banner.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 1232px, 100vw"
              className="object-cover"
              priority
            />

            <div
              className="absolute inset-0 transition-colors duration-500"
              style={{
                background: `linear-gradient(100deg, rgb(0 0 0 / 0.78) 0%, rgb(0 0 0 / 0.48) 55%, ${platformTint(
                  meta?.color ?? "var(--brand-primary)",
                  33,
                )} 100%)`,
              }}
            />

            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 lg:p-8">
              {slide && meta ? (
                <div
                  key={slide.id}
                  aria-live={paused ? "polite" : "off"}
                  className="relative max-w-[85%] sm:max-w-[65%]"
                >
                  <div
                    className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{ backgroundColor: platformTint(meta.color, 20) }}
                  >
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    <span className="text-xs font-bold uppercase text-inverse">{meta.label}</span>
                  </div>

                  <h2 className="text-[clamp(1.125rem,3.5vw,1.75rem)] uppercase leading-tight text-inverse">
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">
                        {slide.campaign_name}
                      </a>
                    ) : (
                      slide.campaign_name
                    )}
                  </h2>

                  {slide.conditions && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-inverse/70 sm:text-sm">{slide.conditions}</p>
                  )}

                  <p className="mt-1 text-xs text-inverse/60">
                    📅 {formatPromoDates(slide.start_date, slide.end_date)}
                  </p>

                  {isRealPromoCode(slide.promo_code) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-surface px-2 py-1 font-mono text-sm font-bold" style={{ color: meta.color }}>
                        {slide.promo_code}
                      </span>
                      <CopyCodeButton code={slide.promo_code} className="bg-surface/90" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-[85%] sm:max-w-[65%]">
                  <h2 className="text-xl leading-tight text-inverse sm:text-2xl">ยังไม่มีโปรโมชั่นที่ใช้ได้ในขณะนี้</h2>
                  <p className="mt-2 text-sm text-inverse/70">เรากำลังอัปเดตโปรใหม่ ลองกลับมาดูอีกครั้งเร็วๆ นี้</p>
                </div>
              )}

              {count > 1 && (
                <div className="relative flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="โปรก่อนหน้า"
                    className="grid size-11 place-items-center rounded-full bg-inverse/15 text-lg text-inverse backdrop-blur-sm hover:bg-inverse/25"
                  >
                    ‹
                  </button>
                  <span className="min-w-14 text-center text-xs font-semibold tabular-nums text-inverse/80" aria-live="off">
                    {(current % count) + 1} / {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="โปรถัดไป"
                    className="grid size-11 place-items-center rounded-full bg-inverse/15 text-lg text-inverse backdrop-blur-sm hover:bg-inverse/25"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Food categories — shortcuts to the promotion list */}
      <div className="bg-surface px-3 pb-4 pt-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Badge variant="secondary" className="mb-1.5" suppressHydrationWarning>
            {thaiDays[new Date().getDay()]}
          </Badge>
          <h2 className="mb-2 text-base text-brand-primary">วันนี้กินอะไรดี ?</h2>
          <div className="flex gap-3 overflow-x-auto pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {foodCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={scrollToPlatforms}
                className="flex min-w-15 flex-col items-center gap-2"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-surface-subtle text-xl" aria-hidden>
                  {cat.emoji}
                </span>
                <span className="text-xs font-semibold text-ink">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
