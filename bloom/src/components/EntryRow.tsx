import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { describeEntry } from '@/domain/describe';
import { logTypeConfig } from '@/domain/logTypes';
import type { Entry } from '@/domain/types';
import { formatRelative, formatTime } from '@/lib/date';
import { useSettings } from '@/state/store';
import { accent, palette, radius } from '@/theme';
import { tap } from './ui';

export function EntryRow({
  entry,
  onPress,
  showRelative,
}: {
  entry: Entry;
  onPress?: () => void;
  showRelative?: boolean;
}) {
  const settings = useSettings();
  const cfg = logTypeConfig(entry.type);
  const a = accent(cfg.accent);
  const { title, detail } = describeEntry(entry, settings);

  return (
    <Pressable
      onPress={
        onPress
          ? () => {
              tap();
              onPress();
            }
          : undefined
      }
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.sm,
          backgroundColor: a.soft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 19 }}>{cfg.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '800', color: palette.ink }} numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '700', color: palette.inkFaint }} numberOfLines={1}>
          {detail}
          {entry.note ? ` · ${entry.note}` : ''}
        </Text>
      </View>
      <Text style={{ fontSize: 11, fontWeight: '800', color: palette.inkFaint }}>
        {showRelative ? formatRelative(entry.at) : formatTime(entry.at, settings.clock24h)}
      </Text>
    </Pressable>
  );
}
