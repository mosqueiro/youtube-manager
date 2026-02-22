import { youtubeGet } from "./client";
import { YouTubeChannelResponse, YouTubeSearchResponse } from "./types";

export async function resolveChannelId(input: string): Promise<string> {
  const trimmed = input.trim();

  // Already a channel ID
  if (trimmed.startsWith("UC") && trimmed.length === 24) {
    return trimmed;
  }

  // Handle (with or without @)
  const handle = trimmed.startsWith("@") ? trimmed : `@${trimmed}`;

  // Try channels.list with forHandle
  const res = await youtubeGet<YouTubeChannelResponse>("channels", {
    part: "id",
    forHandle: handle.slice(1), // remove @
  });

  if (res.items && res.items.length > 0) {
    return res.items[0].id;
  }

  // Fallback: search
  const searchRes = await youtubeGet<YouTubeSearchResponse>("search", {
    part: "snippet",
    q: trimmed,
    type: "channel",
    maxResults: "1",
  });

  if (searchRes.items && searchRes.items.length > 0) {
    return searchRes.items[0].snippet.channelId;
  }

  throw new Error(`Could not resolve channel: ${input}`);
}

export async function fetchChannelInfo(channelId: string) {
  const res = await youtubeGet<YouTubeChannelResponse>("channels", {
    part: "snippet,statistics,contentDetails",
    id: channelId,
  });

  if (!res.items || res.items.length === 0) {
    throw new Error(`Channel not found: ${channelId}`);
  }

  const item = res.items[0];
  return {
    id: item.id,
    name: item.snippet.title,
    handle: item.snippet.customUrl || null,
    avatar_url: item.snippet.thumbnails.default.url,
    subscriber_count: parseInt(item.statistics.subscriberCount) || 0,
    uploads_playlist_id: item.contentDetails.relatedPlaylists.uploads,
  };
}
