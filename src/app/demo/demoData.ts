import { Video } from "@/types/video";
import { Channel } from "@/types/channel";
import { CalendarDay } from "@/types/calendar";
import { addDays, subDays, isToday, format } from "date-fns";

// ── Mock Channels ──────────────────────────────
export const demoChannels: Channel[] = [
  {
    id: "UC1",
    name: "MrBeast",
    handle: "@MrBeast",
    avatar_url: "https://i.pravatar.cc/240?img=12",
    subscriber_count: 342000000,
    color: "#EF4444",
    videos_per_day: 1,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-22T00:00:00Z",
  },
  {
    id: "UC2",
    name: "Veritasium",
    handle: "@veritasium",
    avatar_url: "https://i.pravatar.cc/240?img=33",
    subscriber_count: 16400000,
    color: "#3B82F6",
    videos_per_day: 1,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-22T00:00:00Z",
  },
  {
    id: "UC3",
    name: "Felipe Neto",
    handle: "@felipeneto",
    avatar_url: "https://i.pravatar.cc/240?img=51",
    subscriber_count: 46000000,
    color: "#10B981",
    videos_per_day: 2,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-22T00:00:00Z",
  },
];

// ── Mock Videos ────────────────────────────────
function makeVideo(
  id: string,
  channelIdx: number,
  title: string,
  daysAgo: number,
  hour: number,
  minute: number,
  views: number,
  likes: number,
  comments: number,
  duration: string
): Video {
  const ch = demoChannels[channelIdx];
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setUTCHours(hour, minute, 0, 0);

  return {
    id,
    channel_id: ch.id,
    title,
    thumbnail_url: `https://picsum.photos/seed/${id}/320/180`,
    published_at: date.toISOString(),
    duration,
    view_count: views,
    like_count: likes,
    comment_count: comments,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "public",
    created_at: date.toISOString(),
    channel_name: ch.name,
    channel_color: ch.color,
    channel_avatar: ch.avatar_url ?? undefined,
  };
}

export const demoVideos: Video[] = [
  // MrBeast (UC1)
  makeVideo("v1", 0, "$1 vs $1,000,000 Hotel Room!", 0, 15, 30, 42300000, 2100000, 89000, "PT14M32S"),
  makeVideo("v2", 0, "I Survived 7 Days In An Abandoned City", 1, 18, 0, 38700000, 1900000, 72000, "PT21M05S"),
  makeVideo("v3", 0, "World's Most Dangerous Escape Room!", 2, 16, 45, 55100000, 2800000, 95000, "PT18M44S"),

  // Veritasium (UC2)
  makeVideo("v4", 1, "The Real Reason Planes Crash", 0, 14, 15, 8200000, 410000, 32000, "PT22M18S"),
  makeVideo("v5", 1, "Why No One Has Measured The Speed Of Light", 2, 13, 20, 12500000, 620000, 48000, "PT19M52S"),

  // Felipe Neto (UC3)
  makeVideo("v6", 2, "REAGINDO AOS PIORES FILMES DO ANO", 0, 12, 0, 3400000, 280000, 18000, "PT25M11S"),
  makeVideo("v7", 2, "TENTEI COZINHAR PELA PRIMEIRA VEZ", 0, 20, 30, 2900000, 195000, 14000, "PT16M33S"),
  makeVideo("v8", 2, "DESAFIO: 24 HORAS DIZENDO SIM", 1, 11, 10, 5100000, 340000, 22000, "PT28M07S"),
  makeVideo("v9", 2, "REAÇÃO AO MEU PRIMEIRO VÍDEO", 1, 19, 45, 4200000, 310000, 19000, "PT12M45S"),
  makeVideo("v10", 2, "O JOGO MAIS DIFÍCIL DO MUNDO", 2, 14, 0, 3800000, 250000, 16000, "PT20M22S"),
];

// ── Build Calendar Days ────────────────────────
export function buildDemoDays(): CalendarDay[] {
  const today = new Date();
  const start = subDays(today, 2);

  return Array.from({ length: 5 }).map((_, i) => {
    const date = addDays(start, i);
    const dayStr = format(date, "yyyy-MM-dd");
    const dayVideos = demoVideos.filter((v) => {
      const vStr = format(new Date(v.published_at), "yyyy-MM-dd");
      return vStr === dayStr;
    });
    return {
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      videos: dayVideos,
    };
  });
}
