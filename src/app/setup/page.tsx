"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Youtube, KeyRound, ExternalLink } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { t, Locale } from "@/lib/i18n";

export default function SetupPage() {
  const router = useRouter();
  const storeLocale = useAppStore((s) => s.locale);
  const [locale, setLocale] = useState<Locale>("en");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocale(storeLocale);
  }, [storeLocale]);

  const tr = (key: Parameters<typeof t>[1]) => t(locale, key);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: clientId.trim(), clientSecret: clientSecret.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      router.push("/calendar");
    } catch {
      setError("Failed to save credentials");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent)] mb-4">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{tr("setup.title")}</h1>
          <p className="text-[var(--muted)] mt-2">{tr("setup.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {tr("setup.clientId")}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="123456789-abc.apps.googleusercontent.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {tr("setup.clientSecret")}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="GOCSPX-..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving || !clientId.trim() || !clientSecret.trim()}
            className="w-full py-2.5 px-4 rounded-lg bg-[var(--accent)] text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "..." : tr("setup.save")}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <p className="text-sm font-medium mb-2">{tr("setup.howToGet")}</p>
          <ol className="text-sm text-[var(--muted)] space-y-1.5 list-decimal list-inside">
            <li>{tr("setup.step1")}</li>
            <li>{tr("setup.step2")}</li>
            <li>{tr("setup.step3")}</li>
            <li>{tr("setup.step4")}</li>
          </ol>
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-[var(--accent)] hover:underline"
          >
            Google Cloud Console
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
