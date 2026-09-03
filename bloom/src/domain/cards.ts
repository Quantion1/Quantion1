import type { Entry } from './types';

/**
 * The weekly collectible. One card a week from four to forty — the free pack
 * compares the baby to fruit and veg, which is what every midwife does anyway.
 * Alternative packs are a premium unlock and swap only the comparison, never
 * the measurements.
 */
export interface Card {
  week: number;
  /** What it is compared to. */
  size: string;
  emoji: string;
  lengthCm: number;
  weightG: number;
  /** Optional real-world name for licensed-ish objects. */
  ref?: string;
}

export interface Pack {
  id: string;
  name: string;
  blurb: string;
  premium: boolean;
  cards: Card[];
}

const FRUIT: Card[] = [
  { week: 4, size: 'poppy seed', emoji: '🌱', lengthCm: 0.1, weightG: 0.1 },
  { week: 5, size: 'sesame seed', emoji: '🌾', lengthCm: 0.2, weightG: 0.1 },
  { week: 6, size: 'lentil', emoji: '🫛', lengthCm: 0.5, weightG: 0.2 },
  { week: 7, size: 'blueberry', emoji: '🫐', lengthCm: 1.3, weightG: 0.5 },
  { week: 8, size: 'raspberry', emoji: '🍇', lengthCm: 1.6, weightG: 1 },
  { week: 9, size: 'olive', emoji: '🫒', lengthCm: 2.3, weightG: 2 },
  { week: 10, size: 'kumquat', emoji: '🍊', lengthCm: 3.1, weightG: 4 },
  { week: 11, size: 'fig', emoji: '🟣', lengthCm: 4.1, weightG: 7 },
  { week: 12, size: 'lime', emoji: '🟢', lengthCm: 5.4, weightG: 14 },
  { week: 13, size: 'pea pod', emoji: '🫛', lengthCm: 7.4, weightG: 23 },
  { week: 14, size: 'lemon', emoji: '🍋', lengthCm: 8.7, weightG: 43 },
  { week: 15, size: 'apple', emoji: '🍎', lengthCm: 10.1, weightG: 70 },
  { week: 16, size: 'avocado', emoji: '🥑', lengthCm: 11.6, weightG: 100 },
  { week: 17, size: 'pear', emoji: '🍐', lengthCm: 13.0, weightG: 140 },
  { week: 18, size: 'bell pepper', emoji: '🫑', lengthCm: 14.2, weightG: 190 },
  { week: 19, size: 'mango', emoji: '🥭', lengthCm: 15.3, weightG: 240 },
  { week: 20, size: 'banana', emoji: '🍌', lengthCm: 25.6, weightG: 300 },
  { week: 21, size: 'carrot', emoji: '🥕', lengthCm: 26.7, weightG: 360 },
  { week: 22, size: 'spaghetti squash', emoji: '🎃', lengthCm: 27.8, weightG: 430 },
  { week: 23, size: 'grapefruit', emoji: '🍊', lengthCm: 28.9, weightG: 501 },
  { week: 24, size: 'corn cob', emoji: '🌽', lengthCm: 30.0, weightG: 600 },
  { week: 25, size: 'swede', emoji: '🥔', lengthCm: 34.6, weightG: 660 },
  { week: 26, size: 'lettuce', emoji: '🥬', lengthCm: 35.6, weightG: 760 },
  { week: 27, size: 'cauliflower', emoji: '🥦', lengthCm: 36.6, weightG: 875 },
  { week: 28, size: 'aubergine', emoji: '🍆', lengthCm: 37.6, weightG: 1005 },
  { week: 29, size: 'butternut squash', emoji: '🎃', lengthCm: 38.6, weightG: 1150 },
  { week: 30, size: 'cabbage', emoji: '🥬', lengthCm: 39.9, weightG: 1320 },
  { week: 31, size: 'coconut', emoji: '🥥', lengthCm: 41.1, weightG: 1500 },
  { week: 32, size: 'jicama', emoji: '🥔', lengthCm: 42.4, weightG: 1700 },
  { week: 33, size: 'pineapple', emoji: '🍍', lengthCm: 43.7, weightG: 1920 },
  { week: 34, size: 'cantaloupe', emoji: '🍈', lengthCm: 45.0, weightG: 2150 },
  { week: 35, size: 'honeydew melon', emoji: '🍈', lengthCm: 46.2, weightG: 2380 },
  { week: 36, size: 'romaine lettuce', emoji: '🥬', lengthCm: 47.4, weightG: 2620 },
  { week: 37, size: 'chard', emoji: '🥬', lengthCm: 48.6, weightG: 2860 },
  { week: 38, size: 'leek', emoji: '🥬', lengthCm: 49.8, weightG: 3080 },
  { week: 39, size: 'small watermelon', emoji: '🍉', lengthCm: 50.7, weightG: 3290 },
  { week: 40, size: 'pumpkin', emoji: '🎃', lengthCm: 51.2, weightG: 3460 },
];

const BEDROOM: Card[] = [
  { week: 4, size: 'A fleck of glitter', emoji: '🧸', lengthCm: 0.1, weightG: 0.1 },
  { week: 5, size: 'A seed bead from a friendship bracelet', emoji: '🧸', lengthCm: 0.2, weightG: 0.1 },
  { week: 6, size: 'A single stud on a building brick', emoji: '🧸', lengthCm: 0.5, weightG: 0.2, ref: 'Lego stud' },
  { week: 7, size: 'A doll\'s shoe', emoji: '🧸', lengthCm: 1.3, weightG: 0.5, ref: 'Barbie shoe' },
  { week: 8, size: 'A two-by-two building brick', emoji: '🧸', lengthCm: 1.6, weightG: 1, ref: 'Lego 2×2' },
  { week: 9, size: 'A marble', emoji: '🧸', lengthCm: 2.3, weightG: 2 },
  { week: 10, size: 'The tiny doll from a clamshell playset', emoji: '🧸', lengthCm: 3.1, weightG: 4, ref: 'Polly Pocket figure' },
  { week: 11, size: 'A minifigure', emoji: '🧸', lengthCm: 4.1, weightG: 7, ref: 'Lego minifig' },
  { week: 12, size: 'The plastic egg with a toy inside', emoji: '🧸', lengthCm: 5.4, weightG: 14, ref: 'Kinder Surprise capsule' },
  { week: 13, size: 'A die-cast toy car', emoji: '🧸', lengthCm: 7.4, weightG: 23, ref: 'Hot Wheels' },
  { week: 14, size: 'A clamshell playset, closed', emoji: '🧸', lengthCm: 8.7, weightG: 43, ref: 'Polly Pocket compact' },
  { week: 15, size: 'A bean-filled collectible plush', emoji: '🧸', lengthCm: 10.1, weightG: 70, ref: 'Beanie Baby' },
  { week: 16, size: 'A pastel pony with brushable hair', emoji: '🧸', lengthCm: 11.6, weightG: 100, ref: 'My Little Pony' },
  { week: 17, size: 'A troll doll, hair up', emoji: '🧸', lengthCm: 13.0, weightG: 140, ref: 'Trolls' },
  { week: 18, size: 'A big-eared electronic pet that never shut up', emoji: '🧸', lengthCm: 14.2, weightG: 190, ref: 'Furby' },
  { week: 19, size: 'A pastel bear with a symbol on its belly', emoji: '🧸', lengthCm: 15.3, weightG: 240, ref: 'Care Bear' },
  { week: 20, size: 'A big-headed fashion doll', emoji: '🧸', lengthCm: 25.6, weightG: 300, ref: 'Bratz' },
  { week: 21, size: 'A white rabbit plush with a cross for a mouth', emoji: '🧸', lengthCm: 26.7, weightG: 360, ref: 'Nijntje / Miffy' },
  { week: 22, size: 'A classic fashion doll', emoji: '🧸', lengthCm: 27.8, weightG: 430, ref: 'Barbie' },
  { week: 23, size: 'A magnetic drawing screen with two knobs', emoji: '🧸', lengthCm: 28.9, weightG: 501, ref: 'Etch A Sketch' },
  { week: 24, size: 'A doll\'s head for practising hairstyles', emoji: '🧸', lengthCm: 30.0, weightG: 600, ref: 'Styling head' },
  { week: 25, size: 'A classic teddy bear', emoji: '🧸', lengthCm: 34.6, weightG: 660 },
  { week: 26, size: 'A toy pushchair for dolls, folded', emoji: '🧸', lengthCm: 35.6, weightG: 760 },
  { week: 27, size: 'The guess-the-face board game, open', emoji: '🧸', lengthCm: 36.6, weightG: 875, ref: 'Guess Who?' },
  { week: 28, size: 'A four-in-a-row grid', emoji: '🧸', lengthCm: 37.6, weightG: 1005, ref: 'Connect 4' },
  { week: 29, size: 'A dolls\'-house room, floor to ceiling', emoji: '🧸', lengthCm: 38.6, weightG: 1150 },
  { week: 30, size: 'A soft-bodied doll with yarn hair', emoji: '🧸', lengthCm: 39.9, weightG: 1320, ref: 'Cabbage Patch Kid' },
  { week: 31, size: 'A doll\'s pram, standing up', emoji: '🧸', lengthCm: 41.1, weightG: 1500 },
  { week: 32, size: 'The baby doll that drinks and wets', emoji: '🧸', lengthCm: 42.4, weightG: 1700, ref: 'Baby Born / Baby Annabell' },
  { week: 33, size: 'A woodland-animal family house', emoji: '🧸', lengthCm: 43.7, weightG: 1920, ref: 'Sylvanian Families' },
  { week: 34, size: 'The oversized fairground teddy', emoji: '🧸', lengthCm: 45.0, weightG: 2150 },
  { week: 35, size: 'A toy kitchen worktop', emoji: '🧸', lengthCm: 46.2, weightG: 2380 },
  { week: 36, size: 'A plastic dolls\' house, front to back', emoji: '🧸', lengthCm: 47.4, weightG: 2620 },
  { week: 37, size: 'The property board game, open', emoji: '🧸', lengthCm: 48.6, weightG: 2860, ref: 'Monopoly' },
  { week: 38, size: 'A bouncing hopper ball with handles', emoji: '🧸', lengthCm: 49.8, weightG: 3080, ref: 'Space hopper' },
  { week: 39, size: 'A rocking horse, seat to floor', emoji: '🧸', lengthCm: 50.7, weightG: 3290 },
  { week: 40, size: 'A life-size baby doll. This one\'s real.', emoji: '🧸', lengthCm: 51.2, weightG: 3460 },
];

export const PACKS: Pack[] = [
  { id: 'garden', name: 'The Veg Aisle', blurb: 'Fruit and veg, the way every midwife explains it.', premium: false, cards: FRUIT },
  { id: 'bedroom', name: 'Bedroom Floor', blurb: 'Toys and dolls. The stuff that was actually on the carpet.', premium: true, cards: BEDROOM },
];

export const packById = (id: string): Pack => PACKS.find((p) => p.id === id) ?? PACKS[0];

export function cardFor(packId: string, week: number): Card {
  const pack = packById(packId);
  const clamped = Math.min(40, Math.max(4, Math.round(week)));
  return (
    pack.cards.find((c) => c.week === clamped) ??
    PACKS[0].cards.find((c) => c.week === clamped) ??
    PACKS[0].cards[0]
  );
}

/** What the baby is up to this week. */
export const DEV_NOTES: Record<number, string> = {
  6: 'Heart starts beating — about 110 times a minute.',
  8: 'Fingers and toes are separating. Officially a fetus now.',
  10: 'Vital organs are all in place and starting to practise.',
  12: 'Can swallow, and has fingerprints.',
  16: 'Hears your voice; muscles are wiring up.',
  20: 'Halfway. Starts a proper sleep-wake rhythm.',
  24: 'Lungs practise breathing. Sounds from outside get through.',
  28: 'Eyes open. Dreams, as far as anyone can tell.',
  32: 'Putting on fat fast, running out of somersault room.',
  36: 'Usually head-down and gaining ~200 g a week.',
  40: 'Fully cooked. Waiting on a signal.',
};

export function devNote(week: number): string {
  const keys = Object.keys(DEV_NOTES).map(Number).sort((a, b) => a - b);
  let best = keys[0];
  for (const k of keys) if (k <= week) best = k;
  return DEV_NOTES[best];
}

/** Weeks whose card has been unlocked by simply reaching them. */
export const availableCards = (week: number) =>
  Array.from({ length: Math.max(0, Math.min(40, Math.floor(week)) - 3) }, (_, i) => i + 4);

export const collectedThisWeek = (cards: number[], week: number) => cards.includes(Math.floor(week));

export type { Entry };
