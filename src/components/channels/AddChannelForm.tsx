"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Loader2, LogIn } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface AddChannelFormProps {
  onAdd: (input: string) => Promise<void>;
}

export function AddChannelForm({ onAdd }: AddChannelFormProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsOAuth, setNeedsOAuth] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setNeedsOAuth(false);
      await onAdd(input.trim());
      setInput("");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("channel.addError");
      if (message.includes("No OAuth token")) {
        setNeedsOAuth(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("channel.placeholder")}
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !input.trim()} size="md">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {t("channel.add")}
        </Button>
      </div>
      {needsOAuth && (
        <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-500/10">
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {t("channel.needsOAuth")}
            </p>
            <p className="mt-0.5 text-xs text-amber-600/70 dark:text-amber-400/60">
              {t("channel.needsOAuthHint")}
            </p>
          </div>
          <a
            href="/api/auth/login?channelId=_initial"
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-amber-600"
          >
            <LogIn className="h-3.5 w-3.5" />
            {t("settings.connectGoogle")}
          </a>
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}
    </form>
  );
}
