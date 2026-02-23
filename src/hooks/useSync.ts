"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";

interface SyncResult {
  channel_id: string;
  channel_name: string;
  videos_fetched: number;
  new_videos?: number;
  status: string;
  error?: string;
}

export function useSync() {
  const bumpSync = useAppStore((s) => s.bumpSync);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [results, setResults] = useState<SyncResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLastSync = useCallback(async () => {
    try {
      const res = await fetch("/api/sync");
      const data = await res.json();
      setLastSync(data.last_sync);
    } catch {
      // ignore
    }
  }, []);

  const sync = useCallback(async () => {
    try {
      setSyncing(true);
      setError(null);
      const res = await fetch("/api/sync", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setResults(data.results || []);
      setLastSync(new Date().toISOString());
      bumpSync();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed";
      setError(message);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLastSync();
  }, [fetchLastSync]);

  return { syncing, lastSync, results, error, sync };
}
