"use client";

import { useState, useMemo, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addDays,
  subDays,
  isSameMonth,
  isToday,
  format,
} from "date-fns";
import { Video } from "@/types/video";
import { CalendarDay } from "@/types/calendar";
import { ViewMode } from "@/lib/constants";
import { toLocalDate } from "@/lib/utils";

export function useCalendar(videos: Video[], viewMode: ViewMode, utcOffset: number = 0) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      setCurrentDate((prev) => {
        if (viewMode === "month") {
          return direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1);
        }
        // Week view: move 5 days at a time
        return direction === "prev" ? subDays(prev, 5) : addDays(prev, 5);
      });
    },
    [viewMode]
  );

  const goToToday = useCallback(() => setCurrentDate(new Date()), []);

  const dateRange = useMemo(() => {
    if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return {
        start: startOfWeek(monthStart),
        end: endOfWeek(monthEnd),
        displayStart: monthStart,
        displayEnd: monthEnd,
      };
    }
    // 5 columns: today in the middle (2 before, 2 after)
    const start = subDays(currentDate, 2);
    const end = addDays(currentDate, 2);
    return {
      start,
      end,
      displayStart: start,
      displayEnd: end,
    };
  }, [currentDate, viewMode]);

  const days: CalendarDay[] = useMemo(() => {
    const allDays = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    });

    return allDays.map((date) => {
      const dayStr = format(date, "yyyy-MM-dd");
      const dayVideos = videos.filter((v) => {
        return toLocalDate(v.published_at, utcOffset) === dayStr;
      });

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        videos: dayVideos,
      };
    });
  }, [dateRange, videos, currentDate, utcOffset]);

  const title = useMemo(() => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy");
    }
    return `${format(dateRange.start, "MMM d")} – ${format(dateRange.end, "MMM d, yyyy")}`;
  }, [currentDate, viewMode, dateRange]);

  // For fetching: expand by 1 day each side to cover UTC offset edge cases
  const fetchRange = useMemo(
    () => ({
      start: format(subDays(dateRange.start, 1), "yyyy-MM-dd"),
      end: format(addDays(dateRange.end, 2), "yyyy-MM-dd"),
    }),
    [dateRange]
  );

  return {
    currentDate,
    days,
    title,
    fetchRange,
    navigate,
    goToToday,
  };
}
