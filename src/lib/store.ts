"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale } from "@/lib/i18n";

interface AppStore {
  syncVersion: number;
  bumpSync: () => void;
  channelsVersion: number;
  bumpChannels: () => void;
  utcOffset: number; // e.g. -3 for BRT
  setUtcOffset: (offset: number) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      syncVersion: 0,
      bumpSync: () => set((s) => ({ syncVersion: s.syncVersion + 1 })),
      channelsVersion: 0,
      bumpChannels: () => set((s) => ({ channelsVersion: s.channelsVersion + 1 })),
      utcOffset: -3, // default BRT
      setUtcOffset: (offset: number) => set({ utcOffset: offset }),
      locale: "en",
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: "yt-manager-settings",
      partialize: (state) => ({ utcOffset: state.utcOffset, locale: state.locale }),
    }
  )
);
