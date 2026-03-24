import type { AuthRole } from "@/lib/auth-role";
import type { PlatformKey } from "@/lib/home-content";

export type ReviewModerationStatus = "approved" | "pending" | "flagged";

export type ReviewRecord = {
  id: string;
  scenarioId: string;
  authorName: string;
  authorRole: AuthRole | "guest";
  rating: number;
  headline: string;
  body: string;
  createdAt: number;
  verified: boolean;
  helpfulCount: number;
  moderationStatus: ReviewModerationStatus;
  merchantReply: string | null;
  merchantReplyAt: number | null;
};

export type RewardCatalogItem = {
  id: string;
  title: string;
  brand: string;
  category: "discount" | "truemoney" | "coupon";
  pointsCost: number;
  valueLabel: string;
  stockLabel: string;
  summary: string;
  featured: boolean;
};

export type RewardRedemptionRecord = {
  id: string;
  rewardId: string;
  rewardTitle: string;
  pointsCost: number;
  status: "queued" | "approved" | "delivered";
  deliveryLabel: string;
  redeemedAt: number;
  claimCode: string;
};

export type DeepLinkSurface =
  | "home"
  | "compare-index"
  | "compare-detail"
  | "member"
  | "merchant";

export type AffiliateEvent = {
  id: string;
  scenarioId: string;
  platform: PlatformKey;
  surface: DeepLinkSurface;
  createdAt: number;
  targetUrl: string;
  label: string;
};

export type OcrJobStatus = "queued" | "auto-approved" | "human-review" | "resolved";

export type OcrJob = {
  id: string;
  receiptId: string;
  fileName: string;
  scenarioId: string;
  platform: PlatformKey;
  extractedText: string;
  confidence: number;
  truthScore: number;
  fraudSignals: string[];
  status: OcrJobStatus;
  createdAt: number;
};

export type FraudCase = {
  id: string;
  signal: string;
  account: string;
  severity: "low" | "medium" | "high";
  action: string;
  status: "open" | "monitoring" | "resolved";
  createdAt: number;
};

export type ModerationCase = {
  id: string;
  reviewId: string | null;
  source: "review" | "merchant-response" | "receipt";
  target: string;
  issue: string;
  status: "pending" | "needs-edit" | "approved" | "masked";
  createdAt: number;
};

export type PersonalizedRouteStop = {
  id: string;
  scenarioId: string;
  district: string;
  item: string;
  time: string;
  saving: number;
  reason: string;
};
