import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTables } from "@/lib/db";

export async function GET(req: NextRequest) {
  await ensureTables();
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end query params are required" },
      { status: 400 }
    );
  }

  const { rows } = await pool.query(
    `SELECT v.*, c.name as channel_name, c.color as channel_color, c.avatar_url as channel_avatar
     FROM videos v
     JOIN channels c ON v.channel_id = c.id
     WHERE v.published_at >= $1 AND v.published_at < $2
     ORDER BY v.published_at ASC`,
    [start, end]
  );

  // Mark videos with scheduled_at as scheduled for the UI
  for (const row of rows) {
    if (row.scheduled_at) {
      row.scheduled_at = row.scheduled_at.toISOString
        ? row.scheduled_at.toISOString()
        : row.scheduled_at;
    }
  }

  return NextResponse.json(rows);
}
