import { getAuthenticatedClient } from "./oauth";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

export async function youtubeGet<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  url.searchParams.set("key", getApiKey());
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error (${res.status}): ${body}`);
  }
  return res.json();
}

export async function youtubeGetAuth<T>(
  endpoint: string,
  params: Record<string, string>,
  channelId: string
): Promise<T | null> {
  const auth = await getAuthenticatedClient(channelId);
  if (!auth) return null;

  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const accessToken = (await auth.getAccessToken()).token;
  if (!accessToken) return null;

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[oauth] YouTube API error (${res.status}): ${body}`);
    return null;
  }
  return res.json();
}
