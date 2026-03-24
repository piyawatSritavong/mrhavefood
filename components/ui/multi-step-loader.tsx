import { cn } from "@/lib/utils";

type MultiStepLoaderProps = {
  steps: string[];
  activeStep: number;
  className?: string;
};

export function MultiStepLoader({
  steps,
  activeStep,
  className,
}: MultiStepLoaderProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {steps.map((step, index) => {
        const status =
          index < activeStep ? "done" : index === activeStep ? "active" : "pending";

        return (
          <div
            key={`${step}-${index}`}
            className={cn(
              "flex items-center gap-3 rounded-[1rem] border px-4 py-3 text-sm transition-colors",
              status === "done"
                ? "border-[#85d978]/55 bg-[#effbe9] text-[#23401c]"
                : status === "active"
                  ? "border-[#8dd7ff]/65 bg-[#eef8ff] text-[#1f4b68]"
                  : "border-[#111111]/8 bg-white/65 text-[#667161]",
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold",
                status === "done"
                  ? "bg-[#85d978] text-[#16310f]"
                  : status === "active"
                    ? "bg-[#8dd7ff] text-[#12354a]"
                    : "bg-[#111111]/8 text-[#556054]",
              )}
            >
              {status === "done" ? "✓" : status === "active" ? "…" : index + 1}
            </span>
            <p className="type-body text-current">{step}</p>
          </div>
        );
      })}
    </div>
  );
}
