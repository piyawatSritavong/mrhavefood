"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

type AdSlotProps = {
  /** AdSense ad unit id (data-ad-slot). Nothing renders until both client and slot are set. */
  slot: string | undefined;
  className?: string;
};

/** In-flow AdSense unit placed between sections — never overlays content. */
export function AdSlot({ slot, className }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or a missing script must never break the page.
    }
  }, [slot]);

  if (!CLIENT || !slot) return null;

  return (
    <aside aria-label="โฆษณา" className={cn("w-full overflow-hidden", className)}>
      <p className="mb-1 text-center text-xs text-ink-soft">โฆษณา</p>
      <ins
        className="adsbygoogle block min-h-[100px]"
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
