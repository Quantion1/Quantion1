import { recommendedGain, gestation, typicalFor } from '@/domain/stage';
import type { Entry, Profile } from '@/domain/types';
import { formatDuration, lastNDayKeys, toDayKey, todayKey } from '@/lib/date';

const FEEDS = ['breast', 'bottle'];

export interface DaySleep {
  day: string;
  totalMin: number;
  nightMin: number;
  napMin: number;
  longestMin: number;
  sleeps: number;
}

const isNight = (iso: string) => {
  const h = new Date(iso).getHours();
  return h >= 19 || h < 6;
};

export function dailySleep(entries: Entry[], days: number): DaySleep[] {
  const keys = lastNDayKeys(days);
  const map = new Map<string, DaySleep>(
    keys.map((day) => [day, { day, totalMin: 0, nightMin: 0, napMin: 0, longestMin: 0, sleeps: 0 }]),
  );
  for (const e of entries) {
    if (e.tracker !== 'sleep') continue;
    const row = map.get(toDayKey(e.at));
    if (!row) continue;
    const mins = e.minutes ?? 0;
    row.totalMin += mins;
    row.sleeps += 1;
    if (isNight(e.at)) row.nightMin += mins;
    else row.napMin += mins;
    row.longestMin = Math.max(row.longestMin, mins);
  }
  return keys.map((k) => map.get(k)!);
}

export interface RasterSegment {
  dayIndex: number;
  startMin: number;
  endMin: number;
  night: boolean;
}

/** Sleep blocks laid onto a 0–1440 axis, split where they cross midnight. */
export function sleepRaster(entries: Entry[], days: number): RasterSegment[] {
  const keys = lastNDayKeys(days);
  const index = new Map(keys.map((k, i) => [k, i]));
  const out: RasterSegment[] = [];
  for (const e of entries) {
    if (e.tracker !== 'sleep') continue;
    const start = new Date(e.at);
    let dayIndex = index.get(toDayKey(start));
    if (dayIndex === undefined) continue;
    let startMin = start.getHours() * 60 + start.getMinutes();
    let remaining = e.minutes ?? 0;
    const night = isNight(e.at);
    while (remaining > 0 && dayIndex !== undefined && dayIndex < keys.length) {
      const chunk = Math.min(remaining, 1440 - startMin);
      out.push({ dayIndex, startMin, endMin: startMin + chunk, night });
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
}

export function dailyFeeds(entries: Entry[], days: number): DayFeed[] {
  const keys = lastNDayKeys(days);
  const map = new Map<string, DayFeed>(
    keys.map((day) => [day, { day, count: 0, ml: 0, minutes: 0, nightCount: 0 }]),
  );
  for (const e of entries) {
    if (!FEEDS.includes(e.tracker)) continue;
    const row = map.get(toDayKey(e.at));
    if (!row) continue;
    row.count += 1;
    if (e.tracker === 'bottle') row.ml += e.amount ?? 0;
    row.minutes += e.minutes ?? 0;
    if (isNight(e.at)) row.nightCount += 1;
  }
  return keys.map((k) => map.get(k)!);
}

export function sideBalance(entries: Entry[], days: number) {
  const keys = new Set(lastNDayKeys(days));
  let left = 0;
  let right = 0;
  let bottle = 0;
  for (const e of entries) {
    if (!keys.has(toDayKey(e.at))) continue;
    if (e.tracker === 'bottle') bottle += 1;
    else if (e.tracker === 'breast') {
      const mins = e.minutes ?? 1;
      if (e.side === 'left') left += mins;
      else if (e.side === 'right') right += mins;
      else {
        left += mins / 2;
        right += mins / 2;
      }
    }
  }
  return { left, right, bottle };
}

export function feedIntervalHistogram(entries: Entry[], days: number) {
  const keys = new Set(lastNDayKeys(days));
  const times = entries
    .filter((e) => FEEDS.includes(e.tracker) && keys.has(toDayKey(e.at)))
    .map((e) => +new Date(e.at))
    .sort((a, b) => a - b);
  const labels = ['<1h', '1–2h', '2–3h', '3–4h', '4–5h', '5h+'];
  const buckets = [0, 0, 0, 0, 0, 0];
  for (let i = 1; i < times.length; i++) {
    const h = (times[i] - times[i - 1]) / 3_600_000;
    if (h > 12) continue;
    buckets[Math.min(5, Math.floor(h))] += 1;
  }
  return buckets.map((value, i) => ({ label: labels[i], value }));
}

export function weightSeries(entries: Entry[], profile: Profile) {
  if (!profile.dueDate) return [];
  const base = profile.prePregnancyWeightKg;
  return entries
    .filter((e) => e.tracker === 'weight')
    .map((e) => {
      const g = gestation(profile.dueDate!, new Date(e.at));
      const band = recommendedGain(g.week);
      const kg = e.amount ?? 0;
      return { week: g.week, kg, gain: base ? kg - base : 0, low: band.low, high: band.high };
    })
    .sort((a, b) => a.week - b.week);
}

export function kickSeries(entries: Entry[], days: number) {
  const keys = lastNDayKeys(days);
  const map = new Map(keys.map((k) => [k, { day: k, count: 0, minutes: 0, sessions: 0 }]));
  for (const e of entries) {
    if (e.tracker !== 'kicks') continue;
    const row = map.get(toDayKey(e.at));
    if (!row) continue;
    row.count += e.count ?? 0;
    row.minutes += e.minutes ?? 0;
    row.sessions += 1;
  }
  return keys.map((k) => map.get(k)!);
}

export function contractionSeries(entries: Entry[]) {
  const list = entries
    .filter((e) => e.tracker === 'contr')
    .sort((a, b) => +new Date(a.at) - +new Date(b.at));
  return list.map((e, i) => ({
    at: e.at,
    durationSec: Math.round((e.minutes ?? 0) * 60),
    intervalMin: i > 0 ? (+new Date(e.at) - +new Date(list[i - 1].at)) / 60000 : undefined,
  }));
}

export function mySleepSeries(entries: Entry[], days: number) {
  const keys = lastNDayKeys(days);
  const map = new Map(keys.map((k) => [k, { day: k, minutes: 0, quality: 0, n: 0 }]));
  for (const e of entries) {
    if (e.tracker !== 'msleep') continue;
    const row = map.get(toDayKey(e.at));
    if (!row) continue;
    row.minutes += e.minutes ?? 0;
    row.quality += e.face ?? 0;
    row.n += 1;
  }
  return keys.map((k) => {
    const r = map.get(k)!;
    return { day: k, minutes: r.minutes, quality: r.n ? r.quality / r.n : 0 };
  });
}

export function growthSeries(entries: Entry[], profile: Profile) {
  if (!profile.birthDate) return [];
  const birth = +new Date(profile.birthDate);
  return entries
    .filter((e) => e.tracker === 'weight' && e.amount != null)
    .map((e) => ({ month: (+new Date(e.at) - birth) / (30.4375 * 86_400_000), kg: e.amount! }))
    .filter((p) => p.month >= 0)
    .sort((a, b) => a.month - b.month);
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : 0);

/* ────────────────────────────────────────────────────── the daily review */

export interface Review {
  day: string;
  hasData: boolean;
  /** True while the day is still running — comparisons are withheld. */
  partial: boolean;
  headline: string;
  sub: string;
  numbers: { label: string; value: string; note?: string }[];
  patterns: { emoji: string; title: string; sub: string }[];
  tomorrow: { emoji: string; text: string }[];
  segments: { startMin: number; endMin: number; night: boolean }[];
  marks: { min: number; kind: string }[];
}

/**
 * The end-of-day read-out. Everything here is computed from entries that exist;
 * a day with nothing logged says so rather than inventing an average.
 */
export function buildReview(entries: Entry[], profile: Profile, day: string, months: number): Review {
  const dayEntries = entries.filter((e) => toDayKey(e.at) === day);
  // A day in progress cannot be fairly compared with completed ones.
  const partial = day === todayKey();
  const sleeps = dayEntries.filter((e) => e.tracker === 'sleep');
  const feeds = dayEntries.filter((e) => FEEDS.includes(e.tracker));
  const diapers = dayEntries.filter((e) => e.tracker === 'diaper');
  const typical = typicalFor(months);

  const totalSleep = sleeps.reduce((s, e) => s + (e.minutes ?? 0), 0);
  const longest = sleeps.reduce((m, e) => Math.max(m, e.minutes ?? 0), 0);
  const nightFeeds = feeds.filter((e) => isNight(e.at)).length;

  const segments = sleeps.map((e) => {
    const d = new Date(e.at);
    const start = d.getHours() * 60 + d.getMinutes();
    return { startMin: start, endMin: Math.min(1440, start + (e.minutes ?? 0)), night: isNight(e.at) };
  });
  const marks = [
    ...feeds.map((e) => {
      const d = new Date(e.at);
      return { min: d.getHours() * 60 + d.getMinutes(), kind: 'feed' };
    }),
    ...diapers.map((e) => {
      const d = new Date(e.at);
      return { min: d.getHours() * 60 + d.getMinutes(), kind: 'diaper' };
    }),
  ];

  const numbers: Review['numbers'] = [];
  if (sleeps.length) {
    numbers.push({
      label: partial ? 'Slept so far' : 'Slept',
      value: formatDuration(totalSleep),
      note: partial ? `typical ${typical.sleepLow}–${typical.sleepHigh}h over a full day` : `typical ${typical.sleepLow}–${typical.sleepHigh}h`,
    });
    numbers.push({ label: 'Longest', value: formatDuration(longest) });
  }
  if (feeds.length) {
    numbers.push({ label: 'Feeds', value: `${feeds.length}`, note: `typical ${typical.feedsLow}–${typical.feedsHigh}` });
    const ml = feeds.reduce((s, e) => s + (e.tracker === 'bottle' ? e.amount ?? 0 : 0), 0);
    if (ml) numbers.push({ label: 'Bottles', value: `${Math.round(ml)} ml` });
  }
  if (diapers.length) numbers.push({ label: diapers.length === 1 ? 'Change' : 'Changes', value: `${diapers.length}` });

  // Compare against the seven days before this one.
  const priorKeys = new Set(lastNDayKeys(8, new Date(day)).slice(0, 7));
  const prior = entries.filter((e) => priorKeys.has(toDayKey(e.at)));
  const priorSleepDays = dailySleep(prior, 7).filter((d) => d.totalMin > 0);
  const priorAvg = avg(priorSleepDays.map((d) => d.totalMin));
  const priorLongest = avg(priorSleepDays.map((d) => d.longestMin));

  const patterns: Review['patterns'] = [];
  if (partial) {
    patterns.push({
      emoji: '🕰️',
      title: 'The day is still going',
      sub: 'Comparisons wait until midnight — half a day against seven whole ones would only mislead.',
    });
  }
  if (!partial && sleeps.length && priorAvg > 0) {
    const delta = (totalSleep - priorAvg) / 60;
    patterns.push({
      emoji: delta >= 0 ? '📈' : '📉',
      title: `${Math.abs(delta).toFixed(1)}h ${delta >= 0 ? 'more' : 'less'} sleep than the week before`,
      sub: `Averaging ${(priorAvg / 60).toFixed(1)}h over the last seven days.`,
    });
  }
  if (!partial && longest > 0 && priorLongest > 0 && longest > priorLongest * 1.15) {
    patterns.push({ emoji: '🌙', title: 'Longest stretch beat the recent average', sub: `${formatDuration(longest)} against a usual ${formatDuration(priorLongest)}.` });
  }
  if (nightFeeds >= 3) {
    patterns.push({ emoji: '🌜', title: `${nightFeeds} feeds after 7pm`, sub: 'A heavy night shift. Worth splitting if there are two of you.' });
  }
  if (feeds.length && !sleeps.length) {
    patterns.push({ emoji: '🤷', title: 'Feeds logged, sleep not', sub: 'The sleep charts stay empty until there is something in them.' });
  }

  const tomorrow: Review['tomorrow'] = [];
  if (sleeps.length >= 2) {
    const gaps: number[] = [];
    const sorted = [...sleeps].sort((a, b) => +new Date(a.at) - +new Date(b.at));
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = +new Date(sorted[i - 1].at) + (sorted[i - 1].minutes ?? 0) * 60000;
      gaps.push((+new Date(sorted[i].at) - prevEnd) / 60000);
    }
    const wake = avg(gaps.filter((g) => g > 0 && g < 400));
    if (wake > 0) {
      const over = wake > typical.wakeHigh;
      tomorrow.push({
        emoji: over ? '⏰' : '👍',
        text: over
          ? `Awake windows averaged ${Math.round(wake)} min against a typical ${typical.wakeLow}–${typical.wakeHigh}. Trying the next nap a little earlier is the usual fix.`
          : `Awake windows around ${Math.round(wake)} min, which sits inside the usual ${typical.wakeLow}–${typical.wakeHigh} for this age.`,
      });
    }
  }
  if (!dayEntries.length) {
    tomorrow.push({ emoji: '🫖', text: 'Nothing logged today. That is allowed — the app waits.' });
  }

  const hasData = dayEntries.length > 0;
  return {
    day,
    hasData,
    partial,
    headline: hasData
      ? sleeps.length
        ? `${formatDuration(totalSleep)} of sleep${partial ? ' so far' : ''}, ${feeds.length} feed${feeds.length === 1 ? '' : 's'}`
        : `${dayEntries.length} thing${dayEntries.length === 1 ? '' : 's'} logged`
      : 'Nothing logged',
    sub: hasData
      ? `Longest stretch ${formatDuration(longest)} · ${diapers.length} change${diapers.length === 1 ? '' : 's'}`
      : 'No numbers to report, and no judgement about it.',
    numbers,
    patterns,
    tomorrow,
    segments,
    marks,
  };
}

/** Short read-outs shown above the charts. Descriptive only — never advice. */
export function buildInsights(entries: Entry[], profile: Profile, days: number, months: number): string[] {
  const out: string[] = [];
  if (profile.stage === 'baby') {
    const sleep = dailySleep(entries, days).filter((d) => d.totalMin > 0);
    const feeds = dailyFeeds(entries, days).filter((d) => d.count > 0);
    const typical = typicalFor(months);
    if (sleep.length >= 3) {
      out.push(`Averaging ${(avg(sleep.map((d) => d.totalMin)) / 60).toFixed(1)}h of sleep a day — typical at this age is ${typical.sleepLow}–${typical.sleepHigh}h.`);
      out.push(`Longest single stretch averages ${(avg(sleep.map((d) => d.longestMin)) / 60).toFixed(1)}h.`);
      const half = Math.floor(sleep.length / 2);
      if (half >= 2) {
        const delta = (avg(sleep.slice(half).map((d) => d.longestMin)) - avg(sleep.slice(0, half).map((d) => d.longestMin))) / 60;
        if (Math.abs(delta) > 0.3) {
          out.push(delta > 0
            ? `Night stretches are lengthening — up ${delta.toFixed(1)}h on the start of this period.`
            : `Night stretches shortened by ${Math.abs(delta).toFixed(1)}h. Leaps and growth spurts routinely do this.`);
        }
      }
    }
    if (feeds.length >= 3) {
      out.push(`About ${avg(feeds.map((d) => d.count)).toFixed(1)} feeds a day.`);
      const ml = avg(feeds.map((d) => d.ml));
      if (ml > 0) out.push(`Bottles average ${Math.round(ml)} ml a day.`);
      out.push(`${Math.round(avg(feeds.map((d) => (d.count ? d.nightCount / d.count : 0))) * 100)}% of feeds fall between 7pm and 6am.`);
    }
  } else {
    const ws = weightSeries(entries, profile);
    if (ws.length >= 2) {
      const last = ws[ws.length - 1];
      const where = last.gain >= last.low && last.gain <= last.high ? 'inside' : last.gain < last.low ? 'below' : 'above';
      out.push(`Total gain ${last.gain.toFixed(1)} kg by week ${last.week} — ${where} the ${last.low.toFixed(1)}–${last.high.toFixed(1)} kg guideline band.`);
      out.push(`Recent pace is ${((ws[ws.length - 1].kg - ws[0].kg) / Math.max(1, last.week - ws[0].week)).toFixed(2)} kg per week.`);
    }
    const kicks = kickSeries(entries, days).filter((d) => d.sessions > 0);
    if (kicks.length >= 2) {
      out.push(`Kick sessions took ${Math.round(avg(kicks.map((d) => d.minutes)))} minutes on average to reach ten.`);
      out.push(`You counted on ${kicks.length} of the last ${days} days.`);
    }
    const contr = contractionSeries(entries);
    if (contr.length >= 3) {
      const recent = contr.slice(-3);
      const gaps = recent.map((c) => c.intervalMin).filter((v): v is number => v != null);
      if (gaps.length) out.push(`Last contractions averaged ${avg(gaps).toFixed(1)} minutes apart.`);
    }
    const mine = mySleepSeries(entries, days).filter((d) => d.minutes > 0);
    if (mine.length >= 3) out.push(`You averaged ${(avg(mine.map((d) => d.minutes)) / 60).toFixed(1)}h of sleep a night.`);
  }
  return out;
}
