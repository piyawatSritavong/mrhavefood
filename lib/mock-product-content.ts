import type { CompareScenario } from "@/lib/home-content";
import { compareScenarios } from "@/lib/home-content";
import type {
  FraudCase,
  ModerationCase,
  OcrJob,
  RewardCatalogItem,
  ReviewRecord,
} from "@/lib/product-types";

export const seededReviews: Record<string, ReviewRecord[]> = {
  "krapao-thonglor": [
    {
      id: "review-krapao-1",
      scenarioId: "krapao-thonglor",
      authorName: "Mint A.",
      authorRole: "member",
      rating: 5,
      headline: "คุ้มสุดตอนดึกจริง",
      body: "LINE MAN ถูกกว่าชัดและรสยังแรงเหมือนเดิม ถ้าดูราคา net ก่อนสั่งจะช่วยเซฟได้เยอะ",
      createdAt: Date.UTC(2026, 2, 22, 15, 30),
      verified: true,
      helpfulCount: 14,
      moderationStatus: "approved",
      merchantReply: null,
      merchantReplyAt: null,
    },
    {
      id: "review-krapao-2",
      scenarioId: "krapao-thonglor",
      authorName: "Boss N.",
      authorRole: "guest",
      rating: 4,
      headline: "Grab เร็วกว่าแต่แพงกว่า",
      body: "ถ้ารีบมากยังโอเค แต่ถ้าไม่รีบให้กดแอปที่ net ต่ำกว่าแทน",
      createdAt: Date.UTC(2026, 2, 21, 12, 10),
      verified: false,
      helpfulCount: 8,
      moderationStatus: "approved",
      merchantReply: "ขอบคุณครับ ช่วงดึกเราจะพยายามดัน pickup deal เพิ่มให้คุ้มขึ้นอีก",
      merchantReplyAt: Date.UTC(2026, 2, 22, 5, 20),
    },
  ],
  "boat-noodle-onnut": [
    {
      id: "review-boat-1",
      scenarioId: "boat-noodle-onnut",
      authorName: "Nam P.",
      authorRole: "member",
      rating: 5,
      headline: "ShopeeFood มีผลกับเมนูนี้จริง",
      body: "ถ้ามีโค้ดส่งฟรี ตัวนี้กลายเป็นมื้อเย็นประหยัดสุดในย่านเลย",
      createdAt: Date.UTC(2026, 2, 22, 10, 45),
      verified: true,
      helpfulCount: 11,
      moderationStatus: "approved",
      merchantReply: null,
      merchantReplyAt: null,
    },
  ],
  "chicken-rice-ari": [
    {
      id: "review-chicken-1",
      scenarioId: "chicken-rice-ari",
      authorName: "Ploy T.",
      authorRole: "member",
      rating: 5,
      headline: "ค่าส่งทำให้ต่างกันเยอะ",
      body: "ร้านนี้อาหารราคาใกล้กันทุกแอป แต่ค่าส่งและ service fee ต่างกันจนมีผลกับมื้อกลางวันมาก",
      createdAt: Date.UTC(2026, 2, 23, 4, 15),
      verified: true,
      helpfulCount: 19,
      moderationStatus: "approved",
      merchantReply: null,
      merchantReplyAt: null,
    },
  ],
  "roti-ekkamai": [
    {
      id: "review-roti-1",
      scenarioId: "roti-ekkamai",
      authorName: "Film S.",
      authorRole: "member",
      rating: 4,
      headline: "ของหวานหลังเลิกงานที่ net ต่ำจริง",
      body: "LINE MAN ยังเป็นตัวเลือกที่ถูกสุด แต่ถ้าได้โค้ด ShopeeFood ก็สูสีมาก",
      createdAt: Date.UTC(2026, 2, 21, 14, 50),
      verified: true,
      helpfulCount: 7,
      moderationStatus: "approved",
      merchantReply: null,
      merchantReplyAt: null,
    },
  ],
};

export const rewardsCatalog: RewardCatalogItem[] = [
  {
    id: "reward-truemoney-50",
    title: "TrueMoney Wallet เครดิต 50 บาท",
    brand: "TrueMoney",
    category: "truemoney",
    pointsCost: 280,
    valueLabel: "เครดิต ฿50",
    stockLabel: "Limited daily",
    summary: "เหมาะกับ member ที่ช่วยอัปโหลดใบเสร็จต่อเนื่องและอยากแลกเป็นเครดิตใช้จริง",
    featured: true,
  },
  {
    id: "reward-pickup-deal",
    title: "คูปองรับหน้าร้าน ลด 15%",
    brand: "MrHaveFood Direct",
    category: "discount",
    pointsCost: 160,
    valueLabel: "ลดสูงสุด 15%",
    stockLabel: "Always available",
    summary: "ใช้กับร้านที่มี direct deal เพื่อดึงลูกค้ากลับไปซื้อแบบไม่เสีย GP",
    featured: true,
  },
  {
    id: "reward-dessert-bundle",
    title: "Dessert Bundle Coupon",
    brand: "Partner Dessert Shops",
    category: "coupon",
    pointsCost: 120,
    valueLabel: "คูปอง ฿30",
    stockLabel: "Restocks weekly",
    summary: "แลกคูปองของหวานสำหรับช่วงบ่ายหรือมื้อดึก",
    featured: false,
  },
  {
    id: "reward-lineman-pass",
    title: "คูปองค่าส่งพิเศษ",
    brand: "Affiliate Promo",
    category: "coupon",
    pointsCost: 90,
    valueLabel: "ค่าส่งลด ฿20",
    stockLabel: "Promo batch",
    summary: "mock reward สำหรับทดสอบ flow affiliate-to-reward ในระบบ",
    featured: false,
  },
];

export const initialOcrJobs: OcrJob[] = [
  {
    id: "ocr-seed-1",
    receiptId: "chicken-rice-ari-line-man-guest-seed",
    fileName: "ari-lunch-proof.jpg",
    scenarioId: "chicken-rice-ari",
    platform: "line-man",
    extractedText: "ข้าวมันไก่ + ชาเย็น / LINE MAN / ฿128",
    confidence: 96,
    truthScore: 94,
    fraudSignals: [],
    status: "auto-approved",
    createdAt: Date.UTC(2026, 2, 22, 12, 15),
  },
];

export const initialFraudCases: FraudCase[] = [
  {
    id: "fraud-seed-1",
    signal: "Duplicate receipt hash",
    account: "member+batch-17@demo",
    severity: "high",
    action: "Hold points and send to review",
    status: "open",
    createdAt: Date.UTC(2026, 2, 23, 6, 40),
  },
  {
    id: "fraud-seed-2",
    signal: "Review burst from same IP",
    account: "store-promo-wave",
    severity: "medium",
    action: "Throttle submissions 24h",
    status: "monitoring",
    createdAt: Date.UTC(2026, 2, 23, 7, 20),
  },
];

export const initialModerationCases: ModerationCase[] = [
  {
    id: "mod-seed-1",
    reviewId: null,
    source: "receipt",
    target: "late-night-krapao.png",
    issue: "Low confidence parse requires human review",
    status: "pending",
    createdAt: Date.UTC(2026, 2, 23, 7, 25),
  },
];

export function getScenarioSeedById(scenarioId: string) {
  return compareScenarios.find((scenario) => scenario.id === scenarioId);
}

export function getSeededScenarios() {
  return compareScenarios;
}

export function createDeepLinkTarget(
  scenario: CompareScenario,
  platform: string,
) {
  return `/handoff?platform=${platform}&scenario=${scenario.id}&restaurant=${encodeURIComponent(
    scenario.restaurant,
  )}`;
}
