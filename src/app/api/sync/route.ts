import { NextResponse } from "next/server";
import { ensureTables, query, run } from "@/lib/db";
import { fetchChannelInfo } from "@/lib/youtube/channels";
import { fetchChannelVideos } from "@/lib/youtube/videos";
import { downloadImage } from "@/lib/images";

export async function POST(request: Request) {
  try {
    ensureTables();
    console.log("[sync] Starting sync");
    const channels = query("SELECT * FROM channels");
    console.log("[sync] Channels found:", channels.length);

    if (channels.length === 0) {
      console.log("[sync] No channels to sync");
      return NextResponse.json({
        message: "No channels to sync",
        results: [],
      });
    }

    const results = [];

    for (const channel of channels) {
      try {
        console.log("[sync] Processing channel:", channel.id, channel.name);
        const info = await fetchChannelInfo(channel.id as string);
        console.log("[sync] Channel info:", info.name, "uploads:", info.uploads_playlist_id);
        const videos = await fetchChannelVideos(info.uploads_playlist_id, 50, channel.id as string);
        console.log("[sync] Videos fetched:", videos.length);

        // Get existing video IDs for this channel to detect new vs updated
        const existingVideos = new Set(
          query<{ id: string }>("SELECT id FROM videos WHERE channel_id = ?", [channel.id])
            .map((v) => v.id)
        );
        let newCount = 0;

        for (const video of videos) {
          const publishedAt = video.published_at;
          const scheduledAt = video.scheduled_at || null;
          const calendarDate = scheduledAt || publishedAt;

          let thumbnailUrl = video.thumbnail_url;
          if (video.thumbnail_url) {
            const localThumb = await downloadImage(
              video.thumbnail_url,
              `images/thumbnails/${video.id}.jpg`
            );
            thumbnailUrl = localThumb || video.thumbnail_url;
          }

          // Upsert video
          const result = run(
            `INSERT INTO videos (id, channel_id, title, thumbnail_url, published_at, scheduled_at, duration, view_count, like_count, comment_count, description, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT (id) DO UPDATE SET
               title = excluded.title,
               thumbnail_url = excluded.thumbnail_url,
               published_at = excluded.published_at,
               scheduled_at = excluded.scheduled_at,
               duration = excluded.duration,
               view_count = excluded.view_count,
               like_count = excluded.like_count,
               comment_count = excluded.comment_count,
               description = excluded.description,
               status = excluded.status`,
            [
              video.id,
              channel.id,
              video.title,
              thumbnailUrl,
              calendarDate,
              scheduledAt,
              video.duration,
              video.view_count,
              video.like_count,
              video.comment_count,
              video.description,
              video.status,
            ]
          );

          if (!existingVideos.has(video.id)) {
            newCount++;
          }
        }

        // Remove videos that no longer exist on YouTube
        if (videos.length > 0) {
          const fetchedIds = videos.map((v) => v.id);
          const placeholders = fetchedIds.map(() => "?").join(", ");
          run(
            `DELETE FROM videos WHERE channel_id = ? AND id NOT IN (${placeholders})`,
            [channel.id, ...fetchedIds]
          );
        }

        // Download channel avatar locally
        const localAvatar = await downloadImage(
          info.avatar_url,
          `images/avatars/${channel.id}.jpg`
        );
        const avatarUrl = localAvatar || info.avatar_url;

        // Update channel info
        run(
          `UPDATE channels SET name = ?, handle = ?, avatar_url = ?, subscriber_count = ?, updated_at = datetime('now')
           WHERE id = ?`,
          [info.name, info.handle, avatarUrl, info.subscriber_count, channel.id]
        );

        // Log sync
        run(
          `INSERT INTO sync_log (channel_id, videos_fetched, status) VALUES (?, ?, 'success')`,
          [channel.id, videos.length]
        );

        results.push({
          channel_id: channel.id,
          channel_name: info.name,
          videos_fetched: videos.length,
          new_videos: newCount,
          status: "success",
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[sync] Error syncing channel:", channel.id, message, err);
        run(
          `INSERT INTO sync_log (channel_id, status, error_message) VALUES (?, 'error', ?)`,
          [channel.id, message]
        );
        results.push({
          channel_id: channel.id,
          channel_name: channel.name,
          status: "error",
          error: message,
        });
      }
    }

    console.log("[sync] Sync complete, results:", JSON.stringify(results));
    return NextResponse.json({ message: "Sync complete", results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sync] Fatal error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  ensureTables();
  const rows = query(
    "SELECT synced_at FROM sync_log ORDER BY synced_at DESC LIMIT 1"
  );
  return NextResponse.json({
    last_sync: rows.length > 0 ? rows[0].synced_at : null,
  });
}
