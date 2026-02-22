"use client";

import { useChannels } from "@/hooks/useChannels";
import { AddChannelForm } from "@/components/channels/AddChannelForm";
import { ChannelCard } from "@/components/channels/ChannelCard";
import { useSync } from "@/hooks/useSync";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { Info, Globe, Clock, Tv } from "lucide-react";

const UTC_OPTIONS = [
  { value: -12, label: "UTC-12" },
  { value: -11, label: "UTC-11" },
  { value: -10, label: "UTC-10 (Hawaii)" },
  { value: -9, label: "UTC-9 (Alaska)" },
  { value: -8, label: "UTC-8 (PST)" },
  { value: -7, label: "UTC-7 (MST)" },
  { value: -6, label: "UTC-6 (CST)" },
  { value: -5, label: "UTC-5 (EST)" },
  { value: -4, label: "UTC-4 (Atlantic)" },
  { value: -3, label: "UTC-3 (Brasilia)" },
  { value: -2, label: "UTC-2" },
  { value: -1, label: "UTC-1" },
  { value: 0, label: "UTC+0 (London)" },
  { value: 1, label: "UTC+1 (Paris)" },
  { value: 2, label: "UTC+2 (Cairo)" },
  { value: 3, label: "UTC+3 (Moscow)" },
  { value: 4, label: "UTC+4 (Dubai)" },
  { value: 5, label: "UTC+5" },
  { value: 5.5, label: "UTC+5:30 (India)" },
  { value: 6, label: "UTC+6" },
  { value: 7, label: "UTC+7 (Bangkok)" },
  { value: 8, label: "UTC+8 (Singapore)" },
  { value: 9, label: "UTC+9 (Tokyo)" },
  { value: 10, label: "UTC+10 (Sydney)" },
  { value: 11, label: "UTC+11" },
  { value: 12, label: "UTC+12 (Auckland)" },
];

export default function SettingsPage() {
  const { channels, addChannel, updateChannel, removeChannel } = useChannels();
  const { lastSync } = useSync();
  const utcOffset = useAppStore((s) => s.utcOffset);
  const setUtcOffset = useAppStore((s) => s.setUtcOffset);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Configure your YouTube Manager preferences.
        </p>
      </div>

      {/* Timezone */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Globe className="h-5 w-5 text-[#ff0000]" />
          Timezone
        </h2>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex-1">
            <label
              htmlFor="utc-select"
              className="text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              Display times in
            </label>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              All video publish times will be shown in this timezone.
            </p>
          </div>
          <select
            id="utc-select"
            value={utcOffset}
            onChange={(e) => setUtcOffset(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            {UTC_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Add Channel Section */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Tv className="h-5 w-5 text-[#ff0000]" />
          Add Channel
        </h2>
        <AddChannelForm onAdd={addChannel} />
        <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-red-50 to-red-50 p-4 text-sm dark:from-red-500/5 dark:to-red-600/5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10">
            <Info className="h-4 w-4 text-[#ff0000]" />
          </div>
          <div>
            <p className="font-semibold text-[#cc0000] dark:text-[#ff4e45]">
              How to add channels
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#cc0000]/70 dark:text-[#ff4e45]/60">
              Use channel ID (UC...), @handle, or full YouTube URL.
              After adding, click <strong>Sync</strong> in the header to fetch videos.
            </p>
          </div>
        </div>
      </section>

      {/* Channels List */}
      {channels.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              Your Channels
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-[#cc0000] dark:bg-red-500/10 dark:text-[#ff4e45]">
                {channels.length}
              </span>
            </h2>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Set the daily video goal per channel. Missing slots show up on the calendar.
            </p>
          </div>
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
        </section>
      )}

      {/* Sync Info */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Clock className="h-5 w-5 text-[#ff0000]" />
          Sync Status
        </h2>
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                lastSync
                  ? "bg-[#ff0000] shadow-sm shadow-red-500/50"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lastSync
                  ? format(new Date(lastSync), "MMM d, yyyy 'at' h:mm a")
                  : "Never synced"}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Click Sync in the header to fetch latest videos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
