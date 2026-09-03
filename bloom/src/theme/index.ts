/**
 * Nest design system.
 *
 * Parchment and earth: a warm paper ground, warm brown ink, and a set of muted
 * accents that each own one part of the app. Dot's marigold is the only fully
 * saturated colour in the system and is reserved for the companion, level-ups
 * and the primary action — so the eye always knows where the reward is.
 */

export const palette = {
  // Ground
  paper: '#F5F1EA',
  paperDeep: '#EDE7DC',
  card: '#FFFDF8',
  cardSunk: '#F7F3EB',

  // Ink
  ink: '#2B2724',
  inkSoft: '#6B6259',
  inkFaint: '#9C9389',
  line: '#E2DBCF',
  lineSoft: '#EDE8DE',

  // Dot's marigold — the one bright colour
  dot: '#E8B75E',
  dotDeep: '#C9913A',
  dotSoft: '#FAEFD5',
  bill: '#E39A4B',
  billDeep: '#C97B3C',

  // Accents (carried over from the v3 tracker registry)
  blue: '#4E6E96',
  blueSoft: '#E3ECF7',
  sage: '#4F8467',
  sageSoft: '#E5F1E9',
  clay: '#96683F',
  claySoft: '#F7EDE1',
  rose: '#B5635C',
  roseSoft: '#FBE8E5',
  plum: '#7561A0',
  plumSoft: '#EEE9F8',
  teal: '#3F7F86',
  tealSoft: '#E2F0F1',
  moss: '#6A7C4A',
  mossSoft: '#EDF2E1',
  gold: '#B0803C',
  goldSoft: '#F3E7C8',

  // States
  danger: '#A6402F',
  dangerSoft: '#F7E2DD',
  white: '#FFFFFF',
} as const;

export type AccentName = 'blue' | 'sage' | 'clay' | 'rose' | 'plum' | 'teal' | 'moss' | 'gold' | 'dot';

export const accent = (name: AccentName) => {
  if (name === 'dot') return { base: palette.dot, deep: palette.dotDeep, soft: palette.dotSoft };
  return {
    base: palette[name],
    deep: palette[name],
    soft: palette[`${name}Soft` as const],
  };
};

export const radius = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const space = (n: number) => n * 4;

/**
 * Nest has no slab shadows. Depth comes from paper: a hairline rule, a slightly
 * lifted card, and a soft warm shadow — the feel of things resting on a desk.
 */
export const shadow = {
  rest: {
    shadowColor: '#3A2E1E',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  lift: {
    shadowColor: '#3A2E1E',
    shadowOpacity: 0.13,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
};

export const font = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  body: 'NunitoSans_400Regular',
  bodyMed: 'NunitoSans_600SemiBold',
  bodyBold: 'NunitoSans_700Bold',
};

export const type = {
  hero: { fontFamily: font.displayBold, fontSize: 30, letterSpacing: -0.4, lineHeight: 36 },
  title: { fontFamily: font.displayBold, fontSize: 22, letterSpacing: -0.2, lineHeight: 28 },
  heading: { fontFamily: font.display, fontSize: 17, lineHeight: 23 },
  body: { fontFamily: font.body, fontSize: 15, lineHeight: 21 },
  bodyMed: { fontFamily: font.bodyMed, fontSize: 15, lineHeight: 21 },
  small: { fontFamily: font.body, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: font.bodyBold, fontSize: 11, letterSpacing: 0.9 },
  numeral: { fontFamily: font.displayBold, fontSize: 32, letterSpacing: -0.8 },
};
