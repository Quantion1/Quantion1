import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardFace } from '@/components/CardFace';
import { Dot } from '@/components/Dot';
import { Gear } from '@/components/icons';
import { LevelPrompt } from '@/components/LevelPrompt';
import { Rhythm } from '@/components/Rhythm';
import { EditBanner, TileGrid } from '@/components/TileGrid';
import { Body, Button, Card, Heading, Label, Small, Title, styles, tap } from '@/components/ui';
import { devNote } from '@/domain/cards';
import { ladder } from '@/domain/levels';
import { tileMeta } from '@/domain/describe';
import { tracker } from '@/domain/trackers';
import type { Tile as TileT } from '@/domain/types';
import {
  useBadgeSync, useLevelPrompt, useNest, useOpenTracking, useRhythm, useTodayEntries,
} from '@/state/hooks';
import { useSettings, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const nest = useNest();
  const settings = useSettings();
  const tiles = useStore((s) => s.tiles);
  const entries = useStore((s) => s.entries);
  const progress = useStore((s) => s.progress);
  const addEntry = useStore((s) => s.addEntry);
  const claimLevel = useStore((s) => s.claimLevel);
  const snoozeLevel = useStore((s) => s.snoozeLevel);
  const collectCard = useStore((s) => s.collectCard);
  const removeTile = useStore((s) => s.removeTile);
  const resizeTile = useStore((s) => s.resizeTile);
  const moveTile = useStore((s) => s.moveTile);

  const today = useTodayEntries();
  const rhythm = useRhythm();
  const prompt = useLevelPrompt();
  const [editing, setEditing] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  useBadgeSync();
  useOpenTracking();

  const total = ladder(nest.stage).length;
  const weekCard = nest.stage === 'pregnancy' && nest.week >= 4
    ? { week: Math.min(40, nest.week), collected: progress.cards.includes(Math.min(40, nest.week)) }
    : null;

  /** Instant trackers write straight from the tile — no sheet, no confirmation. */
  const openTile = (t: TileT) => {
    if (t.key === 'today') return router.push('/review');
    const trk = tracker(t.key);
    if (trk.blocks[0]?.t === 'confirm') {
      addEntry({ tracker: trk.key, at: new Date().toISOString(), count: 1 });
      useStore.getState().showToast({ emoji: trk.emoji, title: `${trk.label} logged` });
      return;
    }
    router.push(`/log/${t.key}`);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ───────────────────────────────────────────────────── header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => { tap(); router.push('/(tabs)/journey'); }}>
            <Dot stage={nest.dot as any} size={78} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Title numberOfLines={1}>{nest.title}</Title>
            <Small>{nest.sub}</Small>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <View style={{ backgroundColor: palette.dotSoft, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 }}>
                <Text style={{ ...type.label, color: palette.dotDeep }}>LEVEL {nest.level}</Text>
              </View>
              <Rhythm marks={rhythm.marks} size={13} />
            </View>
          </View>
          <Pressable onPress={() => { tap(); router.push('/settings'); }} hitSlop={12}>
            <Gear size={22} color={palette.inkFaint} />
          </Pressable>
        </View>

        {/* ──────────────────────────────────────────── the level question */}
        {prompt?.ready && (
          <LevelPrompt
            level={prompt.level}
            order={prompt.level.order}
            total={total}
            position={nest.position}
            stage={nest.stage}
            onClaim={() => {
              claimLevel(prompt.level.id, prompt.level.title, prompt.level.emoji);
              if (prompt.level.id === 'p_term') return;
            }}
            onSnooze={() => snoozeLevel(prompt.level.id)}
          />
        )}

        {/* ──────────────────────────────────────────── this week's card */}
        {weekCard && !weekCard.collected && (
          <Card tint={palette.claySoft}>
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
              <View style={{ flex: 1, gap: 4 }}>
                <Label>Week {weekCard.week} card</Label>
                <Heading>There's a new card waiting</Heading>
                <Body style={{ fontSize: 13 }}>{devNote(nest.week)}</Body>
                <Button title="Collect it" tone="clay" size="sm" style={{ alignSelf: 'flex-start', marginTop: 6 }}
                  onPress={() => collectCard(weekCard.week)} />
              </View>
              <Text style={{ fontSize: 40 }}>🃏</Text>
            </View>
          </Card>
        )}

        {/* ─────────────────────────────────────────────────── tile grid */}
        {editing ? (
          <EditBanner onDone={() => { tap(); setEditing(false); }} />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Label>Today</Label>
            <Pressable onPress={() => { tap(); setEditing(true); }} hitSlop={10}>
              <Text style={{ ...type.label, color: palette.inkSoft }}>EDIT</Text>
            </Pressable>
          </View>
        )}

        <View onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
          {gridWidth > 0 && (
            <TileGrid
              tiles={tiles}
              width={gridWidth}
              editing={editing}
              meta={(key) => (key === 'today' ? 'the day so far' : tileMeta(key, today, entries, settings))}
              onEnterEdit={() => setEditing(true)}
              onOpen={openTile}
              onRemove={removeTile}
              onMove={moveTile}
              onResize={resizeTile}
            />
          )}
        </View>

        <Button
          title={editing ? 'Add a tracker' : 'Browse every tracker'}
          tone="quiet"
          full
          icon="＋"
          onPress={() => router.push('/library')}
        />

        {!tiles.length && (
          <Card>
            <Heading>An empty screen</Heading>
            <Body style={{ marginTop: 4 }}>
              Nothing is on it yet, which is exactly how a fresh install should look. Add the trackers you actually
              want and ignore the rest.
            </Body>
          </Card>
        )}

        {nest.stage === 'pregnancy' && nest.week >= 37 && (
          <Card tint={palette.dotSoft}>
            <Heading>🥚 The egg is full</Heading>
            <Body style={{ marginTop: 4, marginBottom: 12 }}>
              Nothing left to unlock but meeting them. Could be tonight, could be three weeks — both are on time.
            </Body>
            <Button title="The baby is here" tone="dot" full onPress={() => router.push('/hatch')} />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
