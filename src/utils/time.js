// src/utils/time.js
import { format } from 'date-fns';

export function formatTime(ts) {
  // ts can be Firestore Timestamp or Date
  try {
    const date = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : new Date());
    return format(date, 'MMM d, HH:mm');
  } catch { return ''; }
}
