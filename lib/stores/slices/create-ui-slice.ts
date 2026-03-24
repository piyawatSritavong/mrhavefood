import type { StateCreator } from "zustand";

import type { HomeStore, UISlice } from "@/lib/stores/home-store-types";

export const createUISlice: StateCreator<
  HomeStore,
  [["zustand/persist", unknown]],
  [],
  UISlice
> = (set) => ({
  activeSection: "vision",
  selectedAudience: "member",
  setActiveSection: (activeSection) => set({ activeSection }),
  setSelectedAudience: (selectedAudience) => set({ selectedAudience }),
});
