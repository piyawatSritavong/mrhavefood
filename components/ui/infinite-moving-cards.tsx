"use client";

import { cn } from "@/lib/cn";

export type InfiniteMovingCardItem = {
  id: string;
  title: string;
  detail: string;
  badge?: string;
};

type InfiniteMovingCardsProps = {
  items: InfiniteMovingCardItem[];
  className?: string;
};

export function InfiniteMovingCards({
  items,
  className,
}: InfiniteMovingCardsProps) {
  const repeatedItems = [...items, ...items];

  return (
    <div
      className={cn(
        "overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div className="infinite-cards-track flex w-max gap-4 py-1">
        {repeatedItems.map((item, index) => (
          <article
            key={`${item.id}-${index}`}
            className="min-w-[18rem] rounded-[1.6rem] border border-black/6 bg-white px-5 py-4 shadow-[0_18px_50px_rgba(31,28,22,0.08)] sm:min-w-[22rem]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="type-heading-sm text-[#111111]">{item.title}</p>
                <p className="type-body mt-2 text-[#556054]">{item.detail}</p>
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
    </div>
  );
}
