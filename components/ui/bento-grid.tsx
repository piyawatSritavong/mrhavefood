import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type BentoGridProps = {
  children: ReactNode;
  className?: string;
};

type BentoGridItemBaseProps = {
  title: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(14rem,auto)] grid-cols-1 gap-4 md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  title,
  description,
  header,
  icon,
  footer,
  className,
  contentClassName,
  ...props
}: (
  | (BentoGridItemBaseProps &
      Omit<HTMLAttributes<HTMLElement>, "title"> & {
        as?: "article" | "div";
      })
  | (BentoGridItemBaseProps &
      Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> & {
        as: "button";
      })
)) {
  const content = (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,107,31,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(39,77,50,0.12),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className={cn("relative flex h-full flex-col gap-4", contentClassName)}>
        {header ? <div>{header}</div> : null}
        {icon ? <div className="text-[#274d32]">{icon}</div> : null}
        <div className="space-y-2">
          <div className="type-heading-md text-[#111111]">{title}</div>
          {description ? <div className="type-body text-[#556054]">{description}</div> : null}
        </div>
        {footer ? <div className="mt-auto">{footer}</div> : null}
      </div>
    </>
  );

  if (props.as === "button") {
    const { as: buttonAs, ...buttonProps } = props;
    void buttonAs;

    return (
      <button
        className={cn(
          "group relative overflow-hidden rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(255,251,243,0.78)_100%)] p-5 text-left shadow-[0_20px_70px_rgba(31,28,22,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(31,28,22,0.12)] sm:p-6",
          className,
        )}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }

  const { as: elementAs, ...elementProps } = props;
  const Component = elementAs === "div" ? "div" : "article";

  return (
    <Component
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(255,251,243,0.78)_100%)] p-5 text-left shadow-[0_20px_70px_rgba(31,28,22,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(31,28,22,0.12)] sm:p-6",
        className,
      )}
      {...elementProps}
    >
      {content}
    </Component>
  );
}
