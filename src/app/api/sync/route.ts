import { NextResponse } from "next/server";
import pool, { ensureTables } from "@/lib/db";
import { fetchChannelInfo } from "@/lib/youtube/channels";
import { fetchChannelVideos } from "@/lib/youtube/videos";
import { downloadImage } from "@/lib/images";

export async function POST(request: Request) {
  try {
    await ensureTables();
    const body = await request.json().catch(() => ({}));
    const utcOffset: number = typeof body.utcOffset === "number" ? body.utcOffset : 0;
    console.log("[sync] Starting sync, utcOffset:", utcOffset);
    const { rows: channels } = await pool.query("SELECT * FROM channels");
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
        // Get uploads playlist ID
        const info = await fetchChannelInfo(channel.id);
        console.log("[sync] Channel info:", info.name, "uploads:", info.uploads_playlist_id);
        const videos = await fetchChannelVideos(info.uploads_playlist_id, 50, channel.id);
        console.log("[sync] Videos fetched:", videos.length);

        let newCount = 0;

        for (const video of videos) {
          // Convert published_at from UTC to local time using the user's offset
          const utcDate = new Date(video.published_at);
          const localMs = utcDate.getTime() + utcOffset * 3600000;
          const localPublishedAt = new Date(localMs).toISOString();

          // For scheduled videos, use scheduled_at as the calendar date
          let localScheduledAt: string | null = null;
          if (video.scheduled_at) {
            const utcScheduled = new Date(video.scheduled_at);
            const localScheduledMs = utcScheduled.getTime() + utcOffset * 3600000;
            localScheduledAt = new Date(localScheduledMs).toISOString();
          }

          // If video is scheduled, use scheduled_at as published_at for calendar placement
          const calendarDate = localScheduledAt || localPublishedAt;

          // Download thumbnail locally (fallback to remote URL on failure)
          let thumbnailUrl = video.thumbnail_url;
          if (video.thumbnail_url) {
            const localThumb = await downloadImage(
              video.thumbnail_url,
              `images/thumbnails/${video.id}.jpg`
            );
            thumbnailUrl = localThumb || video.thumbnail_url;
          }

          // Upsert video
          const res = await pool.query(
            `INSERT INTO videos (id, channel_id, title, thumbnail_url, published_at, scheduled_at, duration, view_count, like_count, comment_count, description, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (id) DO UPDATE SET
               title = EXCLUDED.title,
               thumbnail_url = EXCLUDED.thumbnail_url,
               published_at = EXCLUDED.published_at,
               scheduled_at = EXCLUDED.scheduled_at,
               duration = EXCLUDED.duration,
               view_count = EXCLUDED.view_count,
               like_count = EXCLUDED.like_count,
               comment_count = EXCLUDED.comment_count,
               description = EXCLUDED.description,
               status = EXCLUDED.status
             RETURNING (xmax = 0) as is_new`,
            [
              video.id,
              channel.id,
              video.title,
              thumbnailUrl,
              calendarDate,
              localScheduledAt,
              video.duration,
              video.view_count,
              video.like_count,
              video.comment_count,
              video.description,
              video.status,
            ]
          );

          if (res.rows[0]?.is_new) newCount++;
        }

        // Download channel avatar locally (fallback to remote URL on failure)
        const localAvatar = await downloadImage(
          info.avatar_url,
          `images/avatars/${channel.id}.jpg`
        );
        const avatarUrl = localAvatar || info.avatar_url;

        // Update channel info
        await pool.query(
          `UPDATE channels SET name = $1, handle = $2, avatar_url = $3, subscriber_count = $4, updated_at = NOW()
           WHERE id = $5`,
          [
            info.name,
            info.handle,
            avatarUrl,
            info.subscriber_count,
            channel.id,
          ]
        );

        // Log sync
        await pool.query(
          `INSERT INTO sync_log (channel_id, videos_fetched, status) VALUES ($1, $2, 'success')`,
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
        await pool.query(
          `INSERT INTO sync_log (channel_id, status, error_message) VALUES ($1, 'error', $2)`,
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
  await ensureTables();
  const { rows } = await pool.query(
    "SELECT synced_at FROM sync_log ORDER BY synced_at DESC LIMIT 1"
  );
  return NextResponse.json({
    last_sync: rows.length > 0 ? rows[0].synced_at : null,
  });
}
