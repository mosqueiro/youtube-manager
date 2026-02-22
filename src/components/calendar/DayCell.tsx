"use client";

import { CalendarDay } from "@/types/calendar";
import { Video } from "@/types/video";
import { VideoCard } from "./VideoCard";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DayCellProps {
  day: CalendarDay;
  onVideoClick: (video: Video) => void;
}

export function DayCell({ day, onVideoClick }: DayCellProps) {
  const dateNum = format(day.date, "d");
  const isEmpty = day.videos.length === 0;

  return (
    <div
      className={cn(
        "min-h-[110px] border-b border-r border-zinc-200 dark:border-zinc-800",
        !day.isCurrentMonth && "bg-zinc-50/50 dark:bg-zinc-900/30",
        day.isToday && "bg-red-50/40 dark:bg-red-950/10",
        isEmpty && day.isCurrentMonth && "bg-red-50/20 dark:bg-red-950/5"
      )}
    >
      <div className="flex items-center justify-between p-1.5">
        <span
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
            day.isToday
              ? "bg-[#ff0000] text-white"
              : !day.isCurrentMonth
                ? "text-zinc-300 dark:text-zinc-600"
                : "text-zinc-700 dark:text-zinc-300"
          )}
        >
          {dateNum}
        </span>
        {day.videos.length > 0 && (
          <span className="flex gap-0.5">
            {/* Channel color dots — show unique channels that posted */}
            {[...new Set(day.videos.map((v) => v.channel_color))].map(
              (color, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color || "#3B82F6" }}
                />
              )
            )}
          </span>
        )}
      </div>
      <div className="video-scroll max-h-[140px] space-y-0.5 overflow-y-auto px-1 pb-1">
        {day.videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            compact
            onClick={() => onVideoClick(video)}
          />
        ))}
      </div>
    </div>
  );
}
