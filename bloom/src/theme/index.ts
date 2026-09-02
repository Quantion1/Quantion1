/**
 * Bloom design system.
 *
 * The visual language borrows Duolingo's core ideas — chunky 3D-pressed
 * buttons, saturated accent colours, generous rounding, oversized numerals —
 * but uses a blossom/mint palette so it reads as a family product rather than
 * a language game.
 */

export const palette = {
  // Brand accents
  blossom: '#FF4D79',
  blossomDark: '#D62F5B',
  blossomSoft: '#FFE4EC',

  mint: '#22CC88',
  mintDark: '#16A36A',
  mintSoft: '#DCFAEE',

  sky: '#2BB3F3',
  skyDark: '#1C8FC7',
  skySoft: '#DEF2FE',

  sunny: '#FFC02E',
  sunnyDark: '#DB9C00',
  sunnySoft: '#FFF3D4',

  grape: '#8B5CF6',
  grapeDark: '#6D38E0',
  grapeSoft: '#EFE7FE',

  coral: '#FF7A45',
  coralDark: '#DB5A26',
  coralSoft: '#FFEDE3',

  // Neutrals
  ink: '#2C2438',
  inkSoft: '#6B6480',
  inkFaint: '#A7A1B8',
  line: '#E9E5F0',
  cloud: '#F6F4FA',
  card: '#FFFFFF',
  bg: '#FFFFFF',
  white: '#FFFFFF',

  // States
  danger: '#F4364C',
  dangerSoft: '#FFE3E6',
  locked: '#CFC9DB',
} as const;

export const gradients = {
  premium: ['#8B5CF6', '#FF4D79'] as const,
  night: ['#3A2E63', '#5B4B9E'] as const,
  day: ['#FFD36E', '#FF9F45'] as const,
  blossom: ['#FF6E92', '#FF4D79'] as const,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

export const spacing = (n: number) => n * 4;

/** Duolingo-style solid drop shadow: a darker slab under the element. */
export const slab = (color: string, depth = 4) => ({
  borderBottomWidth: depth,
  borderBottomColor: color,
});

export const shadow = {
  card: {
    shadowColor: '#2C2438',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  float: {
    shadowColor: '#2C2438',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};

export const type = {
  display: { fontSize: 34, fontWeight: '900' as const, letterSpacing: -0.6 },
  title: { fontSize: 24, fontWeight: '900' as const, letterSpacing: -0.4 },
  heading: { fontSize: 18, fontWeight: '800' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '600' as const },
  label: { fontSize: 13, fontWeight: '800' as const, letterSpacing: 0.2 },
  caption: { fontSize: 12, fontWeight: '700' as const },
  numeral: { fontSize: 40, fontWeight: '900' as const, letterSpacing: -1.5 },
};

export type AccentName = 'blossom' | 'mint' | 'sky' | 'sunny' | 'grape' | 'coral';

export const accent = (name: AccentName) => ({
  base: palette[name],
  dark: palette[`${name}Dark` as const],
  soft: palette[`${name}Soft` as const],
});
