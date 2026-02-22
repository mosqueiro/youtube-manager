"use client";

import { useState, useEffect } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useVideos } from "@/hooks/useVideos";
import { useChannels } from "@/hooks/useChannels";
import { useAppStore } from "@/lib/store";
import { CalendarHeader } from "./CalendarHeader";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { VideoDetailModal } from "./VideoDetailModal";
import { ViewMode } from "@/lib/constants";
import { Video } from "@/types/video";
import { Skeleton } from "@/components/ui/Skeleton";
export function CalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const syncVersion = useAppStore((s) => s.syncVersion);
  const { videos, loading, fetchVideos, updateVideoPublishedAt } = useVideos();
  const { channels } = useChannels();
  const { days, title, fetchRange, navigate, goToToday } = useCalendar(
    videos,
    viewMode
  );

  useEffect(() => {
    fetchVideos(fetchRange.start, fetchRange.end);
  }, [fetchRange.start, fetchRange.end, fetchVideos, syncVersion]);

  return (
    <div>
      <CalendarHeader
        title={title}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNavigate={navigate}
        onToday={goToToday}
      />

      {loading && videos.length === 0 ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      ) : viewMode === "month" ? (
        <MonthView days={days} onVideoClick={setSelectedVideo} />
      ) : (
        <WeekView
          days={days}
          channels={channels}
          onVideoClick={setSelectedVideo}
        />
      )}

      <VideoDetailModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onUpdatePublishedAt={(videoId, newDate) => {
          updateVideoPublishedAt(videoId, newDate);
          setSelectedVideo((prev) =>
            prev && prev.id === videoId ? { ...prev, published_at: newDate } : prev
          );
        }}
      />
    </div>
  );
}
