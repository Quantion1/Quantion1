import type { Entry, Settings } from './types';
import { formatDuration } from '@/lib/date';
import { fmtLength, fmtTemp, fmtVolume, fmtWeight } from '@/lib/units';
import { tracker } from './trackers';

const FACES = ['', '😞', '😕', '😐', '🙂', '😄'];

/** One line describing an entry, in the units the parent chose. */
export function describe(e: Entry, settings: Settings): { title: string; detail: string } {
  const t = tracker(e.tracker);
  switch (e.tracker) {
    case 'sleep':
      return { title: formatDuration(e.minutes ?? 0), detail: 'Sleep' };
    case 'breast':
      return {
        title: `${e.side === 'both' ? 'Both sides' : e.side === 'left' ? 'Left' : 'Right'} · ${formatDuration(e.minutes ?? 0)}`,
        detail: 'Breastfeed',
      };
    case 'bottle':
      return { title: fmtVolume(e.amount, settings.units), detail: e.kind ?? 'Bottle' };
    case 'diaper':
      return { title: e.kind ?? 'Change', detail: 'Diaper' };
    case 'weight':
      return { title: fmtWeight(e.amount, settings.units), detail: 'Weight' };
    case 'tummy':
      return { title: 'Tummy time', detail: 'Turtle flipped' };
    case 'temp':
      return { title: fmtTemp(e.amount, settings.units), detail: 'Temperature' };
    case 'vitd':
      return { title: 'Vitamin D given', detail: 'Daily' };
    case 'vitk':
      return { title: 'Vitamin K given', detail: 'Daily' };
    case 'solids':
      return { title: e.chips?.join(', ') || 'Solids', detail: e.kind ?? '' };
    case 'newfood':
      return { title: e.text || 'New food', detail: e.kind ?? '' };
    case 'teeth':
      return { title: e.text || 'A tooth', detail: 'Through' };
    case 'words':
      return { title: `“${e.text ?? ''}”`, detail: e.kind ?? 'Word' };
    case 'vax':
      return { title: e.text || 'Vaccination', detail: e.chips?.join(', ') || '' };
    case 'bmed':
      return { title: e.text || 'Medicine', detail: 'Given' };
    case 'pump':
      return { title: fmtVolume(e.amount, settings.units), detail: `Pumped · ${e.kind ?? ''}` };
    case 'msleep':
      return { title: formatDuration(e.minutes ?? 0), detail: `Your sleep ${FACES[e.face ?? 0] ?? ''}` };
    case 'water':
      return { title: fmtVolume(e.amount, settings.units), detail: e.kind ?? 'Drink' };
    case 'supp':
      return { title: e.checks?.join(', ') || 'Supplements', detail: 'Taken' };
    case 'med':
      return { title: e.text || 'Medication', detail: 'Taken' };
    case 'kicks':
      return { title: `${e.count ?? 0} kicks in ${formatDuration(e.minutes ?? 0)}`, detail: 'Kick session' };
    case 'contr':
      return { title: `${Math.round((e.minutes ?? 0) * 60)}s`, detail: 'Contraction' };
    case 'bump':
      return { title: 'Bump photo', detail: e.text || '' };
    case 'mwq':
      return { title: e.text || 'Question', detail: 'For the midwife' };
    case 'labour':
      return { title: e.text || 'Labour', detail: 'Timeline' };
    case 'birthrec':
      return { title: `${fmtWeight(e.amount, settings.units)} · ${fmtLength(e.amount2, settings.units)}`, detail: e.text || 'Birth record' };
    case 'memories':
      return { title: e.text || 'Memory', detail: 'Photo' };
    case 'note':
      return { title: e.text || 'Note', detail: 'Note' };
    default:
      return { title: t.label, detail: '' };
  }
}

/** The one-line status a home tile shows under its name. */
export function tileMeta(key: string, today: Entry[], all: Entry[], settings: Settings): string {
  const mine = today.filter((e) => e.tracker === key);
  const last = all.find((e) => e.tracker === key);
  switch (key) {
    case 'sleep': {
      const mins = mine.reduce((s, e) => s + (e.minutes ?? 0), 0);
      return mins ? `${formatDuration(mins)} today` : 'nothing yet';
    }
    case 'breast':
    case 'bottle':
      return mine.length ? `${mine.length} today` : 'nothing yet';
    case 'diaper':
      return mine.length ? `${mine.length} today` : 'nothing yet';
    case 'weight':
      return last ? fmtWeight(last.amount, settings.units) : 'no weight yet';
    case 'tummy':
      return mine.length ? `${mine.length}× today` : 'tap the turtle';
    case 'vitd':
    case 'vitk':
      return mine.length ? 'given today' : 'not yet today';
    case 'water': {
      const ml = mine.reduce((s, e) => s + (e.amount ?? 0), 0);
      return ml ? fmtVolume(ml, settings.units) : 'nothing yet';
    }
    case 'msleep': {
      const mins = mine.reduce((s, e) => s + (e.minutes ?? 0), 0);
      return mins ? formatDuration(mins) : 'last night?';
    }
    case 'kicks': {
      const c = mine.reduce((s, e) => s + (e.count ?? 0), 0);
      return c ? `${c} today` : 'tap to count';
    }
    case 'mwq': {
      const open = all.filter((e) => e.tracker === 'mwq').length;
      return open ? `${open} saved` : 'add one';
    }
    default:
      return mine.length ? `${mine.length} today` : 'tap to log';
  }
}
