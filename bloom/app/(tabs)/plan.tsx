import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { confirmAlert } from '@/components/Confirm';
import { Body, Button, Card, Chip, Field, Heading, Label, Small, Title, Wrap, styles, tap } from '@/components/ui';
import { careState, careSystem } from '@/domain/care';
import type { PlanItem } from '@/domain/types';
import { addDays, fromDayKey, MONTHS, toDayKey, todayKey } from '@/lib/date';
import { useNest } from '@/state/hooks';
import { useProfile, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

const KINDS: { k: PlanItem['kind']; label: string; emoji: string }[] = [
  { k: 'appointment', label: 'Appointment', emoji: '🩺' },
  { k: 'scan', label: 'Scan', emoji: '🖥️' },
  { k: 'class', label: 'Class', emoji: '📚' },
  { k: 'visitor', label: 'Visitor', emoji: '🚪' },
  { k: 'reminder', label: 'Reminder', emoji: '🔔' },
];

export default function PlanScreen() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const profile = useProfile();
  const nest = useNest();
  const plans = useStore((s) => s.plans);
  const addPlan = useStore((s) => s.addPlan);
  const deletePlan = useStore((s) => s.deletePlan);
  const updatePlan = useStore((s) => s.updatePlan);

  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(todayKey());
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [kind, setKind] = useState<PlanItem['kind']>('appointment');

  const care = careSystem(profile.country);
  const phase = nest.stage === 'pregnancy' ? 'preg' : 'baby';
  const pos = nest.stage === 'pregnancy' ? nest.week : nest.days;

  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const byDay = useMemo(() => {
    const m = new Map<string, PlanItem[]>();
    for (const p of plans) {
      if (!m.has(p.date)) m.set(p.date, []);
      m.get(p.date)!.push(p);
    }
    return m;
  }, [plans]);

  const dayItems = byDay.get(selected) ?? [];
  const upcoming = plans.filter((p) => p.date >= todayKey()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  const careDone = care.items.filter((i) => plans.some((p) => p.careKey === i.key && p.done)).length;

  /** Due first, then what is coming, then the rest — passed items sink to the bottom. */
  const ordered = useMemo(() => {
    const rank = { due: 0, soon: 1, later: 2, passed: 3 } as const;
    return care.items
      .map((item) => ({ item, state: careState(item, phase as any, pos) }))
      .sort((a, b) => rank[a.state] - rank[b.state] || a.item.from - b.item.from);
  }, [care.items, phase, pos]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 4 }}>
          <Title>Plan</Title>
          <Body>
            {upcoming.length ? `${upcoming.length} thing${upcoming.length > 1 ? 's' : ''} coming up.` : 'Nothing scheduled. Enjoy it.'}
          </Body>
        </View>

        {/* ───────────────────────────────────────────────────── calendar */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Pressable onPress={() => { tap(); setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)); }} hitSlop={12}>
              <Text style={{ fontSize: 18, color: palette.inkSoft }}>‹</Text>
            </Pressable>
            <Heading>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</Heading>
            <Pressable onPress={() => { tap(); setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)); }} hitSlop={12}>
              <Text style={{ fontSize: 18, color: palette.inkSoft }}>›</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={i} style={{ ...type.label, flex: 1, textAlign: 'center', color: palette.inkFaint }}>{d}</Text>
            ))}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
            {grid.map((d) => {
              const key = toDayKey(d);
              const inMonth = d.getMonth() === cursor.getMonth();
              const isToday = key === todayKey();
              const isSel = key === selected;
              const count = (byDay.get(key) ?? []).length;
              return (
                <Pressable
                  key={key}
                  onPress={() => { tap(); setSelected(key); setAdding(false); }}
                  style={{ width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                  <View
                    style={{
                      width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: isSel ? palette.ink : isToday ? palette.dotSoft : 'transparent',
                    }}
                  >
                    <Text style={{ ...type.body, fontSize: 13.5, color: isSel ? palette.paper : inMonth ? palette.ink : palette.inkFaint }}>
                      {d.getDate()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 2, height: 5, marginTop: 1 }}>
                    {Array.from({ length: Math.min(3, count) }, (_, i) => (
                      <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: palette.dot }} />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* ────────────────────────────────────────────── the selected day */}
        <Card>
          <Heading>
            {fromDayKey(selected).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </Heading>
          <View style={{ gap: 8, marginTop: 10 }}>
            {dayItems.map((p) => (
              <Pressable
                key={p.id}
                onLongPress={() => confirmAlert('Delete this?', p.title, [{ text: 'Keep', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deletePlan(p.id) }])}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, backgroundColor: palette.cardSunk }}
              >
                <Text style={{ fontSize: 17 }}>{KINDS.find((k) => k.k === p.kind)?.emoji ?? '📌'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...type.bodyMed, color: palette.ink }}>{p.title}</Text>
                  {!!p.time && <Small>{p.time}</Small>}
                </View>
                <Pressable onPress={() => { tap(); updatePlan(p.id, { done: !p.done }); }} hitSlop={10}>
                  <Text style={{ fontSize: 16, color: p.done ? palette.sage : palette.inkFaint }}>{p.done ? '☑' : '☐'}</Text>
                </Pressable>
              </Pressable>
            ))}
            {!dayItems.length && !adding && <Small>Nothing on this day.</Small>}
          </View>

          {adding ? (
            <View style={{ gap: 10, marginTop: 12 }}>
              <Field value={title} onChangeText={setTitle} placeholder="What is it?" />
              <Field value={time} onChangeText={setTime} placeholder="Time (optional), e.g. 14:30" />
              <Wrap>
                {KINDS.map((k) => (
                  <Chip key={k.k} small label={k.label} emoji={k.emoji} selected={kind === k.k} onPress={() => setKind(k.k)} />
                ))}
              </Wrap>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button title="Cancel" tone="quiet" size="sm" style={{ flex: 1 }} onPress={() => setAdding(false)} />
                <Button
                  title="Add"
                  tone="ink"
                  size="sm"
                  style={{ flex: 1 }}
                  disabled={!title.trim()}
                  onPress={() => {
                    addPlan({ title: title.trim(), date: selected, time: time.trim() || undefined, kind });
                    setTitle('');
                    setTime('');
                    setAdding(false);
                  }}
                />
              </View>
            </View>
          ) : (
            <Button title="Add to this day" tone="quiet" full icon="＋" style={{ marginTop: 12 }} onPress={() => setAdding(true)} />
          )}
        </Card>

        {/* ────────────────────────────────────────────── care pathway */}
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Label>Care pathway · {careDone}/{care.items.length}</Label>
            <Text style={{ ...type.label, color: palette.inkFaint }}>{care.flag} {care.label.toUpperCase()}</Text>
          </View>
          <Small>{care.note}</Small>

          {ordered.map(({ item, state }) => {
            const planned = plans.find((p) => p.careKey === item.key);
            if (state === 'passed') {
              // Past its window: one quiet line, so the list stays about what is next.
              return (
                <View
                  key={item.key}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 14, opacity: 0.55 }}
                >
                  <Text style={{ fontSize: 14 }}>{item.emoji}</Text>
                  <Small style={{ flex: 1 }} numberOfLines={1}>{item.label}</Small>
                  <Text style={{ ...type.label, color: planned?.done ? palette.sage : palette.inkFaint }}>
                    {planned?.done ? 'DONE' : 'PASSED'}
                  </Text>
                </View>
              );
            }
            const tint =
              state === 'due' ? palette.dotSoft : state === 'soon' ? palette.claySoft : palette.card;
            return (
              <View
                key={item.key}
                style={{
                  padding: 14, borderRadius: radius.lg, backgroundColor: tint,
                  borderWidth: 1, borderColor: palette.line, gap: 6,
                  opacity: state === 'later' ? 0.6 : 1,
                }}
              >
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...type.bodyMed, color: palette.ink }}>{item.label}</Text>
                    <Small>
                      {item.phase === 'preg' ? `weeks ${item.from}–${item.to}` : `days ${item.from}–${item.to}`}
                      {state === 'due' ? ' · due now' : state === 'soon' ? ' · coming up' : ''}
                    </Small>
                  </View>
                  {planned?.done && <Text style={{ color: palette.sage }}>✓</Text>}
                </View>
                <Body style={{ fontSize: 13 }}>{item.what}</Body>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Text>💡</Text>
                  <Small style={{ flex: 1 }}>{item.tip}</Small>
                </View>
                {!planned && (
                  <Button
                    title="Plan it"
                    tone="quiet"
                    size="sm"
                    style={{ alignSelf: 'flex-start', marginTop: 4 }}
                    onPress={() => {
                      const target =
                        item.phase === 'preg' && profile.dueDate
                          ? toDayKey(addDays(new Date(profile.dueDate), -(40 - item.from) * 7))
                          : profile.birthDate
                            ? toDayKey(addDays(new Date(profile.birthDate), item.from))
                            : todayKey();
                      addPlan({ title: item.label, date: target, kind: 'care', careKey: item.key });
                      setSelected(target);
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
