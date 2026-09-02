import type { Entry, EntryDraft, Gamification, Mode, Profile } from '@/domain/types';
import { addDays, toDayKey } from '@/lib/date';

/** Small deterministic PRNG so the demo data set is identical every time. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const id = (n: number) => `demo-${n}`;

const SYMPTOMS = ['Nausea', 'Fatigue', 'Heartburn', 'Back pain', 'Cravings', 'Insomnia', 'Swelling', 'Braxton Hicks'];
const BABY_TAGS = ['Happy', 'Fussy', 'Gassy', 'Teething', 'Clingy', 'Playful', 'Congested'];

export function buildDemoData(mode: Mode): { profile: Profile; entries: Entry[]; game: Gamification } {
  const rand = rng(mode === 'baby' ? 20260901 : 20260902);
  const entries: Entry[] = [];
  const now = new Date();
  let n = 0;
  const push = (e: EntryDraft) => {
    // Never generate history that has not happened yet — only appointments look ahead.
    if (e.type !== 'appointment' && +new Date(e.at) > now.getTime()) return;
    entries.push({ ...e, id: id(n++), createdAt: e.at } as Entry);
  };

  const DAYS = 60;
  const xpByDay: Record<string, number> = {};
  const addXp = (at: Date, xp: number) => {
    const k = toDayKey(at);
    xpByDay[k] = (xpByDay[k] ?? 0) + xp;
  };

  let profile: Profile;

  if (mode === 'baby') {
    const birth = addDays(now, -98); // ~14 weeks old
    profile = {
      parentName: 'Alex',
      mode: 'baby',
      babyName: 'Robin',
      babySex: 'girl',
      birthDate: toDayKey(birth),
      onboarded: true,
    };

    for (let d = DAYS - 1; d >= 0; d--) {
      const day = addDays(now, -d);
      const ageWeeks = Math.max(0, Math.round((day.getTime() - birth.getTime()) / (7 * 86400000)));
      // Sleep consolidates as the baby gets older.
      const nightBlocks = ageWeeks < 6 ? 3 : ageWeeks < 10 ? 2 : rand() > 0.35 ? 2 : 1;
      const longestNight = 165 + ageWeeks * 15 + rand() * 60;

      // Night sleep, starting the previous evening.
      let cursor = new Date(day);
      cursor.setHours(19, 20 + Math.floor(rand() * 40), 0, 0);
      for (let b = 0; b < nightBlocks; b++) {
        const minutes = Math.round(b === 0 ? longestNight : 85 + rand() * 115);
        push({ type: 'sleep', at: cursor.toISOString(), minutes, kind: 'night', wakings: b === 0 ? 0 : 1 });
        addXp(day, 6);
        cursor = new Date(cursor.getTime() + (minutes + 20 + rand() * 25) * 60000);
        if (b < nightBlocks - 1) {
          push({
            type: 'feed',
            at: cursor.toISOString(),
            method: rand() > 0.5 ? 'left' : 'right',
            minutes: Math.round(9 + rand() * 12),
          });
          addXp(day, 5);
        }
      }

      // Daytime naps.
      const naps = ageWeeks < 16 ? 4 : 3;
      let napAt = new Date(day);
      napAt.setHours(8, 30, 0, 0);
      for (let i = 0; i < naps; i++) {
        const minutes = Math.round(50 + rand() * 75);
        push({ type: 'sleep', at: napAt.toISOString(), minutes, kind: 'nap' });
        addXp(day, 6);
        napAt = new Date(napAt.getTime() + (minutes + 100 + rand() * 60) * 60000);
      }

      // Daytime feeds.
      const feeds = Math.max(4, 8 - Math.floor(ageWeeks / 6) + (rand() > 0.7 ? 1 : 0));
      let feedAt = new Date(day);
      feedAt.setHours(7, 10, 0, 0);
      for (let i = 0; i < feeds; i++) {
        const bottle = rand() > 0.62;
        push(
          bottle
            ? { type: 'feed', at: feedAt.toISOString(), method: 'bottle', ml: Math.round(90 + rand() * 70) }
            : {
                type: 'feed',
                at: feedAt.toISOString(),
                method: rand() > 0.5 ? 'left' : 'right',
                minutes: Math.round(10 + rand() * 14),
              },
        );
        addXp(day, 5);
        feedAt = new Date(feedAt.getTime() + (150 + rand() * 70) * 60000);
      }

      // Diapers.
      const diapers = 5 + Math.floor(rand() * 3);
      let dAt = new Date(day);
      dAt.setHours(6, 45, 0, 0);
      for (let i = 0; i < diapers; i++) {
        const r = rand();
        push({
          type: 'diaper',
          at: dAt.toISOString(),
          kind: r > 0.72 ? 'dirty' : r > 0.62 ? 'mixed' : 'wet',
        });
        addXp(day, 3);
        dAt = new Date(dAt.getTime() + (140 + rand() * 90) * 60000);
      }

      // Mood check-in most days.
      if (rand() > 0.35) {
        const at = new Date(day);
        at.setHours(20, 30, 0, 0);
        push({
          type: 'babyMood',
          at: at.toISOString(),
          mood: 2 + Math.round(rand() * 3),
          tags: [BABY_TAGS[Math.floor(rand() * BABY_TAGS.length)]],
        });
        addXp(day, 8);
      }

      // Weekly growth measurement.
      if (d % 7 === 3) {
        const weeks = ageWeeks;
        const at = new Date(day);
        at.setHours(10, 0, 0, 0);
        push({
          type: 'growth',
          at: at.toISOString(),
          weightKg: +(3.3 + weeks * 0.185 + rand() * 0.1).toFixed(2),
          lengthCm: +(50 + weeks * 0.72 + rand() * 0.5).toFixed(1),
          headCm: +(35 + weeks * 0.32 + rand() * 0.3).toFixed(1),
        });
        addXp(day, 15);
      }
    }

    // A few milestones and one appointment.
    push({ type: 'milestone', at: addDays(now, -52).toISOString(), key: 'First social smile', note: 'At the changing table, of course.' });
    push({ type: 'milestone', at: addDays(now, -21).toISOString(), key: 'Rolled front to back' });
    push({ type: 'milestone', at: addDays(now, -6).toISOString(), key: 'Laughed out loud' });
    push({ type: 'appointment', at: addDays(now, 9).toISOString(), title: '4-month check-up + vaccines', kind: 'vaccine' });
  } else {
    const due = addDays(now, 112); // ~24 weeks pregnant
    profile = {
      parentName: 'Alex',
      mode: 'pregnancy',
      dueDate: toDayKey(due),
      babySex: 'surprise',
      prePregnancyWeightKg: 64,
      heightCm: 170,
      onboarded: true,
    };

    for (let d = DAYS - 1; d >= 0; d--) {
      const day = addDays(now, -d);
      const gestWeek = 40 - Math.ceil((due.getTime() - day.getTime()) / (7 * 86400000));

      // Symptom check-in on most days.
      if (rand() > 0.22) {
        const at = new Date(day);
        at.setHours(21, 0, 0, 0);
        const pool = SYMPTOMS.filter(() => rand() > 0.72);
        push({
          type: 'symptom',
          at: at.toISOString(),
          symptoms: pool.length ? pool : [SYMPTOMS[Math.floor(rand() * SYMPTOMS.length)]],
          severity: 1 + Math.round(rand() * 3),
          mood: 2 + Math.round(rand() * 2),
        });
        addXp(day, 10);
      }

      // Weekly weigh-in.
      if (d % 7 === 1) {
        const at = new Date(day);
        at.setHours(7, 30, 0, 0);
        push({
          type: 'weight',
          at: at.toISOString(),
          kg: +(64 + Math.max(0, gestWeek - 8) * 0.42 + (rand() - 0.5) * 0.4).toFixed(1),
        });
        addXp(day, 10);
      }

      // Kick counting once movements are established.
      if (gestWeek >= 20 && rand() > 0.3) {
        const at = new Date(day);
        at.setHours(19, 45, 0, 0);
        push({
          type: 'kicks',
          at: at.toISOString(),
          count: 10,
          durationMin: Math.round(14 + rand() * 40),
        });
        addXp(day, 12);
      }
    }

    push({ type: 'appointment', at: addDays(now, -12).toISOString(), title: '20-week anomaly scan', kind: 'scan', done: true });
    push({ type: 'appointment', at: addDays(now, 16).toISOString(), title: 'Midwife check-up', kind: 'midwife' });
    push({ type: 'appointment', at: addDays(now, 30).toISOString(), title: 'Glucose screening', kind: 'doctor' });
    push({ type: 'contraction', at: addDays(now, -3).toISOString(), durationSec: 42, intervalSec: 1180, note: 'Braxton Hicks after a long walk' });
  }

  entries.sort((a, b) => +new Date(b.at) - +new Date(a.at));

  const totalXp = Object.values(xpByDay).reduce((s, v) => s + v, 0);
  const game: Gamification = {
    xp: totalXp,
    gems: 145,
    streak: 12,
    longestStreak: 21,
    lastActiveDay: toDayKey(now),
    streakFreezes: 1,
    freezeDaysUsed: [],
    unlockedBadges: [],
    xpByDay,
    claimedQuests: {},
  };

  return { profile, entries, game };
}
