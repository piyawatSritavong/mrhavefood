import type { StateCreator } from "zustand";

import { compareScenarios, getBestOffer, getScenarioById } from "@/lib/home-content";
import type { CompareSlice, HomeStore } from "@/lib/stores/home-store-types";

const defaultScenario = compareScenarios[0];

export const createCompareSlice: StateCreator<
  HomeStore,
  [["zustand/persist", unknown]],
  [],
  CompareSlice
> = (set) => ({
  searchQuery: "",
  selectedScenarioId: defaultScenario.id,
  selectedPlatform: getBestOffer(defaultScenario).platform,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedScenario: (selectedScenarioId) =>
    set(() => {
      const scenario = getScenarioById(selectedScenarioId) ?? defaultScenario;

      return {
        selectedScenarioId: scenario.id,
        selectedPlatform: getBestOffer(scenario).platform,
      };
    }),
  setSelectedPlatform: (selectedPlatform) => set({ selectedPlatform }),
});
