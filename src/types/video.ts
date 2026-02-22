export interface Video {
  id: string;
  channel_id: string;
  title: string;
  thumbnail_url: string | null;
  published_at: string;
  scheduled_at?: string | null;
  duration: string | null;
  view_count: number | null;
  like_count?: number;
  comment_count?: number;
  description: string | null;
  status: string;
  created_at: string;
  // Joined from channel
  channel_name?: string;
  channel_color?: string;
  channel_avatar?: string;
}
