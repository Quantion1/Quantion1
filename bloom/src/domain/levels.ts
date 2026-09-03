import type { Entry, Progress, Stage } from './types';

/**
 * Levels are claimed, never earned by activity. The app watches for the moment
 * something plausibly happened, asks a plain question, and only advances when a
 * human says yes. Nothing here can be ground out by logging harder.
 */
export interface Level {
  id: string;
  stage: Stage;
  /** 1-based position in its ladder. */
  order: number;
  emoji: string;
  title: string;
  /** The question put to the parent. */
  question: string;
  /** Shown once claimed. */
  done: string;
  /** Earliest it makes sense to ask — weeks in pregnancy, days after birth. */
  openFrom: number;
  /** Optional data signal that brings the question forward. */
  signal?: (entries: Entry[]) => boolean;
  /** Claimed automatically — no question asked. */
  auto?: boolean;
}

const sleepAtLeast = (mins: number) => (entries: Entry[]) =>
  entries.some((e) => e.tracker === 'sleep' && (e.minutes ?? 0) >= mins);

const has = (tracker: string) => (entries: Entry[]) => entries.some((e) => e.tracker === tracker);

export const PREGNANCY_LEVELS: Level[] = [
  { id: 'p_two_lines', stage: 'pregnancy', order: 1, emoji: '🧪', title: 'Two lines', question: 'The test was positive?', done: 'It began with a stick in a bathroom.', openFrom: 0, auto: true },
  { id: 'p_told', stage: 'pregnancy', order: 2, emoji: '📣', title: 'Told the first person', question: 'Have you told someone out loud yet?', done: 'Saying it out loud made it real.', openFrom: 5 },
  { id: 'p_heartbeat', stage: 'pregnancy', order: 3, emoji: '🫀', title: 'Heard the heartbeat', question: 'Have you heard the heartbeat?', done: 'Roughly twice as fast as yours, and twice as loud.', openFrom: 8 },
  { id: 'p_scan', stage: 'pregnancy', order: 4, emoji: '🖥️', title: 'First scan', question: 'Has the dating scan happened?', done: 'The first photograph. A grainy bean.', openFrom: 10 },
  { id: 'p_flutter', stage: 'pregnancy', order: 5, emoji: '🫧', title: 'First flutter', question: 'Felt something that was definitely not digestion?', done: 'Bubbles, popcorn, a fish turning over.', openFrom: 16 },
  { id: 'p_anomaly', stage: 'pregnancy', order: 6, emoji: '🔎', title: 'The twenty-week scan', question: 'Has the anomaly scan happened?', done: 'Every organ counted and in the right place.', openFrom: 19 },
  { id: 'p_outside', stage: 'pregnancy', order: 7, emoji: '👋', title: 'Kicks from outside', question: 'Can someone else feel the kicks with a hand?', done: 'Now other people can feel it too.', openFrom: 24, signal: has('kicks') },
  { id: 'p_hiccups', stage: 'pregnancy', order: 8, emoji: '〰️', title: 'Hiccups', question: 'Noticed the rhythmic twitching yet?', done: 'A metronome under your ribs.', openFrom: 27 },
  { id: 'p_bag', stage: 'pregnancy', order: 9, emoji: '🎒', title: 'The bag is packed', question: 'Is the bag by the door?', done: 'Packed, and quietly repacked twice since.', openFrom: 34 },
  { id: 'p_term', stage: 'pregnancy', order: 10, emoji: '🥚', title: 'Full term', question: 'Thirty-seven weeks.', done: 'The egg is full. From here, any day is on time.', openFrom: 37, auto: true },
];

export const BABY_LEVELS: Level[] = [
  { id: 'b_home', stage: 'baby', order: 1, emoji: '🏠', title: 'Home', question: 'They are here.', done: 'Player two has entered.', openFrom: 0, auto: true },
  { id: 'b_birthweight', stage: 'baby', order: 2, emoji: '⚖️', title: 'Back to birth weight', question: 'Back to birth weight at the last weigh-in?', done: 'The dip is normal. Climbing out of it is the milestone.', openFrom: 7, signal: has('weight') },
  { id: 'b_smile', stage: 'baby', order: 3, emoji: '😊', title: 'The first real smile', question: 'Has a smile happened that was definitely not wind?', done: 'The first one aimed at you specifically.', openFrom: 28 },
  { id: 'b_stretch', stage: 'baby', order: 4, emoji: '🌙', title: 'Five hours in a row', question: 'Did they give you a five-hour stretch?', done: 'The first night that felt survivable.', openFrom: 35, signal: sleepAtLeast(300) },
  { id: 'b_head', stage: 'baby', order: 5, emoji: '🐢', title: 'Head up, holding', question: 'Holding their head steady on their own?', done: 'Tummy time finally paid off.', openFrom: 60, signal: has('tummy') },
  { id: 'b_roll', stage: 'baby', order: 6, emoji: '🔄', title: 'Rolled over', question: 'Have they rolled over?', done: 'Never leave them on a sofa again.', openFrom: 90 },
  { id: 'b_night', stage: 'baby', order: 7, emoji: '🌌', title: 'A six-hour night', question: 'Six hours in one go?', done: 'You woke up before they did, and panicked.', openFrom: 100, signal: sleepAtLeast(360) },
  { id: 'b_sit', stage: 'baby', order: 8, emoji: '🪑', title: 'Sitting up', question: 'Sitting without being propped?', done: 'A whole new view of the room.', openFrom: 150 },
  { id: 'b_food', stage: 'baby', order: 9, emoji: '🥄', title: 'First proper meal', question: 'Have they eaten actual food?', done: 'Mostly on the face, but it counts.', openFrom: 120, signal: has('solids') },
  { id: 'b_tooth', stage: 'baby', order: 10, emoji: '🦷', title: 'First tooth', question: 'Is there a tooth through?', done: 'Sharp. Everyone finds out eventually.', openFrom: 120, signal: has('teeth') },
  { id: 'b_move', stage: 'baby', order: 11, emoji: '🐛', title: 'On the move', question: 'Are they getting across the floor somehow?', done: 'Crawling, shuffling or rolling with intent — all count.', openFrom: 200 },
  { id: 'b_stand', stage: 'baby', order: 12, emoji: '🧗', title: 'Pulled to stand', question: 'Have they pulled themselves up on something?', done: 'Lower the cot mattress. Today.', openFrom: 240 },
  { id: 'b_word', stage: 'baby', order: 13, emoji: '🗣️', title: 'A word they mean', question: 'A word used on purpose, for the right thing?', done: 'It probably was not your name.', openFrom: 270, signal: has('words') },
  { id: 'b_steps', stage: 'baby', order: 14, emoji: '👣', title: 'First steps', question: 'Have they walked, unaided, more than once?', done: 'And with that, the floor stops being safe.', openFrom: 300 },
];

export const ladder = (stage: Stage) => (stage === 'pregnancy' ? PREGNANCY_LEVELS : BABY_LEVELS);

export const levelById = (id: string): Level | undefined =>
  [...PREGNANCY_LEVELS, ...BABY_LEVELS].find((l) => l.id === id);

/**
 * The next unclaimed level, and whether it is ready to be offered.
 * Only one question is ever live at a time — the ladder is walked in order.
 */
export function nextLevel(
  stage: Stage,
  progress: Progress,
  entries: Entry[],
  position: number,
  today: string,
): { level: Level; ready: boolean } | null {
  const list = ladder(stage);
  for (const level of list) {
    if (progress.claimed.includes(level.id)) continue;
    const snoozedOn = progress.snoozed[level.id];
    // "Not yet" hides the question for the rest of the day only.
    if (snoozedOn === today) return null;
    const open = position >= level.openFrom;
    const signalled = level.signal?.(entries) ?? false;
    return { level, ready: open || signalled };
  }
  return null;
}

export const claimedCount = (stage: Stage, progress: Progress) =>
  ladder(stage).filter((l) => progress.claimed.includes(l.id)).length;

/** Dot's growth stage. Pregnancy is an egg that cracks once per trimester. */
export function dotStage(stage: Stage, level: number, week: number): string {
  if (stage === 'pregnancy') {
    if (week >= 37) return 'egg3';
    if (week >= 28) return 'egg2';
    if (week >= 14) return 'egg1';
    return 'egg0';
  }
  if (level >= 13) return 'walk';
  if (level >= 10) return 'stand';
  if (level >= 7) return 'sit';
  if (level >= 4) return 'tummy';
  return 'sleep';
}

export const DOT_STAGE_LABEL: Record<string, string> = {
  egg0: 'An egg, doing nothing visible',
  egg1: 'First crack',
  egg2: 'Second crack',
  egg3: 'Ready',
  sleep: 'Asleep in the blanket',
  tummy: 'Up on her elbows',
  sit: 'Sitting up and waving',
  stand: 'Standing, wobbling',
  walk: 'Off across the room',
};
