import { ImageResponse } from "next/og";

import { rankForDigest } from "@/lib/farm/digest";
import { listActivePromotions } from "@/lib/farm/refresh";
import { formatPromoDates } from "@/lib/format-date";
import { loadGoogleFont } from "@/lib/og-fonts";
import { getPlatformMeta, isRealPromoCode } from "@/lib/promotions-data";
import { DIGEST_SLOT_RE } from "@/lib/time";

const SIZE = 1080;
const MAX_ROWS = 5;

// Brand palette (mirrors app/globals.css; next/og cannot read CSS variables).
const C = {
  primary: "#00437c",
  accent: "#dd722c",
  bg: "#f4eeee",
  surface: "#ffffff",
  ink: "#13324c",
  muted: "#5c6e7f",
};

const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

/** Promo digest card for the farm's Facebook post: /api/og/digest/2026-10-12-am */
export async function GET(_req: Request, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params;
  const m = DIGEST_SLOT_RE.exec(slot);
  if (!m) return new Response("not found", { status: 404 });
  const [, date, period] = m;
  const [y, mo, d] = date.split("-").map(Number);
  const dateLabel = `${d} ${thaiMonths[mo - 1]} ${y + 543}`;

  let promos: Awaited<ReturnType<typeof listActivePromotions>> = [];
  try {
    promos = rankForDigest(await listActivePromotions(), new Set()).slice(0, MAX_ROWS);
  } catch (err) {
    console.error("[api/og/digest] failed to load promotions:", err);
  }

  const heading = period === "am" ? "โปรเด็ดวันนี้" : "โปรเด็ดมื้อเย็น";
  const rows = promos.map((p) => ({
    platform: getPlatformMeta(p.platform),
    name: p.campaign_name,
    code: isRealPromoCode(p.promo_code) ? p.promo_code : null,
    dates: formatPromoDates(p.start_date, p.end_date),
  }));

  const allText = [heading, dateLabel, "MrHaveFood.com", "รวมโค้ดส่วนลดส่งอาหารทุกแอปไว้ที่เดียว", "ยังไม่มีโปรที่ใช้ได้ในขณะนี้", "โค้ด",
    ...rows.flatMap((r) => [r.platform.label, r.name, r.code ?? "", r.dates])].join("");
  const [bold, regular] = await Promise.all([
    loadGoogleFont("Kanit", 700, allText),
    loadGoogleFont("Prompt", 400, allText),
  ]);
  const fonts = [
    ...(bold ? [{ name: "Kanit", data: bold, weight: 700 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "Prompt", data: regular, weight: 400 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: C.bg, padding: 64, fontFamily: "Prompt" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Kanit", fontSize: 76, color: C.primary, lineHeight: 1.1 }}>{heading}</div>
            <div style={{ fontSize: 34, color: C.muted, marginTop: 8 }}>{dateLabel}</div>
          </div>
          <div style={{ display: "flex", background: C.accent, color: C.surface, fontFamily: "Kanit", fontSize: 30, padding: "14px 28px", borderRadius: 999 }}>
            MrHaveFood.com
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 48, flexGrow: 1 }}>
          {rows.length === 0 ? (
            <div style={{ display: "flex", fontSize: 40, color: C.muted }}>ยังไม่มีโปรที่ใช้ได้ในขณะนี้</div>
          ) : (
            rows.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", background: C.surface, borderRadius: 28, padding: "22px 28px", gap: 24 }}>
                <div style={{ display: "flex", width: 14, height: 96, borderRadius: 7, background: r.platform.color }} />
                <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flexShrink: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 26, color: r.platform.color, fontFamily: "Kanit" }}>{r.platform.label}</div>
                  <div style={{ fontSize: 36, color: C.ink, fontFamily: "Kanit", lineHeight: 1.2 }}>{r.name.slice(0, 48)}</div>
                  <div style={{ fontSize: 24, color: C.muted }}>{r.dates}</div>
                </div>
                {r.code && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: `3px dashed ${C.primary}`, borderRadius: 18, padding: "10px 18px" }}>
                    <div style={{ fontSize: 20, color: C.muted }}>โค้ด</div>
                    <div style={{ fontSize: 32, color: C.primary, fontFamily: "Kanit" }}>{r.code.slice(0, 14)}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", fontSize: 32, color: C.primary, marginTop: 32 }}>
          รวมโค้ดส่วนลดส่งอาหารทุกแอปไว้ที่เดียว
        </div>
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
      fonts,
      headers: { "Cache-Control": "public, max-age=600, s-maxage=3600" },
    },
  );
}
