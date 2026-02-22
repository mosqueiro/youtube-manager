import { getAuthenticatedClient, getAnyAuthenticatedClient } from "./oauth";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

async function getAccessToken(channelId?: string): Promise<string> {
  const auth = channelId
    ? (await getAuthenticatedClient(channelId)) ?? (await getAnyAuthenticatedClient())
    : await getAnyAuthenticatedClient();

  if (!auth) {
    throw new Error(
      "No OAuth token available. Connect at least one channel via Google in Settings."
    );
  }

  const token = (await auth.getAccessToken()).token;
  if (!token) {
    throw new Error("Failed to get access token. Try reconnecting in Settings.");
  }
  return token;
}

export async function youtubeGet<T>(
  endpoint: string,
  params: Record<string, string>,
  channelId?: string
): Promise<T> {
  const accessToken = await getAccessToken(channelId);

  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error (${res.status}): ${body}`);
  }
  return res.json();
}
