import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { buildICS, type CalendarEvent } from './ics';

/**
 * Hands one event to whatever calendar the device already has, the same way
 * a website's own "add to calendar" link does — a file the OS already knows
 * how to open, never a direct write into the device's calendar. On web that
 * is a plain download; on a phone it is the native share sheet, so it lands
 * in Apple Calendar, Google Calendar, Outlook or whatever the person actually
 * uses.
 */
export async function exportToCalendar(event: CalendarEvent): Promise<void> {
  const ics = buildICS(event);
  const filename = `${event.uid}.ics`;

  if (Platform.OS === 'web') {
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const file = new File(Paths.cache, filename);
  if (file.exists) file.delete();
  file.create();
  file.write(ics);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: 'text/calendar', dialogTitle: event.title, UTI: 'com.apple.ical.ics' });
  }
}
