/**
 * XP curve. Level n needs 60 + 40n XP on top of the previous level, which keeps
 * the first few levels reachable inside day one and then paces out.
 */
export function levelForXp(xp: number) {
  let level = 1;
  let need = 100;
  let consumed = 0;
  while (xp >= consumed + need) {
    consumed += need;
    level += 1;
    need = 60 + 40 * level;
  }
  return {
    level,
    intoLevel: xp - consumed,
    levelSpan: need,
    progress: need === 0 ? 0 : (xp - consumed) / need,
    toNext: consumed + need - xp,
  };
}

export const LEVEL_TITLES = [
  'Seedling',
  'Sprout',
  'Bud',
  'Bloom',
  'Sunflower',
  'Little Oak',
  'Grove Keeper',
  'Nightwatch',
  'Milestone Maker',
  'Legend Parent',
];

export const levelTitle = (level: number) =>
  LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, Math.floor((level - 1) / 3))];
