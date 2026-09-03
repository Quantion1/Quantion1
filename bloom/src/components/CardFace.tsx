import React from 'react';
import { Text, View } from 'react-native';

import type { Card } from '@/domain/cards';
import { palette, radius, shadow, type } from '@/theme';
import { Small } from './ui';

/** A weekly collectible. Uncollected cards show as a blank slot in the album. */
export function CardFace({
  card, collected, size = 'md',
}: {
  card: Card;
  collected: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const w = size === 'sm' ? 84 : size === 'lg' ? 240 : 120;
  const h = w * 1.42;

  if (!collected) {
    return (
      <View
        style={{
          width: w, height: h, borderRadius: radius.md,
          borderWidth: 1.5, borderColor: palette.line, borderStyle: 'dashed',
          backgroundColor: palette.cardSunk, alignItems: 'center', justifyContent: 'center', gap: 4,
        }}
      >
        <Text style={{ ...type.label, color: palette.inkFaint }}>WK {card.week}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          width: w, height: h, borderRadius: radius.md, overflow: 'hidden',
          backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line,
        },
        shadow.rest,
      ]}
    >
      <View style={{ backgroundColor: palette.dotSoft, paddingVertical: 5, alignItems: 'center' }}>
        <Text style={{ ...type.label, color: palette.dotDeep }}>WEEK {card.week}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: size === 'lg' ? 68 : size === 'sm' ? 26 : 38 }}>{card.emoji}</Text>
      </View>
      <View style={{ paddingHorizontal: 8, paddingBottom: 8, gap: 1 }}>
        <Text
          style={{ ...type.bodyMed, fontSize: size === 'lg' ? 15 : 11, color: palette.ink, textAlign: 'center' }}
          numberOfLines={size === 'lg' ? 3 : 2}
        >
          {card.size}
        </Text>
        <Small style={{ textAlign: 'center', fontSize: size === 'lg' ? 12 : 9.5 }}>
          {card.lengthCm} cm · {card.weightG >= 1000 ? `${(card.weightG / 1000).toFixed(2)} kg` : `${card.weightG} g`}
        </Small>
      </View>
    </View>
  );
}
