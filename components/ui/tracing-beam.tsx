import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type TracingBeamProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function TracingBeam({
  children,
  className,
  contentClassName,
}: TracingBeamProps) {
  return (
    <div className={cn("tracing-beam-shell", className)}>
      <div className="tracing-beam-line" aria-hidden="true" />
      <div className={cn("tracing-beam-content", contentClassName)}>{children}</div>
    </div>
  );
}
