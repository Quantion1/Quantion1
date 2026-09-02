import type { UnitSystem } from '@/domain/types';

export const kgToLb = (kg: number) => kg * 2.20462;
export const lbToKg = (lb: number) => lb / 2.20462;
export const cmToIn = (cm: number) => cm / 2.54;
export const inToCm = (i: number) => i * 2.54;
export const mlToOz = (ml: number) => ml / 29.5735;
export const ozToMl = (oz: number) => oz * 29.5735;

export function fmtWeight(kg: number | undefined, units: UnitSystem, digits = 1): string {
  if (kg == null) return '—';
  if (units === 'metric') return `${kg.toFixed(digits)} kg`;
  const totalLb = kgToLb(kg);
  const lb = Math.floor(totalLb);
  const oz = Math.round((totalLb - lb) * 16);
  return `${lb} lb ${oz} oz`;
}

export function fmtLength(cm: number | undefined, units: UnitSystem): string {
  if (cm == null) return '—';
  return units === 'metric' ? `${cm.toFixed(1)} cm` : `${cmToIn(cm).toFixed(1)} in`;
}

export function fmtVolume(ml: number | undefined, units: UnitSystem): string {
  if (ml == null) return '—';
  return units === 'metric' ? `${Math.round(ml)} ml` : `${mlToOz(ml).toFixed(1)} oz`;
}

export const weightUnit = (u: UnitSystem) => (u === 'metric' ? 'kg' : 'lb');
export const lengthUnit = (u: UnitSystem) => (u === 'metric' ? 'cm' : 'in');
export const volumeUnit = (u: UnitSystem) => (u === 'metric' ? 'ml' : 'oz');
