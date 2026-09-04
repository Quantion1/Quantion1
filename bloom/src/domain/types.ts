import type { AccentName } from '@/theme';

export type Stage = 'pregnancy' | 'baby';

/** Dot's poses, in the order she grows through them. */
export type DotPose = 'egg0' | 'egg1' | 'egg2' | 'egg3' | 'sleep' | 'tummy' | 'sit' | 'stand' | 'walk';

export type TrackerKey =
  // baby
  | 'sleep' | 'breast' | 'bottle' | 'diaper' | 'weight' | 'tummy' | 'temp'
  | 'vitd' | 'vitk' | 'solids' | 'newfood' | 'teeth' | 'words' | 'vax' | 'bmed'
  // you
  | 'pump' | 'msleep' | 'water' | 'supp' | 'med'
  // pregnancy
  | 'kicks' | 'contr' | 'bump' | 'mwq'
  // birth
  | 'labour' | 'birthrec'
  // utility
  | 'memories' | 'note';

/**
 * One shape for every tracker. Which fields a tracker uses is declared by its
 * sheet spec, so adding a tracker is data rather than a new form component.
 */
export interface Entry {
  id: string;
  tracker: TrackerKey;
  /** When it happened. */
  at: string;
  /** For timed entries — sleep, feeds, contractions. */
  end?: string;
  minutes?: number;
  /** Primary number: ml, kg, °C, hours. */
  amount?: number;
  /** Secondary number: cm at birth. */
  amount2?: number;
  kind?: string;
  side?: 'left' | 'right' | 'both';
  chips?: string[];
  /** 1–5 face rating. */
  face?: number;
  text?: string;
  /** Tap counters — kicks, tummy time. */
  count?: number;
  checks?: string[];
  note?: string;
  createdAt: string;
}

export type BlockType =
  | 'timer' | 'timepair' | 'number' | 'pick' | 'chips' | 'faces' | 'text'
  | 'checks' | 'counter' | 'confirm' | 'sides' | 'drinks' | 'teeth'
  | 'events' | 'textlist' | 'photo';

export interface Block {
  t: BlockType;
  label?: string;
  field?: string;
  unit?: string;
  step?: number;
  def?: number | string;
  presets?: number[];
  opts?: (string | [string, string])[];
  faces?: string[];
  target?: number;
  optional?: boolean;
  instant?: boolean;
  single?: boolean;
  bedwake?: boolean;
  ph?: string;
  /**
   * An alternative way to enter what an earlier block already covers. Shown
   * folded away, because two live inputs for one value is clutter, not choice.
   */
  secondary?: boolean;
}

export interface Tracker {
  key: TrackerKey;
  label: string;
  emoji: string;
  accent: AccentName;
  group: 'Baby' | 'You' | 'Pregnancy' | 'Birth' | 'Keepsake';
  stage: Stage | 'both';
  /** Availability window. Pregnancy trackers use weeks, baby trackers use days. */
  from?: number;
  to?: number;
  blurb: string;
  blocks: Block[];
  /** Shown on a fresh install. */
  starter?: boolean;
}

export interface Profile {
  parentName: string;
  babyName: string;
  stage: Stage;
  dueDate?: string;
  birthDate?: string;
  babySex?: 'girl' | 'boy' | 'unknown';
  prePregnancyWeightKg?: number;
  country: string;
  onboarded: boolean;
}

export type UnitSystem = 'metric' | 'imperial';

export type ThemePref = 'system' | 'light' | 'dark';

export interface Settings {
  units: UnitSystem;
  clock24h: boolean;
  /** 'system' follows the phone; the other two override it. */
  theme: ThemePref;
  reviewHour: number;
  drinks: string[];
}

/** A tile on the home grid, sized in grid cells like a launcher widget. */
export interface Tile {
  key: TrackerKey | 'today' | 'dot';
  /** Width: 1 = half, 2 = full. */
  span: 1 | 2;
  /** Height in rows; absent means one row (older saved layouts). */
  h?: 1 | 2;
}

export interface Progress {
  /**
   * Captured moments: id → when it actually happened, as an ISO timestamp.
   * An empty string means it was captured before the app asked for a date.
   */
  moments: Record<string, string>;
  /** Moment ids dismissed with "not yet" — re-offered tomorrow. */
  snoozed: Record<string, string>;
  badges: string[];
  /** yyyy-mm-dd of every day the app was opened. */
  daysOpened: string[];
  /** Weekly size cards collected, by week number. */
  cards: number[];
  activePack: string;
  /** Milestone/first ids that have been marked, with their date. */
  marks: Record<string, string>;
  hatched: boolean;
}

export interface Subscription {
  premium: boolean;
  plan?: 'monthly' | 'annual' | 'lifetime';
  since?: string;
}

export interface PlanItem {
  id: string;
  title: string;
  /** yyyy-mm-dd */
  date: string;
  time?: string;
  kind: 'appointment' | 'scan' | 'class' | 'visitor' | 'reminder' | 'care';
  note?: string;
  careKey?: string;
  done?: boolean;
}

export interface Memory {
  id: string;
  /** Emoji stand-in for the photo in this prototype. */
  glyph: string;
  caption: string;
  at: string;
  tag?: string;
  firstKey?: string;
}
