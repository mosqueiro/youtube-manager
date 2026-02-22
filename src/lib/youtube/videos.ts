import { youtubeGet, youtubeGetAuth } from "./client";
import {
  YouTubePlaylistItemsResponse,
  YouTubeVideoDetailsResponse,
} from "./types";

export async function fetchChannelVideos(
  uploadsPlaylistId: string,
  maxResults: number = 50,
  channelId?: string
) {
  // Try OAuth first (can see scheduled/private videos), fall back to API key
  const playlistRes =
    (channelId
      ? await youtubeGetAuth<YouTubePlaylistItemsResponse>(
          "playlistItems",
          {
            part: "snippet",
            playlistId: uploadsPlaylistId,
            maxResults: String(maxResults),
          },
          channelId
        )
      : null) ??
    (await youtubeGet<YouTubePlaylistItemsResponse>("playlistItems", {
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: String(maxResults),
    }));

  if (!playlistRes.items || playlistRes.items.length === 0) {
    return [];
  }

  // Get video IDs
  const videoIds = playlistRes.items.map(
    (item) => item.snippet.resourceId.videoId
  );

  // Fetch full video details (snippet + stats + duration)
  const details = await fetchVideoDetails(videoIds, channelId);

  // Build from videos.list data (accurate publishedAt)
  return videoIds
    .map((videoId) => {
      const detail = details.get(videoId);
      if (!detail) return null;
      return {
        id: videoId,
        title: detail.title,
        description: detail.description,
        thumbnail_url: detail.thumbnailUrl,
        published_at: detail.publishedAt,
        scheduled_at: detail.scheduledAt || null,
        duration: detail.duration || null,
        view_count: detail.viewCount ? parseInt(detail.viewCount) : 0,
        like_count: detail.likeCount ? parseInt(detail.likeCount) : 0,
        comment_count: detail.commentCount ? parseInt(detail.commentCount) : 0,
        status: detail.privacyStatus || "public",
      };
    })
    .filter((v) => v !== null);
}

async function fetchVideoDetails(videoIds: string[], channelId?: string) {
  const map = new Map<
    string,
    {
      title: string;
      description: string;
      thumbnailUrl: string | null;
      publishedAt: string;
      scheduledAt: string | null;
      duration: string;
      viewCount: string;
      likeCount?: string;
      commentCount?: string;
      privacyStatus: string;
    }
  >();

  // Process in batches of 50
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);

    // Try OAuth first (returns status.publishAt for scheduled videos)
    const res =
      (channelId
        ? await youtubeGetAuth<YouTubeVideoDetailsResponse>(
            "videos",
            {
              part: "snippet,contentDetails,statistics,status",
              id: batch.join(","),
            },
            channelId
          )
        : null) ??
      (await youtubeGet<YouTubeVideoDetailsResponse>("videos", {
        part: "snippet,contentDetails,statistics,status",
        id: batch.join(","),
      }));

    for (const item of res.items) {
      const thumbs = item.snippet.thumbnails;
      const publishAt = item.status.publishAt || null;

      map.set(item.id, {
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl:
          thumbs.maxres?.url ||
          thumbs.high?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url ||
          null,
        publishedAt: item.snippet.publishedAt,
        scheduledAt: publishAt,
        duration: item.contentDetails.duration,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        commentCount: item.statistics.commentCount,
        privacyStatus: item.status.privacyStatus,
      });
    }
  }

  return map;
}
