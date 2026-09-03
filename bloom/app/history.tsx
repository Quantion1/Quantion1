import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryLine } from '@/components/EntryLine';
import { LockedRow } from '@/components/PremiumGate';
import { confirmAlert } from '@/components/Confirm';
import { Card, Chip, Empty, Heading, Small, Title, tap } from '@/components/ui';
import { TRACKERS } from '@/domain/trackers';
import { daysBetween, fromDayKey, toDayKey } from '@/lib/date';
import { usePremium, useStore } from '@/state/store';
import { palette, type } from '@/theme';

const FREE_DAYS = 7;

export default function History() {
  const router = useRouter();
  const entries = useStore((s) => s.entries);
  const deleteEntry = useStore((s) => s.deleteEntry);
  const stage = useStore((s) => s.profile.stage);
  const premium = usePremium();
  const [filter, setFilter] = useState<string>('all');

  const grouped = useMemo(() => {
    const list = entries.filter((e) => filter === 'all' || e.tracker === filter);
    const map = new Map<string, typeof entries>();
    for (const e of list) {
      const k = toDayKey(e.at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [entries, filter]);

  const today = new Date();
  const visible = premium ? grouped : grouped.filter(([k]) => Math.abs(daysBetween(fromDayKey(k), today)) < FREE_DAYS);
  const hidden = grouped.length - visible.length;

  const used = new Set(entries.map((e) => e.tracker));
  const chips = TRACKERS.filter((t) => used.has(t.key));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.paper }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18 }}>
        <Pressable onPress={() => { tap(); router.back(); }} hitSlop={14}>
          <Text style={{ fontSize: 20, color: palette.inkSoft }}>‹</Text>
        </Pressable>
        <Title style={{ fontSize: 21 }}>Everything</Title>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: 0, gap: 14, paddingBottom: 40 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
          <Chip small label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
          {chips.map((t) => (
            <Chip key={t.key} small label={t.label} emoji={t.emoji} tone={t.accent} selected={filter === t.key} onPress={() => setFilter(t.key)} />
          ))}
        </ScrollView>

        {visible.map(([day, list]) => (
          <Card key={day}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Heading>{fromDayKey(day).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}</Heading>
              <Text style={{ ...type.label, color: palette.inkFaint }}>{list.length}</Text>
            </View>
            {list.map((e) => (
              <EntryLine
                key={e.id}
                entry={e}
                onPress={() =>
                  confirmAlert('Delete this entry?', '', [
                    { text: 'Keep', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(e.id) },
                  ])
                }
              />
            ))}
          </Card>
        ))}

        {!premium && hidden > 0 && <LockedRow label={`${hidden} more days of history`} />}
        {!grouped.length && (
          <Card>
            <Empty emoji="📭" title="Nothing here yet" text="A fresh install starts genuinely empty. Log something and it turns up here." />
          </Card>
        )}
        <Small style={{ textAlign: 'center' }}>Tap an entry to delete it.</Small>
      </ScrollView>
    </SafeAreaView>
  );
}
