"use client";

import { Video } from "@/types/video";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatDuration, formatViewCount, formatTimeWithOffset } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { ExternalLink, Eye, Clock, Calendar, ThumbsUp, MessageCircle } from "lucide-react";
import Image from "next/image";

interface VideoDetailModalProps {
  video: Video | null;
  onClose: () => void;
}

export function VideoDetailModal({ video, onClose }: VideoDetailModalProps) {
  const utcOffset = useAppStore((s) => s.utcOffset);

  if (!video) return null;

  const time = formatTimeWithOffset(video.published_at, utcOffset);

  return (
    <Modal open={!!video} onClose={onClose}>
      {video.thumbnail_url && (
        <div className="relative -mx-6 -mt-6 mb-4 aspect-video w-[calc(100%+48px)] overflow-hidden">
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
          {video.duration && (
            <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {formatDuration(video.duration)}
            </span>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold leading-snug tracking-tight">
          {video.title}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <Badge color={video.channel_color}>{video.channel_name}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 dark:bg-red-500/10">
            <Clock className="h-3.5 w-3.5 text-[#ff0000]" />
            <span className="font-bold text-[#cc0000] dark:text-[#ff4e45]">
              {time}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(new Date(video.published_at), "MMM d, yyyy")}
            </span>
          </div>
          {video.view_count != null && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Eye className="h-3.5 w-3.5" />
              <span>{formatViewCount(video.view_count)} views</span>
            </div>
          )}
          {video.like_count != null && video.like_count > 0 && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{formatViewCount(video.like_count)} likes</span>
            </div>
          )}
          {video.comment_count != null && video.comment_count > 0 && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{formatViewCount(video.comment_count)} comments</span>
            </div>
          )}
        </div>

        {video.description && (
          <p className="line-clamp-4 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-400">
            {video.description}
          </p>
        )}

        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-500/25 transition-all hover:shadow-md hover:shadow-red-500/30"
        >
          <ExternalLink className="h-4 w-4" />
          Watch on YouTube
        </a>
      </div>
    </Modal>
  );
}
