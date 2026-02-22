import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTables } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await ensureTables();
    const { channelId } = await req.json();
    if (!channelId) {
      return NextResponse.json({ error: "Missing channelId" }, { status: 400 });
    }
    await pool.query("DELETE FROM settings WHERE key = $1", [
      `google_refresh_token:${channelId}`,
    ]);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
