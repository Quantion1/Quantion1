/**
 * Nest design system.
 *
 * Parchment and earth: a warm paper ground, warm brown ink, and a set of muted
 * accents that each own one part of the app. Dot's marigold is the only fully
 * saturated colour in the system and is reserved for the companion, captured moments
 * and the primary action — so the eye always knows where the reward is.
 */

/** Every colour the app can name. Both schemes carry the whole set. */
const LIGHT = {
  // Ground
  paper: '#F5F1EA',
  paperDeep: '#EDE7DC',
  card: '#FFFDF8',
  cardSunk: '#F7F3EB',
  /** A surface sitting on top of a card — the selected half of a segmented control. */
  raised: '#FFFFFF',

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

  /** Veils the thing behind it: a locked chart. */
  scrim: 'rgba(245,241,234,0.72)',
  /** Behind a modal, darkening the whole screen. */
  backdrop: 'rgba(43,39,36,0.45)',
};

export type Palette = typeof LIGHT;

/**
 * Night parchment, not a grey app. The ground is a warm near-black with brown in
 * it, ink is warm off-white, and every accent moves the opposite way from the
 * light scheme: the base lightens so it can carry text, the soft tint darkens so
 * it can carry a surface. Marigold is the one colour that barely moves — Dot
 * looks the same at 3am as at noon.
 */
const DARK: Palette = {
  // Ground
  paper: '#17130F',
  paperDeep: '#100D0A',
  card: '#241F19',
  cardSunk: '#1B1712',
  // Light carries a raised surface on shadow alone; in the dark there is no
  // shadow to see, so it has to be a step lighter than the card itself.
  raised: '#332B22',

  // Ink
  ink: '#F3EDE3',
  inkSoft: '#B5AA9C',
  inkFaint: '#877D71',
  line: '#342C24',
  lineSoft: '#28221B',

  // Dot's marigold
  dot: '#E8B75E',
  dotDeep: '#F1CA84',
  dotSoft: '#3A2D16',
  bill: '#E39A4B',
  billDeep: '#EFB273',

  // Accents
  blue: '#8FAFD6',
  blueSoft: '#1D2530',
  sage: '#82C29E',
  sageSoft: '#18251E',
  clay: '#D09C6D',
  claySoft: '#291F17',
  rose: '#E0938C',
  roseSoft: '#2C1D1B',
  plum: '#B29EDB',
  plumSoft: '#231D2E',
  teal: '#73BEC5',
  tealSoft: '#152524',
  moss: '#A7BC7E',
  mossSoft: '#1F2419',
  gold: '#DCB26D',
  goldSoft: '#292116',

  // States
  danger: '#E58474',
  dangerSoft: '#301D1A',
  scrim: 'rgba(23,19,15,0.78)',
  backdrop: 'rgba(0,0,0,0.62)',
  // Sits on an accent-coloured button, so it is really "the colour text takes on
  // top of an accent" — on dark those accents are light, and need dark text.
  white: '#17130F',
};

const SCHEMES = { light: LIGHT, dark: DARK };
export type SchemeName = keyof typeof SCHEMES;

let active: Palette = LIGHT;
let activeName: SchemeName = 'light';

/** Switch the whole app over. Components read `palette` live, so this is all it takes. */
export function applyScheme(name: SchemeName) {
  active = SCHEMES[name];
  activeName = name;
}

export const isDark = () => activeName === 'dark';

/**
 * A live view of whichever scheme is active. Every key is a getter, so a style
 * written as `{ color: palette.ink }` picks up the current scheme at the moment
 * it renders — no component has to thread a theme object through its props.
 */
export const palette = {} as Palette;
for (const key of Object.keys(LIGHT) as (keyof Palette)[]) {
  Object.defineProperty(palette, key, { get: () => active[key], enumerable: true });
}

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
  get rest() {
    return {
      shadowColor: isDark() ? '#000000' : '#3A2E1E',
      shadowOpacity: isDark() ? 0.3 : 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 1,
    };
  },
  get lift() {
    return {
      shadowColor: isDark() ? '#000000' : '#3A2E1E',
      shadowOpacity: isDark() ? 0.5 : 0.13,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    };
  },
};

// Each includes a web-safe fallback stack (RN Web renders these as CSS font-family
// lists; native ignores the extra names) so text stays legible even if the custom
// typeface never loads — no gate should ever depend on these actually resolving.
export const font = {
  display: 'Fraunces_600SemiBold, Georgia, serif',
  displayBold: 'Fraunces_700Bold, Georgia, serif',
  body: 'NunitoSans_400Regular, -apple-system, Helvetica, Arial, sans-serif',
  bodyMed: 'NunitoSans_600SemiBold, -apple-system, Helvetica, Arial, sans-serif',
  bodyBold: 'NunitoSans_700Bold, -apple-system, Helvetica, Arial, sans-serif',
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
