"use client";

import { useChannels } from "@/hooks/useChannels";
import { ChannelCard } from "@/components/channels/ChannelCard";
import { AddChannelForm } from "@/components/channels/AddChannelForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tv } from "lucide-react";

export default function ChannelsPage() {
  const { channels, loading, addChannel, updateChannel, removeChannel } = useChannels();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Channels</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Manage the YouTube channels you want to track.
        </p>
      </div>

      <AddChannelForm onAdd={addChannel} />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : channels.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-white/5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
            <Tv className="h-7 w-7 text-slate-300 dark:text-slate-600" />
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400">
              No channels yet
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Add a channel above to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onRemove={removeChannel}
              onUpdate={updateChannel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
