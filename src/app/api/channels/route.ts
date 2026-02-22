import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTables } from "@/lib/db";
import { resolveChannelId, fetchChannelInfo } from "@/lib/youtube/channels";
import { CHANNEL_COLORS } from "@/lib/constants";

export async function GET() {
  await ensureTables();
  const { rows } = await pool.query(
    "SELECT * FROM channels ORDER BY created_at ASC"
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  await ensureTables();
  const { input } = await req.json();
  if (!input) {
    return NextResponse.json({ error: "Input is required" }, { status: 400 });
  }

  try {
    // Resolve channel ID from handle/URL/ID
    const channelId = await resolveChannelId(input);

    // Check if already exists
    const existing = await pool.query("SELECT id FROM channels WHERE id = $1", [
      channelId,
    ]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Channel already added" },
        { status: 409 }
      );
    }

    // Fetch channel info from YouTube
    const info = await fetchChannelInfo(channelId);

    // Assign color based on current channel count
    const countRes = await pool.query("SELECT COUNT(*) FROM channels");
    const colorIndex = parseInt(countRes.rows[0].count) % CHANNEL_COLORS.length;
    const color = CHANNEL_COLORS[colorIndex];

    // Insert into DB
    const { rows } = await pool.query(
      `INSERT INTO channels (id, name, handle, avatar_url, subscriber_count, color)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        info.id,
        info.name,
        info.handle,
        info.avatar_url,
        info.subscriber_count,
        color,
      ]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
