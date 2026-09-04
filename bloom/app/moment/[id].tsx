import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Confetti } from '@/components/Confetti';
import { DateInput, TimeInput } from '@/components/DateInput';
import { Dot } from '@/components/Dot';
import { Body, Button, Card, Heading, Hero, Small, styles, tap } from '@/components/ui';
import { DOT_POSE_LABEL, momentById } from '@/domain/moments';
import { addDays, formatTime, fromDayKey, MONTHS, toDayKey } from '@/lib/date';
import { useNest } from '@/state/hooks';
import { useSettings, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

const pad = (n: number) => String(n).padStart(2, '0');
const clockOf = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/**
 * One moment: capturing it, and afterwards reading it back.
 *
 * A new one arrives in two beats — first the plain question of when it actually
 * happened, because a collection worth reviewing later needs real dates and the
 * moment is usually remembered hours after the fact, then the part that earns
 * it: Dot in whatever pose it unlocked, and what the baby has just quietly
 * learned to do. Opening one already captured lands straight on that second
 * beat, where the date can be corrected or filled in if it was never recorded.
 */
export default function MomentScreen() {
  useScheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; at?: string }>();
  const moment = momentById(String(params.id));
  const nest = useNest();
  const profile = useStore((s) => s.profile);
  const moments = useStore((s) => s.progress.moments);
  const settings = useSettings();
  const capture = useStore((s) => s.captureMoment);
  const redate = useStore((s) => s.redateMoment);

  const storedAt = moment ? moments[moment.id] : undefined;
  // Frozen at mount: capturing during this visit must not turn it into a revisit.
  const [revisit] = useState(storedAt !== undefined);
  const [celebrated, setCelebrated] = useState(false);

  // A moment the app spotted in your own logs arrives already dated, and one
  // being revisited opens on the date it already carries.
  const seed = new Date(String(params.at || storedAt || new Date().toISOString()));
  const [date, setDate] = useState(toDayKey(seed));
  const [time, setTime] = useState(clockOf(seed));
  const [phase, setPhase] = useState<'when' | 'done'>(revisit ? 'done' : 'when');

  if (!moment) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={{ padding: 24, gap: 12 }}>
          <Heading>That moment is gone</Heading>
          <Button title="Close" tone="quiet" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const today = new Date();
  const floor =
    profile.stage === 'baby' && profile.birthDate
      ? fromDayKey(profile.birthDate)
      : profile.dueDate
        ? addDays(fromDayKey(profile.dueDate), -300)
        : addDays(today, -400);

  const whole = !!date && !!time;
  const when = whole ? new Date(`${date}T${time}:00`) : null;
  const undated = storedAt === '';

  const save = () => {
    if (!when) return;
    tap();
    if (revisit) redate(moment.id, when.toISOString());
    else {
      capture(moment.id, when.toISOString());
      setCelebrated(true);
    }
    setPhase('done');
  };

  /** Skips the date entirely — captured (or left) as undated, fillable later. */
  const skip = () => {
    tap();
    if (revisit) redate(moment.id, '');
    else capture(moment.id, '');
    setPhase('done');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {phase === 'done' && celebrated && <Confetti />}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...type.label, color: palette.inkSoft, flex: 1 }}>
            {phase === 'when' ? (revisit ? 'When was it?' : 'A moment') : celebrated ? 'Captured' : 'A captured moment'}
          </Text>
          <Pressable onPress={() => { tap(); router.back(); }} hitSlop={12}>
            <Text style={{ ...type.label, color: palette.inkSoft }}>CLOSE</Text>
          </Pressable>
        </View>

        {phase === 'when' ? (
          <>
            <View style={{ alignItems: 'center', gap: 6, paddingVertical: 6 }}>
              <Text style={{ fontSize: 44 }}>{moment.emoji}</Text>
              <Hero style={{ textAlign: 'center' }}>{moment.title}</Hero>
              <Small style={{ textAlign: 'center' }}>{moment.question}</Small>
            </View>

            <Card>
              <Text style={{ ...type.label, color: palette.inkSoft }}>When did it happen?</Text>
              <Body style={{ fontSize: 13, marginTop: 4, marginBottom: 12 }}>
                {params.at
                  ? 'Taken from what you logged. Move it if the moment itself was somewhere else.'
                  : revisit
                    ? 'Whatever you put here is what the collection will show.'
                    : 'Today and now, unless it was not. The collection keeps whatever you put here.'}
              </Body>
              <DateInput
                value={date}
                onChange={setDate}
                min={floor}
                max={today}
                outOfRange="That is before this all started, or in the future."
              />
              <View style={{ height: 12 }} />
              <TimeInput value={time} onChange={setTime} />
            </Card>

            <Button title={revisit ? 'Save the date' : 'Capture it'} tone="dot" full disabled={!whole} onPress={save} />
            <Button title="Skip — don't know yet" tone="quiet" full onPress={skip} />
            {revisit && <Button title="Back" tone="quiet" full onPress={() => setPhase('done')} />}
          </>
        ) : (
          <>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Dot stage={nest.dot} size={150} />
              <Text style={{ fontSize: 34 }}>{moment.emoji}</Text>
              <Hero style={{ textAlign: 'center' }}>{moment.title}</Hero>
              <Small style={{ textAlign: 'center' }}>
                {storedAt ? stamp(new Date(storedAt), settings.clock24h) : 'No date recorded yet'}
              </Small>
            </View>

            <Card tint={palette.dotSoft}>
              <Heading>{moment.done}</Heading>
              <Body style={{ marginTop: 6 }}>{moment.body}</Body>
            </Card>

            <Card>
              <Text style={{ ...type.label, color: palette.inkSoft }}>The small print</Text>
              <Body style={{ marginTop: 6 }}>{moment.wry}</Body>
            </Card>

            {moment.dot && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: palette.cardSunk }}>
                <Dot stage={moment.dot} size={40} />
                <Small style={{ flex: 1 }}>Dot moved with them — {DOT_POSE_LABEL[moment.dot].toLowerCase()}.</Small>
              </View>
            )}

            <Button
              title={undated ? 'Set the date' : 'Change the date'}
              tone={undated ? 'dot' : 'quiet'}
              full
              onPress={() => { tap(); setPhase('when'); }}
            />
            <Button
              title={celebrated ? 'Add to the collection' : 'Done'}
              tone={undated ? 'quiet' : 'dot'}
              full
              onPress={() => { tap(); router.back(); }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const stamp = (d: Date, clock24h: boolean) =>
  `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${formatTime(d.toISOString(), clock24h)}`;
