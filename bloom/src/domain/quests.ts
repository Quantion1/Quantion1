import type { AccentName } from '@/theme';
import type { Entry, Mode } from './types';

export interface QuestDef {
  id: string;
  title: string;
  emoji: string;
  accent: AccentName;
  target: number;
  xp: number;
  gems: number;
  modes: Mode[];
  /** How far along today's entries are. */
  measure: (today: Entry[]) => number;
}

const count = (t: Entry['type']) => (today: Entry[]) => today.filter((e) => e.type === t).length;

export const QUEST_POOL: QuestDef[] = [
  // Baby
  { id: 'feeds4', title: 'Log 4 feeds', emoji: '🍼', accent: 'sky', target: 4, xp: 20, gems: 5, modes: ['baby'], measure: count('feed') },
  { id: 'feeds6', title: 'Log 6 feeds', emoji: '🍼', accent: 'sky', target: 6, xp: 30, gems: 8, modes: ['baby'], measure: count('feed') },
  { id: 'sleep3', title: 'Log 3 sleeps', emoji: '😴', accent: 'grape', target: 3, xp: 20, gems: 5, modes: ['baby'], measure: count('sleep') },
  { id: 'diaper5', title: 'Log 5 diapers', emoji: '💧', accent: 'mint', target: 5, xp: 15, gems: 4, modes: ['baby'], measure: count('diaper') },
  { id: 'nightsleep', title: 'Record last night’s sleep', emoji: '🌙', accent: 'grape', target: 1, xp: 15, gems: 4, modes: ['baby'], measure: (t) => t.filter((e) => e.type === 'sleep' && e.kind === 'night').length },
  { id: 'mood1', title: 'Rate today’s mood', emoji: '🙂', accent: 'sunny', target: 1, xp: 15, gems: 4, modes: ['baby'], measure: count('babyMood') },
  { id: 'growth1', title: 'Add a growth measurement', emoji: '📏', accent: 'coral', target: 1, xp: 25, gems: 10, modes: ['baby'], measure: count('growth') },

  // Pregnancy
  { id: 'symptom1', title: 'Check in with your symptoms', emoji: '🤰', accent: 'blossom', target: 1, xp: 20, gems: 5, modes: ['pregnancy'], measure: count('symptom') },
  { id: 'weight1', title: 'Log your weight', emoji: '⚖️', accent: 'mint', target: 1, xp: 20, gems: 5, modes: ['pregnancy'], measure: count('weight') },
  { id: 'kicks10', title: 'Count 10 kicks', emoji: '🦶', accent: 'sunny', target: 10, xp: 25, gems: 8, modes: ['pregnancy'], measure: (t) => t.filter((e) => e.type === 'kicks').reduce((s, e) => s + (e as any).count, 0) },
  { id: 'kicksession', title: 'Finish a kick session', emoji: '👣', accent: 'sunny', target: 1, xp: 15, gems: 4, modes: ['pregnancy'], measure: count('kicks') },

  // Both
  { id: 'anything3', title: 'Log 3 things today', emoji: '✍️', accent: 'coral', target: 3, xp: 15, gems: 4, modes: ['pregnancy', 'baby'], measure: (t) => t.length },
  { id: 'note1', title: 'Add a note to any entry', emoji: '📝', accent: 'grape', target: 1, xp: 15, gems: 4, modes: ['pregnancy', 'baby'], measure: (t) => t.filter((e) => !!e.note?.trim()).length },
  { id: 'appointment', title: 'Review your appointments', emoji: '📅', accent: 'sky', target: 1, xp: 15, gems: 4, modes: ['pregnancy', 'baby'], measure: count('appointment') },
];

/** Deterministic per-day hash so the quest set is stable all day. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function questsForDay(dayKey: string, mode: Mode, n = 3): QuestDef[] {
  const pool = QUEST_POOL.filter((q) => q.modes.includes(mode));
  const scored = pool
    .map((q) => ({ q, s: hash(`${dayKey}:${q.id}`) }))
    .sort((a, b) => a.s - b.s)
    .map((x) => x.q);
  return scored.slice(0, n);
}
