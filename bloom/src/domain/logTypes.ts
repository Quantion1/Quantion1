import type { AccentName } from '@/theme';
import type { LogType, Mode } from './types';

export interface LogTypeConfig {
  type: LogType;
  label: string;
  short: string;
  emoji: string;
  accent: AccentName;
  xp: number;
  modes: Mode[];
  /** Shown on the Today quick-log strip. */
  quick?: boolean;
  blurb: string;
}

export const LOG_TYPES: LogTypeConfig[] = [
  { type: 'feed', label: 'Feeding', short: 'Feed', emoji: '🍼', accent: 'sky', xp: 5, modes: ['baby'], quick: true, blurb: 'Breast, bottle or solids' },
  { type: 'sleep', label: 'Sleep', short: 'Sleep', emoji: '😴', accent: 'grape', xp: 6, modes: ['baby'], quick: true, blurb: 'Naps and nights' },
  { type: 'diaper', label: 'Diaper', short: 'Diaper', emoji: '💧', accent: 'mint', xp: 3, modes: ['baby'], quick: true, blurb: 'Wet, dirty or both' },
  { type: 'growth', label: 'Growth', short: 'Growth', emoji: '📏', accent: 'coral', xp: 15, modes: ['baby'], quick: true, blurb: 'Weight, length, head' },
  { type: 'babyMood', label: 'Mood & health', short: 'Mood', emoji: '🙂', accent: 'sunny', xp: 8, modes: ['baby'], blurb: 'How was the day?' },
  { type: 'milestone', label: 'Milestone', short: 'Milestone', emoji: '🏆', accent: 'blossom', xp: 25, modes: ['baby'], blurb: 'First smile, first step…' },

  { type: 'symptom', label: 'Symptoms & mood', short: 'Symptoms', emoji: '🤰', accent: 'blossom', xp: 10, modes: ['pregnancy'], quick: true, blurb: 'How you feel today' },
  { type: 'weight', label: 'My weight', short: 'Weight', emoji: '⚖️', accent: 'mint', xp: 10, modes: ['pregnancy'], quick: true, blurb: 'Track your gain curve' },
  { type: 'kicks', label: 'Kick counter', short: 'Kicks', emoji: '🦶', accent: 'sunny', xp: 12, modes: ['pregnancy'], quick: true, blurb: 'Count 10 movements' },
  { type: 'contraction', label: 'Contractions', short: 'Contractions', emoji: '⏱️', accent: 'coral', xp: 8, modes: ['pregnancy'], quick: true, blurb: 'Time them properly' },
  { type: 'appointment', label: 'Appointment', short: 'Appointment', emoji: '📅', accent: 'sky', xp: 10, modes: ['pregnancy', 'baby'], blurb: 'Scans, checks, classes' },
];

export const logTypeConfig = (t: LogType): LogTypeConfig =>
  LOG_TYPES.find((c) => c.type === t) ?? LOG_TYPES[0];

export const logTypesForMode = (mode: Mode) => LOG_TYPES.filter((c) => c.modes.includes(mode));
