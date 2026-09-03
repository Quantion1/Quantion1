/**
 * A minimal RFC 5545 event: just enough for a phone's own calendar app to
 * accept a single appointment. Times are written "floating" — no TZID, no Z —
 * so the file reads back in whatever zone the calendar opening it is already
 * set to, which is exactly the zone it was written in for a plan you keep
 * yourself.
 */
export interface CalendarEvent {
  /** Stable id for this event, becomes half of its UID. */
  uid: string;
  title: string;
  description?: string;
  /** The day the event falls on. */
  date: Date;
  /** HH:MM, or undefined for an all-day event. */
  time?: string;
}

const pad = (n: number) => `${n}`.padStart(2, '0');

function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

function stampUTC(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function floatingStamp(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function dateStamp(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

export function buildICS(event: CalendarEvent): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nest//Plan//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.uid}@nest-app`,
    `DTSTAMP:${stampUTC(new Date())}`,
  ];

  if (event.time) {
    const [h, m] = event.time.split(':').map(Number);
    const start = new Date(event.date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    lines.push(`DTSTART:${floatingStamp(start)}`, `DTEND:${floatingStamp(end)}`);
  } else {
    const end = new Date(event.date);
    end.setDate(end.getDate() + 1);
    lines.push(`DTSTART;VALUE=DATE:${dateStamp(event.date)}`, `DTEND;VALUE=DATE:${dateStamp(end)}`);
  }

  lines.push(`SUMMARY:${escapeText(event.title)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}
