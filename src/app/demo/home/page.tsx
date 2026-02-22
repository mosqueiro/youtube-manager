"use client";

import { useState } from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { WeekView } from "@/components/calendar/WeekView";
import { VideoDetailModal } from "@/components/calendar/VideoDetailModal";
import { Video } from "@/types/video";
import { ViewMode } from "@/lib/constants";
import { format } from "date-fns";
import { demoChannels, buildDemoDays } from "../demoData";

export default function DemoHomePage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [viewMode] = useState<ViewMode>("week");

  const days = buildDemoDays();
  const start = days[0].date;
  const end = days[days.length - 1].date;
  const title = `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;

  return (
    <div>
      <CalendarHeader
        title={title}
        viewMode={viewMode}
        onViewModeChange={() => {}}
        onNavigate={() => {}}
        onToday={() => {}}
      />
      <WeekView
        days={days}
        channels={demoChannels}
        onVideoClick={setSelectedVideo}
      />
      <VideoDetailModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
