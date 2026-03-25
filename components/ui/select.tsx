import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-12 w-full rounded-2xl border border-[#d7d5d5] bg-white px-4 py-3 text-sm text-[#12324c] outline-none transition-colors focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
