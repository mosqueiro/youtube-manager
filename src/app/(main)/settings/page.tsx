"use client";

import { useChannels } from "@/hooks/useChannels";
import { AddChannelForm } from "@/components/channels/AddChannelForm";
import { ChannelCard } from "@/components/channels/ChannelCard";
import { useSync } from "@/hooks/useSync";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { Info, Globe, Clock, Tv, Languages, CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Locale } from "@/lib/i18n";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const { channels, addChannel, updateChannel, removeChannel } = useChannels();
  const { lastSync } = useSync();
  const utcOffset = useAppStore((s) => s.utcOffset);
  const setUtcOffset = useAppStore((s) => s.setUtcOffset);
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [oauthConfigured, setOauthConfigured] = useState(false);
  const [oauthMessage, setOauthMessage] = useState<string | null>(null);
  const [refreshOAuthKey, setRefreshOAuthKey] = useState(0);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((d) => setOauthConfigured(d.configured))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const oauth = searchParams.get("oauth");
    if (oauth === "success") {
      setOauthMessage("success");
      setRefreshOAuthKey((k) => k + 1);
    } else if (oauth === "error") {
      setOauthMessage("error");
    }
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* OAuth message */}
      {oauthMessage === "success" && (
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-sm dark:bg-green-500/5">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
          <p className="font-semibold text-green-700 dark:text-green-400">
            {t("settings.oauthSuccess")}
          </p>
        </div>
      )}
      {oauthMessage === "error" && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm dark:bg-red-500/5">
          <XCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <p className="font-semibold text-red-700 dark:text-red-400">
            {t("settings.oauthError")}
          </p>
        </div>
      )}

      {/* Language */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Languages className="h-5 w-5 text-[#ff0000]" />
          {t("settings.language")}
        </h2>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex-1">
            <label
              htmlFor="locale-select"
              className="text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              {t("settings.languageLabel")}
            </label>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {t("settings.languageHint")}
            </p>
          </div>
          <select
            id="locale-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <option value="en">English</option>
            <option value="pt-BR">Português (BR)</option>
          </select>
        </div>
      </section>

      {/* Timezone */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Globe className="h-5 w-5 text-[#ff0000]" />
          {t("settings.timezone")}
        </h2>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex-1">
            <label
              htmlFor="utc-select"
              className="text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              {t("settings.displayTimesIn")}
            </label>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {t("settings.timezoneHint")}
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
          {t("settings.addChannel")}
        </h2>
        <AddChannelForm onAdd={addChannel} />
        <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-red-50 to-red-50 p-4 text-sm dark:from-red-500/5 dark:to-red-600/5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10">
            <Info className="h-4 w-4 text-[#ff0000]" />
          </div>
          <div>
            <p className="font-semibold text-[#cc0000] dark:text-[#ff4e45]">
              {t("settings.howToAdd")}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#cc0000]/70 dark:text-[#ff4e45]/60">
              {t("settings.howToAddDetail")}
            </p>
          </div>
        </div>
      </section>

      {/* Channels List */}
      {channels.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              {t("settings.yourChannels")}
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-[#cc0000] dark:bg-red-500/10 dark:text-[#ff4e45]">
                {channels.length}
              </span>
            </h2>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {t("settings.channelGoalHint")}
            </p>
          </div>
          <div className="space-y-3">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onRemove={removeChannel}
                onUpdate={updateChannel}
                oauthConfigured={oauthConfigured}
                refreshOAuthKey={refreshOAuthKey}
              />
            ))}
          </div>
        </section>
      )}

      {/* Sync Info */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Clock className="h-5 w-5 text-[#ff0000]" />
          {t("settings.syncStatus")}
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
                  : t("settings.neverSynced")}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t("settings.syncHint")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
