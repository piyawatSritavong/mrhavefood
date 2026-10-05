import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "accent";

type ButtonSize = "sm" | "default" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-brand-primary text-inverse shadow-sm hover:bg-brand-primary-hover",
  secondary: "bg-surface text-brand-primary shadow-md hover:bg-surface-brand",
  outline: "border border-border-strong bg-surface text-brand-primary hover:bg-surface-subtle",
  accent: "bg-brand-accent text-inverse shadow-sm hover:bg-brand-accent-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 rounded-xl px-3 text-sm",
  default: "min-h-11 rounded-2xl px-4 text-sm",
  lg: "min-h-12 rounded-2xl px-5 text-sm",
  icon: "size-11 rounded-2xl p-0",
};

/** Button styles, also usable on <Link>/<a> so links never wrap a <button>. */
export function buttonClasses({
  variant = "default",
  size = "default",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  className,
  type = "button",
  variant,
  size,
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
