import type { StateCreator } from "zustand";

import type { HomeStore, UISlice } from "@/lib/stores/home-store-types";

export const createUISlice: StateCreator<
  HomeStore,
  [["zustand/persist", unknown]],
  [],
  UISlice
> = (set) => ({
  activeSection: "main",
  setActiveSection: (activeSection) => set({ activeSection }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  chatOpen: false,
  setChatOpen: (chatOpen) => set({ chatOpen }),
});
