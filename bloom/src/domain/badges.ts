import type { AccentName } from '@/theme';
import type { Entry, Gamification, Mode, Profile } from './types';

export interface BadgeContext {
  entries: Entry[];
  game: Gamification;
  profile: Profile;
}

export interface BadgeProgress {
  current: number;
  target: number;
  done: boolean;
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  accent: AccentName;
  tier: 'bronze' | 'silver' | 'gold';
  mode: Mode | 'any';
  measure: (ctx: BadgeContext) => BadgeProgress;
}

const ofType = (t: Entry['type']) => (ctx: BadgeContext) => ctx.entries.filter((e) => e.type === t).length;

const goal = (current: number, target: number): BadgeProgress => ({
  current: Math.min(current, target),
  target,
  done: current >= target,
});

export const BADGES: BadgeDef[] = [
  { id: 'first-log', name: 'First Steps', description: 'Log your very first entry.', emoji: '🌱', accent: 'mint', tier: 'bronze', mode: 'any', measure: (c) => goal(c.entries.length, 1) },
  { id: 'streak-3', name: 'Warming Up', description: 'Keep a 3-day streak.', emoji: '🔥', accent: 'coral', tier: 'bronze', mode: 'any', measure: (c) => goal(c.game.longestStreak, 3) },
  { id: 'streak-7', name: 'Week Warrior', description: 'Keep a 7-day streak.', emoji: '🔥', accent: 'coral', tier: 'silver', mode: 'any', measure: (c) => goal(c.game.longestStreak, 7) },
  { id: 'streak-30', name: 'Unstoppable', description: 'Keep a 30-day streak.', emoji: '🏅', accent: 'sunny', tier: 'gold', mode: 'any', measure: (c) => goal(c.game.longestStreak, 30) },
  { id: 'level-5', name: 'Growing Strong', description: 'Reach level 5.', emoji: '⭐', accent: 'sunny', tier: 'silver', mode: 'any', measure: (c) => goal(c.game.xp, 100 + 160 + 200 + 240) },
  { id: 'logs-100', name: 'Century', description: 'Record 100 entries.', emoji: '💯', accent: 'grape', tier: 'silver', mode: 'any', measure: (c) => goal(c.entries.length, 100) },
  { id: 'logs-500', name: 'Archivist', description: 'Record 500 entries.', emoji: '📚', accent: 'grape', tier: 'gold', mode: 'any', measure: (c) => goal(c.entries.length, 500) },

  { id: 'feeds-50', name: 'Milk Run', description: 'Log 50 feeds.', emoji: '🍼', accent: 'sky', tier: 'bronze', mode: 'baby', measure: (c) => goal(ofType('feed')(c), 50) },
  { id: 'feeds-250', name: 'Feeding Machine', description: 'Log 250 feeds.', emoji: '🥛', accent: 'sky', tier: 'gold', mode: 'baby', measure: (c) => goal(ofType('feed')(c), 250) },
  { id: 'diapers-100', name: 'Diaper Duty', description: 'Log 100 diaper changes.', emoji: '💧', accent: 'mint', tier: 'silver', mode: 'baby', measure: (c) => goal(ofType('diaper')(c), 100) },
  {
    id: 'night-6h',
    name: 'Full Night',
    description: 'Record a single sleep of 6 hours or more.',
    emoji: '🌙',
    accent: 'grape',
    tier: 'gold',
    mode: 'baby',
    measure: (c) => {
      const best = c.entries.reduce((m, e) => (e.type === 'sleep' ? Math.max(m, e.minutes) : m), 0);
      return goal(Math.round(best), 360);
    },
  },
  { id: 'growth-3', name: 'On the Curve', description: 'Add 3 growth measurements.', emoji: '📏', accent: 'coral', tier: 'bronze', mode: 'baby', measure: (c) => goal(ofType('growth')(c), 3) },
  { id: 'milestone-5', name: 'Memory Keeper', description: 'Capture 5 milestones.', emoji: '🏆', accent: 'blossom', tier: 'silver', mode: 'baby', measure: (c) => goal(ofType('milestone')(c), 5) },

  { id: 'symptom-20', name: 'Body Aware', description: 'Do 20 symptom check-ins.', emoji: '🤰', accent: 'blossom', tier: 'silver', mode: 'pregnancy', measure: (c) => goal(ofType('symptom')(c), 20) },
  { id: 'weight-10', name: 'Steady Curve', description: 'Log your weight 10 times.', emoji: '⚖️', accent: 'mint', tier: 'bronze', mode: 'pregnancy', measure: (c) => goal(ofType('weight')(c), 10) },
  {
    id: 'kicks-100',
    name: 'Kickboxer',
    description: 'Count 100 kicks in total.',
    emoji: '🦶',
    accent: 'sunny',
    tier: 'silver',
    mode: 'pregnancy',
    measure: (c) => goal(c.entries.reduce((s, e) => (e.type === 'kicks' ? s + e.count : s), 0), 100),
  },
  { id: 'contractions-1', name: 'Game Time', description: 'Time your first contraction.', emoji: '⏱️', accent: 'coral', tier: 'bronze', mode: 'pregnancy', measure: (c) => goal(ofType('contraction')(c), 1) },
  { id: 'trimester-3', name: 'Third Trimester', description: 'Reach week 28.', emoji: '🎉', accent: 'blossom', tier: 'gold', mode: 'pregnancy', measure: (c) => goal(c.profile.dueDate ? Math.max(0, 40 - Math.ceil((new Date(c.profile.dueDate).getTime() - Date.now()) / (7 * 86400000))) : 0, 28) },
];

export function badgesForMode(mode: Mode) {
  return BADGES.filter((b) => b.mode === 'any' || b.mode === mode);
}

export function evaluateBadges(ctx: BadgeContext) {
  return badgesForMode(ctx.profile.mode).map((b) => ({ def: b, ...b.measure(ctx) }));
}
