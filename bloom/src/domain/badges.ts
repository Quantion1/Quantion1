import type { Entry, Progress } from './types';
import { toDayKey } from '@/lib/date';

/**
 * Badges reward the logging, not the baby. Levels cover the baby's real life;
 * these cover yours — showing up at 3am, filling in a hundred nappies, keeping
 * the thing going. No rarity, no tiers, nothing to buy.
 */
export interface BadgeCtx {
  entries: Entry[];
  progress: Progress;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  group: 'Showing up' | 'The night shift' | 'Sheer volume' | 'Keepsake';
  measure: (c: BadgeCtx) => { current: number; target: number };
}

const goal = (current: number, target: number) => ({ current: Math.min(current, target), target });
const countOf = (c: BadgeCtx, ...keys: string[]) =>
  c.entries.filter((e) => keys.includes(e.tracker)).length;

const hourOf = (e: Entry) => new Date(e.at).getHours();

/** Longest run of consecutive days that have at least one entry. */
function longestRun(entries: Entry[]): number {
  const days = [...new Set(entries.map((e) => toDayKey(e.at)))].sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of days) {
    const t = new Date(d).getTime();
    run = prev !== null && t - prev === 86_400_000 ? run + 1 : 1;
    prev = t;
    best = Math.max(best, run);
  }
  return best;
}

/** Whether any single day has an entry in all four six-hour quarters. */
function fullDayCovered(entries: Entry[]): number {
  const byDay = new Map<string, Set<number>>();
  for (const e of entries) {
    const k = toDayKey(e.at);
    if (!byDay.has(k)) byDay.set(k, new Set());
    byDay.get(k)!.add(Math.floor(hourOf(e) / 6));
  }
  return [...byDay.values()].some((s) => s.size === 4) ? 1 : 0;
}

export const BADGES: Badge[] = [
  // ─────────────────────────────────────────────────────── Showing up
  { id: 'first', name: 'Something is written down', description: 'Log your first anything.', emoji: '✏️', group: 'Showing up', measure: (c) => goal(c.entries.length, 1) },
  { id: 'open7', name: 'A week of turning up', description: 'Open Nest on seven different days.', emoji: '🌤️', group: 'Showing up', measure: (c) => goal(c.progress.daysOpened.length, 7) },
  { id: 'open30', name: 'A month of turning up', description: 'Open Nest on thirty different days.', emoji: '📆', group: 'Showing up', measure: (c) => goal(c.progress.daysOpened.length, 30) },
  { id: 'open100', name: 'A hundred days', description: 'Open Nest on a hundred different days.', emoji: '🗓️', group: 'Showing up', measure: (c) => goal(c.progress.daysOpened.length, 100) },
  { id: 'run7', name: 'Seven days running', description: 'Log something seven days in a row.', emoji: '🔗', group: 'Showing up', measure: (c) => goal(longestRun(c.entries), 7) },
  { id: 'run30', name: 'Thirty days running', description: 'Log something thirty days in a row.', emoji: '⛓️', group: 'Showing up', measure: (c) => goal(longestRun(c.entries), 30) },
  { id: 'fullday', name: 'Around the clock', description: 'Cover one whole day — morning, afternoon, evening and night.', emoji: '🕛', group: 'Showing up', measure: (c) => goal(fullDayCovered(c.entries), 1) },
  { id: 'explorer', name: 'Tried everything', description: 'Use ten different trackers at least once.', emoji: '🧭', group: 'Showing up', measure: (c) => goal(new Set(c.entries.map((e) => e.tracker)).size, 10) },

  // ────────────────────────────────────────────────── The night shift
  { id: 'threeam', name: 'The 3am club', description: 'Log something between three and four in the morning.', emoji: '🌙', group: 'The night shift', measure: (c) => goal(c.entries.some((e) => hourOf(e) === 3) ? 1 : 0, 1) },
  { id: 'smallhours', name: 'The small hours', description: 'Log twenty-five things between midnight and five.', emoji: '🦉', group: 'The night shift', measure: (c) => goal(c.entries.filter((e) => hourOf(e) < 5).length, 25) },
  { id: 'dawn', name: 'Saw the sunrise', description: 'Log something between five and seven in the morning.', emoji: '🌅', group: 'The night shift', measure: (c) => goal(c.entries.some((e) => hourOf(e) >= 5 && hourOf(e) < 7) ? 1 : 0, 1) },
  { id: 'night100', name: 'A hundred night shifts', description: 'Log a hundred things between seven at night and six in the morning.', emoji: '🌜', group: 'The night shift', measure: (c) => goal(c.entries.filter((e) => hourOf(e) >= 19 || hourOf(e) < 6).length, 100) },

  // ──────────────────────────────────────────────────── Sheer volume
  { id: 'sleep100', name: 'A hundred hours of sleep', description: 'Track a hundred hours of the baby sleeping.', emoji: '😴', group: 'Sheer volume', measure: (c) => goal(Math.round(c.entries.filter((e) => e.tracker === 'sleep').reduce((s, e) => s + (e.minutes ?? 0), 0) / 60), 100) },
  { id: 'sleep500', name: 'Five hundred hours', description: 'Track five hundred hours of sleep.', emoji: '💤', group: 'Sheer volume', measure: (c) => goal(Math.round(c.entries.filter((e) => e.tracker === 'sleep').reduce((s, e) => s + (e.minutes ?? 0), 0) / 60), 500) },
  { id: 'feed100', name: 'A hundred feeds', description: 'Log a hundred feeds, breast or bottle.', emoji: '🍼', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'breast', 'bottle'), 100) },
  { id: 'feed500', name: 'Five hundred feeds', description: 'Log five hundred feeds.', emoji: '🥛', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'breast', 'bottle'), 500) },
  { id: 'diaper100', name: 'A hundred changes', description: 'Log a hundred nappy changes.', emoji: '💧', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'diaper'), 100) },
  { id: 'diaper500', name: 'Five hundred changes', description: 'Log five hundred nappy changes. Genuinely impressive.', emoji: '🌊', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'diaper'), 500) },
  { id: 'tummy25', name: 'Twenty-five turtles', description: 'Log twenty-five tummy-time sessions.', emoji: '🐢', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'tummy'), 25) },
  { id: 'weigh10', name: 'Ten weigh-ins', description: 'Record ten weights.', emoji: '⚖️', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'weight'), 10) },
  { id: 'water100', name: 'A hundred drinks', description: 'Log a hundred drinks for yourself.', emoji: '🥤', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'water'), 100) },
  { id: 'kicks20', name: 'Twenty kick sessions', description: 'Count to ten, twenty times over.', emoji: '🦶', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'kicks'), 20) },
  { id: 'contr10', name: 'Ten timed', description: 'Time ten contractions.', emoji: '⏱️', group: 'Sheer volume', measure: (c) => goal(countOf(c, 'contr'), 10) },

  // ───────────────────────────────────────────────────────── Keepsake
  { id: 'photo10', name: 'Ten memories', description: 'Save ten photos.', emoji: '📸', group: 'Keepsake', measure: (c) => goal(countOf(c, 'memories', 'bump'), 10) },
  { id: 'note10', name: 'Ten notes', description: 'Write ten notes you will be glad you wrote.', emoji: '📝', group: 'Keepsake', measure: (c) => goal(countOf(c, 'note'), 10) },
  { id: 'cards10', name: 'Ten cards', description: 'Collect ten weekly size cards.', emoji: '🃏', group: 'Keepsake', measure: (c) => goal(c.progress.cards.length, 10) },
  { id: 'cards40', name: 'The full set', description: 'Collect every weekly size card.', emoji: '🏅', group: 'Keepsake', measure: (c) => goal(c.progress.cards.length, 37) },
];

export const BADGE_GROUPS = ['Showing up', 'The night shift', 'Sheer volume', 'Keepsake'] as const;

export function evaluateBadges(ctx: BadgeCtx) {
  return BADGES.map((def) => {
    const { current, target } = def.measure(ctx);
    return { def, current, target, done: current >= target };
  });
}
