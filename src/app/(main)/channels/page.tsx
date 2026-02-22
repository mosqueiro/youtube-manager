"use client";

import { useChannels } from "@/hooks/useChannels";
import { ChannelCard } from "@/components/channels/ChannelCard";
import { AddChannelForm } from "@/components/channels/AddChannelForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { Tv } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChannelsPage() {
  const { channels, loading, addChannel, updateChannel, removeChannel } = useChannels();
  const { t } = useTranslation();
  const [oauthConfigured, setOauthConfigured] = useState(false);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((d) => setOauthConfigured(d.configured))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("channels.title")}</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          {t("channels.subtitle")}
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
              {t("channels.noChannels")}
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              {t("channels.noChannelsHint")}
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
              oauthConfigured={oauthConfigured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
