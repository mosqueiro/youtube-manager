"use client";

import { ChannelCard } from "@/components/channels/ChannelCard";
import { Globe, Info, Tv, Clock } from "lucide-react";
import { demoChannels } from "../demoData";

export default function DemoSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
          Configure your YouTube Manager preferences.
        </p>
      </div>

      {/* Timezone */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Globe className="h-5 w-5 text-[#ff0000]" />
          Timezone
        </h2>
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-200/60 bg-white/80 p-5 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex-1">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Display times in
            </label>
            <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
              All video publish times will be shown in this timezone.
            </p>
          </div>
          <select
            defaultValue={-3}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <option value={-3}>UTC-3 (Brasilia)</option>
          </select>
        </div>
      </section>

      {/* Add Channel */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Tv className="h-5 w-5 text-[#ff0000]" />
          Add Channel
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Channel ID, @handle, or URL"
            defaultValue="@MrBeast"
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
          />
          <button className="rounded-xl bg-[#ff0000] px-6 py-2.5 text-sm font-bold text-white shadow-sm">
            Add
          </button>
        </div>
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
      <section className="space-y-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            Your Channels
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-[#cc0000] dark:bg-red-500/10 dark:text-[#ff4e45]">
              {demoChannels.length}
            </span>
          </h2>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Set the daily video goal per channel. Missing slots show up on the calendar.
          </p>
        </div>
        <div className="space-y-3">
          {demoChannels.map((ch) => (
            <ChannelCard
              key={ch.id}
              channel={ch}
              onRemove={() => {}}
              onUpdate={() => {}}
            />
          ))}
        </div>
      </section>

      {/* Sync Info */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Clock className="h-5 w-5 text-[#ff0000]" />
          Sync Status
        </h2>
        <div className="rounded-2xl border border-neutral-200/60 bg-white/80 p-5 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-[#ff0000] shadow-sm shadow-red-500/50" />
            <div>
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Feb 22, 2026 at 10:30 AM
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Click Sync in the header to fetch latest videos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
