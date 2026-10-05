"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { CopyCodeButton } from "@/components/ui/copy-code-button";
import { fmtThaiLong, formatPromoDates } from "@/lib/format-date";
import { getPlatformMeta, isRealPromoCode, platformMeta, platformTint, promoHref } from "@/lib/promotions-data";
import { useHomeStore } from "@/lib/stores/use-home-store";
import type { Promotion } from "@/lib/supabase";

type HomePlatformSectionProps = {
  promotions: Promotion[];
};

const AD_COPIES = 8;

function AdBannerScroll({ adDuration }: { adDuration: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const lastTs = useRef<number | null>(null);

  useAnimationFrame((ts) => {
    if (isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    if (lastTs.current === null) { lastTs.current = ts; return; }
    const delta = ts - lastTs.current;
    lastTs.current = ts;
    const unit = track.scrollWidth / AD_COPIES;
    const speed = unit / (adDuration * 1000);
    let next = x.get() - delta * speed;
    if (next <= -unit) next += unit;
    x.set(next);
  });

  return (
    <motion.div
      ref={trackRef}
      style={{ x }}
      className="flex gap-8 cursor-grab active:cursor-grabbing select-none touch-pan-y"
      drag="x"
      dragConstraints={{ left: -400, right: 400 }}
      dragMomentum={true}
      dragElastic={0.08}
      onDragStart={() => { isDragging.current = true; lastTs.current = null; }}
      onDragEnd={() => { isDragging.current = false; }}
    >
      {Array.from({ length: AD_COPIES }, (_, i) => (
        <Image
          key={i}
          src="/assets/mini-ads.webp"
          alt={i === 0 ? "โฆษณา MrHaveFood" : ""}
          width={408}
          height={256}
          className="h-20 w-auto shrink-0 object-cover"
        />
      ))}
    </motion.div>
  );
}

function matchesQuery(promo: Promotion, q: string): boolean {
  const haystack = [promo.campaign_name, promo.conditions, promo.platform, promo.promo_code]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function PromoRow({ promo }: { promo: Promotion }) {
  const meta = getPlatformMeta(promo.platform);
  const href = promoHref(promo);
  const hasCode = isRealPromoCode(promo.promo_code);

  const content = (
    <>
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: platformTint(meta.color, 12) }}
        aria-hidden
      >
        <span className="font-display text-xs font-bold" style={{ color: meta.color }}>
          {meta.abbr}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-brand-primary">
          <span className="sr-only">{meta.label}: </span>
          {promo.campaign_name}
        </span>
        {promo.conditions && <span className="mt-0.5 block text-xs text-ink-muted">{promo.conditions}</span>}
        <span className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge variant="muted" className="whitespace-nowrap">
            {formatPromoDates(promo.start_date, promo.end_date)}
          </Badge>
          {hasCode && (
            <Badge
              variant="outline"
              className="font-mono font-bold"
              style={{ borderColor: meta.color, color: meta.color }}
            >
              {promo.promo_code}
            </Badge>
          )}
        </span>
      </span>
    </>
  );

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-2.5">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="flex min-w-0 flex-1 items-center gap-3">
          {content}
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{content}</div>
      )}
      {hasCode && <CopyCodeButton code={promo.promo_code as string} />}
    </div>
  );
}

export function HomePlatformSection({ promotions }: HomePlatformSectionProps) {
  const searchQuery = useHomeStore((s) => s.searchQuery);
  const setSearchQuery = useHomeStore((s) => s.setSearchQuery);
  const [adDuration, setAdDuration] = useState(15);
  useEffect(() => {
    const update = () => setAdDuration(window.innerWidth < 768 ? 10 : 15);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const visible = useMemo(() => (q ? promotions.filter((p) => matchesQuery(p, q)) : promotions), [promotions, q]);

  return (
    <section
      id="platforms"
      data-section-id="platforms"
      className="w-full min-w-0 bg-background px-3 py-8 sm:px-4 sm:py-12 lg:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-3">
        <div className="overflow-hidden rounded-card">
          <Image
            src="/assets/call-to-action.webp"
            alt="MrHaveFood รวมโปรส่งอาหารทุกแพลตฟอร์ม"
            width={1600}
            height={415}
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="h-auto w-full object-cover"
          />
        </div>

        <div>
          <Badge variant="muted" className="mb-1.5" suppressHydrationWarning>
            {fmtThaiLong(new Date())}
          </Badge>
          <h2 className="text-base text-brand-primary">
            {q ? `ผลการค้นหา “${searchQuery.trim()}”` : "โปรล่าสุด ทุกแพลตฟอร์ม"}
          </h2>
          {q && (
            <p className="text-xs text-ink-muted" aria-live="polite">
              พบ {visible.length} โปรโมชั่น
            </p>
          )}
        </div>

        {visible.length > 0 ? (
          <ul className="space-y-1.5">
            {visible.map((promo, index) => (
              <li key={promo.id}>
                {index > 0 && index % 7 === 0 && (
                  <div className="my-2 overflow-hidden rounded-xl border border-dashed border-border">
                    <AdBannerScroll adDuration={adDuration} />
                  </div>
                )}
                <PromoRow promo={promo} />
              </li>
            ))}
          </ul>
        ) : q ? (
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <p className="text-sm font-semibold text-brand-primary">ไม่พบโปรโมชั่นที่ตรงกับ “{searchQuery.trim()}”</p>
            <p className="mt-1 text-xs text-ink-muted">ลองค้นด้วยชื่อแอป ชื่อธนาคาร หรือคำอื่น</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-3 inline-flex min-h-11 items-center rounded-full bg-surface-brand px-5 text-sm font-semibold text-brand-primary"
            >
              ล้างคำค้นหา
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <p className="text-sm font-semibold text-brand-primary">ยังไม่มีโปรโมชั่นที่ใช้ได้ในขณะนี้</p>
            <p className="mt-1 text-xs text-ink-muted">ระหว่างนี้เช็กโปรในแอปของแต่ละแพลตฟอร์มได้โดยตรง</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {Object.values(platformMeta).map((m) => (
                <a
                  key={m.label}
                  href={m.webUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-semibold"
                  style={{ color: m.color }}
                >
                  {m.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
