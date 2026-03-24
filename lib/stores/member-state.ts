import type { PlatformKey } from "@/lib/home-content";
import type {
  HomeStore,
  PersistedMemberState,
  PriceAlert,
  ReceiptRecord,
} from "@/lib/stores/home-store-types";

const guestSeedCreatedAt = Date.UTC(2026, 2, 23, 8, 0, 0);
const guestSeedReceiptTime = Date.UTC(2026, 2, 22, 12, 15, 0);

const guestMemberStateSeed = {
  favoriteScenarioIds: ["krapao-thonglor"],
  priceAlerts: [
    {
      id: "krapao-thonglor-line-man-149",
      scenarioId: "krapao-thonglor",
      platform: "line-man",
      targetPrice: 149,
      enabled: true,
      createdAt: guestSeedCreatedAt,
    },
  ],
  rewardPoints: 120,
  latestReceipt: null,
  receiptHistory: [
    {
      id: "chicken-rice-ari-line-man-guest-seed",
      fileName: "ari-lunch-proof.jpg",
      scenarioId: "chicken-rice-ari",
      platform: "line-man",
      restaurant: "เฮียช้าง ข้าวมันไก่อารีย์",
      itemName: "ข้าวมันไก่ + ชาเย็น",
      district: "Ari",
      totalPrice: 128,
      createdAt: guestSeedReceiptTime,
      verifiedAt: guestSeedReceiptTime + 45_000,
      status: "verified",
      pointsAwarded: 120,
      ocrConfidence: 98,
      truthScore: 94,
      fraudSignals: [],
      reviewStatus: "auto-approved",
    },
  ],
} satisfies PersistedMemberState;

const emptyMemberStateSeed = {
  favoriteScenarioIds: [],
  priceAlerts: [],
  rewardPoints: 0,
  latestReceipt: null,
  receiptHistory: [],
} satisfies PersistedMemberState;

function clonePriceAlert(alert: PriceAlert): PriceAlert {
  return { ...alert };
}

function cloneReceiptRecord(receipt: ReceiptRecord): ReceiptRecord {
  return { ...receipt };
}

export function clonePersistedMemberState(
  state: PersistedMemberState,
): PersistedMemberState {
  return {
    favoriteScenarioIds: [...state.favoriteScenarioIds],
    priceAlerts: state.priceAlerts.map(clonePriceAlert),
    rewardPoints: state.rewardPoints,
    latestReceipt: state.latestReceipt ? cloneReceiptRecord(state.latestReceipt) : null,
    receiptHistory: state.receiptHistory.map(cloneReceiptRecord),
  };
}

export function createGuestMemberState(): PersistedMemberState {
  return clonePersistedMemberState(guestMemberStateSeed);
}

export function createEmptyPersistedMemberState(): PersistedMemberState {
  return clonePersistedMemberState(emptyMemberStateSeed);
}

export function createPersistedMemberStateFromStore(
  state: Pick<
    HomeStore,
    | "favoriteScenarioIds"
    | "priceAlerts"
    | "rewardPoints"
    | "latestReceipt"
    | "receiptHistory"
  >,
): PersistedMemberState {
  return clonePersistedMemberState({
    favoriteScenarioIds: state.favoriteScenarioIds,
    priceAlerts: state.priceAlerts,
    rewardPoints: state.rewardPoints,
    latestReceipt: state.latestReceipt,
    receiptHistory: state.receiptHistory,
  });
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function isPlatformKey(value: unknown): value is PlatformKey {
  return value === "grab" || value === "line-man" || value === "shopeefood";
}

function isReceiptStatus(value: unknown): value is ReceiptRecord["status"] {
  return value === "processing" || value === "verified";
}

function normalizeNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizePriceAlert(value: unknown): PriceAlert | null {
  if (!isRecord(value) || !isPlatformKey(value.platform)) {
    return null;
  }

  return {
    id: normalizeString(value.id),
    scenarioId: normalizeString(value.scenarioId),
    platform: value.platform,
    targetPrice: normalizeNumber(value.targetPrice),
    enabled: typeof value.enabled === "boolean" ? value.enabled : true,
    createdAt: normalizeNumber(value.createdAt),
  };
}

function normalizeReceiptRecord(value: unknown): ReceiptRecord | null {
  if (
    !isRecord(value) ||
    !isPlatformKey(value.platform) ||
    !isReceiptStatus(value.status)
  ) {
    return null;
  }

  return {
    id: normalizeString(value.id),
    fileName: normalizeString(value.fileName),
    scenarioId: normalizeString(value.scenarioId),
    platform: value.platform,
    restaurant: normalizeString(value.restaurant),
    itemName: normalizeString(value.itemName),
    district: normalizeString(value.district),
    totalPrice: normalizeNumber(value.totalPrice),
    createdAt: normalizeNumber(value.createdAt),
    verifiedAt:
      value.verifiedAt === null ? null : normalizeNumber(value.verifiedAt, 0),
    status: value.status,
    pointsAwarded: normalizeNumber(value.pointsAwarded),
    ocrConfidence:
      value.ocrConfidence === null ? null : normalizeNumber(value.ocrConfidence, 0),
    truthScore:
      value.truthScore === null ? null : normalizeNumber(value.truthScore, 0),
    fraudSignals: Array.isArray(value.fraudSignals)
      ? value.fraudSignals.filter((signal): signal is string => typeof signal === "string")
      : [],
    reviewStatus:
      value.reviewStatus === "auto-approved" || value.reviewStatus === "human-review"
        ? value.reviewStatus
        : "queued",
  };
}

export function normalizePersistedMemberState(
  value: unknown,
): PersistedMemberState {
  if (!isRecord(value)) {
    return createEmptyPersistedMemberState();
  }

  return {
    favoriteScenarioIds: Array.isArray(value.favoriteScenarioIds)
      ? value.favoriteScenarioIds.filter(
          (scenarioId): scenarioId is string => typeof scenarioId === "string",
        )
      : [],
    priceAlerts: Array.isArray(value.priceAlerts)
      ? value.priceAlerts
          .map(normalizePriceAlert)
          .filter((alert): alert is PriceAlert => alert !== null)
      : [],
    rewardPoints: Math.max(0, normalizeNumber(value.rewardPoints)),
    latestReceipt: normalizeReceiptRecord(value.latestReceipt),
    receiptHistory: Array.isArray(value.receiptHistory)
      ? value.receiptHistory
          .map(normalizeReceiptRecord)
          .filter((receipt): receipt is ReceiptRecord => receipt !== null)
          .slice(0, 12)
      : [],
  };
}
