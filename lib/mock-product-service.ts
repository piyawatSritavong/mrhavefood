import {
  createDeepLinkTarget,
  getScenarioSeedById,
  initialFraudCases,
  initialModerationCases,
  initialOcrJobs,
  rewardsCatalog,
  seededReviews,
} from "@/lib/mock-product-content";
import type {
  AffiliateEvent,
  FraudCase,
  ModerationCase,
  OcrJob,
  RewardRedemptionRecord,
  ReviewRecord,
} from "@/lib/product-types";

type MockProductState = {
  affiliateEvents: AffiliateEvent[];
  fraudCases: FraudCase[];
  moderationCases: ModerationCase[];
  ocrJobs: OcrJob[];
  redemptions: RewardRedemptionRecord[];
  reviewsByScenario: Record<string, ReviewRecord[]>;
};

const globalForMockProduct = globalThis as {
  mockProductState?: MockProductState;
};

function cloneState(): MockProductState {
  return {
    affiliateEvents: [],
    fraudCases: structuredClone(initialFraudCases),
    moderationCases: structuredClone(initialModerationCases),
    ocrJobs: structuredClone(initialOcrJobs),
    redemptions: [],
    reviewsByScenario: structuredClone(seededReviews),
  };
}

function getMockState() {
  if (!globalForMockProduct.mockProductState) {
    globalForMockProduct.mockProductState = cloneState();
  }

  return globalForMockProduct.mockProductState;
}

function maybeCreateReviewModerationCase(review: ReviewRecord) {
  const riskyKeywords = ["ห่วย", "โกง", "ปลอม", "แย่จัด"];

  if (!riskyKeywords.some((keyword) => review.body.includes(keyword))) {
    return;
  }

  getMockState().moderationCases.unshift({
    id: crypto.randomUUID(),
    reviewId: review.id,
    source: "review",
    target: review.headline,
    issue: "Potentially abusive language",
    status: "pending",
    createdAt: Date.now(),
  });
}

export function listScenarioReviews(scenarioId: string) {
  const reviews = getMockState().reviewsByScenario[scenarioId] ?? [];

  return reviews
    .filter((review) => review.moderationStatus !== "flagged")
    .sort((reviewA, reviewB) => reviewB.createdAt - reviewA.createdAt);
}

export function createScenarioReview(input: {
  scenarioId: string;
  authorName: string;
  authorRole: ReviewRecord["authorRole"];
  rating: number;
  headline: string;
  body: string;
  verified: boolean;
}) {
  const review: ReviewRecord = {
    id: crypto.randomUUID(),
    scenarioId: input.scenarioId,
    authorName: input.authorName,
    authorRole: input.authorRole,
    rating: input.rating,
    headline: input.headline,
    body: input.body,
    createdAt: Date.now(),
    verified: input.verified,
    helpfulCount: 0,
    moderationStatus: "approved",
    merchantReply: null,
    merchantReplyAt: null,
  };

  const state = getMockState();
  const nextReviews = [review, ...(state.reviewsByScenario[input.scenarioId] ?? [])];
  state.reviewsByScenario[input.scenarioId] = nextReviews;
  maybeCreateReviewModerationCase(review);

  return review;
}

export function replyToReview(input: {
  reviewId: string;
  reply: string;
}) {
  const state = getMockState();

  for (const [scenarioId, reviews] of Object.entries(state.reviewsByScenario)) {
    const targetReview = reviews.find((review) => review.id === input.reviewId);

    if (!targetReview) {
      continue;
    }

    targetReview.merchantReply = input.reply;
    targetReview.merchantReplyAt = Date.now();

    if (input.reply.toLowerCase().includes("guarantee")) {
      state.moderationCases.unshift({
        id: crypto.randomUUID(),
        reviewId: targetReview.id,
        source: "merchant-response",
        target: targetReview.headline,
        issue: "Potential overclaim in merchant reply",
        status: "needs-edit",
        createdAt: Date.now(),
      });
    }

    state.reviewsByScenario[scenarioId] = [...reviews];
    return targetReview;
  }

  return null;
}

export function listRewardCatalog() {
  return rewardsCatalog;
}

export function redeemMockReward(input: {
  rewardId: string;
  memberKey: string;
}) {
  const reward = rewardsCatalog.find((item) => item.id === input.rewardId);

  if (!reward) {
    return null;
  }

  const redemption: RewardRedemptionRecord = {
    id: crypto.randomUUID(),
    rewardId: reward.id,
    rewardTitle: reward.title,
    pointsCost: reward.pointsCost,
    status: reward.category === "truemoney" ? "queued" : "approved",
    deliveryLabel:
      reward.category === "truemoney"
        ? "ทีมงานจะ push เครดิตเข้าบัญชีภายใน 24 ชม."
        : "รับโค้ด mock ได้ทันทีใน prototype",
    redeemedAt: Date.now(),
    claimCode: `MF-${reward.id.toUpperCase().slice(0, 6)}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`,
  };

  getMockState().redemptions.unshift(redemption);

  return redemption;
}

export function listRewardRedemptions() {
  return getMockState().redemptions.slice(0, 8);
}

export function trackAffiliateEvent(input: {
  platform: AffiliateEvent["platform"];
  scenarioId: string;
  surface: AffiliateEvent["surface"];
}) {
  const scenario = getScenarioSeedById(input.scenarioId);

  if (!scenario) {
    return null;
  }

  const event: AffiliateEvent = {
    id: crypto.randomUUID(),
    scenarioId: input.scenarioId,
    platform: input.platform,
    surface: input.surface,
    createdAt: Date.now(),
    targetUrl: createDeepLinkTarget(scenario, input.platform),
    label: `${scenario.title} via ${input.platform}`,
  };

  getMockState().affiliateEvents.unshift(event);

  return event;
}

export function listAffiliateEvents() {
  return getMockState().affiliateEvents.slice(0, 24);
}

export function analyzeMockReceipt(input: {
  receiptId: string;
  scenarioId: string;
  platform: OcrJob["platform"];
  fileName: string;
}) {
  const scenario = getScenarioSeedById(input.scenarioId);

  if (!scenario) {
    return null;
  }

  const lowerFileName = input.fileName.toLowerCase();
  const confidence = lowerFileName.includes("blur")
    ? 78
    : lowerFileName.includes("night")
      ? 84
      : 96;
  const fraudSignals = lowerFileName.includes("duplicate")
    ? ["duplicate-hash"]
    : lowerFileName.includes("edited")
      ? ["possible-image-edit"]
      : [];
  const truthScore = Math.max(62, confidence - fraudSignals.length * 14);
  const status =
    confidence >= 90 && fraudSignals.length === 0
      ? "auto-approved"
      : "human-review";
  const job: OcrJob = {
    id: crypto.randomUUID(),
    receiptId: input.receiptId,
    fileName: input.fileName,
    scenarioId: input.scenarioId,
    platform: input.platform,
    extractedText: `${scenario.title} / ${input.platform} / ${scenario.restaurant}`,
    confidence,
    truthScore,
    fraudSignals,
    status,
    createdAt: Date.now(),
  };

  const state = getMockState();
  state.ocrJobs.unshift(job);

  if (fraudSignals.length) {
    state.fraudCases.unshift({
      id: crypto.randomUUID(),
      signal: fraudSignals.join(", "),
      account: input.fileName,
      severity: "medium",
      action: "Require manual receipt verification",
      status: "open",
      createdAt: Date.now(),
    });
  }

  if (status === "human-review") {
    state.moderationCases.unshift({
      id: crypto.randomUUID(),
      reviewId: null,
      source: "receipt",
      target: input.fileName,
      issue: "Receipt OCR confidence below auto-approve threshold",
      status: "pending",
      createdAt: Date.now(),
    });
  }

  return job;
}

export function listOperationsSnapshot() {
  const state = getMockState();

  return {
    affiliateEvents: listAffiliateEvents(),
    fraudCases: [...state.fraudCases].sort((a, b) => b.createdAt - a.createdAt),
    moderationCases: [...state.moderationCases].sort(
      (a, b) => b.createdAt - a.createdAt,
    ),
    ocrJobs: [...state.ocrJobs].sort((a, b) => b.createdAt - a.createdAt),
  };
}

export function updateOperationStatus(input: {
  entity: "ocr" | "fraud" | "moderation";
  id: string;
  status: string;
}) {
  const state = getMockState();

  if (input.entity === "ocr") {
    const target = state.ocrJobs.find((job) => job.id === input.id);

    if (target) {
      target.status = input.status as OcrJob["status"];
      return target;
    }
  }

  if (input.entity === "fraud") {
    const target = state.fraudCases.find((job) => job.id === input.id);

    if (target) {
      target.status = input.status as FraudCase["status"];
      return target;
    }
  }

  if (input.entity === "moderation") {
    const target = state.moderationCases.find((job) => job.id === input.id);

    if (target) {
      target.status = input.status as ModerationCase["status"];
      return target;
    }
  }

  return null;
}
