import { google } from "googleapis";
import pool from "@/lib/db";

const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  if (!clientId || !clientSecret) return null;

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl(channelId: string): string | null {
  const client = getOAuth2Client();
  if (!client) return null;

  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    state: channelId,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuth2Client();
  if (!client) throw new Error("OAuth not configured");

  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getAuthenticatedClient(channelId: string) {
  const client = getOAuth2Client();
  if (!client) return null;

  // Look up refresh token for this specific channel
  let refreshToken: string | undefined;
  try {
    const { rows } = await pool.query(
      "SELECT value FROM settings WHERE key = $1",
      [`google_refresh_token:${channelId}`]
    );
    if (rows.length > 0) refreshToken = rows[0].value;
  } catch {
    // settings table may not exist yet
  }

  if (!refreshToken) return null;

  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

export function isOAuthConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
