import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { starterTiles } from '@/domain/trackers';
import type {
  Entry, Memory, PlanItem, Profile, Progress, Settings, Stage, Subscription, Tile, TrackerKey,
} from '@/domain/types';
import { todayKey } from '@/lib/date';

export interface Toast {
  emoji: string;
  title: string;
  sub?: string;
  at: number;
  /** A level-up gets the full celebration sheet rather than a passing toast. */
  big?: boolean;
}

interface State {
  profile: Profile;
  settings: Settings;
  progress: Progress;
  sub: Subscription;
  entries: Entry[];
  tiles: Tile[];
  plans: PlanItem[];
  memories: Memory[];
  toast?: Toast;

  addEntry: (draft: Omit<Entry, 'id' | 'createdAt'>) => Entry;
  updateEntry: (id: string, patch: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;

  setProfile: (patch: Partial<Profile>) => void;
  setSettings: (patch: Partial<Settings>) => void;

  setTiles: (tiles: Tile[]) => void;
  addTile: (key: TrackerKey) => void;
  removeTile: (key: string) => void;
  resizeTile: (key: string, span: 1 | 2, h: 1 | 2) => void;
  /** Move a tile to an absolute index — the drag-to-reorder gesture's only write. */
  moveTile: (key: string, to: number) => void;

  claimLevel: (id: string, title: string, emoji: string) => void;
  snoozeLevel: (id: string) => void;
  hatch: (birthDate: string, babyName: string) => void;

  collectCard: (week: number) => void;
  setPack: (id: string) => void;
  mark: (key: string, date?: string) => void;
  unmark: (key: string) => void;
  awardBadges: (ids: string[]) => void;
  noteOpened: () => void;

  addPlan: (item: Omit<PlanItem, 'id'>) => void;
  updatePlan: (id: string, patch: Partial<PlanItem>) => void;
  deletePlan: (id: string) => void;

  addMemory: (m: Omit<Memory, 'id'>) => void;
  deleteMemory: (id: string) => void;

  showToast: (t: Omit<Toast, 'at'>) => void;
  clearToast: () => void;

  setPremium: (plan: Subscription['plan']) => void;
  cancelPremium: () => void;

  seedDemo: (stage: Stage) => void;
  resetAll: () => void;
}

const emptyProfile: Profile = {
  parentName: '',
  babyName: '',
  stage: 'pregnancy',
  country: 'NL',
  onboarded: false,
};

const defaultSettings: Settings = {
  units: 'metric',
  clock24h: true,
  reviewHour: 21,
  drinks: ['glass', 'mug', 'bottle'],
};

const emptyProgress: Progress = {
  pregnancyLevel: 0,
  babyLevel: 0,
  claimed: [],
  snoozed: {},
  badges: [],
  daysOpened: [],
  cards: [],
  activePack: 'garden',
  marks: {},
  hatched: false,
};

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: emptyProfile,
      settings: defaultSettings,
      progress: emptyProgress,
      sub: { premium: false },
      entries: [],
      tiles: [],
      plans: [],
      memories: [],

      addEntry: (draft) => {
        const entry: Entry = { ...draft, id: uid(), createdAt: new Date().toISOString() };
        set((s) => ({ entries: [entry, ...s.entries] }));
        return entry;
      },

      updateEntry: (id, patch) =>
        set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),

      deleteEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      setTiles: (tiles) => set({ tiles }),

      addTile: (key) =>
        set((s) => (s.tiles.some((t) => t.key === key) ? {} : { tiles: [...s.tiles, { key, span: 1 }] })),

      removeTile: (key) => set((s) => ({ tiles: s.tiles.filter((t) => t.key !== key) })),

      resizeTile: (key, span, h) =>
        set((s) => ({
          tiles: s.tiles.map((t) => (t.key === key ? { ...t, span, h } : t)),
        })),

      moveTile: (key, to) =>
        set((s) => {
          const from = s.tiles.findIndex((t) => t.key === key);
          if (from < 0 || to < 0 || to >= s.tiles.length || from === to) return {};
          const next = [...s.tiles];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return { tiles: next };
        }),

      claimLevel: (id, title, emoji) =>
        set((s) => {
          if (s.progress.claimed.includes(id)) return {};
          const claimed = [...s.progress.claimed, id];
          const isPregnancy = id.startsWith('p_');
          return {
            progress: {
              ...s.progress,
              claimed,
              pregnancyLevel: isPregnancy ? s.progress.pregnancyLevel + 1 : s.progress.pregnancyLevel,
              babyLevel: isPregnancy ? s.progress.babyLevel : s.progress.babyLevel + 1,
            },
            toast: { emoji, title, sub: 'Level up', at: Date.now(), big: true },
          };
        }),

      snoozeLevel: (id) =>
        set((s) => ({ progress: { ...s.progress, snoozed: { ...s.progress.snoozed, [id]: todayKey() } } })),

      hatch: (birthDate, babyName) =>
        set((s) => ({
          profile: { ...s.profile, stage: 'baby', birthDate, babyName: babyName || s.profile.babyName },
          progress: { ...s.progress, hatched: true, claimed: [...s.progress.claimed, 'b_home'], babyLevel: 1 },
          tiles: starterTiles('baby').map((key) => ({ key, span: 1 as const })),
          toast: { emoji: '🐣', title: 'Dot hatched', sub: 'Player two has entered', at: Date.now(), big: true },
        })),

      collectCard: (week) =>
        set((s) =>
          s.progress.cards.includes(week)
            ? {}
            : {
                progress: { ...s.progress, cards: [...s.progress.cards, week] },
                toast: { emoji: '🃏', title: `Week ${week} card collected`, at: Date.now() },
              },
        ),

      setPack: (id) => set((s) => ({ progress: { ...s.progress, activePack: id } })),

      mark: (key, date) =>
        set((s) => ({ progress: { ...s.progress, marks: { ...s.progress.marks, [key]: date ?? todayKey() } } })),

      unmark: (key) =>
        set((s) => {
          const marks = { ...s.progress.marks };
          delete marks[key];
          return { progress: { ...s.progress, marks } };
        }),

      awardBadges: (ids) =>
        set((s) => {
          const fresh = ids.filter((id) => !s.progress.badges.includes(id));
          if (!fresh.length) return {};
          return {
            progress: { ...s.progress, badges: [...s.progress.badges, ...fresh] },
            toast: { emoji: '🏅', title: 'Badge earned', at: Date.now() },
          };
        }),

      noteOpened: () =>
        set((s) => {
          const day = todayKey();
          if (s.progress.daysOpened.includes(day)) return {};
          return { progress: { ...s.progress, daysOpened: [...s.progress.daysOpened, day] } };
        }),

      addPlan: (item) => set((s) => ({ plans: [...s.plans, { ...item, id: uid() }] })),
      updatePlan: (id, patch) =>
        set((s) => ({ plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deletePlan: (id) => set((s) => ({ plans: s.plans.filter((p) => p.id !== id) })),

      addMemory: (m) => set((s) => ({ memories: [{ ...m, id: uid() }, ...s.memories] })),
      deleteMemory: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),

      showToast: (t) => set({ toast: { ...t, at: Date.now() } }),
      clearToast: () => set({ toast: undefined }),

      setPremium: (plan) => set({ sub: { premium: true, plan, since: new Date().toISOString() } }),
      cancelPremium: () => set({ sub: { premium: false } }),

      seedDemo: (stage) => {
        const { buildDemo } = require('@/state/demo') as typeof import('@/state/demo');
        const demo = buildDemo(stage);
        set({
          profile: { ...demo.profile, onboarded: true },
          entries: demo.entries,
          progress: demo.progress,
          tiles: demo.tiles,
          plans: demo.plans,
          memories: demo.memories,
          sub: { premium: false },
        });
      },

      resetAll: () =>
        set({
          profile: emptyProfile,
          settings: defaultSettings,
          progress: emptyProgress,
          sub: { premium: false },
          entries: [],
          tiles: [],
          plans: [],
          memories: [],
          toast: undefined,
        }),
    }),
    {
      name: 'nest-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        profile: s.profile,
        settings: s.settings,
        progress: s.progress,
        sub: s.sub,
        entries: s.entries,
        tiles: s.tiles,
        plans: s.plans,
        memories: s.memories,
      }),
    },
  ),
);

export const useProfile = () => useStore((s) => s.profile);
export const useSettings = () => useStore((s) => s.settings);
export const useProgress = () => useStore((s) => s.progress);
export const useEntries = () => useStore((s) => s.entries);
export const usePremium = () => useStore((s) => s.sub.premium);
