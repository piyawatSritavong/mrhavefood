import type { AudienceKey, PlatformKey, SectionId } from "@/lib/home-content";

export type PriceAlert = {
  id: string;
  scenarioId: string;
  platform: PlatformKey;
  targetPrice: number;
  enabled: boolean;
  createdAt: number;
};

export type ReceiptStatus = "processing" | "verified";

export type ReceiptRecord = {
  id: string;
  fileName: string;
  scenarioId: string;
  platform: PlatformKey;
  restaurant: string;
  itemName: string;
  district: string;
  totalPrice: number;
  createdAt: number;
  verifiedAt: number | null;
  status: ReceiptStatus;
  pointsAwarded: number;
  ocrConfidence: number | null;
  truthScore: number | null;
  fraudSignals: string[];
  reviewStatus: "queued" | "auto-approved" | "human-review";
};

export type PersistedMemberState = {
  favoriteScenarioIds: string[];
  priceAlerts: PriceAlert[];
  rewardPoints: number;
  latestReceipt: ReceiptRecord | null;
  receiptHistory: ReceiptRecord[];
};

export type MemberSyncStatus = "guest" | "loading" | "ready" | "saving" | "error";

export type UISlice = {
  activeSection: SectionId;
  selectedAudience: AudienceKey;
  setActiveSection: (section: SectionId) => void;
  setSelectedAudience: (audience: AudienceKey) => void;
};

export type CompareSlice = {
  searchQuery: string;
  selectedScenarioId: string;
  selectedPlatform: PlatformKey;
  setSearchQuery: (query: string) => void;
  setSelectedScenario: (scenarioId: string) => void;
  setSelectedPlatform: (platform: PlatformKey) => void;
};

export type MemberSlice = {
  favoriteScenarioIds: string[];
  priceAlerts: PriceAlert[];
  rewardPoints: number;
  adjustRewardPoints: (delta: number) => void;
  toggleFavoriteScenario: (scenarioId: string) => void;
  createPriceAlert: (input: { scenarioId: string; platform: PlatformKey; targetPrice: number }) => void;
  removePriceAlert: (alertId: string) => void;
  togglePriceAlertEnabled: (alertId: string) => void;
};

export type ReceiptSlice = {
  latestReceipt: ReceiptRecord | null;
  receiptHistory: ReceiptRecord[];
  uploadReceipt: (input: { fileName: string; scenarioId: string; platform: PlatformKey }) => void;
  applyReceiptAnalysis: (input: {
    receiptId: string;
    confidence: number;
    truthScore: number;
    fraudSignals: string[];
    reviewStatus: ReceiptRecord["reviewStatus"];
    pointsAwarded: number;
  }) => void;
  verifyLatestReceipt: () => void;
};

export type PersistenceSlice = {
  memberStateOwnerKey: string | null;
  memberStateResolved: boolean;
  memberSyncStatus: MemberSyncStatus;
  applyPersistedMemberState: (input: {
    ownerKey: string;
    state: PersistedMemberState;
  }) => void;
  resetMemberStateToGuest: () => void;
  setMemberSyncStatus: (status: MemberSyncStatus) => void;
};

export type HomeStore =
  & UISlice
  & CompareSlice
  & MemberSlice
  & ReceiptSlice
  & PersistenceSlice;
