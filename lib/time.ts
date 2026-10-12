// Thailand has no DST, so Bangkok time is always UTC+7.
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Wall-clock parts in Asia/Bangkok. */
export function bangkokParts(now = new Date()) {
  const t = new Date(now.getTime() + BANGKOK_OFFSET_MS);
  return {
    date: t.toISOString().slice(0, 10), // YYYY-MM-DD
    hour: t.getUTCHours(),
  };
}

/** Today's date (YYYY-MM-DD) in Bangkok — the date promo end_dates are written in. */
export function bangkokToday(now = new Date()): string {
  return bangkokParts(now).date;
}

export type DigestPeriod = "am" | "pm";

/**
 * Digest slot for the farm's twice-daily card: am = 06:00–14:59, pm = 15:00–05:59.
 * 00:00–05:59 still belongs to the previous day's pm slot.
 */
export function digestSlot(now = new Date()): { date: string; period: DigestPeriod; id: string } {
  const { hour } = bangkokParts(now);
  if (hour >= 6 && hour < 15) {
    const date = bangkokParts(now).date;
    return { date, period: "am", id: `${date}-am` };
  }
  const ref = hour < 6 ? new Date(now.getTime() - 24 * 60 * 60 * 1000) : now;
  const date = bangkokParts(ref).date;
  return { date, period: "pm", id: `${date}-pm` };
}

export const DIGEST_SLOT_RE = /^(\d{4}-\d{2}-\d{2})-(am|pm)$/;
