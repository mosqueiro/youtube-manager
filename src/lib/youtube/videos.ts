import { youtubeGet } from "./client";
import {
  YouTubePlaylistItemsResponse,
  YouTubeVideoDetailsResponse,
} from "./types";

export async function fetchChannelVideos(
  uploadsPlaylistId: string,
  maxResults: number = 50
) {
  // Fetch playlist items (uploads) — just to get video IDs
  const playlistRes = await youtubeGet<YouTubePlaylistItemsResponse>(
    "playlistItems",
    {
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: String(maxResults),
    }
  );

  if (!playlistRes.items || playlistRes.items.length === 0) {
    return [];
  }

  // Get video IDs
  const videoIds = playlistRes.items.map(
    (item) => item.snippet.resourceId.videoId
  );

  // Fetch full video details (snippet + stats + duration)
  // snippet.publishedAt from videos.list = actual publish date
  const details = await fetchVideoDetails(videoIds);

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
        duration: detail.duration || null,
        view_count: detail.viewCount ? parseInt(detail.viewCount) : 0,
        like_count: detail.likeCount ? parseInt(detail.likeCount) : 0,
        comment_count: detail.commentCount ? parseInt(detail.commentCount) : 0,
        status: detail.privacyStatus || "public",
      };
    })
    .filter((v) => v !== null);
}

async function fetchVideoDetails(videoIds: string[]) {
  const map = new Map<
    string,
    {
      title: string;
      description: string;
      thumbnailUrl: string | null;
      publishedAt: string;
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
    const res = await youtubeGet<YouTubeVideoDetailsResponse>("videos", {
      part: "snippet,contentDetails,statistics,status",
      id: batch.join(","),
    });

    for (const item of res.items) {
      const thumbs = item.snippet.thumbnails;
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
