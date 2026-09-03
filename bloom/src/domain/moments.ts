import type { DotPose, Entry, Progress, Stage, TrackerKey } from './types';

/**
 * Moments are captured, never awarded. Nothing here can be ground out by
 * logging harder: the app either notices in your own data that something has
 * already happened, or asks a plain question once it becomes plausible. You say
 * when it happened, and it joins the collection.
 *
 * They are grouped into eras, which open one at a time. That is the whole of
 * the pacing — there is no score, no rank, and nothing to fall behind on.
 */
export interface Moment {
  id: string;
  stage: Stage;
  /** The era it belongs to. */
  era: string;
  emoji: string;
  title: string;
  /** Asked on Home once this becomes plausible. */
  question: string;
  /** The line it carries in the collection once captured. */
  done: string;
  /** What is actually happening in there — read at the moment of capture. */
  body: string;
  /** The drier half of the same story: true, and slightly at your expense. */
  wry: string;
  /** Plausible from: weeks of pregnancy, or days after birth. */
  openFrom: number;
  /** The pose this moment moves Dot into, if it moves her at all. */
  dot?: DotPose;
  /** A logged entry that proves it happened, and dates it. */
  signal?: (entries: Entry[]) => Entry | undefined;
  /** True the moment the dates say so — never put as a question. */
  auto?: boolean;
}

/** A chapter of the same few weeks. One is open at a time. */
export interface Era {
  id: string;
  stage: Stage;
  name: string;
  blurb: string;
  /** Weeks of pregnancy, or days after birth, before it can open at all. */
  from: number;
}

/** The earliest entry that satisfies a test — the date the thing first happened. */
const earliest = (entries: Entry[], ok: (e: Entry) => boolean): Entry | undefined => {
  let best: Entry | undefined;
  for (const e of entries) if (ok(e) && (!best || e.at < best.at)) best = e;
  return best;
};

const slept = (mins: number) => (entries: Entry[]) =>
  earliest(entries, (e) => e.tracker === 'sleep' && (e.minutes ?? 0) >= mins);

const first = (tracker: TrackerKey) => (entries: Entry[]) =>
  earliest(entries, (e) => e.tracker === tracker);

export const PREGNANCY_ERAS: Era[] = [
  { id: 'p_secret', stage: 'pregnancy', name: 'The secret', blurb: 'Almost nobody knows, and it is already happening.', from: 0 },
  { id: 'p_real', stage: 'pregnancy', name: 'Becoming real', blurb: 'Pictures, movement, and a date on a letter.', from: 10 },
  { id: 'p_room', stage: 'pregnancy', name: 'Making room', blurb: 'They get big enough to be felt from outside.', from: 24 },
  { id: 'p_soon', stage: 'pregnancy', name: 'Any day now', blurb: 'Everything is packed. Nothing is in your control.', from: 37 },
];

export const BABY_ERAS: Era[] = [
  { id: 'b_fourth', stage: 'baby', name: 'The fourth trimester', blurb: 'Nobody sleeps. Everybody survives.', from: 0 },
  { id: 'b_strong', stage: 'baby', name: 'Getting stronger', blurb: 'First the neck, then the back, then the nights.', from: 60 },
  { id: 'b_world', stage: 'baby', name: 'Tasting the world', blurb: 'Sitting up, biting down, eating things that are not milk.', from: 120 },
  { id: 'b_off', stage: 'baby', name: 'On the move', blurb: 'Floor, furniture, freedom.', from: 200 },
];

export const PREGNANCY_MOMENTS: Moment[] = [
  {
    id: 'p_two_lines', stage: 'pregnancy', era: 'p_secret', emoji: '🧪', openFrom: 0, auto: true,
    title: 'Two lines',
    question: 'The test was positive?',
    done: 'It began with a stick in a bathroom.',
    body: 'Right now they are a cluster of cells about the size of a poppy seed, dividing roughly once a day. Everything that comes after is already written down in there.',
    wry: 'The line is hunting for a hormone your body only makes when there is something in there making it, so it cannot be fooled by wishful thinking. This does not stop anyone from taking four more tests.',
  },
  {
    id: 'p_told', stage: 'pregnancy', era: 'p_secret', emoji: '📣', openFrom: 5,
    title: 'Told the first person',
    question: 'Have you told someone out loud yet?',
    done: 'Saying it out loud made it real.',
    body: 'The heart is a folded tube this week and has just started to twitch. There is barely any blood in it yet — it is beating for practice.',
    wry: 'There is no medically correct week to tell people; the twelve-week convention is about miscarriage statistics rather than manners. Plenty of people tell someone at five weeks, usually by accident, usually to a colleague.',
  },
  {
    id: 'p_heartbeat', stage: 'pregnancy', era: 'p_secret', emoji: '🫀', openFrom: 8,
    title: 'Heard the heartbeat',
    question: 'Have you heard the heartbeat?',
    done: 'Roughly twice as fast as yours, and twice as loud.',
    body: 'Around 170 beats a minute, about double your resting rate. It slows a little every week from here and never gets that fast again.',
    wry: 'It started beating around week five, before there was anything you would recognise as a heart. If nothing is audible at eight weeks it usually means the dates were optimistic, not that anything is wrong.',
  },
  {
    id: 'p_scan', stage: 'pregnancy', era: 'p_real', emoji: '🖥️', openFrom: 10,
    title: 'First scan',
    question: 'Has the dating scan happened?',
    done: 'The first photograph. A grainy bean.',
    body: 'About five centimetres, and already somersaulting where you cannot feel it. The scan measures crown to rump, because the legs are still curled up.',
    wry: 'The measurement they take is more accurate than any date you can give them, which is why your due date may have just moved by a week. Nobody is asking for your opinion on this.',
  },
  {
    id: 'p_flutter', stage: 'pregnancy', era: 'p_real', emoji: '🫧', openFrom: 16,
    title: 'First flutter',
    question: 'Felt something that was definitely not digestion?',
    done: 'Bubbles, popcorn, a fish turning over.',
    body: 'They have been moving for weeks — this is only the first week they are close enough to the wall for you to notice.',
    wry: 'First-time parents tend to notice around eighteen to twenty weeks. Second-timers swear they felt it at fourteen, and they are probably right — they know what they are feeling for.',
  },
  {
    id: 'p_anomaly', stage: 'pregnancy', era: 'p_real', emoji: '🔎', openFrom: 19,
    title: 'The twenty-week scan',
    question: 'Has the anomaly scan happened?',
    done: 'Every organ counted and in the right place.',
    body: 'Four chambers of the heart, every bone in the spine, both kidneys, the stomach filling and emptying. Halfway — and the most thorough look anyone will ever get at them.',
    wry: 'The sonographer goes quiet because they are working through a checklist of about twenty structures, and cannot count and chat at the same time. Silence in that room is concentration, not bad news.',
  },
  {
    id: 'p_outside', stage: 'pregnancy', era: 'p_room', emoji: '👋', openFrom: 24,
    title: 'Kicks from outside',
    question: 'Can someone else feel the kicks with a hand?',
    done: 'Now other people can feel it too.',
    body: 'Strong enough to be felt through skin. They can hear you as well by now — voices arrive muffled, the way speech comes through a wall.',
    wry: 'They know your voice at birth and prefer it to anyone else\'s, having heard it through a wall for months. They have also been listening to your digestion that whole time, which nobody warns them about.',
  },
  {
    id: 'p_hiccups', stage: 'pregnancy', era: 'p_room', emoji: '〰️', openFrom: 27,
    title: 'Hiccups',
    question: 'Noticed the rhythmic twitching yet?',
    done: 'A metronome under your ribs.',
    body: 'Every few seconds, completely regular, and entirely normal: the diaphragm rehearsing the breathing it will need on day one.',
    wry: 'Nobody is quite sure why they hiccup this much; the best guess is the brainstem test-firing the breathing circuit. They can keep it up for twenty minutes and there is nothing whatsoever you can do about it.',
  },
  {
    id: 'p_bag', stage: 'pregnancy', era: 'p_room', emoji: '🎒', openFrom: 34,
    title: 'The bag is packed',
    question: 'Is the bag by the door?',
    done: 'Packed, and quietly repacked twice since.',
    body: 'The lungs finish last. They are making surfactant now — the stuff that stops the air sacs collapsing between breaths.',
    wry: 'Most bags are packed around thirty-four weeks and most are packed wrong. The things people actually use are snacks, a phone cable longer than the bed, and going-home clothes two sizes bigger than seems reasonable.',
  },
  {
    id: 'p_term', stage: 'pregnancy', era: 'p_soon', emoji: '🥚', openFrom: 37, auto: true,
    title: 'Full term',
    question: 'Thirty-seven weeks.',
    done: 'The egg is full. From here, any day is on time.',
    body: 'Everything needed to live out here is finished. What is left is weight, and waiting.',
    wry: 'Only about one baby in twenty-five turns up on the due date itself. It is a median wearing the costume of an appointment.',
  },
];

export const BABY_MOMENTS: Moment[] = [
  {
    id: 'b_home', stage: 'baby', era: 'b_fourth', emoji: '🏠', openFrom: 0, auto: true, dot: 'sleep',
    title: 'Home',
    question: 'They are here.',
    done: 'Player two has entered.',
    body: 'They can focus at about thirty centimetres — roughly the distance from your arms to your face, which is not a coincidence.',
    wry: 'Their eyesight is around 20/400 — legally blind in most countries — and stays blurry for months. You are a warm shape that smells correct, and for now that is the entire relationship.',
  },
  {
    id: 'b_birthweight', stage: 'baby', era: 'b_fourth', emoji: '⚖️', openFrom: 7,
    title: 'Back to birth weight',
    question: 'Back to birth weight at the last weigh-in?',
    done: 'The dip is normal. Climbing out of it is the milestone.',
    body: 'Nearly every baby loses five to ten per cent in the first days and is back by about two weeks. The dip is expected; the climb is the thing worth marking.',
    wry: 'Some of the loss is water and a surprising amount is meconium, which is heavier than it has any right to be. Midwives are watching the trend, not the number, and are unmoved by your bathroom scales.',
  },
  {
    id: 'b_smile', stage: 'baby', era: 'b_fourth', emoji: '😊', openFrom: 28,
    title: 'The first real smile',
    question: 'Has a smile happened that was definitely not wind?',
    done: 'The first one aimed at you specifically.',
    body: 'The first smile aimed at a face rather than at nothing. It is the first thing they ever do purely to get something back from you.',
    wry: 'This is the first time they work out that pulling a face makes a giant appear — the opening move in every negotiation you will have for the next eighteen years. Anything before six weeks is usually wind; the tell is the eyes, which crease on a real one.',
  },
  {
    id: 'b_stretch', stage: 'baby', era: 'b_fourth', emoji: '🌙', openFrom: 35, signal: slept(300),
    title: 'Five hours in a row',
    question: 'Did they give you a five-hour stretch?',
    done: 'The first night that felt survivable.',
    body: 'Sleep is starting to gather into longer blocks as their body works out that dark means night. The rhythm is being built, slowly, mostly at your expense.',
    wry: 'Baby sleep runs in fifty-minute cycles, so a five-hour block means they surfaced four or five times and put themselves back down again. That is a skill, and it is theirs, not yours.',
  },
  {
    id: 'b_head', stage: 'baby', era: 'b_strong', emoji: '🐢', openFrom: 60, dot: 'tummy',
    title: 'Head up, holding',
    question: 'Holding their head steady on their own?',
    done: 'Tummy time finally paid off.',
    body: 'The neck can now hold up a head that is a quarter of their body weight. Rolling, sitting and crawling are all built on top of this one.',
    wry: 'A newborn head is about a quarter of their body weight — the adult equivalent of balancing a bowling ball on your neck all day. That is why the wobble looks alarming and why it takes months to sort out.',
  },
  {
    id: 'b_roll', stage: 'baby', era: 'b_strong', emoji: '🔄', openFrom: 90,
    title: 'Rolled over',
    question: 'Have they rolled over?',
    done: 'Never leave them on a sofa again.',
    body: 'The first time they move themselves from one place to another under their own power. The world just got less safe.',
    wry: 'Front to back usually comes first, because gravity is helping. They will demonstrate it exactly once, to nobody, and then refuse to do it again for a fortnight.',
  },
  {
    id: 'b_night', stage: 'baby', era: 'b_strong', emoji: '🌌', openFrom: 100, signal: slept(360),
    title: 'A six-hour night',
    question: 'Six hours in one go?',
    done: 'You woke up before they did, and panicked.',
    body: 'Most growth hormone is released in deep sleep, so they are growing hardest during exactly the hours you finally get back.',
    wry: '\'Sleeping through the night\' is defined in the research as six hours, not eight, and not necessarily the six you would have chosen. Roughly half of babies manage it by six months; the other half are also entirely normal.',
  },
  {
    id: 'b_food', stage: 'baby', era: 'b_world', emoji: '🥄', openFrom: 120, signal: first('solids'),
    title: 'First proper meal',
    question: 'Have they eaten actual food?',
    done: 'Mostly on the face, but it counts.',
    body: 'The first weeks of food are the tongue learning not to push everything straight back out. Most of it ends up on the face, and that still counts.',
    wry: 'For the first months food is a hobby and milk is still doing the actual work. The reflex that shoves the spoon straight back out is a safety feature, not a review of your cooking.',
  },
  {
    id: 'b_tooth', stage: 'baby', era: 'b_world', emoji: '🦷', openFrom: 120, signal: first('teeth'),
    title: 'First tooth',
    question: 'Is there a tooth through?',
    done: 'Sharp. Everyone finds out eventually.',
    body: 'Usually the bottom two, and they have been sitting under the gum since before birth. Sharp — everyone finds out eventually.',
    wry: 'Teeth arrive in much the same order for everyone and on wildly different schedules — a few babies are born with one. Teething has been blamed for fevers for several centuries and causes almost none of them.',
  },
  {
    id: 'b_sit', stage: 'baby', era: 'b_world', emoji: '🪑', openFrom: 150, dot: 'sit',
    title: 'Sitting up',
    question: 'Sitting without being propped?',
    done: 'A whole new view of the room.',
    body: 'Hands free for the first time. A new view of the room, and both hands available to take it apart.',
    wry: 'The real upgrade is the hands: eyes and both hands on the same object for the first time. It is also the beginning of the era in which everything goes into the mouth.',
  },
  {
    id: 'b_move', stage: 'baby', era: 'b_off', emoji: '🐛', openFrom: 200,
    title: 'On the move',
    question: 'Are they getting across the floor somehow?',
    done: 'Crawling, shuffling or rolling with intent — all count.',
    body: 'Babies invent their own method, and a good half never crawl on all fours at all. However they cross the room, it counts.',
    wry: 'About half of babies never crawl on all fours. There is bum-shuffling, commando dragging and rolling with intent, none of it predicts anything later, and all of it is faster than you expect.',
  },
  {
    id: 'b_stand', stage: 'baby', era: 'b_off', emoji: '🧗', openFrom: 240, dot: 'stand',
    title: 'Pulled to stand',
    question: 'Have they pulled themselves up on something?',
    done: 'Lower the cot mattress. Today.',
    body: 'The legs can take their whole weight now. Lower the cot mattress today, not at the weekend.',
    wry: 'Pulling up arrives weeks before the faintest idea of how to get back down, so there is a period of standing and howling. The furniture has stopped being scenery and become a route.',
  },
  {
    id: 'b_word', stage: 'baby', era: 'b_off', emoji: '🗣️', openFrom: 270, signal: first('words'),
    title: 'A word they mean',
    question: 'A word used on purpose, for the right thing?',
    done: 'It probably was not your name.',
    body: 'A sound used deliberately, for the right thing, more than once. It probably was not your name.',
    wry: 'First words are usually about people or food, and \'dada\' tends to come first because the d sound is easier to make than the m. It means nothing. Say so early, and often.',
  },
  {
    id: 'b_steps', stage: 'baby', era: 'b_off', emoji: '👣', openFrom: 300, dot: 'walk',
    title: 'First steps',
    question: 'Have they walked, unaided, more than once?',
    done: 'And with that, the floor stops being safe.',
    body: 'Balance is the last piece to arrive, not strength — they have had the legs for months. And with that, the floor stops being safe.',
    wry: 'The legs have been strong enough for months; what arrives last is balance and the nerve to let go of the sofa. Early walking predicts nothing at all except an earlier need for stair gates.',
  },
];

const ALL = [...PREGNANCY_MOMENTS, ...BABY_MOMENTS];

export const eras = (stage: Stage) => (stage === 'pregnancy' ? PREGNANCY_ERAS : BABY_ERAS);
export const momentsOf = (eraId: string) => ALL.filter((m) => m.era === eraId);
export const allMoments = (stage: Stage) => (stage === 'pregnancy' ? PREGNANCY_MOMENTS : BABY_MOMENTS);
export const momentById = (id: string) => ALL.find((m) => m.id === id);
export const isCaptured = (progress: Progress, id: string) => progress.moments[id] !== undefined;
export const capturedCount = (stage: Stage, progress: Progress) =>
  allMoments(stage).filter((m) => isCaptured(progress, m.id)).length;

/**
 * How long a moment stays the frontier before its era gives up waiting. Without
 * this an era could be held open forever by one thing that never happened, and
 * the next chapter would never arrive.
 */
const LAPSE: Record<Stage, number> = { pregnancy: 6, baby: 45 };

export interface EraState {
  era: Era;
  moments: Moment[];
  /** Open eras can be captured from; sealed ones show nothing but their name. */
  open: boolean;
  /** Every moment captured or long past — what lets the next era open. */
  cleared: boolean;
  captured: number;
  /** Why it is still sealed: too early, or the chapter before is unfinished. */
  waitingOn: 'age' | 'previous' | null;
  /** Moments still holding this era open. */
  outstanding: Moment[];
}

/** Every era of the stage, in order, with what the parent can do in each. */
export function eraStates(stage: Stage, progress: Progress, position: number): EraState[] {
  let runningCleared = true;
  return eras(stage).map((era) => {
    const moments = momentsOf(era.id);
    const outstanding = moments.filter(
      (m) => !isCaptured(progress, m.id) && position < m.openFrom + LAPSE[stage],
    );
    const cleared = outstanding.length === 0;
    const oldEnough = position >= era.from;
    const captured = moments.filter((m) => isCaptured(progress, m.id)).length;
    // A chapter holding something already captured is never hidden: an
    // auto-captured moment can land inside one the seal has not reached yet,
    // and history the parent can no longer see is worse than an early reveal.
    const open = oldEnough && (runningCleared || captured > 0);
    const state: EraState = {
      era,
      moments,
      open,
      cleared,
      captured,
      waitingOn: open ? null : !oldEnough ? 'age' : 'previous',
      outstanding,
    };
    runningCleared = runningCleared && cleared;
    return state;
  });
}

export interface Road {
  era: Era;
  /** 0–1 across the gap between the era before it and this one. */
  progress: number;
  /** Weeks (pregnancy) or days (baby) until they are old enough. */
  away: number;
  /** What still has to be captured before it can open. */
  blocking: Moment[];
}

/** The next sealed era, and how close the baby is to it. Null once all are open. */
export function road(stage: Stage, progress: Progress, position: number): Road | null {
  const states = eraStates(stage, progress, position);
  const index = states.findIndex((s) => !s.open);
  if (index < 0) return null;
  const target = states[index];
  const from = index > 0 ? states[index - 1].era.from : 0;
  const span = Math.max(1, target.era.from - from);
  return {
    era: target.era,
    progress: Math.max(0, Math.min(1, (position - from) / span)),
    away: Math.max(0, target.era.from - position),
    blocking: index > 0 ? states[index - 1].outstanding : [],
  };
}

const POSES: DotPose[] = ['sleep', 'tummy', 'sit', 'stand', 'walk'];

/**
 * Dot follows the baby's age on her own, and jumps ahead the moment a captured
 * moment says the baby is further along than the calendar thinks. She can run
 * early; she can never fall behind because you forgot to tell her something.
 */
export function dotPose(stage: Stage, progress: Progress, week: number, days: number): DotPose {
  if (stage === 'pregnancy') {
    if (week >= 37) return 'egg3';
    if (week >= 28) return 'egg2';
    if (week >= 14) return 'egg1';
    return 'egg0';
  }
  const byAge: DotPose =
    days >= 300 ? 'walk' : days >= 240 ? 'stand' : days >= 150 ? 'sit' : days >= 60 ? 'tummy' : 'sleep';
  let rank = POSES.indexOf(byAge);
  for (const m of BABY_MOMENTS) {
    if (m.dot && isCaptured(progress, m.id)) rank = Math.max(rank, POSES.indexOf(m.dot));
  }
  return POSES[rank];
}

export const DOT_POSE_LABEL: Record<DotPose, string> = {
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

export interface Ask {
  moment: Moment;
  /** The entry that gave it away, when the app spotted it rather than asked. */
  noticed?: Entry;
}

/**
 * The single thing Home puts to the parent, if there is one. Anything the data
 * already proves comes first — that is a celebration waiting to happen, not a
 * question — and otherwise the oldest moment that is plausibly due.
 */
export function pendingAsk(
  stage: Stage,
  progress: Progress,
  entries: Entry[],
  position: number,
  today: string,
): Ask | null {
  const live = eraStates(stage, progress, position)
    .filter((s) => s.open)
    .flatMap((s) => s.moments)
    .filter((m) => !isCaptured(progress, m.id) && progress.snoozed[m.id] !== today);

  for (const moment of live) {
    const noticed = moment.signal?.(entries);
    if (noticed) return { moment, noticed };
  }
  const due = live.find((m) => position >= m.openFrom && !m.auto);
  return due ? { moment: due } : null;
}

/** "around week 20", "around 4 months" — when a moment usually turns up. */
export function usually(stage: Stage, openFrom: number): string {
  if (stage === 'pregnancy') return openFrom <= 0 ? 'from the start' : `around week ${openFrom}`;
  if (openFrom <= 0) return 'day one';
  if (openFrom < 28) return `around ${openFrom} days`;
  if (openFrom < 90) return `around ${Math.round(openFrom / 7)} weeks`;
  return `around ${Math.round(openFrom / 30.4)} months`;
}
