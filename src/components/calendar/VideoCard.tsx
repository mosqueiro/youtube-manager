"use client";

import { Video } from "@/types/video";
import { formatDuration, formatTime, formatViewCount } from "@/lib/utils";
import { Clock, Eye, ThumbsUp, MessageCircle, CalendarClock } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

interface VideoCardProps {
  video: Video;
  compact?: boolean;
  onClick: () => void;
}

export function VideoCard({ video, compact, onClick }: VideoCardProps) {
  const time = formatTime(video.published_at);
  const { t } = useTranslation();
  const isScheduled = !!video.scheduled_at;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all hover:bg-slate-100/80 dark:hover:bg-white/5 ${isScheduled ? "border border-dashed border-amber-400/60 dark:border-amber-500/40" : ""}`}
      >
        <div
          className="h-2 w-2 flex-shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900"
          style={{ backgroundColor: video.channel_color || "#ff0000" }}
        />
        <span className="line-clamp-1 flex-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          {video.title}
        </span>
        {isScheduled && (
          <span className="flex-shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            {t("calendar.scheduled")}
          </span>
        )}
        <span className={`flex-shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${isScheduled ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"}`}>
          {time}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`group w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:bg-white/5 dark:hover:bg-white/8 dark:hover:shadow-none ${isScheduled ? "border-dashed border-amber-400/80 dark:border-amber-500/40" : "border-slate-200/80 dark:border-white/5"}`}
    >
      {/* Color accent bar */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: isScheduled ? "#f59e0b" : (video.channel_color || "#ff0000") }}
      />

      <div className="flex gap-2 p-2">
        {/* Thumbnail — left side */}
        {video.thumbnail_url && (
          <div className="relative w-[56px] flex-shrink-0 self-stretch overflow-hidden rounded-lg">
            <Image
              src={video.thumbnail_url}
              alt={video.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="128px"
              quality={90}
            />
            {video.duration && (
              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 py-0.5 text-[8px] font-semibold text-white backdrop-blur-sm">
                {formatDuration(video.duration)}
              </span>
            )}
          </div>
        )}

        {/* Right side — time + title */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className={`inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 ${isScheduled ? "bg-amber-50 dark:bg-amber-500/10" : "bg-green-50 dark:bg-green-500/10"}`}>
              {isScheduled ? (
                <CalendarClock className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Clock className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
              )}
              <span className={`text-[10px] font-bold tabular-nums ${isScheduled ? "text-amber-700 dark:text-amber-400" : "text-green-700 dark:text-green-400"}`}>
                {time}
              </span>
            </div>
            {isScheduled && (
              <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                {t("calendar.scheduled")}
              </span>
            )}
          </div>
          <p className="line-clamp-3 text-[11px] font-semibold leading-snug text-neutral-900 dark:text-white">
            {video.title}
          </p>
          {/* Stats row */}
          <div className="mt-auto flex items-center gap-2 text-[10px] font-medium tabular-nums text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" />
              {formatViewCount(video.view_count ?? 0)}
            </span>
            <span className="flex items-center gap-0.5">
              <ThumbsUp className="h-3 w-3" />
              {formatViewCount(video.like_count ?? 0)}
            </span>
            <span className="flex items-center gap-0.5">
              <MessageCircle className="h-3 w-3" />
              {formatViewCount(video.comment_count ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
