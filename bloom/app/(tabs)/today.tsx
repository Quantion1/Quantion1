import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryRow } from '@/components/EntryRow';
import { Mascot } from '@/components/Mascot';
import { ProgressBar, ProgressRing } from '@/components/ProgressRing';
import { QuestCard } from '@/components/QuestCard';
import { StatTile } from '@/components/StatTile';
import { TopBar } from '@/components/TopBar';
import { Body, Button3D, Card, Heading, Label, Title, styles, tap } from '@/components/ui';
import { levelForXp, levelTitle } from '@/domain/levels';
import { logTypesForMode } from '@/domain/logTypes';
import { formatDuration, lastNDayKeys, WEEKDAY_INITIALS, fromDayKey } from '@/lib/date';
import { fmtVolume } from '@/lib/units';
import { useBadgeSync, useDailyGoal, useDailyQuests, useJourneyContext, useTodayEntries } from '@/state/hooks';
import { useGame, useProfile, useSettings, useStore } from '@/state/store';
import { accent, palette, radius } from '@/theme';

export default function TodayScreen() {
  const router = useRouter();
  const profile = useProfile();
  const settings = useSettings();
  const game = useGame();
  const claimQuest = useStore((s) => s.claimQuest);
  const entries = useStore((s) => s.entries);
  const today = useTodayEntries();
  const quests = useDailyQuests();
  const goal = useDailyGoal();
  const ctx = useJourneyContext();
  const level = levelForXp(game.xp);
  useBadgeSync();

  const quickTypes = logTypesForMode(profile.mode).filter((t) => t.quick);
  const week = lastNDayKeys(7);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const mascotMood = goal.met ? 'cheer' : hour >= 21 || hour < 6 ? 'sleepy' : game.streak > 0 ? 'happy' : 'wave';

  // Today's numbers, mode-aware.
  const feeds = today.filter((e) => e.type === 'feed');
  const sleeps = today.filter((e) => e.type === 'sleep') as Extract<(typeof today)[number], { type: 'sleep' }>[];
  const diapers = today.filter((e) => e.type === 'diaper');
  const sleepMin = sleeps.reduce((s, e) => s + e.minutes, 0);
  const bottleMl = feeds.reduce((s, e) => s + ((e as any).ml ?? 0), 0);
  const kicks = today.filter((e) => e.type === 'kicks').reduce((s, e) => s + (e as any).count, 0);
  const symptomsToday = today.filter((e) => e.type === 'symptom').length;
  const lastWeight = entries.find((e) => e.type === 'weight') as any;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ---------------------------------------------------------- hero */}
        <Card tone="blossom" style={{ padding: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Mascot size={96} mood={mascotMood as any} />
            <View style={{ flex: 1, gap: 4 }}>
              <Label>{greeting}{profile.parentName ? `, ${profile.parentName}` : ''}</Label>
              <Title style={{ fontSize: 22 }}>{ctx.stageLabel}</Title>
              <Body style={{ fontSize: 13 }}>{ctx.stageSub}</Body>
            </View>
          </View>

          <View style={{ marginTop: 14, gap: 8 }}>
            <ProgressBar progress={ctx.progress} color={palette.blossom} height={12} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: palette.inkSoft }}>
              {ctx.emoji} {ctx.headline}
            </Text>
            {!!ctx.sizeLabel && (
              <Text style={{ fontSize: 12, fontWeight: '700', color: palette.inkFaint }}>{ctx.sizeLabel}</Text>
            )}
          </View>
        </Card>

        {/* ----------------------------------------------------- daily goal */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <ProgressRing progress={goal.progress} color={goal.met ? palette.mint : palette.sunny} size={96} stroke={11}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: palette.ink }}>{goal.xpToday}</Text>
              <Text style={{ fontSize: 10, fontWeight: '800', color: palette.inkFaint }}>/ {goal.goal} XP</Text>
            </ProgressRing>
            <View style={{ flex: 1, gap: 8 }}>
              <Heading>{goal.met ? 'Daily goal complete! 🎉' : 'Daily goal'}</Heading>
              <Body style={{ fontSize: 13 }}>
                {goal.met
                  ? `Streak safe for today. ${game.streak} day${game.streak === 1 ? '' : 's'} in a row.`
                  : `${goal.goal - goal.xpToday} XP to keep your ${game.streak}-day streak alive.`}
              </Body>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 2 }}>
                {week.map((k) => {
                  const done = (game.xpByDay[k] ?? 0) >= settings.dailyGoalXp;
                  const frozen = game.freezeDaysUsed.includes(k);
                  return (
                    <View key={k} style={{ alignItems: 'center', gap: 3 }}>
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: done ? palette.coral : frozen ? palette.skySoft : palette.cloud,
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{done ? '🔥' : frozen ? '❄️' : ''}</Text>
                      </View>
                      <Text style={{ fontSize: 9, fontWeight: '900', color: palette.inkFaint }}>
                        {WEEKDAY_INITIALS[fromDayKey(k).getDay()]}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 14, gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, fontWeight: '900', color: palette.grapeDark }}>
                Level {level.level} · {levelTitle(level.level)}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '800', color: palette.inkFaint }}>
                {level.toNext} XP to level {level.level + 1}
              </Text>
            </View>
            <ProgressBar progress={level.progress} color={palette.grape} height={10} />
          </View>
        </Card>

        {/* --------------------------------------------------------- quick */}
        <View style={{ gap: 8 }}>
          <Label>Quick log</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {quickTypes.map((t) => {
              const a = accent(t.accent);
              return (
                <Pressable
                  key={t.type}
                  onPress={() => {
                    tap();
                    router.push(`/log/${t.type}`);
                  }}
                  style={{
                    flexGrow: 1,
                    flexBasis: '44%',
                    backgroundColor: a.soft,
                    borderRadius: radius.lg,
                    borderBottomWidth: 4,
                    borderBottomColor: a.base,
                    paddingVertical: 14,
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{t.emoji}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: a.dark }}>{t.short}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* -------------------------------------------------------- quests */}
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Label>Daily quests</Label>
            <Text style={{ fontSize: 11, fontWeight: '800', color: palette.inkFaint }}>Resets at midnight</Text>
          </View>
          {quests.map((q) => (
            <QuestCard
              key={q.def.id}
              quest={q.def}
              progress={q.progress}
              claimed={q.claimed}
              onClaim={() => claimQuest(q.def.id, q.def.xp, q.def.gems)}
            />
          ))}
        </View>

        {/* --------------------------------------------------- today stats */}
        <View style={{ gap: 8 }}>
          <Label>Today so far</Label>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {profile.mode === 'baby' ? (
              <>
                <StatTile emoji="🍼" tone="sky" value={`${feeds.length}`} label="Feeds" sub={bottleMl ? fmtVolume(bottleMl, settings.units) : 'breast + bottle'} />
                <StatTile emoji="😴" tone="grape" value={formatDuration(sleepMin)} label="Sleep" sub={`${sleeps.length} sleeps`} />
                <StatTile emoji="💧" tone="mint" value={`${diapers.length}`} label="Diapers" />
              </>
            ) : (
              <>
                <StatTile emoji="🦶" tone="sunny" value={`${kicks}`} label="Kicks today" sub={kicks >= 10 ? 'session complete' : 'aim for 10'} />
                <StatTile emoji="🤰" tone="blossom" value={symptomsToday ? '✓' : '—'} label="Check-in" sub={symptomsToday ? 'logged' : 'not yet'} />
                <StatTile emoji="⚖️" tone="mint" value={lastWeight ? `${lastWeight.kg}` : '—'} label="Last weight" sub="kg" />
              </>
            )}
          </View>
        </View>

        {/* -------------------------------------------------------- recent */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Heading>Recent activity</Heading>
            <Pressable onPress={() => router.push('/history')}>
              <Text style={{ fontSize: 12, fontWeight: '900', color: palette.sky }}>SEE ALL</Text>
            </Pressable>
          </View>
          {entries.slice(0, 6).map((e) => (
            <EntryRow key={e.id} entry={e} showRelative />
          ))}
          {!entries.length && (
            <View style={{ alignItems: 'center', paddingVertical: 20, gap: 10 }}>
              <Mascot size={80} mood="wave" />
              <Body style={{ textAlign: 'center' }}>Nothing logged yet. Tap a quick-log button to start your streak.</Body>
              <Button3D title="Log something" tone="mint" onPress={() => router.push('/(tabs)/track')} />
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
