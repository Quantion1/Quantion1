import { useEffect, useMemo } from 'react';

import { evaluateBadges } from '@/domain/badges';
import { availableCards, cardFor } from '@/domain/cards';
import { dotStage, nextLevel } from '@/domain/levels';
import { babyAge, gestation, position } from '@/domain/stage';
import { availability, TRACKERS } from '@/domain/trackers';
import type { Entry } from '@/domain/types';
import { todayKey, toDayKey } from '@/lib/date';
import { useStore } from './store';

export function useTodayEntries(): Entry[] {
  const entries = useStore((s) => s.entries);
  const day = todayKey();
  return useMemo(() => entries.filter((e) => toDayKey(e.at) === day), [entries, day]);
}

/** Where the parent is: which stage, how far in, and what Dot looks like. */
export function useNest() {
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);

  return useMemo(() => {
    const pos = position(profile);
    if (profile.stage === 'pregnancy') {
      const g = profile.dueDate ? gestation(profile.dueDate) : { week: 0, day: 0, daysLeft: 280, trimester: 1, progress: 0 };
      return {
        stage: 'pregnancy' as const,
        position: pos,
        week: g.week,
        days: 0,
        months: 0,
        progress: g.progress,
        title: `Week ${g.week}`,
        sub: `${Math.max(0, g.daysLeft)} days to go · trimester ${g.trimester}`,
        level: progress.pregnancyLevel,
        dot: dotStage('pregnancy', progress.pregnancyLevel, g.week),
      };
    }
    const a = profile.birthDate ? babyAge(profile.birthDate) : { days: 0, weeks: 0, months: 0, progress: 0, label: '' };
    return {
      stage: 'baby' as const,
      position: pos,
      week: 0,
      days: a.days,
      months: a.months,
      progress: a.progress,
      title: profile.babyName || 'The Nugget',
      sub: a.label,
      level: progress.babyLevel,
      dot: dotStage('baby', progress.babyLevel, 0),
    };
  }, [profile, progress]);
}

/** The one live level question, if there is one. */
export function useLevelPrompt() {
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const entries = useStore((s) => s.entries);
  const nest = useNest();

  return useMemo(
    () => nextLevel(profile.stage, progress, entries, nest.position, todayKey()),
    [profile.stage, progress, entries, nest.position],
  );
}

/** Trackers split by whether they make sense right now. */
export function useLibrary() {
  const profile = useStore((s) => s.profile);
  const tiles = useStore((s) => s.tiles);
  const nest = useNest();
  const onHome = new Set(tiles.map((t) => t.key));

  return useMemo(() => {
    const groups = { now: [] as typeof TRACKERS, later: [] as typeof TRACKERS, retired: [] as typeof TRACKERS };
    for (const t of TRACKERS) {
      const state = availability(t, profile.stage, nest.week, nest.days);
      if (state === 'other-stage') continue;
      if (state === 'now') groups.now.push(t);
      else if (state === 'later') groups.later.push(t);
      else groups.retired.push(t);
    }
    return { ...groups, onHome };
  }, [profile.stage, nest.week, nest.days, tiles]);
}

/** This week's collectible card, and whether it is still uncollected. */
export function useWeeklyCard() {
  const progress = useStore((s) => s.progress);
  const nest = useNest();
  return useMemo(() => {
    if (nest.stage !== 'pregnancy') return null;
    const week = Math.min(40, Math.max(4, nest.week));
    if (week < 4) return null;
    return {
      week,
      card: cardFor(progress.activePack, week),
      collected: progress.cards.includes(week),
      available: availableCards(nest.week).length,
    };
  }, [nest.stage, nest.week, progress.activePack, progress.cards]);
}

/** Awards any badge whose target has just been met. */
export function useBadgeSync() {
  const entries = useStore((s) => s.entries);
  const progress = useStore((s) => s.progress);
  const onboarded = useStore((s) => s.profile.onboarded);
  const awardBadges = useStore((s) => s.awardBadges);

  useEffect(() => {
    if (!onboarded) return;
    const earned = evaluateBadges({ entries, progress })
      .filter((b) => b.done && !progress.badges.includes(b.def.id))
      .map((b) => b.def.id);
    if (earned.length) awardBadges(earned);
  }, [entries, progress, onboarded, awardBadges]);
}

/** Records that the app was opened today — the basis of the showing-up badges. */
export function useOpenTracking() {
  const noteOpened = useStore((s) => s.noteOpened);
  const onboarded = useStore((s) => s.profile.onboarded);
  useEffect(() => {
    if (onboarded) noteOpened();
  }, [onboarded, noteOpened]);
}

/** How many of the last seven days have something logged. No loss state. */
export function useRhythm() {
  const entries = useStore((s) => s.entries);
  return useMemo(() => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(toDayKey(d));
    }
    const logged = new Set(entries.map((e) => toDayKey(e.at)));
    const marks = days.map((d) => ({ day: d, on: logged.has(d) }));
    return { marks, count: marks.filter((m) => m.on).length };
  }, [entries]);
}
