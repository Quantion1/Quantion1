export interface MonthInfo {
  month: number;
  title: string;
  emoji: string;
  headline: string;
  tip: string;
  /** Typical total sleep in 24h (hours). */
  sleepLow: number;
  sleepHigh: number;
  /** Typical feeds per 24h. */
  feedsLow: number;
  feedsHigh: number;
  /** Typical awake window between sleeps (minutes). */
  wakeWindowMin: number;
  wakeWindowMax: number;
  milestones: string[];
}

export const BABY_MONTHS: MonthInfo[] = [
  { month: 0, title: 'Newborn', emoji: '🍼', headline: 'Days blur together. Feed, sleep, repeat — that is the job.', tip: 'Expect 8–12 feeds a day and no schedule at all. Log, do not plan.', sleepLow: 14, sleepHigh: 17, feedsLow: 8, feedsHigh: 12, wakeWindowMin: 35, wakeWindowMax: 60, milestones: ['Lifts head briefly', 'Responds to your voice', 'Grasp reflex'] },
  { month: 1, title: '1 month', emoji: '👶', headline: 'Focus improves to about 30 cm — exactly your face while feeding.', tip: 'First social smiles are close. Watch for eye contact that lingers.', sleepLow: 14, sleepHigh: 17, feedsLow: 7, feedsHigh: 10, wakeWindowMin: 45, wakeWindowMax: 75, milestones: ['Follows objects with eyes', 'Makes cooing sounds', 'Calms when held'] },
  { month: 2, title: '2 months', emoji: '😊', headline: 'Real smiles arrive, and so do the first vaccinations.', tip: 'Night stretches may lengthen. Log sleep to spot the trend early.', sleepLow: 14, sleepHigh: 16, feedsLow: 6, feedsHigh: 9, wakeWindowMin: 60, wakeWindowMax: 100, milestones: ['Social smile', 'Holds head up when on tummy', 'Coos and gurgles'] },
  { month: 3, title: '3 months', emoji: '🤗', headline: 'Hands are discovered — and immediately go in the mouth.', tip: 'Naps start consolidating. Aim for consistent wake windows.', sleepLow: 14, sleepHigh: 16, feedsLow: 6, feedsHigh: 8, wakeWindowMin: 75, wakeWindowMax: 120, milestones: ['Pushes up on forearms', 'Brings hands to mouth', 'Laughs out loud'] },
  { month: 4, title: '4 months', emoji: '🙃', headline: 'The famous 4-month sleep progression: sleep cycles mature.', tip: 'Broken nights now are developmental, not a step backwards.', sleepLow: 12, sleepHigh: 16, feedsLow: 5, feedsHigh: 7, wakeWindowMin: 90, wakeWindowMax: 135, milestones: ['Rolls front to back', 'Reaches for toys', 'Babbles with expression'] },
  { month: 5, title: '5 months', emoji: '🎈', headline: 'Rolling both ways and grabbing everything within reach.', tip: 'Three naps is typical. Watch the last wake window before bedtime.', sleepLow: 12, sleepHigh: 15, feedsLow: 5, feedsHigh: 7, wakeWindowMin: 105, wakeWindowMax: 150, milestones: ['Rolls both directions', 'Recognises own name', 'Sits with support'] },
  { month: 6, title: '6 months', emoji: '🥄', headline: 'First tastes of solids — milk still does the heavy lifting.', tip: 'Log solids alongside milk feeds to spot intolerances early.', sleepLow: 12, sleepHigh: 15, feedsLow: 4, feedsHigh: 6, wakeWindowMin: 120, wakeWindowMax: 165, milestones: ['Sits unsupported', 'Starts solids', 'Passes objects hand to hand'] },
  { month: 7, title: '7 months', emoji: '🧸', headline: 'Object permanence kicks in — peekaboo becomes hilarious.', tip: 'Separation anxiety may disturb nights. Consistency beats novelty.', sleepLow: 12, sleepHigh: 15, feedsLow: 4, feedsHigh: 6, wakeWindowMin: 135, wakeWindowMax: 180, milestones: ['Sits steadily', 'Babbles "ba-ba, da-da"', 'Looks for dropped toys'] },
  { month: 8, title: '8 months', emoji: '🚼', headline: 'Crawling, shuffling, or rolling with purpose across the room.', tip: 'Two naps is now the norm for most babies.', sleepLow: 12, sleepHigh: 15, feedsLow: 4, feedsHigh: 5, wakeWindowMin: 150, wakeWindowMax: 195, milestones: ['Crawls or scoots', 'Pincer grasp forming', 'Responds to "no"'] },
  { month: 9, title: '9 months', emoji: '🧗', headline: 'Pulling to stand and cruising along the furniture.', tip: 'Lower the cot mattress before they surprise you.', sleepLow: 12, sleepHigh: 14, feedsLow: 3, feedsHigh: 5, wakeWindowMin: 165, wakeWindowMax: 210, milestones: ['Pulls to stand', 'Waves bye-bye', 'Eats finger foods'] },
  { month: 10, title: '10 months', emoji: '👏', headline: 'Copying everything you do — clapping, waving, banging.', tip: 'Three solid meals plus milk is a typical rhythm now.', sleepLow: 11, sleepHigh: 14, feedsLow: 3, feedsHigh: 4, wakeWindowMin: 180, wakeWindowMax: 225, milestones: ['Cruises furniture', 'Says "mama/dada" with meaning', 'Drinks from a cup'] },
  { month: 11, title: '11 months', emoji: '🦶', headline: 'First wobbly independent steps for some — no rush for others.', tip: 'Sleep may wobble around new motor skills. It settles.', sleepLow: 11, sleepHigh: 14, feedsLow: 2, feedsHigh: 4, wakeWindowMin: 195, wakeWindowMax: 240, milestones: ['Stands alone briefly', 'Understands simple requests', 'Points at things'] },
  { month: 12, title: '1 year', emoji: '🎂', headline: 'A whole year. Walking, waving, and full of opinions.', tip: 'Many babies drop to one nap between 12 and 18 months.', sleepLow: 11, sleepHigh: 14, feedsLow: 2, feedsHigh: 4, wakeWindowMin: 210, wakeWindowMax: 270, milestones: ['First steps', 'Says 1–3 words', 'Cooperates with dressing'] },
];

export function monthInfo(month: number): MonthInfo {
  const m = Math.min(12, Math.max(0, Math.round(month)));
  return BABY_MONTHS[m];
}

export function babyAge(birthDate: string, now = new Date()) {
  const b = new Date(birthDate);
  const days = Math.floor((now.getTime() - b.getTime()) / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.4375);
  return {
    days: Math.max(0, days),
    weeks: Math.max(0, weeks),
    months: Math.max(0, months),
    progress: Math.min(1, Math.max(0, days / 365)),
    label:
      days < 14 ? `${Math.max(0, days)} days old` : days < 90 ? `${weeks} weeks old` : `${months} months old`,
  };
}

/** WHO median weight-for-age (kg) at month 0..12, used for the premium curve. */
export const WHO_WEIGHT_MEDIAN: Record<'girl' | 'boy', number[]> = {
  girl: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9],
  boy: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6],
};
