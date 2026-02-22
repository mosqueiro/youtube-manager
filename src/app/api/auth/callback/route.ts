import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTables } from "@/lib/db";
import { exchangeCodeForTokens } from "@/lib/youtube/oauth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const channelId = req.nextUrl.searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
  }
  if (!channelId) {
    return NextResponse.json({ error: "Missing state (channelId)" }, { status: 400 });
  }

  try {
    await ensureTables();
    const tokens = await exchangeCodeForTokens(code);

    if (tokens.refresh_token) {
      await pool.query(
        `INSERT INTO settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [`google_refresh_token:${channelId}`, tokens.refresh_token]
      );
      console.log(`[oauth] Refresh token saved for channel ${channelId}`);
    }

    const baseUrl = req.nextUrl.origin;
    return NextResponse.redirect(`${baseUrl}/settings?oauth=success&channelId=${channelId}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[oauth] Callback error:", message);
    const baseUrl = req.nextUrl.origin;
    return NextResponse.redirect(
      `${baseUrl}/settings?oauth=error&message=${encodeURIComponent(message)}`
    );
  }
}
