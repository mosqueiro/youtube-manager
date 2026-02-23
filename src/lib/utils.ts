import { type ClassValue, clsx } from "clsx";
import { Locale } from "@/lib/i18n";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatDuration(isoDuration: string | null): string {
  if (!isoDuration) return "";
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatViewCount(count: number | null): string {
  if (!count) return "0";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function extractChannelId(input: string): string {
  const trimmed = input.trim();
  // Direct channel ID
  if (trimmed.startsWith("UC") && trimmed.length === 24) return trimmed;
  // URL with channel ID
  const channelMatch = trimmed.match(/youtube\.com\/channel\/(UC[\w-]{22})/);
  if (channelMatch) return channelMatch[1];
  // Handle or URL with handle — return as-is for resolution
  return trimmed;
}


/**
 * Convert a UTC date string to a local date string (yyyy-MM-dd) using the given UTC offset.
 */
export function toLocalDate(dateStr: string, utcOffset: number): string {
  const date = new Date(dateStr);
  const localMs = date.getTime() + utcOffset * 3600000;
  const local = new Date(localMs);
  const y = local.getUTCFullYear();
  const m = String(local.getUTCMonth() + 1).padStart(2, "0");
  const d = String(local.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Convert a UTC date to a local Date object using the given UTC offset.
 */
export function toLocalDateObj(dateStr: string, utcOffset: number): Date {
  const date = new Date(dateStr);
  return new Date(date.getTime() + utcOffset * 3600000);
}

/**
 * Format a time string from a UTC timestamp, applying the given UTC offset.
 * pt-BR → "HH:mm" (24h), en → "h:mm AM/PM" (12h).
 */
export function formatTime(dateStr: string | Date, locale: Locale = "en", utcOffset: number = 0): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const localMs = date.getTime() + utcOffset * 3600000;
  const local = new Date(localMs);
  const hours = local.getUTCHours();
  const minutes = String(local.getUTCMinutes()).padStart(2, "0");
  if (locale === "pt-BR") {
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
