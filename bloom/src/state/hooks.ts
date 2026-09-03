import { useEffect, useMemo } from 'react';

import { evaluateBadges } from '@/domain/badges';
import { availableCards, cardFor } from '@/domain/cards';
import { capturedCount, dotPose, eraStates, isCaptured, momentById, pendingAsk } from '@/domain/moments';
import { babyAge, gestation, position } from '@/domain/stage';
import { availability, TRACKERS } from '@/domain/trackers';
import type { Entry, Progress } from '@/domain/types';
import { addDays, fromDayKey, todayKey, toDayKey } from '@/lib/date';
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
        era: openEra('pregnancy', progress, pos),
        captured: capturedCount('pregnancy', progress),
        dot: dotPose('pregnancy', progress, g.week, 0),
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
      era: openEra('baby', progress, pos),
      captured: capturedCount('baby', progress),
      dot: dotPose('baby', progress, 0, a.days),
    };
  }, [profile, progress]);
}

/** The name of the chapter the parent is in — what Dot wears instead of a level. */
function openEra(stage: 'pregnancy' | 'baby', progress: Progress, position: number): string {
  const open = eraStates(stage, progress, position).filter((e) => e.open);
  return open.length ? open[open.length - 1].era.name : eraStates(stage, progress, position)[0].era.name;
}

/** The one thing Home puts to the parent, if there is anything. */
export function useMomentAsk() {
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const entries = useStore((s) => s.entries);
  const nest = useNest();

  return useMemo(
    () => pendingAsk(profile.stage, progress, entries, nest.position, todayKey()),
    [profile.stage, progress, entries, nest.position],
  );
}

/**
 * Moments the dates alone settle. Nobody should be asked to confirm that they
 * reached thirty-seven weeks, so it captures itself — dated to the day it
 * actually happened, not the day the app noticed.
 */
export function useAutoMoments() {
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const capture = useStore((s) => s.captureMoment);
  const showToast = useStore((s) => s.showToast);
  const nest = useNest();

  useEffect(() => {
    if (!profile.onboarded) return;
    if (profile.stage !== 'pregnancy' || !profile.dueDate) return;
    if (nest.week < 37 || isCaptured(progress, 'p_term')) return;
    const moment = momentById('p_term');
    if (!moment) return;
    // Thirty-seven weeks is three weeks before the due date, whenever that fell.
    capture('p_term', addDays(fromDayKey(profile.dueDate), -21).toISOString());
    showToast({ emoji: moment.emoji, title: moment.title, sub: 'A moment', body: moment.body, big: true });
  }, [profile, progress, nest.week, capture, showToast]);
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
