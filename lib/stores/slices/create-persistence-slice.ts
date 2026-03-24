import type { StateCreator } from "zustand";

import { createGuestMemberState } from "@/lib/stores/member-state";
import type {
  HomeStore,
  PersistenceSlice,
} from "@/lib/stores/home-store-types";

export const createPersistenceSlice: StateCreator<
  HomeStore,
  [["zustand/persist", unknown]],
  [],
  PersistenceSlice
> = (set) => ({
  memberStateOwnerKey: null,
  memberStateResolved: true,
  memberSyncStatus: "guest",
  applyPersistedMemberState: ({ ownerKey, state }) =>
    set({
      memberStateOwnerKey: ownerKey,
      memberStateResolved: true,
      memberSyncStatus: "ready",
      favoriteScenarioIds: [...state.favoriteScenarioIds],
      priceAlerts: state.priceAlerts.map((alert) => ({ ...alert })),
      rewardPoints: state.rewardPoints,
      latestReceipt: state.latestReceipt ? { ...state.latestReceipt } : null,
      receiptHistory: state.receiptHistory.map((receipt) => ({ ...receipt })),
    }),
  resetMemberStateToGuest: () => {
    const guestState = createGuestMemberState();

    set({
      memberStateOwnerKey: null,
      memberStateResolved: true,
      memberSyncStatus: "guest",
      favoriteScenarioIds: guestState.favoriteScenarioIds,
      priceAlerts: guestState.priceAlerts,
      rewardPoints: guestState.rewardPoints,
      latestReceipt: guestState.latestReceipt,
      receiptHistory: guestState.receiptHistory,
    });
  },
  setMemberSyncStatus: (memberSyncStatus) =>
    set({
      memberSyncStatus,
      memberStateResolved: memberSyncStatus !== "loading",
    }),
});
