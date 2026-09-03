import React from 'react';
import { Text, View } from 'react-native';

import type { Ask } from '@/domain/moments';
import { usually } from '@/domain/moments';
import type { Stage } from '@/domain/types';
import { palette, radius, shadow, type } from '@/theme';
import { Body, Button, Heading, Label } from './ui';

/**
 * The only thing the app ever asks for. Two flavours: something your own logs
 * already prove, which is a celebration waiting to be opened, and something
 * that is merely plausible, which is a question. Saying "not yet" costs
 * nothing and it comes back tomorrow.
 */
export function MomentPrompt({
  ask, stage, onOpen, onSnooze,
}: {
  ask: Ask;
  stage: Stage;
  onOpen: () => void;
  onSnooze: () => void;
}) {
  const { moment, noticed } = ask;

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
        <Text style={{ fontSize: 22 }}>{moment.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Label style={{ color: palette.dotDeep }}>
            {noticed ? 'A moment, unlocked' : `A moment · usually ${usually(stage, moment.openFrom)}`}
          </Label>
          <Heading>{moment.title}</Heading>
        </View>
      </View>

      <Body style={{ ...type.body, color: palette.ink }}>
        {noticed ? 'Your own logs say this has already happened. It is waiting to be added.' : moment.question}
      </Body>

      {noticed ? (
        <Button title="Open it" tone="dot" size="sm" onPress={onOpen} style={{ marginTop: 2 }} full />
      ) : (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
          <Button title="Not yet" tone="quiet" size="sm" onPress={onSnooze} style={{ flex: 1 }} />
          <Button title="Yes, that happened" tone="dot" size="sm" onPress={onOpen} style={{ flex: 1.6 }} />
        </View>
      )}
    </View>
  );
}
