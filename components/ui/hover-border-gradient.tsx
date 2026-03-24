import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type HoverBorderGradientProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  innerClassName?: string;
};

export function HoverBorderGradient({
  children,
  className,
  innerClassName,
  type = "button",
  ...props
}: HoverBorderGradientProps) {
  return (
    <button
      type={type}
      className={cn("group relative rounded-full p-px transition-transform hover:-translate-y-0.5", className)}
      {...props}
    >
      <span className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,rgba(255,154,72,0.88),rgba(133,217,255,0.85),rgba(255,214,92,0.88))] opacity-55 blur-[0.5px] transition duration-300 group-hover:opacity-100" />
      <span
        className={cn(
          "relative flex items-center gap-2 rounded-full border border-white/55 bg-white/82 px-4 py-2 text-sm text-[#111111] shadow-[0_10px_30px_rgba(17,17,17,0.06)] backdrop-blur-xl",
          innerClassName,
        )}
      >
        {children}
      </span>
    </button>
  );
}
