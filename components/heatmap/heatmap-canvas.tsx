"use client";

import { useState } from "react";

type HeatZone = {
  name: string;
  score: string;
  delta: string;
};

type HeatmapCanvasProps = {
  zones: HeatZone[];
};

export function HeatmapCanvas({
  zones,
}: HeatmapCanvasProps) {
  const [activeZone, setActiveZone] = useState(
    zones.find((zone) => zone.name === "Lat Phrao")?.name ?? zones[0]?.name ?? "Ari",
  );
  const embedQuery = encodeURIComponent(`${activeZone}, Bangkok, Thailand`);
  const embedSrc = `https://www.google.com/maps?q=${embedQuery}&z=14&output=embed`;

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-[2rem] border border-[#111111]/8 bg-white shadow-[0_30px_90px_rgba(35,24,16,0.12)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#111111]/8 bg-[#f8fafc] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#ff8d33]" />
            <span className="size-2.5 rounded-full bg-[#ffd56a]" />
            <span className="size-2.5 rounded-full bg-[#79d15d]" />
          </div>
          <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
            Google Maps preview
          </p>
          <span className="rounded-full bg-white px-3 py-1 text-xs text-[#111111]">
            {activeZone} live
          </span>
        </div>
        <div className="relative">
          <iframe
            key={activeZone}
            title={`Google Maps preview for ${activeZone}`}
            src={embedSrc}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[28rem] w-full border-0 bg-white"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {zones.slice(0, 6).map((zone) => (
          <button
            key={zone.name}
            type="button"
            onClick={() => setActiveZone(zone.name)}
            className={`rounded-[1.2rem] border px-4 py-3 text-left text-sm font-semibold ${
              activeZone === zone.name
                ? "border-[#111111]/18 bg-[#fff9ef] text-[#111111]"
                : "border-[#111111]/8 bg-white/75 text-[#566156]"
            }`}
          >
            {zone.name} • {zone.score}
          </button>
        ))}
      </div>
    </div>
  );
}
