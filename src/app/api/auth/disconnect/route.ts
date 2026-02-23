import { NextRequest, NextResponse } from "next/server";
import { ensureTables, run } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    ensureTables();
    const { channelId } = await req.json();
    if (!channelId) {
      return NextResponse.json({ error: "Missing channelId" }, { status: 400 });
    }
    run("DELETE FROM settings WHERE key = ?", [
      `google_refresh_token:${channelId}`,
    ]);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
