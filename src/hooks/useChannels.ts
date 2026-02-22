"use client";

import { useState, useEffect, useCallback } from "react";
import { Channel } from "@/types/channel";

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/channels");
      if (!res.ok) throw new Error("Failed to fetch channels");
      const data = await res.json();
      setChannels(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const addChannel = useCallback(async (input: string) => {
    const res = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add channel");
    setChannels((prev) => [...prev, data]);
    return data;
  }, []);

  const updateChannel = useCallback(
    async (channelId: string, data: Partial<Pick<Channel, "videos_per_day" | "color">>) => {
      const res = await fetch(`/api/channels/${channelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Failed to update channel");
      setChannels((prev) => prev.map((c) => (c.id === channelId ? updated : c)));
      return updated;
    },
    []
  );

  const removeChannel = useCallback(async (channelId: string) => {
    const res = await fetch(`/api/channels/${channelId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to remove channel");
    setChannels((prev) => prev.filter((c) => c.id !== channelId));
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return { channels, loading, error, addChannel, updateChannel, removeChannel, refetch: fetchChannels };
}
