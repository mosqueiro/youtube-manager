"use client";

import { Channel } from "@/types/channel";
import { formatViewCount } from "@/lib/utils";
import { Trash2, Users, Minus, Plus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

interface ChannelCardProps {
  channel: Channel;
  onRemove: (id: string) => void;
  onUpdate?: (id: string, data: Partial<Pick<Channel, "videos_per_day">>) => void;
}

export function ChannelCard({ channel, onRemove, onUpdate }: ChannelCardProps) {
  const { t } = useTranslation();
  const goal = channel.videos_per_day || 1;

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-white/[0.03]">
      {/* Avatar with color ring */}
      <div
        className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-offset-2 dark:ring-offset-[#0f0f0f]"
        style={{ boxShadow: `0 0 0 2px ${channel.color}30`, borderColor: channel.color }}
      >
        <div className="absolute inset-0 rounded-full ring-2" style={{ borderColor: channel.color }} />
        {channel.avatar_url ? (
          <Image
            src={channel.avatar_url}
            alt={channel.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: channel.color }}
          >
            {channel.name[0]}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-bold text-slate-800 dark:text-slate-100">
            {channel.name}
          </h3>
          <div
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: channel.color }}
          />
        </div>
        {channel.handle && (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {channel.handle}
          </p>
        )}
        {channel.subscriber_count != null && (
          <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-400">
            <Users className="h-3 w-3" />
            {formatViewCount(channel.subscriber_count)} {t("channel.subscribers")}
          </p>
        )}
      </div>

      {/* Videos per day goal */}
      {onUpdate && (
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 dark:border-white/5 dark:bg-white/[0.03]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t("channel.goal")}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                onUpdate(channel.id, {
                  videos_per_day: Math.max(0, goal - 1),
                })
              }
              className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-600 dark:hover:bg-white/10"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center text-base font-extrabold text-slate-700 dark:text-slate-200">
              {goal}
            </span>
            <button
              onClick={() =>
                onUpdate(channel.id, {
                  videos_per_day: goal + 1,
                })
              }
              className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-600 dark:hover:bg-white/10"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-[10px] text-slate-400">{t("channel.perDay")}</span>
        </div>
      )}

      <button
        onClick={() => onRemove(channel.id)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition-all hover:bg-red-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
