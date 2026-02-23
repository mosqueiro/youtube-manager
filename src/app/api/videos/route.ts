import { NextRequest, NextResponse } from "next/server";
import { ensureTables, query } from "@/lib/db";

export async function GET(req: NextRequest) {
  ensureTables();
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end query params are required" },
      { status: 400 }
    );
  }

  const rows = query(
    `SELECT v.*, c.name as channel_name, c.color as channel_color, c.avatar_url as channel_avatar
     FROM videos v
     JOIN channels c ON v.channel_id = c.id
     WHERE v.published_at >= ? AND v.published_at < ?
     ORDER BY v.published_at ASC`,
    [start, end]
  );

  return NextResponse.json(rows);
}
