import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { addDays, MONTHS, toDayKey, WEEKDAY_INITIALS } from '@/lib/date';
import { palette, radius, type } from '@/theme';

import { tap } from './ui';

/**
 * A single month, tap-a-day picker — the visual half of choosing a date
 * without ever putting a permanent calendar on screen. It only appears while
 * you are actually picking a date, then closes back down to whatever it
 * called back with.
 */
export function MiniCalendarGrid({
  value, onChange, min, max,
}: {
  /** A YYYY-MM-DD key, or '' for nothing chosen yet. */
  value: string;
  onChange: (dayKey: string) => void;
  min?: Date;
  max?: Date;
}) {
  const seed = value ? new Date(value) : new Date();
  const [cursor, setCursor] = useState(() => new Date(seed.getFullYear(), seed.getMonth(), 1));

  const grid = (() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = addDays(first, -first.getDay());
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  })();

  const atStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const lo = min ? atStart(min) : undefined;
  const hi = max ? atStart(max) : undefined;

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => { tap(); setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)); }} hitSlop={12}>
          <Text style={{ fontSize: 16, color: palette.inkSoft }}>‹</Text>
        </Pressable>
        <Text style={{ ...type.bodyMed, color: palette.ink }}>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</Text>
        <Pressable onPress={() => { tap(); setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)); }} hitSlop={12}>
          <Text style={{ fontSize: 16, color: palette.inkSoft }}>›</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {WEEKDAY_INITIALS.map((d, i) => (
          <Text key={i} style={{ ...type.label, flex: 1, textAlign: 'center', color: palette.inkFaint }}>{d}</Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {grid.map((d) => {
          const key = toDayKey(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isSel = key === value;
          const at = atStart(d);
          const disabled = (!!lo && at < lo) || (!!hi && at > hi);
          return (
            <Pressable
              key={key}
              disabled={disabled}
              onPress={() => { tap(); onChange(key); }}
              style={{ width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <View
                style={{
                  width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isSel ? palette.ink : 'transparent',
                }}
              >
                <Text
                  style={{
                    ...type.body, fontSize: 13,
                    color: isSel ? palette.paper : disabled ? palette.inkFaint : inMonth ? palette.ink : palette.inkFaint,
                    opacity: disabled ? 0.4 : inMonth ? 1 : 0.5,
                  }}
                >
                  {d.getDate()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
