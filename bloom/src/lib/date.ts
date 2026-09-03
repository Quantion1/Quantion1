export const DAY_MS = 86_400_000;

export function toDayKey(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
}

export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const todayKey = () => toDayKey(new Date());

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function daysBetween(a: Date | string, b: Date | string): number {
  const s = startOfDay(typeof a === 'string' ? new Date(a) : a).getTime();
  const e = startOfDay(typeof b === 'string' ? new Date(b) : b).getTime();
  return Math.round((e - s) / DAY_MS);
}

export function lastNDayKeys(n: number, end = new Date()): string[] {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) keys.push(toDayKey(addDays(end, -i)));
  return keys;
}

export function formatTime(iso: string, clock24h = true): string {
  const d = new Date(iso);
  if (clock24h) return `${`${d.getHours()}`.padStart(2, '0')}:${`${d.getMinutes()}`.padStart(2, '0')}`;
  const h = d.getHours() % 12 || 12;
  return `${h}:${`${d.getMinutes()}`.padStart(2, '0')}${d.getHours() < 12 ? 'am' : 'pm'}`;
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 0) {
    const ahead = -mins;
    if (ahead < 60) return `in ${ahead}m`;
    if (ahead < 1440) return `in ${Math.round(ahead / 60)}h`;
    return `in ${Math.round(ahead / 1440)}d`;
  }
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ${mins % 60}m ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatDuration(minutes: number): string {
  const m = Math.round(minutes);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}

export const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
