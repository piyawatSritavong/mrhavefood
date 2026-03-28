import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { HomeStore } from "@/lib/stores/home-store-types";
import { createUISlice } from "@/lib/stores/slices/create-ui-slice";

export const useHomeStore = create<HomeStore>()(
  persist(
    (...store) => ({
      ...createUISlice(...store),
    }),
    {
      name: "mr-have-food-home-store-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeSection: state.activeSection,
      }),
    },
  ),
);
