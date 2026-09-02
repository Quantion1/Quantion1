import React from 'react';
import { Text, View } from 'react-native';

import { accent, AccentName, palette, radius } from '@/theme';

export function StatTile({
  emoji,
  value,
  label,
  tone = 'sky',
  sub,
  flex = 1,
}: {
  emoji: string;
  value: string;
  label: string;
  tone?: AccentName;
  sub?: string;
  flex?: number;
}) {
  const a = accent(tone);
  return (
    <View
      style={{
        flex,
        backgroundColor: a.soft,
        borderRadius: radius.lg,
        padding: 14,
        gap: 2,
        minWidth: 100,
      }}
    >
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={{ fontSize: 22, fontWeight: '900', color: a.dark, letterSpacing: -0.6 }}>{value}</Text>
      <Text style={{ fontSize: 11, fontWeight: '800', color: palette.inkSoft }}>{label}</Text>
      {!!sub && <Text style={{ fontSize: 10, fontWeight: '700', color: palette.inkFaint }}>{sub}</Text>}
    </View>
  );
}
