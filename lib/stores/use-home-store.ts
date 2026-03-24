import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { HomeStore } from "@/lib/stores/home-store-types";
import { createCompareSlice } from "@/lib/stores/slices/create-compare-slice";
import { createMemberSlice } from "@/lib/stores/slices/create-member-slice";
import { createPersistenceSlice } from "@/lib/stores/slices/create-persistence-slice";
import { createReceiptSlice } from "@/lib/stores/slices/create-receipt-slice";
import { createUISlice } from "@/lib/stores/slices/create-ui-slice";

export const useHomeStore = create<HomeStore>()(
  persist(
    (...store) => ({
      ...createUISlice(...store),
      ...createCompareSlice(...store),
      ...createMemberSlice(...store),
      ...createReceiptSlice(...store),
      ...createPersistenceSlice(...store),
    }),
    {
      name: "mr-have-food-home-store-v3",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeSection: state.activeSection,
        searchQuery: state.searchQuery,
        selectedAudience: state.selectedAudience,
        selectedScenarioId: state.selectedScenarioId,
        selectedPlatform: state.selectedPlatform,
      }),
    },
  ),
);
