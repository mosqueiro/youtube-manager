import { NextRequest, NextResponse } from "next/server";
import { ensureTables, query, run } from "@/lib/db";
import { resolveChannelId, fetchChannelInfo } from "@/lib/youtube/channels";
import { CHANNEL_COLORS } from "@/lib/constants";
import { downloadImage } from "@/lib/images";

export async function GET() {
  ensureTables();
  const rows = query("SELECT * FROM channels ORDER BY created_at ASC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  ensureTables();
  const { input } = await req.json();
  if (!input) {
    return NextResponse.json({ error: "Input is required" }, { status: 400 });
  }

  try {
    const channelId = await resolveChannelId(input);

    const existing = query("SELECT id FROM channels WHERE id = ?", [channelId]);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Channel already added" },
        { status: 409 }
      );
    }

    const info = await fetchChannelInfo(channelId);

    const localAvatar = await downloadImage(
      info.avatar_url,
      `images/avatars/${info.id}.jpg`
    );
    const avatarUrl = localAvatar || info.avatar_url;

    const countRes = query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM channels");
    const colorIndex = countRes[0].cnt % CHANNEL_COLORS.length;
    const color = CHANNEL_COLORS[colorIndex];

    run(
      `INSERT INTO channels (id, name, handle, avatar_url, subscriber_count, color)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [info.id, info.name, info.handle, avatarUrl, info.subscriber_count, color]
    );

    const rows = query("SELECT * FROM channels WHERE id = ?", [info.id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
