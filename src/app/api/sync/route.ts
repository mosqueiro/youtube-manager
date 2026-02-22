import { NextResponse } from "next/server";
import pool, { ensureTables } from "@/lib/db";
import { fetchChannelInfo } from "@/lib/youtube/channels";
import { fetchChannelVideos } from "@/lib/youtube/videos";

export async function POST() {
  try {
    await ensureTables();
    const { rows: channels } = await pool.query("SELECT * FROM channels");

    if (channels.length === 0) {
      return NextResponse.json({
        message: "No channels to sync",
        results: [],
      });
    }

    const results = [];

    for (const channel of channels) {
      try {
        // Get uploads playlist ID
        const info = await fetchChannelInfo(channel.id);
        const videos = await fetchChannelVideos(info.uploads_playlist_id, 50);

        let newCount = 0;

        for (const video of videos) {
          // Upsert video
          const res = await pool.query(
            `INSERT INTO videos (id, channel_id, title, thumbnail_url, published_at, duration, view_count, like_count, comment_count, description, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (id) DO UPDATE SET
               title = EXCLUDED.title,
               thumbnail_url = EXCLUDED.thumbnail_url,
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
              video.thumbnail_url,
              video.published_at,
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

        // Update channel info
        await pool.query(
          `UPDATE channels SET name = $1, handle = $2, avatar_url = $3, subscriber_count = $4, updated_at = NOW()
           WHERE id = $5`,
          [
            info.name,
            info.handle,
            info.avatar_url,
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

    return NextResponse.json({ message: "Sync complete", results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
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
