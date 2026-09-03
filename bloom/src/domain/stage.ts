import type { Profile } from './types';

/** Gestational age from a due date (40 weeks from LMP). */
export function gestation(dueDate: string, now = new Date()) {
  const due = new Date(dueDate);
  const start = new Date(due.getTime() - 280 * 86_400_000);
  const totalDays = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const week = Math.max(0, Math.floor(totalDays / 7));
  return {
    week,
    day: Math.max(0, totalDays % 7),
    daysLeft: Math.ceil((due.getTime() - now.getTime()) / 86_400_000),
    trimester: week <= 13 ? 1 : week <= 27 ? 2 : 3,
    progress: Math.min(1, Math.max(0, totalDays / 280)),
  };
}

export function babyAge(birthDate: string, now = new Date()) {
  const days = Math.max(0, Math.floor((now.getTime() - +new Date(birthDate)) / 86_400_000));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.4375);
  return {
    days,
    weeks,
    months,
    progress: Math.min(1, days / 365),
    label: days < 14 ? `${days} days old` : days < 90 ? `${weeks} weeks old` : `${months} months old`,
  };
}

/** How far in they are: weeks of pregnancy, or days since the birth. */
export function position(profile: Profile, now = new Date()): number {
  if (profile.stage === 'pregnancy') return profile.dueDate ? gestation(profile.dueDate, now).week : 0;
  return profile.birthDate ? babyAge(profile.birthDate, now).days : 0;
}

/** WHO median weight-for-age (kg) at month 0..12. */
export const WHO_WEIGHT_MEDIAN: Record<'girl' | 'boy', number[]> = {
  girl: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9],
  boy: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6],
};

/** Typical 24h sleep and feed ranges by month, used only as context on charts. */
export const TYPICAL = [
  { sleepLow: 14, sleepHigh: 17, feedsLow: 8, feedsHigh: 12, wakeLow: 35, wakeHigh: 60 },
  { sleepLow: 14, sleepHigh: 17, feedsLow: 7, feedsHigh: 10, wakeLow: 45, wakeHigh: 75 },
  { sleepLow: 14, sleepHigh: 16, feedsLow: 6, feedsHigh: 9, wakeLow: 60, wakeHigh: 100 },
  { sleepLow: 14, sleepHigh: 16, feedsLow: 6, feedsHigh: 8, wakeLow: 75, wakeHigh: 120 },
  { sleepLow: 12, sleepHigh: 16, feedsLow: 5, feedsHigh: 7, wakeLow: 90, wakeHigh: 135 },
  { sleepLow: 12, sleepHigh: 15, feedsLow: 5, feedsHigh: 7, wakeLow: 105, wakeHigh: 150 },
  { sleepLow: 12, sleepHigh: 15, feedsLow: 4, feedsHigh: 6, wakeLow: 120, wakeHigh: 165 },
  { sleepLow: 12, sleepHigh: 15, feedsLow: 4, feedsHigh: 6, wakeLow: 135, wakeHigh: 180 },
  { sleepLow: 12, sleepHigh: 15, feedsLow: 4, feedsHigh: 5, wakeLow: 150, wakeHigh: 195 },
  { sleepLow: 12, sleepHigh: 14, feedsLow: 3, feedsHigh: 5, wakeLow: 165, wakeHigh: 210 },
  { sleepLow: 11, sleepHigh: 14, feedsLow: 3, feedsHigh: 4, wakeLow: 180, wakeHigh: 225 },
  { sleepLow: 11, sleepHigh: 14, feedsLow: 2, feedsHigh: 4, wakeLow: 195, wakeHigh: 240 },
  { sleepLow: 11, sleepHigh: 14, feedsLow: 2, feedsHigh: 4, wakeLow: 210, wakeHigh: 270 },
];

export const typicalFor = (months: number) => TYPICAL[Math.min(12, Math.max(0, Math.round(months)))];

/** Recommended cumulative gain (kg) by gestational week, normal starting BMI. */
export function recommendedGain(week: number): { low: number; high: number } {
  const w = Math.max(0, Math.min(40, week));
  if (w <= 13) return { low: (w / 13) * 1.0, high: (w / 13) * 2.0 };
  const extra = w - 13;
  return { low: 1.0 + extra * 0.35, high: 2.0 + extra * 0.5 };
}
