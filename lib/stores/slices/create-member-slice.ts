import type { StateCreator } from "zustand";

import { createGuestMemberState } from "@/lib/stores/member-state";
import type { HomeStore, MemberSlice } from "@/lib/stores/home-store-types";

export const createMemberSlice: StateCreator<
  HomeStore,
  [["zustand/persist", unknown]],
  [],
  MemberSlice
> = (set) => {
  const guestState = createGuestMemberState();

  return {
    favoriteScenarioIds: guestState.favoriteScenarioIds,
    priceAlerts: guestState.priceAlerts,
    rewardPoints: guestState.rewardPoints,
    adjustRewardPoints: (delta) =>
      set((state) => ({
        rewardPoints: Math.max(0, state.rewardPoints + delta),
      })),
    toggleFavoriteScenario: (scenarioId) =>
      set((state) => ({
        favoriteScenarioIds: state.favoriteScenarioIds.includes(scenarioId)
          ? state.favoriteScenarioIds.filter((id) => id !== scenarioId)
          : [...state.favoriteScenarioIds, scenarioId],
      })),
    createPriceAlert: ({ scenarioId, platform, targetPrice }) =>
      set((state) => {
        const id = `${scenarioId}-${platform}-${targetPrice}`;
        const existingAlert = state.priceAlerts.find((alert) => alert.id === id);

        if (existingAlert) {
          return {
            priceAlerts: state.priceAlerts.map((alert) =>
              alert.id === id ? { ...alert, enabled: true } : alert,
            ),
          };
        }

        return {
          priceAlerts: [
            {
              id,
              scenarioId,
              platform,
              targetPrice,
              enabled: true,
              createdAt: Date.now(),
            },
            ...state.priceAlerts,
          ],
        };
      }),
    removePriceAlert: (alertId) =>
      set((state) => ({
        priceAlerts: state.priceAlerts.filter((alert) => alert.id !== alertId),
      })),
    togglePriceAlertEnabled: (alertId) =>
      set((state) => ({
        priceAlerts: state.priceAlerts.map((alert) =>
          alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert,
        ),
      })),
  };
};
