import type { Promotion } from "@/lib/supabase";

export type PlatformMeta = {
  label: string;
  abbr: string;
  /** Brand color of the delivery platform (third-party brand, not our palette). */
  color: string;
  webUrl: string;
};

// Single source for platform brand colors and links.
export const platformMeta: Record<string, PlatformMeta> = {
  GrabFood: { label: "GrabFood", abbr: "GF", color: "#00B14F", webUrl: "https://food.grab.com/th/th/" },
  "LINE MAN": { label: "LINE MAN", abbr: "LM", color: "#00C300", webUrl: "https://lineman.line.me/" },
  ShopeeFood: { label: "ShopeeFood", abbr: "SF", color: "#EE4D2D", webUrl: "https://shopee.co.th/m/shopeefood" },
  Robinhood: { label: "Robinhood", abbr: "RH", color: "#4A148C", webUrl: "https://www.robinhood.co.th/" },
};

export function getPlatformMeta(platform: string): PlatformMeta {
  return (
    platformMeta[platform] ?? {
      label: platform,
      abbr: platform.slice(0, 2).toUpperCase(),
      color: "var(--brand-primary)",
      webUrl: "",
    }
  );
}

/** Tinted background for a platform color, e.g. badge fills. */
export function platformTint(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

const NON_CODE_VALUES = new Set(["ลดอัตโนมัติ ไม่ต้องใช้รหัส", "เก็บคูปองในแอป"]);

/** True when promo_code is an actual code a user can type or copy. */
export function isRealPromoCode(code: string | null): code is string {
  return Boolean(code) && !NON_CODE_VALUES.has(code as string);
}

export function promoHref(promo: Promotion): string | null {
  return promo.reference_link || getPlatformMeta(promo.platform).webUrl || null;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/** Drop inactive or expired promotions (end_date before today). */
export function filterActivePromotions(list: Promotion[], today = todayISO()): Promotion[] {
  return list.filter((p) => p.is_active && (!p.end_date || p.end_date >= today));
}

export const fallbackPromotions: Promotion[] = [
  {
    id: "1",
    platform: "GrabFood",
    campaign_name: "GSB Debit Card Exclusive",
    promo_code: "GSB100",
    conditions: "สั่งขั้นต่ำ 300 บาท, ชำระผ่าน GrabPay ด้วยบัตรเดบิต GSB, จำกัด 2 สิทธิ์/คน/เดือน",
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    reference_link: "https://www.grab.com/th/en/blog/gsb_y2026/",
    fetched_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "2",
    platform: "GrabFood",
    campaign_name: "KBank Credit Card Promotion",
    promo_code: "KBANKGF",
    conditions: "สั่งขั้นต่ำ 500 บาท, ชำระผ่าน GrabPay ด้วยบัตรเครดิต KBank ที่ร่วมรายการ, จำกัด 1 สิทธิ์/คน/เดือน",
    start_date: "2026-03-01",
    end_date: "2027-02-28",
    reference_link: "https://www.grab.com/th/en/blog/kbankgf_2026/",
    fetched_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "3",
    platform: "LINE MAN",
    campaign_name: "KTC VISA Foodie",
    promo_code: "KTCVSPD80",
    conditions: "สั่งขั้นต่ำ 450 บาท (เฉพาะค่าอาหาร), ชำระผ่านบัตรเครดิต KTC VISA เท่านั้น",
    start_date: "2026-02-01",
    end_date: "2026-07-31",
    reference_link: "https://lineman.line.me/partnership-ktc/",
    fetched_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "4",
    platform: "LINE MAN",
    campaign_name: "Rabbit Rewards Special",
    promo_code: "แลกรับ Rabbit Rewards",
    conditions: "สั่งขั้นต่ำ 200 บาท, ใช้ได้เฉพาะร้านที่ร่วมรายการ (GP), จำกัด 1 รหัส/สิทธิ์",
    start_date: "2025-09-16",
    end_date: "2026-03-31",
    reference_link: "https://rewards.rabbit.co.th/rewards/line-man---get-150-thb-discount-on-food-delivery-order-with-min-spend-at-200-thb-batch-sep25",
    fetched_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "5",
    platform: "LINE MAN",
    campaign_name: "LINE MAN MART x Big C",
    promo_code: "BIGC200",
    conditions: "ช้อปขั้นต่ำ 800 บาท ที่ Big C ผ่านบริการ LINE MAN MART",
    start_date: "2026-03-01",
    end_date: "2026-03-31",
    reference_link: "https://lineman.line.me/how-to-apply-promo-code-2/",
    fetched_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "6",
    platform: "ShopeeFood",
    campaign_name: "ShopeeFood x KFC New User",
    promo_code: "เก็บคูปองในแอป",
    conditions: "เฉพาะลูกค้าใหม่, ไม่มีขั้นต่ำ, ใช้ได้กับเมนูที่ร่วมรายการ",
    start_date: null,
    end_date: null,
    reference_link: "https://promotion.thairath.co.th/shopee-food-coupons/",
    fetched_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "7",
    platform: "ShopeeFood",
    campaign_name: "ShopeeFood x McDonald's",
    promo_code: null,
    conditions: "สำหรับทุกผู้ใช้, เฉพาะเมนูเซ็ตที่ร่วมรายการ, ไม่มีขั้นต่ำ",
    start_date: null,
    end_date: null,
    reference_link: "https://promotion.thairath.co.th/shopee-food-coupons/",
    fetched_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "8",
    platform: "Robinhood",
    campaign_name: "Robinhood Food (Current Status)",
    promo_code: null,
    conditions: "ตรวจสอบราคาพิเศษได้ที่หน้าแอปพลิเคชันในส่วน 'ดีลดีร้านดัง'",
    start_date: "2026-03-01",
    end_date: "2026-03-31",
    reference_link: "https://www.robinhood.co.th/",
    fetched_at: new Date().toISOString(),
    is_active: true,
  },
];
