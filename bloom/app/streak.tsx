import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { StatTile } from '@/components/StatTile';
import { Body, Button3D, Card, Heading, Label, Title, success } from '@/components/ui';
import { fromDayKey, lastNDayKeys, WEEKDAY_INITIALS } from '@/lib/date';
import { useGame, useSettings, useStore, usePremium } from '@/state/store';
import { palette, radius } from '@/theme';

const FREEZE_COST = 60;

export default function StreakScreen() {
  const router = useRouter();
  const game = useGame();
  const settings = useSettings();
  const premium = usePremium();
  const setGame = useStore.setState;

  const days = lastNDayKeys(28);

  const buyFreeze = () => {
    if (game.gems < FREEZE_COST) return;
    setGame((s) => ({ game: { ...s.game, gems: s.game.gems - FREEZE_COST, streakFreezes: s.game.streakFreezes + 1 } }));
    success();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16 }}>
        <Pressable onPress={() => router.back()} hitSlop={14}>
          <Text style={{ fontSize: 22, fontWeight: '900', color: palette.inkFaint }}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 16, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 72 }}>🔥</Text>
          <Title style={{ fontSize: 44 }}>{game.streak}</Title>
          <Heading>day streak</Heading>
          <Body style={{ textAlign: 'center', maxWidth: 300 }}>
            Log at least {settings.dailyGoalXp} XP each day. Miss one and a freeze covers you automatically.
          </Body>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <StatTile emoji="🏆" tone="sunny" value={`${game.longestStreak}`} label="Longest streak" />
          <StatTile emoji="❄️" tone="sky" value={`${game.streakFreezes}`} label="Freezes left" />
          <StatTile emoji="💎" tone="grape" value={`${game.gems}`} label="Gems" />
        </View>

        <Card>
          <Heading>Last 4 weeks</Heading>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {days.map((k) => {
              const met = (game.xpByDay[k] ?? 0) >= settings.dailyGoalXp;
              const partial = (game.xpByDay[k] ?? 0) > 0 && !met;
              const frozen = game.freezeDaysUsed.includes(k);
              return (
                <View key={k} style={{ width: '12.4%', alignItems: 'center', gap: 3 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: met ? palette.coral : frozen ? palette.skySoft : partial ? palette.sunnySoft : palette.cloud,
                    }}
                  >
                    <Text style={{ fontSize: 13 }}>{met ? '🔥' : frozen ? '❄️' : partial ? '·' : ''}</Text>
                  </View>
                  <Text style={{ fontSize: 8, fontWeight: '900', color: palette.inkFaint }}>
                    {WEEKDAY_INITIALS[fromDayKey(k).getDay()]}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card tone="sky">
          <Heading>❄️ Streak freeze</Heading>
          <Body style={{ marginTop: 4, marginBottom: 12 }}>
            Equipped freezes are spent automatically on a missed day. Free accounts get one per month; Premium keeps you
            permanently stocked.
          </Body>
          <View style={{ gap: 8 }}>
            <Button3D
              title={`Buy a freeze · 💎 ${FREEZE_COST}`}
              tone="sky"
              full
              disabled={game.gems < FREEZE_COST}
              onPress={buyFreeze}
            />
            {!premium && (
              <Button3D title="Unlimited freezes with Premium" tone="grape" full icon="👑" onPress={() => router.push('/paywall')} />
            )}
          </View>
        </Card>

        <View style={{ alignItems: 'center', gap: 10, marginTop: 8 }}>
          <Mascot size={90} mood={game.streak > 0 ? 'cheer' : 'sad'} />
          <Label>
            {game.streak > 0 ? 'Keep it going — Pip is counting on you.' : 'Log anything today to start a new streak.'}
          </Label>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
