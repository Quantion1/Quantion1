export interface WeekInfo {
  week: number;
  size: string;
  emoji: string;
  /** Approximate crown-to-heel length in cm. */
  lengthCm: number;
  /** Approximate weight in grams. */
  weightG: number;
  headline: string;
  tip: string;
}

export const TRIMESTER = (week: number) => (week <= 13 ? 1 : week <= 27 ? 2 : 3);

export const PREGNANCY_WEEKS: WeekInfo[] = [
  { week: 4, size: 'poppy seed', emoji: '🫘', lengthCm: 0.1, weightG: 0.1, headline: 'The embryo implants and the placenta starts forming.', tip: 'Start a prenatal vitamin with folic acid if you have not already.' },
  { week: 5, size: 'sesame seed', emoji: '🌱', lengthCm: 0.2, weightG: 0.1, headline: 'The neural tube — future brain and spine — is closing.', tip: 'Nausea often begins now. Small, frequent snacks help more than big meals.' },
  { week: 6, size: 'lentil', emoji: '🫛', lengthCm: 0.5, weightG: 0.2, headline: 'A tiny heart begins to beat, around 110 bpm.', tip: 'Book your first midwife appointment.' },
  { week: 7, size: 'blueberry', emoji: '🫐', lengthCm: 1.3, weightG: 0.5, headline: 'Arm and leg buds appear.', tip: 'Fatigue peaks in the first trimester — nap without guilt.' },
  { week: 8, size: 'raspberry', emoji: '🍇', lengthCm: 1.6, weightG: 1, headline: 'Fingers and toes are webbed but forming.', tip: 'Track your symptoms daily — patterns help your midwife.' },
  { week: 9, size: 'olive', emoji: '🫒', lengthCm: 2.3, weightG: 2, headline: 'All essential organs have started to develop.', tip: 'Keep hydrated; aim for 2 litres of water.' },
  { week: 10, size: 'kumquat', emoji: '🍊', lengthCm: 3.1, weightG: 4, headline: 'Officially a fetus now, with working joints.', tip: 'Gentle movement — walking, swimming — eases nausea for many.' },
  { week: 11, size: 'fig', emoji: '🫐', lengthCm: 4.1, weightG: 7, headline: 'Tooth buds and fingernails begin to appear.', tip: 'Your first scan is usually between weeks 11 and 14.' },
  { week: 12, size: 'lime', emoji: '🍈', lengthCm: 5.4, weightG: 14, headline: 'Reflexes develop — the fingers can open and close.', tip: 'Many people share the news around now. Do what feels right.' },
  { week: 13, size: 'pea pod', emoji: '🫛', lengthCm: 7.4, weightG: 23, headline: 'Vocal cords form. Fingerprints are unique already.', tip: 'End of trimester one. Energy often returns in the next few weeks.' },
  { week: 14, size: 'lemon', emoji: '🍋', lengthCm: 8.7, weightG: 43, headline: 'Facial muscles let the baby squint and frown.', tip: 'Add a bit of iron-rich food — blood volume is climbing.' },
  { week: 15, size: 'apple', emoji: '🍎', lengthCm: 10.1, weightG: 70, headline: 'The baby can sense light through your belly.', tip: 'Start sleeping on your side to help circulation.' },
  { week: 16, size: 'avocado', emoji: '🥑', lengthCm: 11.6, weightG: 100, headline: 'Tiny bones are hardening; movements get coordinated.', tip: 'First flutters ("quickening") often show up between 16 and 22 weeks.' },
  { week: 17, size: 'pear', emoji: '🍐', lengthCm: 13, weightG: 140, headline: 'Body fat begins to form under the skin.', tip: 'Log your weight weekly — steady gain matters more than the number.' },
  { week: 18, size: 'bell pepper', emoji: '🫑', lengthCm: 14.2, weightG: 190, headline: 'Ears move into position; sounds get through.', tip: 'Talk or play music — the baby is starting to listen.' },
  { week: 19, size: 'mango', emoji: '🥭', lengthCm: 15.3, weightG: 240, headline: 'Vernix, a protective waxy coat, covers the skin.', tip: 'Round-ligament twinges are normal. Move slowly when standing.' },
  { week: 20, size: 'banana', emoji: '🍌', lengthCm: 25.6, weightG: 300, headline: 'Halfway. The anomaly scan checks every organ.', tip: 'Bring your questions to the 20-week scan — write them down first.' },
  { week: 21, size: 'carrot', emoji: '🥕', lengthCm: 26.7, weightG: 360, headline: 'The baby swallows amniotic fluid and tastes your meals.', tip: 'Kicks become regular. Start noticing their pattern.' },
  { week: 22, size: 'spaghetti squash', emoji: '🎃', lengthCm: 27.8, weightG: 430, headline: 'Eyebrows and eyelashes appear.', tip: 'Heartburn? Smaller meals and an upright half-hour after eating.' },
  { week: 23, size: 'grapefruit', emoji: '🍊', lengthCm: 28.9, weightG: 501, headline: 'Lungs practise breathing movements.', tip: 'Consider a prenatal class booking around now.' },
  { week: 24, size: 'corn cob', emoji: '🌽', lengthCm: 30, weightG: 600, headline: 'Viability milestone. Inner ear controls balance now.', tip: 'Glucose screening usually falls between weeks 24 and 28.' },
  { week: 25, size: 'rutabaga', emoji: '🥔', lengthCm: 34.6, weightG: 660, headline: 'Hair colour and texture are set.', tip: 'Try pelvic-floor exercises daily — future you says thanks.' },
  { week: 26, size: 'lettuce head', emoji: '🥬', lengthCm: 35.6, weightG: 760, headline: 'Eyes open for the first time.', tip: 'Third trimester next week. Start thinking about the birth plan.' },
  { week: 27, size: 'cauliflower', emoji: '🥦', lengthCm: 36.6, weightG: 875, headline: 'Regular sleep and wake cycles begin.', tip: 'Count kicks daily from now — 10 movements in 2 hours is a common guide.' },
  { week: 28, size: 'eggplant', emoji: '🍆', lengthCm: 37.6, weightG: 1005, headline: 'The baby can blink and may dream.', tip: 'Appointments usually move to every two weeks.' },
  { week: 29, size: 'butternut squash', emoji: '🎃', lengthCm: 38.6, weightG: 1150, headline: 'Muscles and lungs keep maturing; bones absorb calcium.', tip: 'Add a calcium source at each meal.' },
  { week: 30, size: 'cabbage', emoji: '🥬', lengthCm: 39.9, weightG: 1320, headline: 'Brain surface starts to wrinkle, making room for tissue.', tip: 'Pack a rough hospital-bag list — you can refine it later.' },
  { week: 31, size: 'coconut', emoji: '🥥', lengthCm: 41.1, weightG: 1500, headline: 'All five senses are working.', tip: 'Braxton Hicks may start. Time them — real ones get closer together.' },
  { week: 32, size: 'jicama', emoji: '🥔', lengthCm: 42.4, weightG: 1700, headline: 'Most babies settle head-down around now.', tip: 'Sleep gets trickier. A pillow between the knees helps a lot.' },
  { week: 33, size: 'pineapple', emoji: '🍍', lengthCm: 43.7, weightG: 1920, headline: 'The skull stays soft and flexible for birth.', tip: 'Practise your breathing techniques.' },
  { week: 34, size: 'cantaloupe', emoji: '🍈', lengthCm: 45, weightG: 2150, headline: 'Fingernails reach the fingertips.', tip: 'Install the car seat — it takes longer than you think.' },
  { week: 35, size: 'honeydew melon', emoji: '🍈', lengthCm: 46.2, weightG: 2380, headline: 'Rapid brain development; kidneys are fully developed.', tip: 'Group B strep test is usually done between 35 and 37 weeks.' },
  { week: 36, size: 'romaine lettuce', emoji: '🥬', lengthCm: 47.4, weightG: 2620, headline: 'The baby drops lower into the pelvis.', tip: 'Weekly appointments from here. Finish the hospital bag.' },
  { week: 37, size: 'swiss chard', emoji: '🥬', lengthCm: 48.6, weightG: 2860, headline: 'Early term. Practising breathing, sucking and blinking.', tip: 'Know the signs of labour — and when to call.' },
  { week: 38, size: 'leek', emoji: '🥬', lengthCm: 49.8, weightG: 3080, headline: 'Vernix and lanugo shed into the fluid.', tip: 'Rest when you can. Sleep now is stored energy.' },
  { week: 39, size: 'mini watermelon', emoji: '🍉', lengthCm: 50.7, weightG: 3290, headline: 'Full term. The brain is still growing fast.', tip: 'Time contractions with the built-in timer when they start.' },
  { week: 40, size: 'pumpkin', emoji: '🎃', lengthCm: 51.2, weightG: 3460, headline: 'Due date. Only about 4% of babies arrive on it.', tip: 'Stay in touch with your midwife about next steps.' },
];

export function weekInfo(week: number): WeekInfo {
  const clamped = Math.min(40, Math.max(4, Math.round(week)));
  return PREGNANCY_WEEKS.find((w) => w.week === clamped) ?? PREGNANCY_WEEKS[0];
}

/** Gestational age given a due date (40w from LMP). */
export function gestation(dueDate: string, now = new Date()) {
  const due = new Date(dueDate);
  const conceptionStart = new Date(due.getTime() - 280 * 86_400_000);
  const totalDays = Math.floor((now.getTime() - conceptionStart.getTime()) / 86_400_000);
  const week = Math.floor(totalDays / 7);
  const day = totalDays % 7;
  const daysLeft = Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
  return {
    week: Math.max(0, week),
    day: Math.max(0, day),
    daysLeft,
    trimester: TRIMESTER(Math.max(1, week)),
    progress: Math.min(1, Math.max(0, totalDays / 280)),
  };
}

/**
 * Institute of Medicine recommended cumulative weight gain (kg) by week for a
 * normal pre-pregnancy BMI: ~1.6 kg in T1, then 0.42 kg/week.
 */
export function recommendedGain(week: number): { low: number; high: number } {
  const w = Math.max(0, Math.min(40, week));
  if (w <= 13) return { low: (w / 13) * 1.0, high: (w / 13) * 2.0 };
  const extra = w - 13;
  return { low: 1.0 + extra * 0.35, high: 2.0 + extra * 0.5 };
}
