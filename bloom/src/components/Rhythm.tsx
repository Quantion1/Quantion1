import React from 'react';
import { Text, View } from 'react-native';

import { fromDayKey, WEEKDAY_INITIALS } from '@/lib/date';
import { palette, type } from '@/theme';

/**
 * Seven days, filled or not. There is no streak to break, no freeze to buy and
 * nothing to lose — a bad week is information, not a punishment.
 */
export function Rhythm({ marks, size = 22 }: { marks: { day: string; on: boolean }[]; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 7 }}>
      {marks.map((m) => (
        <View key={m.day} style={{ alignItems: 'center', gap: 4 }}>
          <View
            style={{
              width: size, height: size, borderRadius: size / 2,
              backgroundColor: m.on ? palette.dot : 'transparent',
              borderWidth: m.on ? 0 : 1.5,
              borderColor: palette.line,
            }}
          />
          <Text style={{ ...type.label, fontSize: 9, color: palette.inkFaint }}>
            {WEEKDAY_INITIALS[fromDayKey(m.day).getDay()]}
          </Text>
        </View>
      ))}
    </View>
  );
}
