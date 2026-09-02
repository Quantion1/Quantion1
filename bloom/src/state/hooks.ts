import { useEffect, useMemo } from 'react';

import { babyAge, monthInfo } from '@/domain/baby';
import { evaluateBadges } from '@/domain/badges';
import { gestation, weekInfo } from '@/domain/pregnancy';
import { questsForDay } from '@/domain/quests';
import type { Entry } from '@/domain/types';
import { todayKey, toDayKey } from '@/lib/date';
import { useStore } from './store';

export function useTodayEntries(): Entry[] {
  const entries = useStore((s) => s.entries);
  const day = todayKey();
  return useMemo(() => entries.filter((e) => toDayKey(e.at) === day), [entries, day]);
}

export function useDailyQuests() {
  const mode = useStore((s) => s.profile.mode);
  const claimed = useStore((s) => s.game.claimedQuests);
  const today = useTodayEntries();
  const day = todayKey();

  return useMemo(
    () =>
      questsForDay(day, mode).map((def) => ({
        def,
        progress: def.measure(today),
        claimed: !!claimed[`${day}:${def.id}`],
      })),
    [day, mode, today, claimed],
  );
}

export function useDailyGoal() {
  const goal = useStore((s) => s.settings.dailyGoalXp);
  const xpByDay = useStore((s) => s.game.xpByDay);
  const xpToday = xpByDay[todayKey()] ?? 0;
  return { xpToday, goal, progress: Math.min(1, xpToday / Math.max(1, goal)), met: xpToday >= goal };
}

/** Awards any badge whose criteria are newly satisfied. */
export function useBadgeSync() {
  const entries = useStore((s) => s.entries);
  const game = useStore((s) => s.game);
  const profile = useStore((s) => s.profile);
  const awardBadges = useStore((s) => s.awardBadges);

  useEffect(() => {
    if (!profile.onboarded) return;
    const earned = evaluateBadges({ entries, game, profile })
      .filter((b) => b.done && !game.unlockedBadges.includes(b.def.id))
      .map((b) => b.def.id);
    if (earned.length) awardBadges(earned);
  }, [entries, game, profile, awardBadges]);
}

/** Mode-aware "where are we" summary used across the header and Journey. */
export function useJourneyContext() {
  const profile = useStore((s) => s.profile);

  return useMemo(() => {
    if (profile.mode === 'pregnancy' && profile.dueDate) {
      const g = gestation(profile.dueDate);
      const info = weekInfo(g.week);
      return {
        mode: 'pregnancy' as const,
        progress: g.progress,
        stageLabel: `Week ${g.week} + ${g.day}d`,
        stageSub: `${Math.max(0, g.daysLeft)} days to go · trimester ${g.trimester}`,
        headline: info.headline,
        tip: info.tip,
        emoji: info.emoji,
        sizeLabel: `about the size of a ${info.size}`,
        index: g.week,
      };
    }
    if (profile.mode === 'baby' && profile.birthDate) {
      const a = babyAge(profile.birthDate);
      const info = monthInfo(a.months);
      return {
        mode: 'baby' as const,
        progress: a.progress,
        stageLabel: info.title,
        stageSub: `${a.weeks} weeks · ${a.days} days old`,
        headline: info.headline,
        tip: info.tip,
        emoji: info.emoji,
        sizeLabel: `wake windows around ${info.wakeWindowMin}–${info.wakeWindowMax} min`,
        index: a.months,
      };
    }
    return {
      mode: profile.mode,
      progress: 0,
      stageLabel: 'Getting started',
      stageSub: 'Add your dates in Profile',
      headline: 'Tell Bloom your due date or your baby’s birthday to unlock the journey.',
      tip: 'You can change this any time.',
      emoji: '🌱',
      sizeLabel: '',
      index: 0,
    };
  }, [profile]);
}
