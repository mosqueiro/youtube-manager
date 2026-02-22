"use client";

import { CalendarDay } from "@/types/calendar";
import { Video } from "@/types/video";
import { DayCell } from "./DayCell";
import { DAYS_OF_WEEK } from "@/lib/i18n";
import { useTranslation } from "@/hooks/useTranslation";

interface MonthViewProps {
  days: CalendarDay[];
  onVideoClick: (video: Video) => void;
}

export function MonthView({ days, onVideoClick }: MonthViewProps) {
  const { locale } = useTranslation();
  const localizedDays = DAYS_OF_WEEK[locale];

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      {/* Day headers */}
      <div className="calendar-grid border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {localizedDays.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Day cells */}
      <div className="calendar-grid">
        {days.map((day, i) => (
          <DayCell key={i} day={day} onVideoClick={onVideoClick} />
        ))}
      </div>
    </div>
  );
}
