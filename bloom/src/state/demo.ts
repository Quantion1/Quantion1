import { careSystem } from '@/domain/care';
import { BABY_LEVELS, PREGNANCY_LEVELS } from '@/domain/levels';
import { starterTiles } from '@/domain/trackers';
import type { Entry, Memory, PlanItem, Profile, Progress, Stage, Tile } from '@/domain/types';
import { addDays, toDayKey } from '@/lib/date';

/** Deterministic PRNG so the demo set is identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function buildDemo(stage: Stage): {
  profile: Profile;
  entries: Entry[];
  progress: Progress;
  tiles: Tile[];
  plans: PlanItem[];
  memories: Memory[];
} {
  const rand = rng(stage === 'baby' ? 424242 : 313131);
  const now = new Date();
  const entries: Entry[] = [];
  let n = 0;
  const push = (e: Omit<Entry, 'id' | 'createdAt'>) => {
    if (+new Date(e.at) > now.getTime()) return;
    entries.push({ ...e, id: `demo-${n++}`, createdAt: e.at });
  };

  const DAYS = 60;
  const daysOpened: string[] = [];
  for (let d = DAYS - 1; d >= 0; d--) daysOpened.push(toDayKey(addDays(now, -d)));

  const plans: PlanItem[] = [];
  const memories: Memory[] = [];
  let profile: Profile;
  let progress: Progress;

  if (stage === 'baby') {
    const birth = addDays(now, -104);
    profile = {
      parentName: 'Robin',
      babyName: 'Ada',
      stage: 'baby',
      birthDate: toDayKey(birth),
      babySex: 'girl',
      country: 'NL',
      onboarded: true,
    };

    for (let d = DAYS - 1; d >= 0; d--) {
      const day = addDays(now, -d);
      const weeks = Math.max(0, Math.round((day.getTime() - birth.getTime()) / (7 * 86400000)));

      // Night sleep, consolidating with age.
      let cursor = new Date(day);
      cursor.setHours(19, 15 + Math.floor(rand() * 45), 0, 0);
      const blocks = weeks < 8 ? 3 : weeks < 13 ? 2 : rand() > 0.4 ? 2 : 1;
      for (let b = 0; b < blocks; b++) {
        const minutes = Math.round(b === 0 ? 195 + weeks * 15 + rand() * 55 : 105 + rand() * 110);
        push({ tracker: 'sleep', at: cursor.toISOString(), minutes });
        cursor = new Date(cursor.getTime() + (minutes + 18 + rand() * 25) * 60000);
        if (b < blocks - 1) {
          push({ tracker: 'breast', at: cursor.toISOString(), side: rand() > 0.5 ? 'left' : 'right', minutes: Math.round(9 + rand() * 11) });
        }
      }

      // Naps.
      let nap = new Date(day);
      nap.setHours(8, 40, 0, 0);
      const naps = weeks < 16 ? 4 : 3;
      for (let i = 0; i < naps; i++) {
        const minutes = Math.round(55 + rand() * 75);
        push({ tracker: 'sleep', at: nap.toISOString(), minutes });
        nap = new Date(nap.getTime() + (minutes + 95 + rand() * 55) * 60000);
      }

      // Daytime feeds.
      let feed = new Date(day);
      feed.setHours(7, 5, 0, 0);
      const feeds = Math.max(4, 8 - Math.floor(weeks / 7) + (rand() > 0.7 ? 1 : 0));
      for (let i = 0; i < feeds; i++) {
        if (rand() > 0.63) push({ tracker: 'bottle', at: feed.toISOString(), amount: Math.round(90 + rand() * 60), kind: rand() > 0.5 ? 'Breastmilk' : 'Formula' });
        else push({ tracker: 'breast', at: feed.toISOString(), side: rand() > 0.5 ? 'left' : 'right', minutes: Math.round(10 + rand() * 13) });
        feed = new Date(feed.getTime() + (145 + rand() * 70) * 60000);
      }

      // Nappies.
      let dia = new Date(day);
      dia.setHours(6, 40, 0, 0);
      for (let i = 0; i < 5 + Math.floor(rand() * 3); i++) {
        const r = rand();
        push({ tracker: 'diaper', at: dia.toISOString(), kind: r > 0.72 ? 'Dirty' : r > 0.6 ? 'Both' : 'Wet' });
        dia = new Date(dia.getTime() + (135 + rand() * 85) * 60000);
      }

      // Tummy time, vitamins, and the parent's own logs.
      if (rand() > 0.4) {
        const t = new Date(day);
        t.setHours(11, 20, 0, 0);
        push({ tracker: 'tummy', at: t.toISOString(), count: 1 });
      }
      const v = new Date(day);
      v.setHours(9, 0, 0, 0);
      if (rand() > 0.15) push({ tracker: 'vitd', at: v.toISOString(), count: 1 });
      const ms = new Date(day);
      ms.setHours(23, 30, 0, 0);
      if (rand() > 0.3) push({ tracker: 'msleep', at: ms.toISOString(), minutes: Math.round(230 + rand() * 190), face: 1 + Math.round(rand() * 3) });
      for (let i = 0; i < 2 + Math.floor(rand() * 3); i++) {
        const w = new Date(day);
        w.setHours(8 + i * 4, 15, 0, 0);
        push({ tracker: 'water', at: w.toISOString(), amount: 250, kind: 'Mug' });
      }

      if (d % 7 === 3) {
        const g = new Date(day);
        g.setHours(10, 0, 0, 0);
        push({ tracker: 'weight', at: g.toISOString(), amount: +(3.4 + weeks * 0.18 + rand() * 0.08).toFixed(2) });
      }
    }

    push({ tracker: 'note', at: addDays(now, -12).toISOString(), text: 'Laughed at the extractor fan. Not at me. At the fan.' });
    push({ tracker: 'note', at: addDays(now, -3).toISOString(), text: 'Slept through the doorbell, the dog and a delivery. Then woke because I sat down.' });

    memories.push(
      { id: 'm1', glyph: '🍼', caption: 'First bottle, taken without complaint', at: addDays(now, -40).toISOString(), tag: 'family', firstKey: 'first_bottle' },
      { id: 'm2', glyph: '😊', caption: 'The smile, finally caught', at: addDays(now, -33).toISOString(), tag: 'family', firstKey: 'first_smile' },
      { id: 'm3', glyph: '🛁', caption: 'First proper bath', at: addDays(now, -18).toISOString(), tag: 'family' },
    );

    plans.push(
      { id: 'p1', title: 'Consultatiebureau — 4 month check', date: toDayKey(addDays(now, 11)), time: '10:20', kind: 'appointment' },
      { id: 'p2', title: 'Second jab round', date: toDayKey(addDays(now, 11)), time: '10:40', kind: 'care', careKey: 'first_vax' },
      { id: 'p3', title: 'Oma visiting', date: toDayKey(addDays(now, 4)), kind: 'visitor' },
    );

    progress = {
      pregnancyLevel: PREGNANCY_LEVELS.length,
      babyLevel: 5,
      claimed: [...PREGNANCY_LEVELS.map((l) => l.id), ...BABY_LEVELS.slice(0, 5).map((l) => l.id)],
      snoozed: {},
      badges: [],
      daysOpened,
      cards: Array.from({ length: 37 }, (_, i) => i + 4),
      activePack: 'garden',
      marks: { first_smile: toDayKey(addDays(now, -33)), first_bottle: toDayKey(addDays(now, -40)) },
      hatched: true,
    };
  } else {
    const due = addDays(now, 112);
    profile = {
      parentName: 'Robin',
      babyName: '',
      stage: 'pregnancy',
      dueDate: toDayKey(due),
      babySex: 'unknown',
      prePregnancyWeightKg: 64,
      country: 'NL',
      onboarded: true,
    };

    for (let d = DAYS - 1; d >= 0; d--) {
      const day = addDays(now, -d);
      const week = 40 - Math.ceil((due.getTime() - day.getTime()) / (7 * 86400000));

      if (week >= 24 && rand() > 0.28) {
        const t = new Date(day);
        t.setHours(19, 40, 0, 0);
        push({ tracker: 'kicks', at: t.toISOString(), count: 10, minutes: Math.round(13 + rand() * 38) });
      }
      if (d % 7 === 1) {
        const w = new Date(day);
        w.setHours(7, 30, 0, 0);
        push({ tracker: 'weight', at: w.toISOString(), amount: +(64 + Math.max(0, week - 8) * 0.42 + (rand() - 0.5) * 0.35).toFixed(1) });
      }
      const ms = new Date(day);
      ms.setHours(23, 15, 0, 0);
      if (rand() > 0.25) push({ tracker: 'msleep', at: ms.toISOString(), minutes: Math.round(330 + rand() * 150), face: 1 + Math.round(rand() * 3) });
      for (let i = 0; i < 3 + Math.floor(rand() * 3); i++) {
        const w = new Date(day);
        w.setHours(8 + i * 3, 30, 0, 0);
        push({ tracker: 'water', at: w.toISOString(), amount: 250, kind: 'Mug' });
      }
      if (rand() > 0.6) {
        const s = new Date(day);
        s.setHours(8, 5, 0, 0);
        push({ tracker: 'supp', at: s.toISOString(), checks: ['Folic acid', 'Vitamin D'] });
      }
    }

    push({ tracker: 'mwq', at: addDays(now, -5).toISOString(), text: 'Is this much heartburn normal, or should I be doing something about it?' });
    push({ tracker: 'mwq', at: addDays(now, -2).toISOString(), text: 'What actually happens if I go past 41 weeks?' });
    push({ tracker: 'contr', at: addDays(now, -4).toISOString(), minutes: 0.7, note: 'Braxton Hicks after a long walk' });

    memories.push(
      { id: 'm1', glyph: '🖥️', caption: 'The twenty-week scan', at: addDays(now, -14).toISOString(), tag: 'scan' },
      { id: 'm2', glyph: '🤰', caption: 'Week 22 — same wall, same jumper', at: addDays(now, -8).toISOString(), tag: 'bump' },
    );

    const care = careSystem('NL');
    plans.push(
      { id: 'p1', title: care.items[4].label, date: toDayKey(addDays(now, -14)), kind: 'care', careKey: 'anomaly', done: true },
      { id: 'p2', title: 'Midwife — 24 week check', date: toDayKey(addDays(now, 9)), time: '14:30', kind: 'appointment' },
      { id: 'p3', title: 'Whooping cough jab', date: toDayKey(addDays(now, 20)), kind: 'care', careKey: 'pertussis' },
    );

    progress = {
      pregnancyLevel: 6,
      babyLevel: 0,
      claimed: PREGNANCY_LEVELS.slice(0, 6).map((l) => l.id),
      snoozed: {},
      badges: [],
      daysOpened,
      cards: Array.from({ length: 20 }, (_, i) => i + 4),
      activePack: 'garden',
      marks: {},
      hatched: false,
    };
  }

  entries.sort((a, b) => +new Date(b.at) - +new Date(a.at));

  const tiles: Tile[] = [
    { key: 'today', span: 2 },
    ...starterTiles(stage).map((key) => ({ key, span: 1 as const })),
  ];

  return { profile, entries, progress, tiles, plans, memories };
}
