import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardFace } from '@/components/CardFace';
import { Dot } from '@/components/Dot';
import { PremiumGate } from '@/components/PremiumGate';
import { Body, Button, Card, Chip, Heading, Label, Segmented, Small, Title, Wrap, styles, tap } from '@/components/ui';
import { BADGE_GROUPS, evaluateBadges } from '@/domain/badges';
import { cardFor, PACKS } from '@/domain/cards';
import { DOT_STAGE_LABEL, ladder } from '@/domain/levels';
import { useNest } from '@/state/hooks';
import { usePremium, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';

type Tab = 'levels' | 'cards' | 'badges';

export default function JourneyScreen() {
  const router = useRouter();
  const nest = useNest();
  const progress = useStore((s) => s.progress);
  const entries = useStore((s) => s.entries);
  const setPack = useStore((s) => s.setPack);
  const collectCard = useStore((s) => s.collectCard);
  const premium = usePremium();
  const [tab, setTab] = useState<Tab>('levels');

  const list = ladder(nest.stage);
  const badges = useMemo(() => evaluateBadges({ entries, progress }), [entries, progress]);
  const earned = badges.filter((b) => b.done).length;

  const maxWeek = nest.stage === 'pregnancy' ? Math.min(40, nest.week) : 40;
  const albumWeeks = Array.from({ length: 37 }, (_, i) => i + 4);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card tint={palette.dotSoft} style={{ alignItems: 'center', gap: 6, paddingVertical: 22 }}>
          <Dot stage={nest.dot as any} size={150} />
          <Title>Dot</Title>
          <Small>{DOT_STAGE_LABEL[nest.dot]}</Small>
          <View style={{ backgroundColor: palette.card, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, marginTop: 4 }}>
            <Text style={{ ...type.label, color: palette.dotDeep }}>
              LEVEL {nest.level} OF {list.length}
            </Text>
          </View>
          <Body style={{ textAlign: 'center', marginTop: 4, fontSize: 13 }}>
            {nest.stage === 'pregnancy'
              ? 'She hatches the day the baby arrives. Until then she cracks once a trimester.'
              : 'She grows when you confirm something real happened. Nothing you log speeds her up.'}
          </Body>
        </Card>

        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'levels', label: 'Levels' },
            { value: 'cards', label: 'Cards' },
            { value: 'badges', label: 'Badges' },
          ]}
        />

        {/* ───────────────────────────────────────────────────── levels */}
        {tab === 'levels' && (
          <View style={{ gap: 10 }}>
            <Body style={{ fontSize: 13 }}>
              Levels come from the baby's life, not from the app's. Each one waits until you say it happened.
            </Body>
            {list.map((l) => {
              const claimed = progress.claimed.includes(l.id);
              const current = !claimed && list.findIndex((x) => !progress.claimed.includes(x.id)) === list.indexOf(l);
              return (
                <View
                  key={l.id}
                  style={{
                    flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.lg,
                    backgroundColor: claimed ? palette.card : current ? palette.dotSoft : palette.cardSunk,
                    borderWidth: 1, borderColor: current ? palette.dot : palette.line,
                    opacity: claimed || current ? 1 : 0.65,
                  }}
                >
                  <View style={{ width: 34, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20 }}>{claimed ? l.emoji : current ? l.emoji : '·'}</Text>
                    <Text style={{ ...type.label, fontSize: 9, color: palette.inkFaint }}>{l.order}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...type.heading, fontSize: 15.5, color: palette.ink }}>{l.title}</Text>
                    <Small>{claimed ? l.done : current ? l.question : `From ${nest.stage === 'pregnancy' ? `week ${l.openFrom}` : `day ${l.openFrom}`}`}</Small>
                  </View>
                  {claimed && <Text style={{ fontSize: 15, color: palette.sage }}>✓</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* ────────────────────────────────────────────────────── cards */}
        {tab === 'cards' && (
          <View style={{ gap: 14 }}>
            <Body style={{ fontSize: 13 }}>
              One card a week, four to forty. The pack changes what the baby is compared to — never the measurements.
            </Body>

            <Wrap>
              {PACKS.map((p) => (
                <Chip
                  key={p.id}
                  label={p.premium && !premium ? `${p.name} 🔒` : p.name}
                  selected={progress.activePack === p.id}
                  onPress={() => (p.premium && !premium ? router.push('/paywall') : setPack(p.id))}
                />
              ))}
            </Wrap>
            <Small>{PACKS.find((p) => p.id === progress.activePack)?.blurb}</Small>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }}>
              {albumWeeks.map((w) => {
                const collected = progress.cards.includes(w);
                const reachable = w <= maxWeek;
                return (
                  <Pressable
                    key={w}
                    onPress={() => { if (reachable && !collected) { tap(); collectCard(w); } }}
                    style={{ opacity: reachable ? 1 : 0.4 }}
                  >
                    <CardFace card={cardFor(progress.activePack, w)} collected={collected} size="sm" />
                  </Pressable>
                );
              })}
            </View>
            <Small style={{ textAlign: 'center' }}>
              {progress.cards.length} of 37 collected · tap a reached week to add it
            </Small>
          </View>
        )}

        {/* ───────────────────────────────────────────────────── badges */}
        {tab === 'badges' && (
          <View style={{ gap: 18 }}>
            <Body style={{ fontSize: 13 }}>
              Badges are about you, not the baby — showing up, logging at strange hours, and sheer accumulated volume.
              {' '}{earned} of {badges.length} so far.
            </Body>
            {BADGE_GROUPS.map((g) => (
              <View key={g} style={{ gap: 8 }}>
                <Label>{g}</Label>
                {badges.filter((b) => b.def.group === g).map((b) => (
                  <View
                    key={b.def.id}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
                      borderRadius: radius.md, backgroundColor: b.done ? palette.card : palette.cardSunk,
                      borderWidth: 1, borderColor: b.done ? palette.dot : palette.line,
                    }}
                  >
                    <Text style={{ fontSize: 21, opacity: b.done ? 1 : 0.35 }}>{b.def.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...type.bodyMed, color: b.done ? palette.ink : palette.inkSoft }}>{b.def.name}</Text>
                      <Small numberOfLines={1}>{b.def.description}</Small>
                    </View>
                    <Text style={{ ...type.label, color: b.done ? palette.sage : palette.inkFaint }}>
                      {b.done ? 'DONE' : `${b.current}/${b.target}`}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
