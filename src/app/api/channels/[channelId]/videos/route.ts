import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;

  const { rows } = await pool.query(
    `SELECT v.*, c.name as channel_name, c.color as channel_color, c.avatar_url as channel_avatar
     FROM videos v
     JOIN channels c ON v.channel_id = c.id
     WHERE v.channel_id = $1
     ORDER BY v.published_at DESC
     LIMIT 50`,
    [channelId]
  );

  return NextResponse.json(rows);
}
