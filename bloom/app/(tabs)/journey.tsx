import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardFace } from '@/components/CardFace';
import { Body, Card, Chip, Heading, Label, Segmented, Small, Title, Wrap, styles, tap } from '@/components/ui';
import { BADGE_GROUPS, evaluateBadges } from '@/domain/badges';
import { cardFor, PACKS } from '@/domain/cards';
import { allMoments, eraStates, isCaptured, road, usually, type EraState, type Moment } from '@/domain/moments';
import type { Progress } from '@/domain/types';
import { MONTHS } from '@/lib/date';
import { useNest } from '@/state/hooks';
import { usePremium, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

type Tab = 'moments' | 'cards' | 'badges';

const shortDate = (at: string) => {
  const d = new Date(at);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};

export default function JourneyScreen() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const router = useRouter();
  const nest = useNest();
  const progress = useStore((s) => s.progress);
  const entries = useStore((s) => s.entries);
  const setPack = useStore((s) => s.setPack);
  const collectCard = useStore((s) => s.collectCard);
  const premium = usePremium();
  const [tab, setTab] = useState<Tab>('moments');

  const chapters = eraStates(nest.stage, progress, nest.position);
  const ahead = road(nest.stage, progress, nest.position);
  const total = allMoments(nest.stage).length;

  const badges = useMemo(() => evaluateBadges({ entries, progress }), [entries, progress]);
  const earned = badges.filter((b) => b.done).length;

  const maxWeek = nest.stage === 'pregnancy' ? Math.min(40, nest.week) : 40;
  const albumWeeks = Array.from({ length: 37 }, (_, i) => i + 4);

  const open = (m: Moment) => { tap(); router.push(`/moment/${m.id}`); };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 2 }}>
          <Title>The collection</Title>
          <Small>
            {nest.captured} of {total} moments · {nest.era}
          </Small>
        </View>

        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'moments', label: 'Moments' },
            { value: 'cards', label: 'Cards' },
            { value: 'badges', label: 'Badges' },
          ]}
        />

        {/* ──────────────────────────────────────────────────── moments */}
        {tab === 'moments' && (
          <View style={{ gap: 18 }}>
            {ahead ? (
              <Card tint={palette.sageSoft}>
                <Label>Next chapter</Label>
                <Heading style={{ marginTop: 2 }}>{ahead.era.name}</Heading>
                <Body style={{ fontSize: 13, marginTop: 2 }}>{ahead.era.blurb}</Body>
                <Meter value={ahead.progress} />
                {/* Age first: it is the real gate, and the one that moves on its own. */}
                <Small>
                  {ahead.away > 0
                    ? nest.stage === 'pregnancy'
                      ? `Opens in ${ahead.away} ${ahead.away === 1 ? 'week' : 'weeks'}, as they grow into it.`
                      : `Opens in ${ahead.away} ${ahead.away === 1 ? 'day' : 'days'}, as they grow into it.`
                    : ahead.blocking.length
                      ? `Old enough — waiting on ${ahead.blocking.length} ${ahead.blocking.length === 1 ? 'moment' : 'moments'} from the chapter above.`
                      : 'Opening now.'}
                </Small>
              </Card>
            ) : (
              <Card tint={palette.sageSoft}>
                <Label>The road</Label>
                <Heading style={{ marginTop: 2 }}>Every chapter is open</Heading>
                <Body style={{ fontSize: 13, marginTop: 2 }}>
                  Nothing left to unlock — only things left to happen.
                </Body>
              </Card>
            )}

            {chapters.map((c) => (
              <Chapter key={c.era.id} state={c} progress={progress} stage={nest.stage} onOpen={open} />
            ))}

            <Small style={{ textAlign: 'center' }}>
              Moments come from the baby's life, not the app's. Nothing you log here can speed one up.
            </Small>
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

/** The age bar. It fills with the baby growing, not with anything you do. */
function Meter({ value }: { value: number }) {
  return (
    <View style={{ height: 7, borderRadius: 4, backgroundColor: palette.cardSunk, marginVertical: 10, overflow: 'hidden' }}>
      <View style={{ width: `${Math.round(value * 100)}%`, height: '100%', backgroundColor: palette.sage, borderRadius: 4 }} />
    </View>
  );
}

/**
 * One chapter. An open one shows what has been captured, dated, followed by
 * what is still out there to catch. A sealed one shows nothing but its name and
 * how many moments are waiting inside it.
 */
function Chapter({
  state, progress, stage, onOpen,
}: {
  state: EraState;
  progress: Progress;
  stage: 'pregnancy' | 'baby';
  onOpen: (m: Moment) => void;
}) {
  const captured = state.moments
    .filter((m) => isCaptured(progress, m.id))
    .sort((a, b) => (progress.moments[a.id] || '').localeCompare(progress.moments[b.id] || ''));
  const waiting = state.moments.filter((m) => !isCaptured(progress, m.id));

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Label style={{ flex: 1 }}>{state.era.name}</Label>
        <Text style={{ ...type.label, color: state.open ? palette.sage : palette.inkFaint }}>
          {state.open ? `${state.captured}/${state.moments.length}` : 'SEALED'}
        </Text>
      </View>
      <Small>{state.era.blurb}</Small>

      {!state.open ? (
        <View
          style={{
            padding: 14, borderRadius: radius.lg, backgroundColor: palette.cardSunk,
            borderWidth: 1, borderColor: palette.line, borderStyle: 'dashed', alignItems: 'center', gap: 4,
          }}
        >
          <Text style={{ fontSize: 18, letterSpacing: 6, color: palette.inkFaint }}>
            {state.moments.map(() => '·').join('')}
          </Text>
          <Small>
            {state.moments.length} moments, still sealed
            {state.waitingOn === 'previous' ? ' until the chapter above is done' : ''}
          </Small>
        </View>
      ) : (
        <>
          {captured.map((m) => {
            const at = progress.moments[m.id];
            return (
              // Openable: it is where the moment can be read back, and where a
              // date that was never recorded gets filled in.
              <Pressable
                key={m.id}
                onPress={() => onOpen(m)}
                style={{
                  flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.lg,
                  backgroundColor: palette.card, borderWidth: 1, borderColor: palette.dot,
                }}
              >
                <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...type.heading, fontSize: 15.5, color: palette.ink }}>{m.title}</Text>
                  <Small>{m.done}</Small>
                  <Text style={{ ...type.label, color: at ? palette.sage : palette.dotDeep, marginTop: 4 }}>
                    {at ? shortDate(at) : 'NO DATE YET · TAP TO SET'}
                  </Text>
                </View>
                <Text style={{ ...type.label, color: palette.inkFaint }}>OPEN</Text>
              </Pressable>
            );
          })}

          {waiting.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => onOpen(m)}
              style={{
                flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.lg,
                backgroundColor: palette.dotSoft, borderWidth: 1, borderColor: palette.line,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, opacity: 0.5 }}>{m.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.heading, fontSize: 15.5, color: palette.ink }}>{m.title}</Text>
                <Small>{m.question}</Small>
                <Text style={{ ...type.label, color: palette.inkFaint, marginTop: 4 }}>
                  USUALLY {usually(stage, m.openFrom).toUpperCase()}
                </Text>
              </View>
              <Text style={{ ...type.label, color: palette.dotDeep }}>CAPTURE</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}
