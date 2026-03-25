import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "accent"
  | "outline"
  | "platform-grab"
  | "platform-line-man"
  | "platform-shopeefood";

const badgeClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--brand-primary)] text-white",
  secondary: "bg-[#edf4fb] text-[var(--brand-primary)]",
  accent: "bg-[var(--brand-accent)] text-white",
  outline: "border border-[#d7d5d5] bg-white text-[#5d6d7e]",
  "platform-grab": "bg-[#dbf6e4] text-[#156c38]",
  "platform-line-man": "bg-[#ebf7d2] text-[#4f7a17]",
  "platform-shopeefood": "bg-[#fff0e4] text-[#b8571d]",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.72rem] font-semibold leading-none",
        badgeClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
