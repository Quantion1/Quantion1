import type { Tracker, TrackerKey, Stage } from './types';

const FACES = ['😞', '😕', '😐', '🙂', '😄'];

/**
 * The tracker registry. Each entry declares where it belongs, when it is
 * relevant, and which blocks its log sheet shows.
 */
export const TRACKERS: Tracker[] = [
  // ─────────────────────────────────────────────────────────────── Baby
  {
    key: 'sleep', label: 'Sleep', emoji: '😴', accent: 'blue', group: 'Baby', stage: 'baby', starter: true,
    blurb: 'Naps and nights',
    blocks: [{ t: 'timer' }, { t: 'timepair', label: 'OR ENTER THE TIMES' }],
  },
  {
    key: 'breast', label: 'Breastfeed', emoji: '🤱', accent: 'rose', group: 'Baby', stage: 'baby', starter: true,
    blurb: 'Which side, how long',
    blocks: [{ t: 'sides' }, { t: 'timepair', label: 'OR ENTER THE TIMES' }],
  },
  {
    key: 'bottle', label: 'Bottle', emoji: '🍼', accent: 'gold', group: 'Baby', stage: 'baby', starter: true,
    blurb: 'Volume and what was in it',
    blocks: [
      { t: 'number', unit: 'ml', step: 10, def: 90, presets: [60, 90, 120, 150] },
      { t: 'pick', field: 'kind', opts: [['Breastmilk', '🥛'], ['Formula', '🥣']], def: 'Breastmilk' },
    ],
  },
  {
    key: 'diaper', label: 'Diaper', emoji: '💧', accent: 'sage', group: 'Baby', stage: 'baby', starter: true,
    blurb: 'One tap, done',
    blocks: [{ t: 'pick', field: 'kind', opts: [['Wet', '💧'], ['Dirty', '💩'], ['Both', '🌊']], instant: true }],
  },
  {
    key: 'weight', label: 'Weight', emoji: '⚖️', accent: 'plum', group: 'Baby', stage: 'both', starter: true,
    blurb: 'The number everyone asks about',
    blocks: [{ t: 'number', unit: 'kg', step: 0.01, def: 4.35 }],
  },
  {
    key: 'tummy', label: 'Tummy time', emoji: '🐢', accent: 'teal', group: 'Baby', stage: 'baby', from: 7,
    blurb: 'One tap that counts — no minutes',
    blocks: [{ t: 'confirm', label: 'Tummy time done' }],
  },
  {
    key: 'temp', label: 'Temperature', emoji: '🌡️', accent: 'clay', group: 'Baby', stage: 'baby',
    blurb: 'When something feels off',
    blocks: [{ t: 'number', unit: '°C', step: 0.1, def: 37 }],
  },
  {
    key: 'vitd', label: 'Vitamin D', emoji: '💊', accent: 'moss', group: 'Baby', stage: 'baby',
    blurb: 'Daily, for years',
    blocks: [{ t: 'confirm', label: 'Given today' }],
  },
  {
    key: 'vitk', label: 'Vitamin K', emoji: '🧴', accent: 'moss', group: 'Baby', stage: 'baby', to: 92,
    blurb: 'Daily for the first three months',
    blocks: [{ t: 'confirm', label: 'Given today' }],
  },
  {
    key: 'solids', label: 'Solids', emoji: '🥑', accent: 'sage', group: 'Baby', stage: 'baby', from: 120,
    blurb: 'What was offered, and the verdict',
    blocks: [
      { t: 'chips', field: 'chips', label: 'WHAT WAS OFFERED', opts: ['Carrot', 'Sweet potato', 'Apple', 'Pear', 'Banana', 'Broccoli', 'Oatmeal', 'Yoghurt', 'Egg', 'Bread'] },
      { t: 'pick', field: 'kind', opts: [['Loved', '😍'], ['Tolerated', '😐'], ['Rejected', '🙅']], def: 'Tolerated' },
    ],
  },
  {
    key: 'newfood', label: 'New food', emoji: '🍓', accent: 'rose', group: 'Baby', stage: 'baby', from: 120,
    blurb: 'First tastes and allergen flags',
    blocks: [
      { t: 'text', field: 'text', label: 'WHICH FOOD', ph: 'e.g. peanut butter' },
      { t: 'chips', field: 'chips', label: 'ALLERGEN FLAGS', opts: ['Peanut', 'Egg', 'Dairy', 'Gluten', 'Soy', 'Fish', 'Nuts', 'Sesame'] },
      { t: 'pick', field: 'kind', opts: [['No reaction', '✅'], ['Mild rash', '🟡'], ['Reaction', '🔴']], def: 'No reaction' },
    ],
  },
  {
    key: 'teeth', label: 'Teeth', emoji: '🦷', accent: 'blue', group: 'Baby', stage: 'baby', from: 90,
    blurb: 'Tap the tooth that came through',
    blocks: [{ t: 'teeth' }],
  },
  {
    key: 'words', label: 'Words', emoji: '🗣️', accent: 'plum', group: 'Baby', stage: 'baby', from: 210,
    blurb: 'Said it, uses it, means it',
    blocks: [
      { t: 'text', field: 'text', label: 'THE WORD', ph: 'e.g. mama' },
      { t: 'pick', field: 'kind', opts: [['Said once', '👂'], ['Uses it', '🗣️'], ['Means it', '🎯']], def: 'Said once' },
    ],
  },
  {
    key: 'vax', label: 'Vaccinations', emoji: '💉', accent: 'teal', group: 'Baby', stage: 'baby',
    blurb: 'Which round, and how they took it',
    blocks: [
      { t: 'text', field: 'text', label: 'WHICH VACCINATION', ph: 'e.g. DKTP-Hib-HepB round 1' },
      { t: 'chips', field: 'chips', label: 'REACTION', opts: ['None', 'Sore leg', 'Fever', 'Sleepy', 'Fussy'] },
    ],
  },
  {
    key: 'bmed', label: "Baby's medicine", emoji: '🥄', accent: 'clay', group: 'Baby', stage: 'baby',
    blurb: 'What was given, and when',
    blocks: [
      { t: 'text', field: 'text', label: 'MEDICINE', ph: 'e.g. paracetamol 60 mg' },
      { t: 'timepair', label: 'WHEN', single: true },
    ],
  },

  // ──────────────────────────────────────────────────────────────── You
  {
    key: 'pump', label: 'Pumping', emoji: '🫙', accent: 'rose', group: 'You', stage: 'baby',
    blurb: 'Time it, and what came out',
    blocks: [
      { t: 'timer', optional: true },
      { t: 'number', unit: 'ml expressed', step: 10, def: 120, presets: [60, 100, 150, 200] },
      { t: 'pick', field: 'kind', opts: [['Left', '🫱'], ['Right', '🫲'], ['Both', '🤲']], def: 'Both' },
    ],
  },
  {
    key: 'msleep', label: 'My sleep', emoji: '🛏️', accent: 'plum', group: 'You', stage: 'both',
    blurb: 'Yours matters too',
    blocks: [
      { t: 'timepair', label: 'BED AND WAKE', bedwake: true },
      { t: 'faces', faces: ['😵', '😕', '😐', '🙂', '😴'], label: 'HOW DID YOU SLEEP' },
    ],
  },
  {
    key: 'water', label: 'Water', emoji: '🥤', accent: 'blue', group: 'You', stage: 'both',
    blurb: 'Tap the vessel you drank',
    blocks: [{ t: 'drinks' }],
  },
  {
    key: 'supp', label: 'Supplements', emoji: '💊', accent: 'moss', group: 'You', stage: 'both',
    blurb: "Today's list",
    blocks: [{ t: 'checks', field: 'checks', label: 'TODAY', opts: ['Folic acid', 'Vitamin D', 'Iron'] }],
  },
  {
    key: 'med', label: 'My medication', emoji: '🧾', accent: 'clay', group: 'You', stage: 'both',
    blurb: 'Name, dose, time',
    blocks: [
      { t: 'text', field: 'text', label: 'NAME AND DOSE', ph: 'e.g. Labetalol 100 mg' },
      { t: 'timepair', label: 'WHEN', single: true },
    ],
  },

  // ────────────────────────────────────────────────────────── Pregnancy
  {
    key: 'kicks', label: 'Kick counter', emoji: '🦶', accent: 'clay', group: 'Pregnancy', stage: 'pregnancy', from: 24, starter: true,
    blurb: 'Tap for every movement',
    blocks: [{ t: 'counter', target: 10 }],
  },
  {
    key: 'contr', label: 'Contractions', emoji: '⏱️', accent: 'plum', group: 'Pregnancy', stage: 'pregnancy', from: 30,
    blurb: 'Time them properly',
    blocks: [{ t: 'timer' }],
  },
  {
    key: 'bump', label: 'Bump photo', emoji: '🤰', accent: 'rose', group: 'Pregnancy', stage: 'pregnancy', from: 8, starter: true,
    blurb: 'Same wall, same pose, every week',
    blocks: [{ t: 'photo' }],
  },
  {
    key: 'mwq', label: 'Midwife questions', emoji: '❓', accent: 'blue', group: 'Pregnancy', stage: 'both', starter: true,
    blurb: 'The things you forget in the room',
    blocks: [{ t: 'textlist', label: 'FOR THE NEXT VISIT', ph: 'e.g. is this much heartburn normal?' }],
  },

  // ────────────────────────────────────────────────────────────── Birth
  {
    key: 'labour', label: 'Labour timeline', emoji: '🕰️', accent: 'clay', group: 'Birth', stage: 'both', from: 36,
    blurb: 'Stamp each moment as it happens',
    blocks: [{ t: 'events', opts: ['Waters broke', 'Contractions regular', 'Left for hospital', 'Arrived', 'Pushing', 'Born'] }],
  },
  {
    key: 'birthrec', label: 'Birth record', emoji: '📜', accent: 'gold', group: 'Birth', stage: 'both', from: 37, to: 30,
    blurb: 'The one you write once',
    blocks: [
      { t: 'timepair', label: 'BORN AT', single: true },
      { t: 'number', unit: 'kg at birth', step: 0.01, def: 3.4 },
      { t: 'number', field: 'amount2', unit: 'cm long', step: 0.5, def: 50 },
      { t: 'text', field: 'text', label: 'WHERE, AND WHO WAS THERE', ph: 'e.g. home, with Sam and the midwife' },
    ],
  },

  // ─────────────────────────────────────────────────────────── Keepsake
  {
    key: 'memories', label: 'Memories', emoji: '📸', accent: 'clay', group: 'Keepsake', stage: 'both',
    blurb: 'A picture and a date',
    blocks: [{ t: 'photo' }],
  },
  {
    key: 'note', label: 'Note', emoji: '📝', accent: 'gold', group: 'Keepsake', stage: 'both', starter: true,
    blurb: 'Anything you want to keep',
    blocks: [{ t: 'text', field: 'text', label: 'WHAT HAPPENED', ph: 'she laughed at the extractor fan' }],
  },
];

export const trackerMap: Record<string, Tracker> = Object.fromEntries(
  TRACKERS.map((t) => [t.key, t]),
);

export const tracker = (key: string): Tracker =>
  trackerMap[key] ?? TRACKERS[TRACKERS.length - 1];

export type Availability = 'now' | 'later' | 'retired' | 'other-stage';

/**
 * Whether a tracker is relevant right now. Pregnancy windows are in
 * gestational weeks; baby windows are in days since birth.
 */
export function availability(t: Tracker, stage: Stage, week: number, days: number): Availability {
  if (t.stage !== 'both' && t.stage !== stage) return 'other-stage';
  const pos = stage === 'pregnancy' ? week : days;
  // Birth-window trackers straddle the two stages and read from whichever applies.
  if (t.key === 'birthrec') {
    if (stage === 'pregnancy') return week >= 37 ? 'now' : 'later';
    return days <= 30 ? 'now' : 'retired';
  }
  if (t.key === 'labour') {
    if (stage === 'pregnancy') return week >= 36 ? 'now' : 'later';
    return days <= 3 ? 'now' : 'retired';
  }
  if (t.from != null && pos < t.from) return 'later';
  if (t.to != null && pos > t.to) return 'retired';
  return 'now';
}

export const starterTiles = (stage: Stage): TrackerKey[] =>
  TRACKERS.filter((t) => t.starter && (t.stage === 'both' || t.stage === stage)).map((t) => t.key);

export { FACES };
