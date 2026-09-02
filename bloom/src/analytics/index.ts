import { monthInfo } from '@/domain/baby';
import { gestation, recommendedGain } from '@/domain/pregnancy';
import type { Entry, Profile } from '@/domain/types';
import { lastNDayKeys, toDayKey } from '@/lib/date';

export interface DaySleep {
  day: string;
  totalMin: number;
  nightMin: number;
  napMin: number;
  longestMin: number;
  sleeps: number;
  wakings: number;
}

export function dailySleep(entries: Entry[], days: number): DaySleep[] {
  const keys = lastNDayKeys(days);
  const map = new Map<string, DaySleep>(
    keys.map((day) => [day, { day, totalMin: 0, nightMin: 0, napMin: 0, longestMin: 0, sleeps: 0, wakings: 0 }]),
  );
  for (const e of entries) {
    if (e.type !== 'sleep') continue;
    const key = toDayKey(e.at);
    const row = map.get(key);
    if (!row) continue;
    row.totalMin += e.minutes;
    row.sleeps += 1;
    row.wakings += e.wakings ?? 0;
    if (e.kind === 'night') row.nightMin += e.minutes;
    else row.napMin += e.minutes;
    row.longestMin = Math.max(row.longestMin, e.minutes);
  }
  return keys.map((k) => map.get(k)!);
}

export interface RasterSegment {
  dayIndex: number;
  startMin: number;
  endMin: number;
  night: boolean;
}

/** Sleep blocks flattened onto a 0–1440 minute axis, split across midnight. */
export function sleepRaster(entries: Entry[], days: number): RasterSegment[] {
  const keys = lastNDayKeys(days);
  const index = new Map(keys.map((k, i) => [k, i]));
  const out: RasterSegment[] = [];
  for (const e of entries) {
    if (e.type !== 'sleep') continue;
    const start = new Date(e.at);
    let dayIndex = index.get(toDayKey(start));
    if (dayIndex === undefined) continue;
    let startMin = start.getHours() * 60 + start.getMinutes();
    let remaining = e.minutes;
    while (remaining > 0 && dayIndex !== undefined && dayIndex < keys.length) {
      const chunk = Math.min(remaining, 1440 - startMin);
      out.push({ dayIndex, startMin, endMin: startMin + chunk, night: e.kind === 'night' });
      remaining -= chunk;
      startMin = 0;
      dayIndex += 1;
    }
  }
  return out;
}

export interface DayFeed {
  day: string;
  count: number;
  ml: number;
  minutes: number;
  nightCount: number;
  dayCount: number;
}

export function dailyFeeds(entries: Entry[], days: number): DayFeed[] {
  const keys = lastNDayKeys(days);
  const map = new Map<string, DayFeed>(
    keys.map((day) => [day, { day, count: 0, ml: 0, minutes: 0, nightCount: 0, dayCount: 0 }]),
  );
  for (const e of entries) {
    if (e.type !== 'feed') continue;
    const row = map.get(toDayKey(e.at));
    if (!row) continue;
    row.count += 1;
    row.ml += e.ml ?? 0;
    row.minutes += e.minutes ?? 0;
    const hour = new Date(e.at).getHours();
    if (hour >= 19 || hour < 6) row.nightCount += 1;
    else row.dayCount += 1;
  }
  return keys.map((k) => map.get(k)!);
}

export function breastBalance(entries: Entry[], days: number) {
  const keys = new Set(lastNDayKeys(days));
  let left = 0;
  let right = 0;
  let bottle = 0;
  let solids = 0;
  for (const e of entries) {
    if (e.type !== 'feed' || !keys.has(toDayKey(e.at))) continue;
    if (e.method === 'left') left += e.minutes ?? 1;
    else if (e.method === 'right') right += e.minutes ?? 1;
    else if (e.method === 'bottle') bottle += 1;
    else solids += 1;
  }
  return { left, right, bottle, solids };
}

/** Gaps between consecutive feeds, bucketed in hours. */
export function feedIntervalHistogram(entries: Entry[], days: number) {
  const keys = new Set(lastNDayKeys(days));
  const times = entries
    .filter((e) => e.type === 'feed' && keys.has(toDayKey(e.at)))
    .map((e) => +new Date(e.at))
    .sort((a, b) => a - b);
  const buckets = [0, 0, 0, 0, 0, 0];
  const labels = ['<1h', '1–2h', '2–3h', '3–4h', '4–5h', '5h+'];
  for (let i = 1; i < times.length; i++) {
    const h = (times[i] - times[i - 1]) / 3_600_000;
    if (h > 12) continue; // overnight boundary between separate sessions
    const idx = Math.min(5, Math.floor(h));
    buckets[idx] += 1;
  }
  return buckets.map((value, i) => ({ label: labels[i], value }));
}

export interface WeightPoint {
  week: number;
  kg: number;
  gain: number;
  low: number;
  high: number;
}

export function weightSeries(entries: Entry[], profile: Profile): WeightPoint[] {
  if (!profile.dueDate) return [];
  const base = profile.prePregnancyWeightKg;
  return entries
    .filter((e) => e.type === 'weight')
    .map((e) => {
      const g = gestation(profile.dueDate!, new Date(e.at));
      const band = recommendedGain(g.week);
      const kg = (e as Extract<Entry, { type: 'weight' }>).kg;
      return { week: g.week, kg, gain: base ? kg - base : 0, low: band.low, high: band.high };
    })
    .sort((a, b) => a.week - b.week);
}

export function symptomHeatmap(entries: Entry[], profile: Profile) {
  const rows = new Map<string, Map<number, number>>();
  const weeks = new Set<number>();
  for (const e of entries) {
    if (e.type !== 'symptom') continue;
    const week = profile.dueDate ? gestation(profile.dueDate, new Date(e.at)).week : 0;
    weeks.add(week);
    for (const s of e.symptoms) {
      if (!rows.has(s)) rows.set(s, new Map());
      const r = rows.get(s)!;
      r.set(week, (r.get(week) ?? 0) + 1);
    }
  }
  const weekList = [...weeks].sort((a, b) => a - b);
  const symptomList = [...rows.entries()]
    .map(([name, m]) => ({ name, total: [...m.values()].reduce((s, v) => s + v, 0), byWeek: m }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);
  return { weeks: weekList, symptoms: symptomList };
}

export function kickSeries(entries: Entry[], days: number) {
  const keys = lastNDayKeys(days);
  const map = new Map(keys.map((k) => [k, { day: k, count: 0, minutes: 0, sessions: 0 }]));
  for (const e of entries) {
    if (e.type !== 'kicks') continue;
    const row = map.get(toDayKey(e.at));
    if (!row) continue;
    row.count += e.count;
    row.minutes += e.durationMin;
    row.sessions += 1;
  }
  return keys.map((k) => map.get(k)!);
}

export function moodSeries(entries: Entry[], days: number) {
  const keys = lastNDayKeys(days);
  const map = new Map(keys.map((k) => [k, { day: k, mood: 0, severity: 0, n: 0 }]));
  for (const e of entries) {
    if (e.type !== 'symptom' && e.type !== 'babyMood') continue;
    const row = map.get(toDayKey(e.at));
    if (!row) continue;
    row.mood += e.mood;
    row.severity += e.type === 'symptom' ? e.severity : 0;
    row.n += 1;
  }
  return keys.map((k) => {
    const r = map.get(k)!;
    return { day: k, mood: r.n ? r.mood / r.n : 0, severity: r.n ? r.severity / r.n : 0 };
  });
}

export function growthSeries(entries: Entry[], profile: Profile) {
  if (!profile.birthDate) return [];
  const birth = +new Date(profile.birthDate);
  return entries
    .filter((e) => e.type === 'growth')
    .map((e) => {
      const g = e as Extract<Entry, { type: 'growth' }>;
      return {
        month: (+new Date(e.at) - birth) / (30.4375 * 86_400_000),
        weightKg: g.weightKg,
        lengthCm: g.lengthCm,
        headCm: g.headCm,
      };
    })
    .filter((p) => p.weightKg != null)
    .sort((a, b) => a.month - b.month);
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : 0);

/**
 * Plain-language read-outs shown above the charts. These are descriptive
 * summaries of the parent's own data — never medical advice.
 */
export function buildInsights(entries: Entry[], profile: Profile, days: number): string[] {
  const out: string[] = [];
  if (profile.mode === 'baby') {
    const sleep = dailySleep(entries, days).filter((d) => d.totalMin > 0);
    const feeds = dailyFeeds(entries, days).filter((d) => d.count > 0);
    if (sleep.length >= 3) {
      const total = avg(sleep.map((d) => d.totalMin)) / 60;
      const longest = avg(sleep.map((d) => d.longestMin)) / 60;
      const info = monthInfo(
        profile.birthDate ? (Date.now() - +new Date(profile.birthDate)) / (30.4375 * 86_400_000) : 0,
      );
      out.push(
        `Averaging ${total.toFixed(1)}h of sleep a day — typical at this age is ${info.sleepLow}–${info.sleepHigh}h.`,
      );
      out.push(`Longest single stretch averages ${longest.toFixed(1)}h.`);
      const half = Math.floor(sleep.length / 2);
      if (half >= 2) {
        const early = avg(sleep.slice(0, half).map((d) => d.longestMin));
        const late = avg(sleep.slice(half).map((d) => d.longestMin));
        const delta = (late - early) / 60;
        if (Math.abs(delta) > 0.3) {
          out.push(
            delta > 0
              ? `Night stretches are getting longer — up ${delta.toFixed(1)}h versus the start of this period.`
              : `Night stretches shortened by ${Math.abs(delta).toFixed(1)}h. Growth spurts and leaps often do this.`,
          );
        }
      }
    }
    if (feeds.length >= 3) {
      out.push(`About ${avg(feeds.map((d) => d.count)).toFixed(1)} feeds a day.`);
      const ml = avg(feeds.map((d) => d.ml));
      if (ml > 0) out.push(`Bottles average ${Math.round(ml)} ml a day across this period.`);
      const nightShare = avg(feeds.map((d) => (d.count ? d.nightCount / d.count : 0)));
      out.push(`${Math.round(nightShare * 100)}% of feeds happen between 7pm and 6am.`);
    }
  } else {
    const ws = weightSeries(entries, profile);
    if (ws.length >= 2) {
      const last = ws[ws.length - 1];
      const inBand = last.gain >= last.low && last.gain <= last.high;
      out.push(
        `Total gain ${last.gain.toFixed(1)} kg by week ${last.week} — ${
          inBand ? 'inside' : last.gain < last.low ? 'below' : 'above'
        } the ${last.low.toFixed(1)}–${last.high.toFixed(1)} kg guideline band.`,
      );
      const rate = (ws[ws.length - 1].kg - ws[0].kg) / Math.max(1, last.week - ws[0].week);
      out.push(`Recent pace is ${rate.toFixed(2)} kg per week.`);
    }
    const kicks = kickSeries(entries, days).filter((d) => d.sessions > 0);
    if (kicks.length >= 3) {
      out.push(`Kick sessions took ${Math.round(avg(kicks.map((d) => d.minutes)))} minutes on average to reach 10.`);
      out.push(`You counted on ${kicks.length} of the last ${days} days.`);
    }
    const heat = symptomHeatmap(entries, profile);
    if (heat.symptoms.length) {
      out.push(`Most-logged symptom: ${heat.symptoms[0].name} (${heat.symptoms[0].total} days).`);
    }
  }
  return out;
}
