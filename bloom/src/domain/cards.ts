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


/**
 * What is being built in there, week by week, and the drier half of the same
 * story. Read on the back of the week's card.
 */
export const WEEK_STORY: Record<number, { body: string; wry: string }> = {
  4: {
    body: 'A ball of a few hundred cells burrows into the wall of the uterus and immediately starts building two things at once: the baby, and the placenta it will live off for the next nine months.',
    wry: 'It is smaller than the full stop at the end of this sentence, and it has already made you tired. This sets the tone for roughly the next eighteen years.',
  },
  5: {
    body: 'The neural tube — the future brain and spinal cord — closes over this week, and a tube that will become the heart starts to twitch on its own.',
    wry: 'Nothing is recognisable yet. If you could see it you would say \'seahorse\', and you would be embarrassingly close.',
  },
  6: {
    body: 'The heart beats around 110 times a minute. Dark spots appear where the eyes will go, and arm and leg buds push out like paddles.',
    wry: 'The \'heart\' is a folded tube with no chambers in it. Nobody at the clinic will describe it that way, because \'we heard the tube\' does not land well.',
  },
  7: {
    body: 'The brain is growing about a hundred cells a minute. Hands and feet are still paddles, and the tail — yes, there was one — is being reabsorbed.',
    wry: 'Everyone gets a tail for a few weeks. Yours went the same way. Nothing further to discuss.',
  },
  8: {
    body: 'Fingers and toes separate, eyelids form, and the intestines start out inside the umbilical cord because there is not yet room for them in the abdomen.',
    wry: 'It is promoted from embryo to fetus this week. The duties are unchanged.',
  },
  9: {
    body: 'Tiny muscles start to work — it can bend at the elbows and curl its toes — and the first basic reflexes are being wired in.',
    wry: 'It is moving almost constantly and you cannot feel a thing. This is the last period in which its activity will be silent.',
  },
  10: {
    body: 'Every vital organ is in place and starting to rehearse. Fingernails and hair follicles form, and the most fragile stretch of development is now behind it.',
    wry: 'This is the week the odds shift decisively in its favour. It happens quietly, with no announcement, and nobody sends a card.',
  },
  11: {
    body: 'The head is nearly half its total length, tooth buds appear under the gums, and the diaphragm forms — which is when the hiccups start.',
    wry: 'The head-to-body ratio is comical and stays that way for months. Every animator draws babies like this for exactly the reason evolution did.',
  },
  12: {
    body: 'It can swallow amniotic fluid, its kidneys make urine, and it has fingerprints — patterns no other human will ever have.',
    wry: 'It drinks the fluid, filters it, and returns it. The entire system is a very small, very committed closed loop.',
  },
  13: {
    body: 'Vocal cords form, the bones begin to harden, and the intestines finally move out of the cord and into the abdomen where they belong.',
    wry: 'It now has vocal cords, in a fluid-filled space, with no air. Enjoy this. It is the quietest they will ever be.',
  },
  14: {
    body: 'The facial muscles work: it can squint, frown and grimace. A fine hair called lanugo starts to cover the skin.',
    wry: 'It is pulling faces at nobody, in the dark, months before there is anything in there to react to.',
  },
  15: {
    body: 'The skeleton is turning from cartilage into bone, and the ears finish moving to the sides of the head from somewhere near the neck.',
    wry: 'Everything is still migrating into position. Early on, the parts are in roughly the right postcode and no closer than that.',
  },
  16: {
    body: 'It can hear — your heartbeat, your digestion and your voice, all muffled through fluid and wall. The legs are finally longer than the arms.',
    wry: 'The clearest sound in there is your pulse, thumping steadily. Every white-noise machine you buy later is trying to sell that back to you.',
  },
  17: {
    body: 'Fat starts forming under the skin, the joints move properly, and the umbilical cord thickens and toughens up.',
    wry: 'Until now it has been translucent and unnervingly red. This is the week it starts filling out into something you could put a nappy on.',
  },
  18: {
    body: 'The ears stand out from the head, and the nerves are being coated in myelin, which speeds up every signal it sends.',
    wry: 'This is around when the anomaly scan gets booked. It will be the longest twenty minutes of silence you have ever sat through.',
  },
  19: {
    body: 'A greasy white coat called vernix forms over the skin to stop it dissolving in the fluid it is floating in.',
    wry: 'It is waterproofing, essentially. Some of it is still on them at birth, and it is genuinely better to know that in advance.',
  },
  20: {
    body: 'Halfway. It sleeps and wakes on a rhythm now, sucks its thumb, and from this week is measured head to heel rather than head to bottom.',
    wry: 'The length on the chart jumps overnight because the ruler changed, not the baby. Every chart does this and nobody warns anyone.',
  },
  21: {
    body: 'It swallows a little fluid every day, which gives the digestive system something to practise on, and the bone marrow starts making blood cells.',
    wry: 'It can taste what you ate — flavours reach the fluid within hours. Whatever you have been eating this month, they have already tried it.',
  },
  22: {
    body: 'It has eyebrows, eyelashes and a proper grip. The inner ear finishes, so it now has a sense of balance and knows which way up it is.',
    wry: 'Somewhere in here it works out which way is up, which is more than can be said for anyone in the house at 3am later on.',
  },
  23: {
    body: 'The lungs begin making surfactant, blood vessels develop ready for breathing air, and it reliably moves in response to sound.',
    wry: 'Loud noises make it jump. Slamming a car door and feeling a kick back is one of the stranger moments of the whole business.',
  },
  24: {
    body: 'A threshold doctors take seriously: from about now, with a great deal of help, a baby born early can survive. The lungs practise breathing, using fluid.',
    wry: 'It weighs about six hundred grams — a bag of sugar with a heartbeat and firm opinions about your sleeping position.',
  },
  25: {
    body: 'Its heart rate changes when it hears your voice, body fat is building quickly, and the nostrils open up.',
    wry: 'It starts drawing fluid in and out of the lungs. Nobody is drowning; the oxygen is arriving through the cord, as it has all along.',
  },
  26: {
    body: 'The eyes open for the first time, and brain-wave activity for hearing and sight starts showing up on a scan.',
    wry: 'There is nothing whatsoever to look at. A bright light on the bump gets a reaction, which is a party trick that should not be overused.',
  },
  27: {
    body: 'The third trimester begins. Sleep now runs in proper cycles, including REM — the kind of sleep in which humans dream.',
    wry: 'Whether a fetus dreams, and about what, is genuinely unknown. It has no material to work with yet.',
  },
  28: {
    body: 'It can blink, and the brain develops the folds and grooves that let more of it fit inside the skull.',
    wry: 'It has been rehearsing breathing for weeks in a place with no air, on nothing but the assumption that this will eventually be useful.',
  },
  29: {
    body: 'The bones harden in earnest and start drawing calcium from you at a serious rate, while the head grows to keep up with the brain inside it.',
    wry: 'It takes around 250 mg of calcium a day. If your teeth feel strange, that is not folklore, it is arithmetic.',
  },
  30: {
    body: 'It can tell light from dark and will turn towards a light source. The fluid around it peaks at about half a litre and starts reducing from here.',
    wry: 'The room stops being a swimming pool and becomes a studio flat. Somersaults are off the schedule for good.',
  },
  31: {
    body: 'All five senses are working, the brain is processing what they send it, and it can turn its head from side to side.',
    wry: 'It puts on roughly 200 g a week from here to the end, and you will feel every gram of it in your lower back.',
  },
  32: {
    body: 'It practises breathing, sucking and swallowing in one coordinated sequence, which is far harder than it sounds and is needed on day one.',
    wry: 'The fingernails reach the fingertips. A fair few babies arrive with a scratch on the face, self-inflicted before anyone had met them.',
  },
  33: {
    body: 'The skull bones stay separate and soft — that is what lets the head compress on the way out and the brain keep growing afterwards.',
    wry: 'The soft spot on top does not close for over a year. It is the compromise between a large brain and a narrow pelvis, and you are living in the middle of it.',
  },
  34: {
    body: 'The nervous system and lungs keep maturing, and most babies have settled head-down by about now.',
    wry: 'If it is still the wrong way up, it has a few weeks and a strong incentive. Nobody has ever won an argument with one.',
  },
  35: {
    body: 'Room is running out, so the kicks turn into squirms, rolls and pressure. The construction work is essentially done; what is left is weight.',
    wry: 'The uterus is now around a thousand times its original volume. It does go back down, at a pace no one finds satisfying.',
  },
  36: {
    body: 'It swallows fluid and stores meconium — the first, dark nappy, already loaded and waiting for you — while the lungs finish maturing.',
    wry: 'That first nappy has the colour and texture of roofing tar. There is no preparing for it, but at least you now know it is coming.',
  },
  37: {
    body: 'Full term. Everything needed to live out here is finished, and the remaining work is on the brain and the lungs.',
    wry: 'Anywhere between now and 42 weeks is normal. The due date is a median wearing the costume of an appointment.',
  },
  38: {
    body: 'The brain is still growing fast, the lungs are making enough surfactant to hold the air sacs open, and most of the lanugo sheds.',
    wry: 'It swallows the shed hair along with everything else in there. That is one more thing turning up in the first nappy.',
  },
  39: {
    body: 'The placenta keeps passing over antibodies that will protect them for months after birth, and the skin thickens as the fat pads out.',
    wry: 'Nobody is certain what starts labour, but the best evidence points at a signal from the baby\'s own lungs. The timing, in other words, is their idea.',
  },
  40: {
    body: 'Fully built, and simply waiting. Average is about 3.5 kg and 51 cm, though \'average\' is doing a great deal of work in that sentence.',
    wry: 'Roughly one baby in twenty-five is born on the due date itself. The other twenty-four have been noted, and no action has been taken.',
  },
};

export const weekStory = (week: number) => WEEK_STORY[Math.min(40, Math.max(4, Math.round(week)))];

/** Every week the album holds, four to forty. */
export const ALBUM_WEEKS = Array.from({ length: 37 }, (_, i) => i + 4);

/** Weeks whose card has been unlocked by simply reaching them. */
export const availableCards = (week: number) =>
  Array.from({ length: Math.max(0, Math.min(40, Math.floor(week)) - 3) }, (_, i) => i + 4);

export const collectedThisWeek = (cards: number[], week: number) => cards.includes(Math.floor(week));

export type { Entry };
