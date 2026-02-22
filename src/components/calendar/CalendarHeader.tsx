"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ViewMode } from "@/lib/constants";

interface CalendarHeaderProps {
  title: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onToday: () => void;
}

export function CalendarHeader({
  title,
  viewMode,
  onViewModeChange,
  onNavigate,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h1>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onNavigate("prev")}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-[#272727] dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onNavigate("next")}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-[#272727] dark:hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 dark:border-[#3f3f3f] dark:bg-[#272727] dark:text-neutral-300 dark:hover:bg-[#3f3f3f]"
        >
          Today
        </button>
        <div className="flex overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-[#3f3f3f] dark:bg-[#272727]">
          <button
            onClick={() => onViewModeChange("month")}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              viewMode === "month"
                ? "bg-[#ff0000] text-white"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-[#3f3f3f]"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onViewModeChange("week")}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              viewMode === "week"
                ? "bg-[#ff0000] text-white"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-[#3f3f3f]"
            }`}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
}
