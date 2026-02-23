import { google } from "googleapis";
import { ensureTables, queryOne } from "@/lib/db";

const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

function getCredentialsFromDb(): { clientId: string; clientSecret: string } | null {
  try {
    ensureTables();
    const idRow = queryOne<{ value: string }>("SELECT value FROM settings WHERE key = ?", ["google_client_id"]);
    const secretRow = queryOne<{ value: string }>("SELECT value FROM settings WHERE key = ?", ["google_client_secret"]);
    if (idRow?.value && secretRow?.value) {
      return { clientId: idRow.value, clientSecret: secretRow.value };
    }
  } catch {
    // DB may not be ready yet
  }
  return null;
}

function getOAuth2Client() {
  const creds = getCredentialsFromDb();
  if (!creds) return null;

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  return new google.auth.OAuth2(creds.clientId, creds.clientSecret, redirectUri);
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

  const row = queryOne<{ value: string }>(
    "SELECT value FROM settings WHERE key = ?",
    [`google_refresh_token:${channelId}`]
  );

  if (!row?.value) return null;

  client.setCredentials({ refresh_token: row.value });
  return client;
}

export async function getAnyAuthenticatedClient() {
  const client = getOAuth2Client();
  if (!client) return null;

  const row = queryOne<{ value: string }>(
    "SELECT value FROM settings WHERE key LIKE 'google_refresh_token:%' LIMIT 1"
  );

  if (!row?.value) return null;

  client.setCredentials({ refresh_token: row.value });
  return client;
}

export function isOAuthConfigured(): boolean {
  const creds = getCredentialsFromDb();
  return creds !== null;
}
