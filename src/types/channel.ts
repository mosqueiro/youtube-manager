export interface Channel {
  id: string;
  name: string;
  handle: string | null;
  avatar_url: string | null;
  subscriber_count: number | null;
  color: string;
  videos_per_day: number;
  created_at: string;
  updated_at: string;
}
