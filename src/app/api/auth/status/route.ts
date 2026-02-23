import { NextRequest, NextResponse } from "next/server";
import { ensureTables } from "@/lib/db";
import { getAuthenticatedClient, isOAuthConfigured } from "@/lib/youtube/oauth";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  ensureTables();

  const channelId = req.nextUrl.searchParams.get("channelId");
  if (!channelId) {
    return NextResponse.json({ configured: isOAuthConfigured(), connected: false });
  }

  if (!isOAuthConfigured()) {
    return NextResponse.json({ configured: false, connected: false });
  }

  const auth = await getAuthenticatedClient(channelId);
  if (!auth) {
    return NextResponse.json({ configured: true, connected: false });
  }

  try {
    const youtube = google.youtube({ version: "v3", auth });
    const res = await youtube.channels.list({
      part: ["snippet"],
      mine: true,
    });
    const channel = res.data.items?.[0];
    return NextResponse.json({
      configured: true,
      connected: true,
      channelTitle: channel?.snippet?.title || null,
    });
  } catch {
    return NextResponse.json({ configured: true, connected: false, expired: true });
  }
}
