import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body, Button, Label, Section, Small, Title, tap } from '@/components/ui';
import type { Tracker } from '@/domain/types';
import { useLibrary, useNest } from '@/state/hooks';
import { useStore } from '@/state/store';
import { accent, palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

/**
 * The tile library. Sorting by *when a tracker is relevant* is what lets the
 * home screen shrink as well as grow — teeth appear at three months, vitamin K
 * retires at three months, and neither needs a decision from the parent.
 */
export default function Library() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const router = useRouter();
  const lib = useLibrary();
  const nest = useNest();
  const addTile = useStore((s) => s.addTile);
  const removeTile = useStore((s) => s.removeTile);

  const group = (title: string, note: string, list: Tracker[], dim = false) =>
    list.length ? (
      <Section title={title} key={title}>
        <Small style={{ marginTop: -4, marginBottom: 4 }}>{note}</Small>
        <View style={{ gap: 8 }}>
          {list.map((t) => {
            const on = lib.onHome.has(t.key);
            const a = accent(t.accent);
            return (
              <View
                key={t.key}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
                  borderRadius: radius.md, backgroundColor: palette.card,
                  borderWidth: 1, borderColor: palette.line, opacity: dim ? 0.62 : 1,
                }}
              >
                <View style={{ width: 38, height: 38, borderRadius: radius.sm, backgroundColor: a.soft, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>{t.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...type.bodyMed, color: palette.ink }}>{t.label}</Text>
                  <Small numberOfLines={1}>{t.blurb}</Small>
                </View>
                <Pressable
                  onPress={() => { tap(); on ? removeTile(t.key) : addTile(t.key); }}
                  style={{
                    paddingHorizontal: 13, paddingVertical: 7, borderRadius: radius.pill,
                    backgroundColor: on ? palette.cardSunk : palette.ink,
                    borderWidth: on ? 1 : 0, borderColor: palette.line,
                  }}
                >
                  <Text style={{ ...type.label, color: on ? palette.inkSoft : palette.paper }}>
                    {on ? 'ON HOME' : 'ADD'}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </Section>
    ) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.paper }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 }}>
        <View>
          <Title>Tile library</Title>
          <Small>{nest.stage === 'pregnancy' ? `Week ${nest.week}` : `Day ${nest.days}`}</Small>
        </View>
        <Pressable onPress={() => { tap(); router.back(); }} hitSlop={14}>
          <Text style={{ fontSize: 20, color: palette.inkFaint }}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: 0, gap: 22, paddingBottom: 40 }}>
        <Body>
          Everything here knows when it matters. Trackers move themselves between these lists as the weeks pass — you
          are never scrolling past teething at four days old.
        </Body>

        {group('Suggested now', 'Relevant at this exact point.', lib.now)}
        {group('Not yet', 'These will move up on their own.', lib.later, true)}
        {group('Retired', 'Past their window. Add them back if you disagree.', lib.retired, true)}

        <Button title="Done" tone="ink" full onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}
