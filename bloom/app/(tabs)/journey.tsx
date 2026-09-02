import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { ProgressBar } from '@/components/ProgressRing';
import { TopBar } from '@/components/TopBar';
import { Body, Card, Heading, Label, Title, styles, tap } from '@/components/ui';
import { BABY_MONTHS } from '@/domain/baby';
import { evaluateBadges } from '@/domain/badges';
import { PREGNANCY_WEEKS } from '@/domain/pregnancy';
import { useJourneyContext } from '@/state/hooks';
import { useGame, useProfile, useStore } from '@/state/store';
import { palette, radius, shadow } from '@/theme';

export default function JourneyScreen() {
  const router = useRouter();
  const profile = useProfile();
  const game = useGame();
  const entries = useStore((s) => s.entries);
  const ctx = useJourneyContext();
  const { width } = useWindowDimensions();

  const nodes = useMemo(
    () =>
      profile.mode === 'pregnancy'
        ? PREGNANCY_WEEKS.map((w) => ({ index: w.week, label: `W${w.week}`, emoji: w.emoji, title: `Week ${w.week}`, sub: w.size }))
        : BABY_MONTHS.map((m) => ({ index: m.month, label: m.month === 0 ? 'NB' : `${m.month}M`, emoji: m.emoji, title: m.title, sub: m.headline.slice(0, 28) + '…' })),
    [profile.mode],
  );

  const badges = useMemo(() => evaluateBadges({ entries, game, profile }), [entries, game, profile]);
  const unlocked = badges.filter((b) => b.done);

  const current = ctx.index;
  const amplitude = Math.min(90, width * 0.22);
  const offsetAt = (i: number) => Math.sin(i * 0.9) * amplitude;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 4 }}>
          <Title>Journey</Title>
          <Body>{profile.mode === 'pregnancy' ? 'Week by week to the due date.' : 'Month by month through the first year.'}</Body>
        </View>

        <Card tone="sunny">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Mascot size={70} mood="proud" />
            <View style={{ flex: 1, gap: 6 }}>
              <Heading>{ctx.stageLabel}</Heading>
              <ProgressBar progress={ctx.progress} color={palette.sunny} height={12} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: palette.inkSoft }}>{ctx.stageSub}</Text>
            </View>
          </View>
        </Card>

        {/* --------------------------------------------------------- path */}
        <View style={{ paddingVertical: 10 }}>
          {nodes.map((n, i) => {
            const state = n.index < current ? 'done' : n.index === current ? 'current' : 'locked';
            const offset = offsetAt(i);
            const color = state === 'done' ? palette.mint : state === 'current' ? palette.sunny : palette.cloud;
            const dark = state === 'done' ? palette.mintDark : state === 'current' ? palette.sunnyDark : palette.line;
            const checkpoint = i > 0 && i % 5 === 0;

            return (
              <View key={n.index} style={{ alignItems: 'center', marginBottom: 6 }}>
                {state === 'current' && (
                  <View
                    style={{
                      transform: [{ translateX: offset }],
                      backgroundColor: palette.white,
                      borderWidth: 2,
                      borderColor: palette.sunny,
                      borderRadius: radius.pill,
                      paddingHorizontal: 12,
                      paddingVertical: 5,
                      marginBottom: 6,
                      ...shadow.card,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '900', color: palette.sunnyDark }}>YOU ARE HERE</Text>
                  </View>
                )}
                <Pressable
                  onPress={() => {
                    tap();
                    router.push(`/stage/${n.index}`);
                  }}
                  style={{
                    transform: [{ translateX: offset }],
                    width: state === 'current' ? 78 : 64,
                    height: state === 'current' ? 78 : 64,
                    borderRadius: 40,
                    backgroundColor: color,
                    borderBottomWidth: 6,
                    borderBottomColor: dark,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: state === 'current' ? 30 : 24, opacity: state === 'locked' ? 0.35 : 1 }}>
                    {state === 'locked' ? '🔒' : n.emoji}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '900',
                      color: state === 'locked' ? palette.inkFaint : palette.white,
                      marginTop: 1,
                    }}
                  >
                    {n.label}
                  </Text>
                </Pressable>
                {i < nodes.length - 1 && !checkpoint && (
                  <View style={{ paddingVertical: 6, gap: 7 }}>
                    {[0.33, 0.66].map((t) => (
                      <View
                        key={t}
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: 5,
                          backgroundColor: nodes[i + 1].index <= current ? palette.mint : palette.line,
                          opacity: nodes[i + 1].index <= current ? 0.5 : 1,
                          transform: [{ translateX: offset + (offsetAt(i + 1) - offset) * t }],
                        }}
                      />
                    ))}
                  </View>
                )}
                {checkpoint && (
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: n.index <= current ? palette.grapeSoft : palette.cloud,
                      borderRadius: radius.pill,
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{n.index <= current ? '🎁' : '📦'}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: n.index <= current ? palette.grapeDark : palette.inkFaint }}>
                      Checkpoint chest
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ------------------------------------------------------- badges */}
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Label>Badges</Label>
            <Text style={{ fontSize: 11, fontWeight: '900', color: palette.inkFaint }}>
              {unlocked.length} / {badges.length}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {badges.map((b) => (
              <View
                key={b.def.id}
                style={{
                  width: '30.5%',
                  aspectRatio: 0.86,
                  borderRadius: radius.lg,
                  backgroundColor: b.done ? palette.white : palette.cloud,
                  borderWidth: 2,
                  borderColor: b.done ? palette.sunny : palette.line,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 26, opacity: b.done ? 1 : 0.3 }}>{b.def.emoji}</Text>
                <Text style={{ fontSize: 10, fontWeight: '900', color: b.done ? palette.ink : palette.inkFaint, textAlign: 'center' }}>
                  {b.def.name}
                </Text>
                {!b.done && (
                  <Text style={{ fontSize: 9, fontWeight: '800', color: palette.inkFaint }}>
                    {b.current}/{b.target}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
