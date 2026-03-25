import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "accent"
  | "hero";

type ButtonSize = "sm" | "default" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[var(--brand-primary)] text-white shadow-sm hover:bg-[#003865]",
  secondary:
    "bg-white text-[var(--brand-primary)] shadow-sm hover:bg-[#f8f5f5]",
  outline:
    "border border-[#d7d5d5] bg-white text-[var(--brand-primary)] hover:bg-[#f8f5f5]",
  ghost:
    "bg-transparent text-[var(--brand-primary)] hover:bg-white/60",
  accent:
    "bg-[var(--brand-accent)] text-white shadow-sm hover:bg-[#c96321]",
  hero:
    "bg-white text-[var(--brand-primary)] shadow-md hover:bg-[#f5f7fb]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-xl px-3 text-sm",
  default: "h-10 rounded-2xl px-4 text-sm",
  lg: "h-12 rounded-2xl px-5 text-sm",
  icon: "size-10 rounded-2xl p-0",
};

export function Button({
  className,
  type = "button",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/30 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
