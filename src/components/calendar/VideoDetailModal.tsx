"use client";

import { useState } from "react";
import { Video } from "@/types/video";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatDuration, formatViewCount, formatTime } from "@/lib/utils";
import { format } from "date-fns";
import { ExternalLink, Eye, Clock, Calendar, ThumbsUp, MessageCircle, Pencil, Check, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

interface VideoDetailModalProps {
  video: Video | null;
  onClose: () => void;
  onUpdatePublishedAt?: (videoId: string, newDate: string) => void;
}

export function VideoDetailModal({ video, onClose, onUpdatePublishedAt }: VideoDetailModalProps) {
  const { t, locale } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [saving, setSaving] = useState(false);

  if (!video) return null;

  const publishedDate = new Date(video.published_at);
  const time = formatTime(video.published_at, locale);

  function startEditing() {
    const d = new Date(video!.published_at);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    setEditDate(`${da}/${mo}/${y}`);
    setEditTime(`${h}:${mi}`);
    setEditing(true);
  }

  async function saveEdit() {
    if (!editDate || !editTime || !video) return;
    // Parse dd/mm/yyyy and HH:mm
    const parts = editDate.split("/");
    if (parts.length !== 3) return;
    const [dd, mm, yyyy] = parts;
    const iso = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T${editTime}:00`;
    const parsed = new Date(iso);
    if (isNaN(parsed.getTime())) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published_at: parsed.toISOString() }),
      });

      if (res.ok) {
        onUpdatePublishedAt?.(video.id, parsed.toISOString());
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

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
          {/* Editable publish time */}
          {editing ? (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="w-[110px] rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-center text-sm font-medium tabular-nums dark:border-neutral-600 dark:bg-neutral-800"
              />
              <input
                type="text"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                placeholder="HH:mm"
                className="w-[70px] rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-center text-sm font-medium tabular-nums dark:border-neutral-600 dark:bg-neutral-800"
              />
              <button
                onClick={saveEdit}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-green-600 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                {t("modal.save")}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-200 px-3 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300"
              >
                <X className="h-3.5 w-3.5" />
                {t("modal.cancel")}
              </button>
            </div>
          ) : (
            <button
              onClick={startEditing}
              className="group flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
              <Clock className="h-3.5 w-3.5 text-[#ff0000]" />
              <span className="font-bold text-[#cc0000] dark:text-[#ff4e45]">
                {time}
              </span>
              <Pencil className="h-3 w-3 text-[#ff0000] opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(publishedDate, "MMM d, yyyy")}
            </span>
          </div>
          {video.view_count != null && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Eye className="h-3.5 w-3.5" />
              <span>{formatViewCount(video.view_count)} {t("modal.views")}</span>
            </div>
          )}
          {video.like_count != null && video.like_count > 0 && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{formatViewCount(video.like_count)} {t("modal.likes")}</span>
            </div>
          )}
          {video.comment_count != null && video.comment_count > 0 && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{formatViewCount(video.comment_count)} {t("modal.comments")}</span>
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
          {t("modal.watchOnYouTube")}
        </a>
      </div>
    </Modal>
  );
}
