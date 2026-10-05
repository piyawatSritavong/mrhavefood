import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "เร็วๆ นี้",
  robots: { index: false },
};

const REPEAT_TEXT = "COMING SOON \u00a0";

export default function ComingSoonPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-brand-primary">

      {/* Background repeated text grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none flex-col justify-around overflow-hidden"
      >
        {Array.from({ length: 9 }).map((_, row) => (
          <div key={row} className="flex whitespace-nowrap">
            {Array.from({ length: 6 }).map((_, col) => (
              <span
                key={col}
                className="font-display text-[clamp(2rem,6vw,5rem)] font-bold uppercase leading-none tracking-widest"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px color-mix(in srgb, var(--inverse) 18%, transparent)",
                }}
              >
                {REPEAT_TEXT}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Diagonal tape — top (behind card) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-20%] top-[33%] z-0 w-[140%] -rotate-22 bg-brand-accent py-6 shadow-md"
      >
        <p className="whitespace-nowrap text-center font-display text-xl font-bold uppercase tracking-[0.25em] text-inverse">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>COMING SOON &nbsp;·&nbsp; </span>
          ))}
        </p>
      </div>

      {/* Diagonal tape — bottom (behind card) */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[33%] left-[-20%] z-0 w-[140%] rotate-22 bg-brand-accent py-6 shadow-md"
      >
        <p className="whitespace-nowrap text-center font-display text-xl font-bold uppercase tracking-[0.25em] text-inverse">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>COMING SOON &nbsp;·&nbsp; </span>
          ))}
        </p>
      </div>

      {/* Center card */}
      <div className="relative z-10 mx-4 rounded-2xl bg-surface px-10 py-10 text-center shadow-2xl sm:px-16 sm:py-12">
        <h1
          className="font-display text-[clamp(3rem,12vw,6rem)] font-bold uppercase leading-[0.9] text-brand-primary"
        >
          COMING<br />SOON
        </h1>

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.35em] text-brand-primary/50">
          MrHaveFood.com
        </p>

        <p className="mt-4 text-sm text-brand-primary/70">
          ฟีเจอร์นี้กำลังอยู่ระหว่างการพัฒนา
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-brand-primary px-6 text-sm font-bold text-inverse hover:bg-brand-primary-hover"
        >
          ← กลับหน้าหลัก
        </Link>
      </div>

    </div>
  );
}
