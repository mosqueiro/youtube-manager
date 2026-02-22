import { Video } from "./video";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  videos: Video[];
}

export interface CalendarWeek {
  days: CalendarDay[];
}
