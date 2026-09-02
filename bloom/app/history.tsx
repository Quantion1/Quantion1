import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryRow } from '@/components/EntryRow';
import { LockedRow } from '@/components/PremiumGate';
import { Body, Card, Chip, Heading, Label, Title, tap } from '@/components/ui';
import { logTypesForMode } from '@/domain/logTypes';
import type { LogType } from '@/domain/types';
import { daysBetween, fromDayKey, toDayKey } from '@/lib/date';
import { useProfile, useStore, usePremium } from '@/state/store';
import { palette } from '@/theme';

const FREE_DAYS = 7;

export default function HistoryScreen() {
  const router = useRouter();
  const entries = useStore((s) => s.entries);
  const deleteEntry = useStore((s) => s.deleteEntry);
  const profile = useProfile();
  const premium = usePremium();
  const [filter, setFilter] = useState<LogType | 'all'>('all');

  const grouped = useMemo(() => {
    const filtered = entries.filter((e) => filter === 'all' || e.type === filter);
    const map = new Map<string, typeof entries>();
    for (const e of filtered) {
      const k = toDayKey(e.at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [entries, filter]);

  const today = new Date();
  const visible = premium ? grouped : grouped.filter(([k]) => Math.abs(daysBetween(fromDayKey(k), today)) < FREE_DAYS);
  const hidden = grouped.length - visible.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
        <Pressable
          onPress={() => {
            tap();
            router.back();
          }}
          hitSlop={14}
        >
          <Text style={{ fontSize: 22, fontWeight: '900', color: palette.inkFaint }}>‹</Text>
        </Pressable>
        <Title style={{ fontSize: 22 }}>History</Title>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 14, paddingBottom: 40 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
          <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
          {logTypesForMode(profile.mode).map((t) => (
            <Chip key={t.type} label={t.short} emoji={t.emoji} tone={t.accent} selected={filter === t.type} onPress={() => setFilter(t.type)} />
          ))}
        </ScrollView>

        {visible.map(([day, list]) => (
          <Card key={day}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Heading>
                {fromDayKey(day).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
              </Heading>
              <Text style={{ fontSize: 11, fontWeight: '900', color: palette.inkFaint }}>{list.length} entries</Text>
            </View>
            {list.map((e) => (
              <EntryRow
                key={e.id}
                entry={e}
                onPress={() => {
                  // Long-list prototypes get a simple tap-to-delete affordance.
                  deleteEntry(e.id);
                }}
              />
            ))}
          </Card>
        ))}

        {!premium && hidden > 0 && <LockedRow label={`${hidden} more days of history`} />}
        {!visible.length && <Body>Nothing logged in this filter yet.</Body>}
        <Label>Tap an entry to delete it.</Label>
      </ScrollView>
    </SafeAreaView>
  );
}
