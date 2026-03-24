import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BackgroundGradientAnimationProps = {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function BackgroundGradientAnimation({
  children,
  className,
  containerClassName,
}: BackgroundGradientAnimationProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", containerClassName)}>
      <div className={cn("absolute inset-0", className)}>
        <div className="hero-gradient-base" />
        <span className="hero-gradient-orb orb-a" />
        <span className="hero-gradient-orb orb-b" />
        <span className="hero-gradient-orb orb-c" />
        <span className="hero-gradient-grid" />
      </div>
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}
