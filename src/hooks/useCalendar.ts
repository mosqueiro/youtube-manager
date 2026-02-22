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

export function useCalendar(videos: Video[], viewMode: ViewMode) {
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
        const vDate = format(new Date(v.published_at), "yyyy-MM-dd");
        return vDate === dayStr;
      });

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        videos: dayVideos,
      };
    });
  }, [dateRange, videos, currentDate]);

  const title = useMemo(() => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy");
    }
    return `${format(dateRange.start, "MMM d")} – ${format(dateRange.end, "MMM d, yyyy")}`;
  }, [currentDate, viewMode, dateRange]);

  // For fetching: the actual date range we need data for
  const fetchRange = useMemo(
    () => ({
      start: format(dateRange.start, "yyyy-MM-dd"),
      end: format(
        new Date(dateRange.end.getTime() + 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
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
