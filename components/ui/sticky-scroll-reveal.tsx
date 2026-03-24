"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export type StickyRevealItem = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  content: ReactNode;
};

type StickyScrollRevealProps = {
  items: StickyRevealItem[];
  className?: string;
  contentClassName?: string;
};

export function StickyScrollReveal({
  items,
  className,
  contentClassName,
}: StickyScrollRevealProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLElement[];

    if (!nodes.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nextEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

        if (!nextEntry) {
          return;
        }

        const nextIndex = Number((nextEntry.target as HTMLElement).dataset.index);

        if (!Number.isNaN(nextIndex)) {
          setActiveIndex(nextIndex);
        }
      },
      {
        threshold: [0.3, 0.45, 0.6],
        rootMargin: "-12% 0px -12% 0px",
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [items.length]);

  const activeItem = items[activeIndex] ?? items[0];

  return (
    <div className={cn("grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-start", className)}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <article
            key={item.id}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            data-index={index}
            className={cn(
              "rounded-[1.8rem] border p-5 transition-all sm:p-6",
              index === activeIndex
                ? "border-[#111111]/14 bg-white shadow-[0_18px_60px_rgba(31,28,22,0.08)]"
                : "border-[#111111]/8 bg-white/70",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="type-heading-md text-[#111111]">{item.title}</p>
                <p className="type-body mt-3 text-[#586257]">{item.description}</p>
              </div>
              {item.badge ? (
                <span className="rounded-full bg-[#111111] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white">
                  {item.badge}
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="lg:sticky lg:top-28">
        <div
          className={cn(
            "overflow-hidden rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(252,247,237,0.82)_100%)] p-5 shadow-[0_26px_80px_rgba(31,28,22,0.08)] sm:p-6",
            contentClassName,
          )}
        >
          {activeItem?.content}
        </div>
      </div>
    </div>
  );
}
