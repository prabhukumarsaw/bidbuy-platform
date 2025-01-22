// utils/formatTime.ts
import { formatDistanceToNow, format, isToday } from 'date-fns';

export function formatTime(isoDateString: string): string {
  const date = new Date(isoDateString);

  if (isToday(date)) {
    // Format the time and remove the word "about"
    const timeAgo = formatDistanceToNow(date, { addSuffix: true, includeSeconds: false });
    return timeAgo.replace('about ', ''); // Remove "about"
  } else {
    // If the date is not today, display "January 22, 2025, 5:16 PM"
    return format(date, 'MMMM d, yyyy, h:mm a');
  }
}