import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { logTypeConfig } from '@/domain/logTypes';
import type {
  Entry,
  EntryDraft,
  Gamification,
  LogType,
  Mode,
  Profile,
  Settings,
  Subscription,
} from '@/domain/types';
import { daysBetween, todayKey, toDayKey } from '@/lib/date';

export interface XpEvent {
  amount: number;
  label: string;
  at: number;
  levelUp?: number;
  badges?: string[];
}

interface State {
  profile: Profile;
  settings: Settings;
  game: Gamification;
  sub: Subscription;
  entries: Entry[];
  /** Transient — drives the celebration toast. Not persisted. */
  lastXpEvent?: XpEvent;

  addEntry: (draft: EntryDraft & { at?: string }) => Entry;
  updateEntry: (id: string, patch: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;

  setProfile: (patch: Partial<Profile>) => void;
  setSettings: (patch: Partial<Settings>) => void;
  switchMode: (mode: Mode) => void;

  claimQuest: (questId: string, xp: number, gems: number) => void;
  spendFreeze: () => boolean;
  awardBadges: (ids: string[]) => void;
  clearXpEvent: () => void;

  setPremium: (plan: Subscription['plan']) => void;
  cancelPremium: () => void;

  seedDemo: (mode: Mode) => void;
  resetAll: () => void;
}

const emptyProfile: Profile = { parentName: '', mode: 'pregnancy', onboarded: false };

const defaultSettings: Settings = {
  units: 'metric',
  clock24h: true,
  dailyGoalXp: 30,
  remindersOn: true,
};

const emptyGame: Gamification = {
  xp: 0,
  gems: 20,
  streak: 0,
  longestStreak: 0,
  streakFreezes: 1,
  freezeDaysUsed: [],
  unlockedBadges: [],
  xpByDay: {},
  claimedQuests: {},
};

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function bumpStreak(game: Gamification, day: string): Gamification {
  if (game.lastActiveDay === day) return game;
  let streak = game.streak;
  let freezes = game.streakFreezes;
  const freezeDaysUsed = [...game.freezeDaysUsed];

  if (!game.lastActiveDay) {
    streak = 1;
  } else {
    const gap = daysBetween(game.lastActiveDay, day);
    if (gap === 1) {
      streak += 1;
    } else if (gap === 2 && freezes > 0) {
      // One missed day, covered by a freeze — the streak survives.
      freezes -= 1;
      freezeDaysUsed.push(toDayKey(new Date(new Date(day).getTime() - 86_400_000)));
      streak += 1;
    } else {
      streak = 1;
    }
  }

  return {
    ...game,
    streak,
    streakFreezes: freezes,
    freezeDaysUsed,
    longestStreak: Math.max(game.longestStreak, streak),
    lastActiveDay: day,
  };
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: emptyProfile,
      settings: defaultSettings,
      game: emptyGame,
      sub: { premium: false },
      entries: [],

      addEntry: (draft) => {
        const at = draft.at ?? new Date().toISOString();
        const entry = { ...draft, at, id: uid(), createdAt: new Date().toISOString() } as Entry;
        const cfg = logTypeConfig(entry.type as LogType);
        const day = todayKey();

        set((s) => {
          const game = bumpStreak(s.game, day);
          const xpByDay = { ...game.xpByDay, [day]: (game.xpByDay[day] ?? 0) + cfg.xp };
          return {
            entries: [entry, ...s.entries],
            game: { ...game, xp: game.xp + cfg.xp, xpByDay },
            lastXpEvent: { amount: cfg.xp, label: cfg.label, at: Date.now() },
          };
        });
        return entry;
      },

      updateEntry: (id, patch) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? ({ ...e, ...patch } as Entry) : e)),
        })),

      deleteEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      switchMode: (mode) => set((s) => ({ profile: { ...s.profile, mode } })),

      claimQuest: (questId, xp, gems) => {
        const day = todayKey();
        const key = `${day}:${questId}`;
        if (get().game.claimedQuests[key]) return;
        set((s) => {
          const game = bumpStreak(s.game, day);
          return {
            game: {
              ...game,
              xp: game.xp + xp,
              gems: game.gems + gems,
              xpByDay: { ...game.xpByDay, [day]: (game.xpByDay[day] ?? 0) + xp },
              claimedQuests: { ...game.claimedQuests, [key]: day },
            },
            lastXpEvent: { amount: xp, label: 'Quest complete', at: Date.now() },
          };
        });
      },

      spendFreeze: () => {
        const { game } = get();
        if (game.streakFreezes <= 0) return false;
        set({ game: { ...game, streakFreezes: game.streakFreezes - 1 } });
        return true;
      },

      awardBadges: (ids) =>
        set((s) => {
          const fresh = ids.filter((id) => !s.game.unlockedBadges.includes(id));
          if (!fresh.length) return {};
          return {
            game: {
              ...s.game,
              unlockedBadges: [...s.game.unlockedBadges, ...fresh],
              gems: s.game.gems + fresh.length * 10,
            },
            lastXpEvent: { amount: 0, label: 'Badge unlocked', at: Date.now(), badges: fresh },
          };
        }),

      clearXpEvent: () => set({ lastXpEvent: undefined }),

      setPremium: (plan) => set({ sub: { premium: true, plan, since: new Date().toISOString() } }),
      cancelPremium: () => set({ sub: { premium: false } }),

      seedDemo: (mode) => {
        // Imported lazily to keep the generator out of the startup path.
        const { buildDemoData } = require('@/state/demo') as typeof import('@/state/demo');
        const demo = buildDemoData(mode);
        set({
          profile: { ...demo.profile, onboarded: true },
          entries: demo.entries,
          game: demo.game,
          sub: { premium: false },
        });
      },

      resetAll: () =>
        set({
          profile: emptyProfile,
          settings: defaultSettings,
          game: emptyGame,
          sub: { premium: false },
          entries: [],
          lastXpEvent: undefined,
        }),
    }),
    {
      name: 'bloom-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        profile: s.profile,
        settings: s.settings,
        game: s.game,
        sub: s.sub,
        entries: s.entries,
      }),
    },
  ),
);

export const useProfile = () => useStore((s) => s.profile);
export const useSettings = () => useStore((s) => s.settings);
export const useGame = () => useStore((s) => s.game);
export const useEntries = () => useStore((s) => s.entries);
export const usePremium = () => useStore((s) => s.sub.premium);
