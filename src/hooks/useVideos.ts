"use client";

import { useState, useCallback } from "react";
import { Video } from "@/types/video";

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async (start: string, end: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/videos?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVideoPublishedAt = useCallback(
    (videoId: string, newPublishedAt: string) => {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, published_at: newPublishedAt } : v
        )
      );
    },
    []
  );

  return { videos, loading, error, fetchVideos, updateVideoPublishedAt };
}
