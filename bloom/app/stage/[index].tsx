import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { StatTile } from '@/components/StatTile';
import { Body, Button3D, Card, Heading, Label, Title } from '@/components/ui';
import { monthInfo } from '@/domain/baby';
import { weekInfo } from '@/domain/pregnancy';
import { useJourneyContext } from '@/state/hooks';
import { useProfile, usePremium } from '@/state/store';
import { palette, radius } from '@/theme';

export default function StageScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const router = useRouter();
  const profile = useProfile();
  const premium = usePremium();
  const ctx = useJourneyContext();
  const i = Number(index);

  const isCurrent = i === ctx.index;
  const locked = !premium && !isCurrent;

  const pregnancy = profile.mode === 'pregnancy';
  const w = pregnancy ? weekInfo(i) : null;
  const m = pregnancy ? null : monthInfo(i);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16 }}>
        <Pressable onPress={() => router.back()} hitSlop={14}>
          <Text style={{ fontSize: 22, fontWeight: '900', color: palette.inkFaint }}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 16, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 68 }}>{pregnancy ? w!.emoji : m!.emoji}</Text>
          <Title style={{ fontSize: 28 }}>{pregnancy ? `Week ${w!.week}` : m!.title}</Title>
          {isCurrent && (
            <View style={{ backgroundColor: palette.sunnySoft, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 }}>
              <Text style={{ fontSize: 11, fontWeight: '900', color: palette.sunnyDark }}>YOU ARE HERE</Text>
            </View>
          )}
        </View>

        {locked ? (
          <Card style={{ alignItems: 'center', gap: 12, paddingVertical: 28 }}>
            <Mascot size={90} mood="happy" />
            <Heading>Locked</Heading>
            <Body style={{ textAlign: 'center' }}>
              Free covers the stage you are in right now. Premium opens all 40 pregnancy weeks and the full first year —
              read ahead or look back whenever you like.
            </Body>
            <Button3D title="Unlock all stages" tone="grape" icon="👑" onPress={() => router.push('/paywall')} />
          </Card>
        ) : pregnancy ? (
          <>
            <Card tone="blossom">
              <Heading>About this week</Heading>
              <Body style={{ marginTop: 6, fontSize: 15, color: palette.ink }}>{w!.headline}</Body>
            </Card>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <StatTile emoji="🍒" tone="blossom" value={w!.size} label="Size of a" />
              <StatTile emoji="📏" tone="sky" value={`${w!.lengthCm} cm`} label="Length" />
              <StatTile emoji="⚖️" tone="mint" value={w!.weightG >= 1000 ? `${(w!.weightG / 1000).toFixed(2)} kg` : `${w!.weightG} g`} label="Weight" />
            </View>
            <Card tone="sunny">
              <Heading>💡 This week’s tip</Heading>
              <Body style={{ marginTop: 6 }}>{w!.tip}</Body>
            </Card>
          </>
        ) : (
          <>
            <Card tone="sky">
              <Heading>What’s going on</Heading>
              <Body style={{ marginTop: 6, fontSize: 15, color: palette.ink }}>{m!.headline}</Body>
            </Card>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <StatTile emoji="😴" tone="grape" value={`${m!.sleepLow}–${m!.sleepHigh}h`} label="Sleep / 24h" />
              <StatTile emoji="🍼" tone="sky" value={`${m!.feedsLow}–${m!.feedsHigh}`} label="Feeds / day" />
              <StatTile emoji="⏰" tone="mint" value={`${m!.wakeWindowMin}–${m!.wakeWindowMax}m`} label="Wake window" />
            </View>
            <Card>
              <Heading>Typical milestones</Heading>
              <View style={{ marginTop: 10, gap: 8 }}>
                {m!.milestones.map((x) => (
                  <View key={x} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text>🏆</Text>
                    <Body style={{ flex: 1, color: palette.ink }}>{x}</Body>
                  </View>
                ))}
              </View>
              <Label style={{ marginTop: 12 }}>Every baby has their own timeline. These are ranges, not deadlines.</Label>
            </Card>
            <Card tone="sunny">
              <Heading>💡 Tip</Heading>
              <Body style={{ marginTop: 6 }}>{m!.tip}</Body>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
