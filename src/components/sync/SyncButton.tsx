"use client";

import { RefreshCw, Check } from "lucide-react";
import { useSync } from "@/hooks/useSync";
import { useChannels } from "@/hooks/useChannels";
import { getRelativeTime } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";

export function SyncButton() {
  const { t } = useTranslation();
  const { syncing, lastSync, sync } = useSync();
  const { channels } = useChannels();
  const hasChannels = channels.length > 0;
  const [justSynced, setJustSynced] = useState(false);

  const handleSync = async () => {
    try {
      await sync();
      setJustSynced(true);
    } catch {
      // error handled in hook
    }
  };

  useEffect(() => {
    if (justSynced) {
      const t = setTimeout(() => setJustSynced(false), 3000);
      return () => clearTimeout(t);
    }
  }, [justSynced]);

  return (
    <div className="flex items-center gap-3">
      {lastSync && (
        <span className="hidden text-[11px] text-neutral-400 md:inline">
          {getRelativeTime(new Date(lastSync))}
        </span>
      )}
      <button
        onClick={handleSync}
        disabled={syncing || !hasChannels}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all disabled:opacity-60 ${
          justSynced
            ? "bg-emerald-500 text-white shadow-emerald-500/20"
            : syncing
              ? "bg-[#cc0000] text-white shadow-red-500/20"
              : "bg-[#ff0000] text-white shadow-red-500/25 hover:bg-[#cc0000] hover:shadow-red-500/40 hover:shadow-md"
        }`}
      >
        {justSynced ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <RefreshCw
            className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
          />
        )}
        {justSynced ? t("sync.done") : syncing ? t("sync.syncing") : t("sync.sync")}
      </button>
    </div>
  );
}
