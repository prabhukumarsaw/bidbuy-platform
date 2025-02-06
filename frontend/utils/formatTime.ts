import { formatDistanceToNow, format, isToday, isValid, parseISO } from 'date-fns';

export function formatTime(isoDateString?: string): string {
  if (!isoDateString) {
    return 'Invalid date'; // Handle undefined or null
  }

  // Parse the ISO date string into a Date object
  const date = parseISO(isoDateString);

  // Check if the date is valid
  if (!isValid(date)) {
    console.error('Invalid date string:', isoDateString);
    return 'Invalid date'; // Return a fallback value
  }

  if (isToday(date)) {
    // Format the time and remove the word "about"
    const timeAgo = formatDistanceToNow(date, { addSuffix: true, includeSeconds: false });
    return timeAgo.replace(/^about /, ''); // Use regex to remove "about"
  } else {
    // If the date is not today, display "January 22, 2025, 5:16 PM"
    return format(date, 'MMMM d, yyyy, h:mm a');
  }
}