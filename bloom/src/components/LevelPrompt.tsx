import React from 'react';
import { Text, View } from 'react-native';

import type { Level } from '@/domain/levels';
import { palette, radius, shadow, type } from '@/theme';
import { Body, Button, Heading, Label } from './ui';

/**
 * The core loop, in one card. The app never awards a level — it notices that
 * one might be due and asks. Saying "not yet" costs nothing and it comes back
 * tomorrow.
 */
export function LevelPrompt({
  level, order, total, position, stage, onClaim, onSnooze,
}: {
  level: Level;
  order: number;
  total: number;
  position: number;
  stage: 'pregnancy' | 'baby';
  onClaim: () => void;
  onSnooze: () => void;
}) {
  const unit = stage === 'pregnancy' ? `week ${level.openFrom}` : `day ${level.openFrom}`;
  const early = position < level.openFrom;

  return (
    <View
      style={[
        {
          backgroundColor: palette.dotSoft,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: palette.dot,
          padding: 16,
          gap: 10,
        },
        shadow.rest,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 22 }}>{level.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Label style={{ color: palette.dotDeep }}>
            Level {order} of {total} · from {unit}
          </Label>
          <Heading>{level.title}</Heading>
        </View>
      </View>

      <Body style={{ ...type.body, color: palette.ink }}>{level.question}</Body>
      {early && <Body style={{ fontSize: 13 }}>Early, but you would know better than the calendar.</Body>}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
        <Button title="Not yet" tone="quiet" size="sm" onPress={onSnooze} style={{ flex: 1 }} />
        <Button title="Yes — level up" tone="dot" size="sm" onPress={onClaim} style={{ flex: 1.6 }} />
      </View>
    </View>
  );
}
