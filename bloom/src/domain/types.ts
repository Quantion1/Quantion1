export type Mode = 'pregnancy' | 'baby';

export type LogType =
  // Baby
  | 'feed'
  | 'sleep'
  | 'diaper'
  | 'growth'
  | 'babyMood'
  | 'milestone'
  // Pregnancy
  | 'symptom'
  | 'weight'
  | 'kicks'
  | 'contraction'
  | 'appointment';

export type FeedMethod = 'left' | 'right' | 'bottle' | 'solids';

export interface BaseEntry {
  id: string;
  type: LogType;
  /** ISO timestamp the event happened (not when it was typed in). */
  at: string;
  createdAt: string;
  note?: string;
}

export interface FeedEntry extends BaseEntry {
  type: 'feed';
  method: FeedMethod;
  /** Breast/nursing duration. */
  minutes?: number;
  /** Bottle volume in millilitres (canonical unit; UI converts). */
  ml?: number;
}

export interface SleepEntry extends BaseEntry {
  type: 'sleep';
  /** Minutes asleep. `at` is the moment sleep started. */
  minutes: number;
  kind: 'night' | 'nap';
  wakings?: number;
}

export interface DiaperEntry extends BaseEntry {
  type: 'diaper';
  kind: 'wet' | 'dirty' | 'mixed' | 'dry';
}

export interface GrowthEntry extends BaseEntry {
  type: 'growth';
  weightKg?: number;
  lengthCm?: number;
  headCm?: number;
}

export interface BabyMoodEntry extends BaseEntry {
  type: 'babyMood';
  /** 1 = very fussy … 5 = delighted */
  mood: number;
  tags: string[];
}

export interface MilestoneEntry extends BaseEntry {
  type: 'milestone';
  key: string;
}

export interface SymptomEntry extends BaseEntry {
  type: 'symptom';
  symptoms: string[];
  /** 1 = barely … 5 = severe */
  severity: number;
  /** 1 = rough … 5 = great */
  mood: number;
}

export interface WeightEntry extends BaseEntry {
  type: 'weight';
  kg: number;
}

export interface KicksEntry extends BaseEntry {
  type: 'kicks';
  count: number;
  durationMin: number;
}

export interface ContractionEntry extends BaseEntry {
  type: 'contraction';
  /** Length of the contraction. */
  durationSec: number;
  /** Gap since the previous contraction started. */
  intervalSec?: number;
}

export interface AppointmentEntry extends BaseEntry {
  type: 'appointment';
  title: string;
  kind: 'scan' | 'midwife' | 'doctor' | 'class' | 'vaccine' | 'other';
  done?: boolean;
}

export type Entry =
  | FeedEntry
  | SleepEntry
  | DiaperEntry
  | GrowthEntry
  | BabyMoodEntry
  | MilestoneEntry
  | SymptomEntry
  | WeightEntry
  | KicksEntry
  | ContractionEntry
  | AppointmentEntry;

export interface Profile {
  parentName: string;
  mode: Mode;
  /** ISO date (yyyy-mm-dd) */
  dueDate?: string;
  birthDate?: string;
  babyName?: string;
  babySex?: 'girl' | 'boy' | 'surprise';
  prePregnancyWeightKg?: number;
  heightCm?: number;
  onboarded: boolean;
}

export type UnitSystem = 'metric' | 'imperial';

export interface Settings {
  units: UnitSystem;
  clock24h: boolean;
  dailyGoalXp: number;
  remindersOn: boolean;
}

export interface Gamification {
  xp: number;
  gems: number;
  streak: number;
  longestStreak: number;
  /** yyyy-mm-dd of the last day that earned XP. */
  lastActiveDay?: string;
  streakFreezes: number;
  /** yyyy-mm-dd days a freeze was spent on. */
  freezeDaysUsed: string[];
  unlockedBadges: string[];
  /** yyyy-mm-dd -> xp earned that day */
  xpByDay: Record<string, number>;
  /** questId -> yyyy-mm-dd it was claimed */
  claimedQuests: Record<string, string>;
}

export interface Subscription {
  premium: boolean;
  plan?: 'monthly' | 'annual' | 'lifetime';
  since?: string;
}

/** Distributive Omit so each variant keeps its own discriminated fields. */
export type EntryDraft = {
  [K in Entry['type']]: Omit<Extract<Entry, { type: K }>, 'id' | 'createdAt'>;
}[Entry['type']];
