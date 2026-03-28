import Link from "next/link";

export const metadata = { title: "Coming Soon" };

const REPEAT_TEXT = "COMING SOON \u00a0";

export default function ComingSoonPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#00437c]">

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
                className="font-display text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-none tracking-widest"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.18)",
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
        className="pointer-events-none absolute left-[-20%] top-[33%] z-0 w-[140%] -rotate-22 bg-[#dd722c] py-6 shadow-md"
      >
        <p className="whitespace-nowrap text-center font-display text-xl font-black uppercase tracking-[0.25em] text-white">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>COMING SOON &nbsp;·&nbsp; </span>
          ))}
        </p>
      </div>

      {/* Diagonal tape — bottom (behind card) */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[33%] left-[-20%] z-0 w-[140%] rotate-22 bg-[#dd722c] py-6 shadow-md"
      >
        <p className="whitespace-nowrap text-center font-display text-xl font-black uppercase tracking-[0.25em] text-white">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>COMING SOON &nbsp;·&nbsp; </span>
          ))}
        </p>
      </div>

      {/* Center card */}
      <div className="relative z-10 mx-4 rounded-2xl bg-white px-10 py-10 text-center shadow-2xl sm:px-16 sm:py-12">
        <h1
          className="font-display text-[clamp(3rem,12vw,6rem)] font-black uppercase leading-[0.9] text-[#00437c]"
        >
          COMING<br />SOON
        </h1>

        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.35em] text-[#00437c]/50">
          MrHaveFood.com
        </p>

        <p className="mt-4 text-sm text-[#00437c]/60">
          ฟีเจอร์นี้กำลังอยู่ระหว่างการพัฒนา
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-[#00437c] px-6 py-2 text-sm font-bold uppercase tracking-wider"
          style={{ color: "white" }}
        >
          ← กลับหน้าหลัก
        </Link>
      </div>

    </div>
  );
}
