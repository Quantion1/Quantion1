import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardFace } from '@/components/CardFace';
import { Body, Button, Card, Heading, Small, styles, tap } from '@/components/ui';
import { cardFor, weekStory } from '@/domain/cards';
import { useNest } from '@/state/hooks';
import { useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

/**
 * The back of a weekly card: what was being built in there that week, and the
 * drier half of the same story. Opening a card you have reached collects it —
 * reaching the week is the whole of the earning, so there is no reason to make
 * the parent tap twice.
 */
export default function CardScreen() {
  useScheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ week: string }>();
  const week = Math.min(40, Math.max(4, Number(params.week) || 4));
  const nest = useNest();
  const progress = useStore((s) => s.progress);
  const collectCard = useStore((s) => s.collectCard);

  const card = cardFor(progress.activePack, week);
  const story = weekStory(week);
  // Past the birth the whole album is open, so nothing is left to reach.
  const reached = nest.stage === 'baby' || week <= nest.week;

  useEffect(() => {
    if (reached && !progress.cards.includes(week)) collectCard(week);
  }, [reached, week, progress.cards, collectCard]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...type.label, color: palette.inkSoft, flex: 1 }}>Week {week} card</Text>
          <Pressable onPress={() => { tap(); router.back(); }} hitSlop={12}>
            <Text style={{ ...type.label, color: palette.inkSoft }}>CLOSE</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', gap: 10, paddingVertical: 4 }}>
          <CardFace card={card} collected={reached} size="lg" />
          {!reached && <Small>Not there yet — this one arrives in week {week}.</Small>}
        </View>

        {reached && (
          <>
            <Card tint={palette.dotSoft}>
              <Text style={{ ...type.label, color: palette.dotDeep }}>What is happening</Text>
              <Body style={{ marginTop: 6 }}>{story.body}</Body>
            </Card>

            <Card>
              <Text style={{ ...type.label, color: palette.inkSoft }}>The small print</Text>
              <Body style={{ marginTop: 6 }}>{story.wry}</Body>
            </Card>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Fact label="Length" value={`${card.lengthCm} cm`} />
              <Fact label="Weight" value={card.weightG >= 1000 ? `${(card.weightG / 1000).toFixed(2)} kg` : `${card.weightG} g`} />
              <Fact label="Measured" value={week < 20 ? 'crown to rump' : 'head to heel'} />
            </View>
          </>
        )}

        <Button title="Back to the album" tone="quiet" full onPress={() => { tap(); router.back(); }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, gap: 2, padding: 12, borderRadius: radius.md, backgroundColor: palette.cardSunk }}>
      <Text style={{ ...type.label, fontSize: 9, color: palette.inkFaint }}>{label.toUpperCase()}</Text>
      <Text style={{ ...type.bodyMed, fontSize: 13, color: palette.ink }}>{value}</Text>
    </View>
  );
}
