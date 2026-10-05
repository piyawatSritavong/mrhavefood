import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "accent" | "outline" | "muted";

const badgeClasses: Record<BadgeVariant, string> = {
  default: "bg-brand-primary text-inverse",
  secondary: "bg-surface-brand text-brand-primary",
  accent: "bg-brand-accent text-inverse",
  outline: "border border-border-strong bg-surface text-ink-muted",
  muted: "bg-surface-subtle text-ink-muted",
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
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold leading-none",
        badgeClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
