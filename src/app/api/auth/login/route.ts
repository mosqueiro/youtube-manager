import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/youtube/oauth";

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channelId");
  if (!channelId) {
    return NextResponse.json({ error: "Missing channelId parameter" }, { status: 400 });
  }

  const url = getAuthUrl(channelId);
  if (!url) {
    return NextResponse.json(
      { error: "OAuth not configured. Enter your Google credentials in the Setup screen." },
      { status: 500 }
    );
  }
  return NextResponse.redirect(url);
}
