"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppStore {
  syncVersion: number;
  bumpSync: () => void;
  utcOffset: number; // e.g. -3 for BRT
  setUtcOffset: (offset: number) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      syncVersion: 0,
      bumpSync: () => set((s) => ({ syncVersion: s.syncVersion + 1 })),
      utcOffset: -3, // default BRT
      setUtcOffset: (offset: number) => set({ utcOffset: offset }),
    }),
    {
      name: "yt-manager-settings",
      partialize: (state) => ({ utcOffset: state.utcOffset }),
    }
  )
);
