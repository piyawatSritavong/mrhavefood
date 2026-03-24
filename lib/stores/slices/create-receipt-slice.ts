import type { StateCreator } from "zustand";

import { getOfferForPlatform, getScenarioById } from "@/lib/home-content";
import { createGuestMemberState } from "@/lib/stores/member-state";
import type { HomeStore, ReceiptRecord, ReceiptSlice } from "@/lib/stores/home-store-types";

function createReceiptRecord(input: {
  fileName: string;
  scenarioId: string;
  restaurant: string;
  itemName: string;
  district: string;
  platform: ReceiptRecord["platform"];
  totalPrice: number;
  createdAt: number;
  status: ReceiptRecord["status"];
  verifiedAt: number | null;
  pointsAwarded: number;
  ocrConfidence: number | null;
  truthScore: number | null;
  fraudSignals: string[];
  reviewStatus: ReceiptRecord["reviewStatus"];
}) {
  return {
    id: `${input.scenarioId}-${input.platform}-${input.createdAt}`,
    ...input,
  } satisfies ReceiptRecord;
}

export const createReceiptSlice: StateCreator<
  HomeStore,
  [["zustand/persist", unknown]],
  [],
  ReceiptSlice
> = (set) => {
  const guestState = createGuestMemberState();

  return {
    latestReceipt: guestState.latestReceipt,
    receiptHistory: guestState.receiptHistory,
    uploadReceipt: ({ fileName, scenarioId, platform }) =>
      set((state) => {
        const scenario = getScenarioById(scenarioId);
        const offer = scenario ? getOfferForPlatform(scenario, platform) : undefined;

        if (!scenario || !offer) {
          return state;
        }

        const createdAt = Date.now();
        const record = createReceiptRecord({
          fileName,
          scenarioId,
          restaurant: scenario.restaurant,
          itemName: scenario.title,
          district: scenario.district,
          platform,
          totalPrice: offer.totalPrice,
          createdAt,
          status: "processing",
          verifiedAt: null,
          pointsAwarded: 0,
          ocrConfidence: null,
          truthScore: null,
          fraudSignals: [],
          reviewStatus: "queued",
        });

        return {
          latestReceipt: record,
          receiptHistory: [record, ...state.receiptHistory].slice(0, 5),
        };
      }),
    applyReceiptAnalysis: ({
      receiptId,
      confidence,
      truthScore,
      fraudSignals,
      reviewStatus,
      pointsAwarded,
    }) =>
      set((state) => {
        const targetReceipt = state.receiptHistory.find((receipt) => receipt.id === receiptId);

        if (!targetReceipt) {
          return state;
        }

        const verifiedAt = reviewStatus === "auto-approved" ? Date.now() : null;
        const nextStatus = reviewStatus === "auto-approved" ? "verified" : "processing";
        const pointsDelta =
          nextStatus === "verified" && targetReceipt.status !== "verified"
            ? pointsAwarded
            : 0;
        const analyzedReceipt: ReceiptRecord = {
          ...targetReceipt,
          status: nextStatus,
          verifiedAt,
          pointsAwarded: pointsDelta,
          ocrConfidence: confidence,
          truthScore,
          fraudSignals,
          reviewStatus,
        };

        return {
          latestReceipt:
            state.latestReceipt?.id === receiptId ? analyzedReceipt : state.latestReceipt,
          rewardPoints: state.rewardPoints + pointsDelta,
          receiptHistory: state.receiptHistory.map((receipt) =>
            receipt.id === receiptId ? analyzedReceipt : receipt,
          ),
        };
      }),
    verifyLatestReceipt: () =>
      set((state) => {
        if (!state.latestReceipt || state.latestReceipt.status === "verified") {
          return state;
        }

        const verifiedAt = Date.now();
        const verifiedReceipt: ReceiptRecord = {
          ...state.latestReceipt,
          status: "verified",
          verifiedAt,
          pointsAwarded: 120,
          ocrConfidence: state.latestReceipt.ocrConfidence ?? 97,
          truthScore: state.latestReceipt.truthScore ?? 92,
          fraudSignals: state.latestReceipt.fraudSignals,
          reviewStatus: "auto-approved",
        };

        return {
          latestReceipt: verifiedReceipt,
          rewardPoints: state.rewardPoints + 120,
          receiptHistory: state.receiptHistory.map((receipt) =>
            receipt.id === verifiedReceipt.id ? verifiedReceipt : receipt,
          ),
        };
      }),
  };
};
