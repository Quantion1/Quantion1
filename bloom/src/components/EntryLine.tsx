import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { describe } from '@/domain/describe';
import { tracker } from '@/domain/trackers';
import type { Entry } from '@/domain/types';
import { formatRelative, formatTime } from '@/lib/date';
import { useSettings } from '@/state/store';
import { accent, palette, radius, type } from '@/theme';
import { tap } from './ui';

export function EntryLine({ entry, onPress, relative }: { entry: Entry; onPress?: () => void; relative?: boolean }) {
  const settings = useSettings();
  const t = tracker(entry.tracker);
  const a = accent(t.accent);
  const { title, detail } = describe(entry, settings);

  return (
    <Pressable
      onPress={onPress ? () => { tap(); onPress(); } : undefined}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 }}
    >
      <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: a.soft, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16 }}>{t.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...type.bodyMed, fontSize: 14, color: palette.ink }} numberOfLines={1}>{title}</Text>
        <Text style={{ ...type.small, fontSize: 12, color: palette.inkFaint }} numberOfLines={1}>
          {detail}{entry.note ? ` · ${entry.note}` : ''}
        </Text>
      </View>
      <Text style={{ ...type.label, color: palette.inkFaint }}>
        {relative ? formatRelative(entry.at) : formatTime(entry.at, settings.clock24h)}
      </Text>
    </Pressable>
  );
}
