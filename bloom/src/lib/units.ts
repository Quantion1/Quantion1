import type { UnitSystem } from '@/domain/types';

export const kgToLb = (kg: number) => kg * 2.20462;
export const lbToKg = (lb: number) => lb / 2.20462;
export const cmToIn = (cm: number) => cm / 2.54;
export const inToCm = (i: number) => i * 2.54;
export const mlToOz = (ml: number) => ml / 29.5735;
export const ozToMl = (oz: number) => oz * 29.5735;
export const cToF = (c: number) => c * 1.8 + 32;
export const fToC = (f: number) => (f - 32) / 1.8;

export function fmtWeight(kg: number | undefined, units: UnitSystem, digits = 2): string {
  if (kg == null) return '—';
  if (units === 'metric') return `${kg.toFixed(digits)} kg`;
  const total = kgToLb(kg);
  const lb = Math.floor(total);
  return `${lb} lb ${Math.round((total - lb) * 16)} oz`;
}

export const fmtLength = (cm: number | undefined, u: UnitSystem) =>
  cm == null ? '—' : u === 'metric' ? `${cm.toFixed(1)} cm` : `${cmToIn(cm).toFixed(1)} in`;

export const fmtVolume = (ml: number | undefined, u: UnitSystem) =>
  ml == null ? '—' : u === 'metric' ? `${Math.round(ml)} ml` : `${mlToOz(ml).toFixed(1)} oz`;

export const fmtTemp = (c: number | undefined, u: UnitSystem) =>
  c == null ? '—' : u === 'metric' ? `${c.toFixed(1)} °C` : `${cToF(c).toFixed(1)} °F`;

/** Convert a canonical (metric) value into the display unit for a given tracker unit label. */
export function toDisplay(value: number, unit: string, u: UnitSystem): { value: number; unit: string; step: number; decimals: number } {
  if (u === 'metric') {
    const decimals = unit.startsWith('kg') ? 2 : unit.startsWith('°C') ? 1 : 0;
    return { value, unit, step: unit.startsWith('kg') ? 0.01 : unit.startsWith('°C') ? 0.1 : 10, decimals };
  }
  if (unit.startsWith('kg')) return { value: kgToLb(value), unit: unit.replace('kg', 'lb'), step: 0.1, decimals: 1 };
  if (unit.startsWith('cm')) return { value: cmToIn(value), unit: unit.replace('cm', 'in'), step: 0.25, decimals: 1 };
  if (unit.startsWith('ml')) return { value: mlToOz(value), unit: unit.replace('ml', 'oz'), step: 0.5, decimals: 1 };
  if (unit.startsWith('°C')) return { value: cToF(value), unit: '°F', step: 0.1, decimals: 1 };
  return { value, unit, step: 1, decimals: 0 };
}

export function fromDisplay(value: number, unit: string, u: UnitSystem): number {
  if (u === 'metric') return value;
  if (unit.startsWith('kg')) return lbToKg(value);
  if (unit.startsWith('cm')) return inToCm(value);
  if (unit.startsWith('ml')) return ozToMl(value);
  if (unit.startsWith('°C')) return fToC(value);
  return value;
}
