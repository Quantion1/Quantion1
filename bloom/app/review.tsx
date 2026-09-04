import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { DayRhythm } from '@/charts';
import { Dot } from '@/components/Dot';
import { Sheet } from '@/components/Sheet';
import { Body, Button, Card, Empty, Heading, Label, Small, tap } from '@/components/ui';
import { buildReview } from '@/analytics';
import { EntryLine } from '@/components/EntryLine';
import { addDays, fromDayKey, toDayKey, todayKey } from '@/lib/date';
import { useNest } from '@/state/hooks';
import { useProfile, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

export default function Review() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const entries = useStore((s) => s.entries);
  const profile = useProfile();
  const nest = useNest();
  const [day, setDay] = useState(todayKey());

  const review = useMemo(() => buildReview(entries, profile, day, nest.months), [entries, profile, day, nest.months]);
  const dayEntries = useMemo(
    () => entries.filter((e) => toDayKey(e.at) === day).sort((a, b) => +new Date(b.at) - +new Date(a.at)),
    [entries, day],
  );

  const shift = (delta: number) => setDay(toDayKey(addDays(fromDayKey(day), delta)));
  const isToday = day === todayKey();

  return (
    <Sheet
      title={isToday ? 'Today' : fromDayKey(day).toLocaleDateString(undefined, { weekday: 'long' })}
      subtitle={fromDayKey(day).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
      centerTitle
      maxBodyFraction={0.72}
      padded={false}
      left={
        <Pressable onPress={() => { tap(); shift(-1); }} hitSlop={12}>
          <Text style={{ fontSize: 18, color: palette.inkSoft }}>‹</Text>
        </Pressable>
      }
      right={
        <Pressable onPress={() => { tap(); if (!isToday) shift(1); }} hitSlop={12}>
          <Text style={{ fontSize: 18, color: isToday ? palette.line : palette.inkSoft }}>›</Text>
        </Pressable>
      }
    >
      <View style={{ padding: 18, gap: 14 }}>
        {!review.hasData ? (
          <Card>
            <Empty
              emoji="🫖"
              title="Nothing logged"
              text="No numbers to report, and no judgement about it. The review only ever shows what actually happened."
            />
          </Card>
        ) : (
          <>
            <Card tint={palette.blueSoft}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Dot stage={nest.dot} size={64} />
                <View style={{ flex: 1 }}>
                  <Heading>{review.headline}</Heading>
                  <Small>{review.sub}</Small>
                </View>
              </View>
            </Card>

            <Card>
              <Label>The day</Label>
              <View style={{ marginTop: 8 }}>
                <DayRhythm segments={review.segments} marks={review.marks} width={width - 68} />
              </View>
              <View style={{ flexDirection: 'row', gap: 14, marginTop: 4 }}>
                <Legend color={palette.blue} label="Night sleep" />
                <Legend color={palette.teal} label="Naps" />
                <Legend color={palette.gold} label="Feeds" />
                <Legend color={palette.sage} label="Changes" />
              </View>
            </Card>

            {!!review.numbers.length && (
              <Card>
                <Label>Numbers</Label>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  {review.numbers.map((n) => (
                    <View key={n.label} style={{ minWidth: '30%', flexGrow: 1, backgroundColor: palette.cardSunk, borderRadius: radius.md, padding: 12 }}>
                      <Text style={{ ...type.title, fontSize: 19, color: palette.ink }}>{n.value}</Text>
                      <Text style={{ ...type.label, color: palette.inkSoft }}>{n.label.toUpperCase()}</Text>
                      {!!n.note && <Small style={{ fontSize: 10.5 }}>{n.note}</Small>}
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {!!review.patterns.length && (
              <Card>
                <Label>Patterns I noticed</Label>
                <View style={{ gap: 12, marginTop: 10 }}>
                  {review.patterns.map((p, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                      <Text style={{ fontSize: 17 }}>{p.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ ...type.bodyMed, color: palette.ink }}>{p.title}</Text>
                        <Small>{p.sub}</Small>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {!!review.tomorrow.length && (
              <Card tint={palette.dotSoft}>
                <Label>What I'd try tomorrow</Label>
                <View style={{ gap: 10, marginTop: 10 }}>
                  {review.tomorrow.map((t, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                      <Text style={{ fontSize: 16 }}>{t.emoji}</Text>
                      <Body style={{ flex: 1, fontSize: 13.5, color: palette.ink }}>{t.text}</Body>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            <Card>
              <Label>Everything logged</Label>
              <View style={{ marginTop: 4 }}>
                {dayEntries.map((e) => <EntryLine key={e.id} entry={e} />)}
              </View>
            </Card>
          </>
        )}

        <Button title="Close" tone="quiet" full onPress={() => router.back()} />
      </View>
    </Sheet>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Small style={{ fontSize: 10.5 }}>{label}</Small>
    </View>
  );
}
