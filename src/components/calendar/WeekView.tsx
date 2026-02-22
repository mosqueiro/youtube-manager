"use client";

import { CalendarDay } from "@/types/calendar";
import { Video } from "@/types/video";
import { Channel } from "@/types/channel";
import { VideoCard } from "./VideoCard";
import { format, isPast, isToday as isTodayFn, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

interface WeekViewProps {
  days: CalendarDay[];
  channels: Channel[];
  onVideoClick: (video: Video) => void;
}

export function WeekView({ days, channels, onVideoClick }: WeekViewProps) {
  const utcOffset = useAppStore((s) => s.utcOffset);

  return (
    <div className="space-y-4">
      {/* Day headers — sticky row */}
      <div className="grid min-w-[750px] gap-0" style={{ gridTemplateColumns: "140px repeat(5, 1fr)" }}>
        <div className="rounded-xl bg-neutral-100/80 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:bg-[#272727]/50 dark:text-neutral-500">
          Channel
        </div>
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              "px-2 py-3 text-center",
              day.isToday
                ? "rounded-xl bg-red-50 dark:bg-red-500/10"
                : ""
            )}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
              {format(day.date, "EEE")}
            </div>
            <div
              className={cn(
                "mt-0.5 text-2xl font-extrabold leading-tight tracking-tight",
                day.isToday
                  ? "text-[#cc0000] dark:text-[#ff4e45]"
                  : "text-neutral-800 dark:text-neutral-200"
              )}
            >
              {format(day.date, "d")}
            </div>
            <div className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
              {format(day.date, "MMM")}
            </div>
            {day.isToday && (
              <div className="mx-auto mt-1 h-1 w-5 rounded-full bg-[#ff0000]" />
            )}
          </div>
        ))}
      </div>

      {/* Channel rows — each is its own card */}
      {channels.map((channel) => {
        const goal = channel.videos_per_day || 1;

        return (
          <div
            key={channel.id}
            className="overflow-hidden rounded-2xl border border-neutral-200/60 shadow-sm dark:border-[#3f3f3f]/60"
            style={{ borderLeftWidth: "4px", borderLeftColor: channel.color }}
          >
            <div
              className="grid min-w-[750px]"
              style={{ gridTemplateColumns: "140px repeat(5, 1fr)" }}
            >
              {/* Channel label */}
              <div className="flex items-center gap-2.5 bg-neutral-50/80 px-3 py-3 dark:bg-[#1a1a1a]">
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm dark:ring-[#272727]">
                  {channel.avatar_url ? (
                    <Image
                      src={channel.avatar_url}
                      alt={channel.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: channel.color }}
                    >
                      {channel.name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-neutral-700 dark:text-neutral-200">
                    {channel.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <div
                      className="h-1.5 w-5 rounded-full"
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                      {goal}/day
                    </span>
                  </div>
                </div>
              </div>

              {/* Day cells */}
              {days.map((day, i) => {
                const channelVideos = day.videos.filter(
                  (v) => v.channel_id === channel.id
                );
                const count = channelVideos.length;
                const missing = Math.max(0, goal - count);
                const dayStart = startOfDay(day.date);
                const isInPast = isPast(dayStart) && !isTodayFn(dayStart);

                return (
                  <div
                    key={i}
                    className={cn(
                      "border-l border-neutral-200/40 p-1.5 dark:border-[#3f3f3f]/40",
                      day.isToday && "bg-red-50/30 dark:bg-red-500/[0.03]",
                      missing > 0 &&
                        !isInPast &&
                        "bg-amber-50/30 dark:bg-amber-500/[0.02]"
                    )}
                  >
                    <div className="video-scroll flex flex-col gap-1.5 overflow-y-auto">
                      {channelVideos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          onClick={() => onVideoClick(video)}
                        />
                      ))}

                      {/* Empty slots — ghost card style */}
                      {missing > 0 && !isInPast &&
                        Array.from({ length: missing }).map((_, j) => (
                          <div
                            key={`slot-${j}`}
                            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-amber-300/60 bg-gradient-to-br from-amber-50/80 to-orange-50/50 px-3 py-3 dark:border-amber-500/20 dark:from-amber-500/5 dark:to-orange-500/5"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                                Needs video
                              </p>
                              <p className="text-[10px] text-amber-500/70 dark:text-amber-500/50">
                                Slot available
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* Past days with missing */}
                      {missing > 0 && isInPast &&
                        Array.from({ length: missing }).map((_, j) => (
                          <div
                            key={`missed-${j}`}
                            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-200/60 bg-neutral-50/50 px-3 py-3 opacity-50 dark:border-white/5 dark:bg-white/[0.02]"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/5">
                              <AlertCircle className="h-4 w-4 text-neutral-400" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500">
                                Missed
                              </p>
                              <p className="text-[10px] text-neutral-300 dark:text-neutral-600">
                                No video posted
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {channels.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 py-16 dark:border-[#3f3f3f]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/5">
            <AlertCircle className="h-6 w-6 text-neutral-300 dark:text-neutral-600" />
          </div>
          <p className="font-semibold text-neutral-500 dark:text-neutral-400">
            No channels yet
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            Go to Settings to add your YouTube channels.
          </p>
        </div>
      )}
    </div>
  );
}
