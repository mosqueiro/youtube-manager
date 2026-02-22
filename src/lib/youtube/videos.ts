import { youtubeGet } from "./client";
import {
  YouTubePlaylistItemsResponse,
  YouTubeVideoDetailsResponse,
} from "./types";

export async function fetchChannelVideos(
  uploadsPlaylistId: string,
  maxResults: number = 50
) {
  // Fetch playlist items (uploads)
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

  // Get video IDs for details (duration, views)
  const videoIds = playlistRes.items.map(
    (item) => item.snippet.resourceId.videoId
  );

  // Fetch video details in batches of 50
  const details = await fetchVideoDetails(videoIds);

  // Merge data
  return playlistRes.items.map((item) => {
    const videoId = item.snippet.resourceId.videoId;
    const detail = details.get(videoId);
    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail_url:
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url ||
        null,
      published_at: item.snippet.publishedAt,
      duration: detail?.duration || null,
      view_count: detail?.viewCount ? parseInt(detail.viewCount) : 0,
      like_count: detail?.likeCount ? parseInt(detail.likeCount) : 0,
      comment_count: detail?.commentCount ? parseInt(detail.commentCount) : 0,
      status: detail?.privacyStatus || "public",
    };
  });
}

async function fetchVideoDetails(videoIds: string[]) {
  const map = new Map<
    string,
    { duration: string; viewCount: string; likeCount?: string; commentCount?: string; privacyStatus: string }
  >();

  // Process in batches of 50
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res = await youtubeGet<YouTubeVideoDetailsResponse>("videos", {
      part: "contentDetails,statistics,status",
      id: batch.join(","),
    });

    for (const item of res.items) {
      map.set(item.id, {
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
