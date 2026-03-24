import { cn } from "@/lib/cn";

const beamSpecs = [
  { left: "8%", delay: "0s", duration: "16s", width: "12rem" },
  { left: "26%", delay: "-5s", duration: "20s", width: "14rem" },
  { left: "48%", delay: "-10s", duration: "18s", width: "10rem" },
  { left: "69%", delay: "-3s", duration: "22s", width: "16rem" },
  { left: "86%", delay: "-8s", duration: "17s", width: "11rem" },
];

type BackgroundBeamsProps = {
  className?: string;
};

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.56)_0%,rgba(246,240,225,0.74)_58%,rgba(246,240,225,0.96)_100%)]" />
      <div className="absolute inset-0 opacity-70 [mask-image:linear-gradient(180deg,rgba(0,0,0,0.95),rgba(0,0,0,0.15))]">
        {beamSpecs.map((beam, index) => (
          <span
            key={beam.left}
            className={cn(
              "acet-beam-line absolute top-[-30%] block h-[160%] rounded-full blur-3xl",
              index % 2 === 0
                ? "bg-[linear-gradient(180deg,rgba(227,107,31,0)_0%,rgba(227,107,31,0.26)_45%,rgba(39,77,50,0.14)_100%)]"
                : "bg-[linear-gradient(180deg,rgba(39,77,50,0)_0%,rgba(39,77,50,0.22)_42%,rgba(255,179,71,0.16)_100%)]",
            )}
            style={{
              left: beam.left,
              width: beam.width,
              animationDelay: beam.delay,
              animationDuration: beam.duration,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 via-white/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f6f0e1] to-transparent" />
    </div>
  );
}
