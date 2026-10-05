const thaiMonths = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

export const thaiDays = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];

/** "5 ต.ค. 69" */
export function fmtThaiShort(d: string): string {
  const dt = new Date(d);
  return `${dt.getDate()} ${thaiMonthsShort[dt.getMonth()]} ${String(dt.getFullYear() + 543).slice(2)}`;
}

/** "5 ตุลาคม 2569" */
export function fmtThaiLong(dt: Date): string {
  return `${dt.getDate()} ${thaiMonths[dt.getMonth()]} ${dt.getFullYear() + 543}`;
}

/** Promotion validity label; undated promos are labelled instead of showing a fake date. */
export function formatPromoDates(start: string | null, end: string | null): string {
  if (start && end) return `${fmtThaiShort(start)} – ${fmtThaiShort(end)}`;
  if (end) return `ถึง ${fmtThaiShort(end)}`;
  if (start) return `เริ่ม ${fmtThaiShort(start)}`;
  return "ไม่ระบุวันหมดเขต";
}
