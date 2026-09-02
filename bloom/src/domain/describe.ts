import type { Entry, Settings } from '@/domain/types';
import { formatDuration } from '@/lib/date';
import { fmtLength, fmtVolume, fmtWeight } from '@/lib/units';
import { logTypeConfig } from './logTypes';

const MOODS = ['', '😖', '🙁', '😐', '🙂', '😄'];

export function describeEntry(e: Entry, settings: Settings): { title: string; detail: string } {
  const cfg = logTypeConfig(e.type);
  switch (e.type) {
    case 'feed':
      return {
        title:
          e.method === 'bottle'
            ? `Bottle · ${fmtVolume(e.ml, settings.units)}`
            : e.method === 'solids'
              ? 'Solids'
              : `${e.method === 'left' ? 'Left' : 'Right'} breast · ${formatDuration(e.minutes ?? 0)}`,
        detail: 'Feeding',
      };
    case 'sleep':
      return {
        title: `${e.kind === 'night' ? 'Night sleep' : 'Nap'} · ${formatDuration(e.minutes)}`,
        detail: e.wakings ? `${e.wakings} waking${e.wakings > 1 ? 's' : ''}` : 'Sleep',
      };
    case 'diaper':
      return { title: `Diaper · ${e.kind}`, detail: 'Change' };
    case 'growth':
      return {
        title: [
          e.weightKg != null ? fmtWeight(e.weightKg, settings.units) : null,
          e.lengthCm != null ? fmtLength(e.lengthCm, settings.units) : null,
        ]
          .filter(Boolean)
          .join(' · '),
        detail: e.headCm != null ? `head ${fmtLength(e.headCm, settings.units)}` : 'Growth',
      };
    case 'babyMood':
      return { title: `${MOODS[e.mood] ?? '🙂'} Mood ${e.mood}/5`, detail: e.tags.join(', ') || 'Daily check-in' };
    case 'milestone':
      return { title: e.key, detail: 'Milestone' };
    case 'symptom':
      return {
        title: e.symptoms.length ? e.symptoms.join(', ') : 'No symptoms',
        detail: `${MOODS[e.mood] ?? ''} mood ${e.mood}/5 · severity ${e.severity}/5`,
      };
    case 'weight':
      return { title: fmtWeight(e.kg, settings.units), detail: 'Weigh-in' };
    case 'kicks':
      return { title: `${e.count} kicks in ${formatDuration(e.durationMin)}`, detail: 'Kick session' };
    case 'contraction':
      return {
        title: `${Math.round(e.durationSec)}s contraction`,
        detail: e.intervalSec ? `${Math.round(e.intervalSec / 60)}m apart` : 'Timed',
      };
    case 'appointment':
      return { title: e.title, detail: e.kind };
    default:
      return { title: cfg.label, detail: '' };
  }
}
