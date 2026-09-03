import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Dot } from '@/components/Dot';
import { Body, Button, Card, Chip, Field, Heading, Label, Small, Title, Wrap, ping, tap } from '@/components/ui';
import { CARE_SYSTEMS, COUNTRY_ORDER } from '@/domain/care';
import { cardFor } from '@/domain/cards';
import { starterTiles } from '@/domain/trackers';
import type { Stage } from '@/domain/types';
import { addDays, daysBetween, MONTHS, toDayKey } from '@/lib/date';
import { useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';

const STEPS = 4;

export default function Onboarding() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const setTiles = useStore((s) => s.setTiles);
  const claimLevel = useStore((s) => s.claimLevel);
  const seedDemo = useStore((s) => s.seedDemo);

  const today = new Date();
  const sixWeeksAgo = addDays(today, -42);

  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<Stage>('pregnancy');
  const [week, setWeek] = useState(20);
  const [birthDay, setBirthDay] = useState(sixWeeksAgo.getDate());
  const [birthMonth, setBirthMonth] = useState(sixWeeksAgo.getMonth());
  const [birthYear, setBirthYear] = useState(sixWeeksAgo.getFullYear());
  const [parentName, setParentName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [country, setCountry] = useState('NL');

  const dueDate = toDayKey(addDays(new Date(), (40 - week) * 7));

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const clampedBirthDay = Math.min(birthDay, daysInMonth(birthYear, birthMonth));
  const birthDateObj = new Date(birthYear, birthMonth, clampedBirthDay) > today ? today : new Date(birthYear, birthMonth, clampedBirthDay);
  const birthDate = toDayKey(birthDateObj);
  const weeksOld = Math.max(0, Math.floor(daysBetween(birthDateObj, today) / 7));

  const finish = (demo: boolean) => {
    if (demo) {
      seedDemo(stage);
    } else {
      setProfile({
        parentName: parentName.trim() || 'you',
        babyName: babyName.trim(),
        stage,
        country,
        dueDate: stage === 'pregnancy' ? dueDate : undefined,
        birthDate: stage === 'baby' ? birthDate : undefined,
        onboarded: true,
      });
      setTiles([{ key: 'today', span: 2 }, ...starterTiles(stage).map((key) => ({ key, span: 1 as const }))]);
      // The first level is a given — you are here, reading this.
      claimLevel(stage === 'pregnancy' ? 'p_two_lines' : 'b_home', stage === 'pregnancy' ? 'Two lines' : 'Home', stage === 'pregnancy' ? '🧪' : '🏠');
    }
    ping();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.paper }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 22, paddingTop: 10 }}>
        {Array.from({ length: STEPS }, (_, i) => (
          <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i <= step ? palette.dot : palette.line }} />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 22, gap: 20, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={{ alignItems: 'center', gap: 14, paddingTop: 20 }}>
            <Dot stage="egg1" size={170} />
            <Title style={{ fontSize: 28, textAlign: 'center' }}>This is Dot</Title>
            <Body style={{ textAlign: 'center', maxWidth: 320 }}>
              She is an egg for now. She cracks once a trimester, hatches the day the baby arrives, and grows every
              time you confirm something real happened.
            </Body>
            <View style={{ gap: 12, alignSelf: 'stretch', marginTop: 10 }}>
              <Point emoji="👆" title="One tap is a log" text="Tap a tile and it either starts a timer or opens a short sheet." />
              <Point emoji="🧩" title="Your home screen" text="Add, remove, resize and reorder tiles. It shrinks as the baby grows." />
              <Point emoji="📊" title="Real analysis" text="Sleep rasters, feeding rhythm, weight against the band — from your data only." />
              <Point emoji="🔒" title="Stays on this phone" text="No account, no server, nothing shared." />
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 16 }}>
            <Title>Where are you?</Title>
            <Body>You can switch later. Nothing is lost when the baby arrives.</Body>
            <Choice emoji="🤰" title="I'm pregnant" text="Kicks, contractions, the weekly card, the care pathway." on={stage === 'pregnancy'} onPress={() => setStage('pregnancy')} />
            <Choice emoji="👶" title="The baby is here" text="Sleep, feeds, nappies, weight, teeth, words." on={stage === 'baby'} onPress={() => setStage('baby')} />
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 16 }}>
            {stage === 'pregnancy' ? (
              <>
                <Title>How far along?</Title>
                <Card style={{ alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 46 }}>{cardFor('garden', week).emoji}</Text>
                  <Title style={{ fontSize: 26 }}>Week {week}</Title>
                  <Body style={{ textAlign: 'center' }}>
                    About a {cardFor('garden', week).size} · due around {dueDate}
                  </Body>
                </Card>
                <Scale value={week} min={4} max={40} onChange={setWeek} />
              </>
            ) : (
              <>
                <Title>When was the baby born?</Title>
                <Card style={{ alignItems: 'center', gap: 6 }}>
                  <Dot stage={weeksOld < 12 ? 'sleep' : weeksOld < 26 ? 'tummy' : 'sit'} size={110} />
                  <Title style={{ fontSize: 26 }}>{weeksOld} week{weeksOld === 1 ? '' : 's'} old</Title>
                  <Body>Born {MONTHS[birthMonth]} {clampedBirthDay}, {birthYear}</Body>
                </Card>
                <DateWheels
                  day={clampedBirthDay}
                  month={birthMonth}
                  year={birthYear}
                  maxDay={daysInMonth(birthYear, birthMonth)}
                  minYear={today.getFullYear() - 2}
                  maxYear={today.getFullYear()}
                  onChangeDay={setBirthDay}
                  onChangeMonth={setBirthMonth}
                  onChangeYear={setBirthYear}
                />
              </>
            )}
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: 18 }}>
            <Title>Last bit</Title>
            <View style={{ gap: 8 }}>
              <Label>What should we call you?</Label>
              <Field value={parentName} onChangeText={setParentName} placeholder="your name" />
            </View>
            {stage === 'baby' && (
              <View style={{ gap: 8 }}>
                <Label>And the baby? Leave it empty and we'll say Nugget</Label>
                <Field value={babyName} onChangeText={setBabyName} placeholder="baby's name" />
              </View>
            )}
            <View style={{ gap: 8 }}>
              <Label>Where are you having care?</Label>
              <Small>Sets the checkups, scans and jabs on the Plan tab.</Small>
              <Wrap>
                {COUNTRY_ORDER.map((c) => (
                  <Chip key={c} label={`${CARE_SYSTEMS[c].flag} ${CARE_SYSTEMS[c].label}`} selected={country === c} onPress={() => setCountry(c)} />
                ))}
              </Wrap>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 22, paddingTop: 0, gap: 10 }}>
        {step < STEPS - 1 ? (
          <Button title="Continue" tone="ink" size="lg" full onPress={() => { tap(); setStep((s) => s + 1); }} />
        ) : (
          <>
            <Button title="Start with nothing logged" tone="ink" size="lg" full onPress={() => finish(false)} />
            <Button title="Fill it with sixty days of demo data" tone="quiet" full onPress={() => finish(true)} />
          </>
        )}
        {step > 0 && <Button title="Back" tone="ghost" full onPress={() => setStep((s) => s - 1)} />}
      </View>
    </SafeAreaView>
  );
}

function Point({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: palette.cardSunk, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 15 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...type.bodyMed, color: palette.ink }}>{title}</Text>
        <Small>{text}</Small>
      </View>
    </View>
  );
}

function Choice({ emoji, title, text, on, onPress }: { emoji: string; title: string; text: string; on: boolean; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={{ borderWidth: 2, borderColor: on ? palette.dot : palette.line, backgroundColor: on ? palette.dotSoft : palette.card }}>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <Text style={{ fontSize: 32 }}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Heading>{title}</Heading>
          <Small>{text}</Small>
        </View>
        {on && <Text style={{ fontSize: 16, color: palette.dotDeep }}>✓</Text>}
      </View>
    </Card>
  );
}

/** A horizontal number scale — friendlier than typing a date, and no extra dependency. */
function Scale({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <View style={{ gap: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
        {steps.map((s) => (
          <Text
            key={s}
            onPress={() => { tap(); onChange(s); }}
            style={{
              width: 42, textAlign: 'center', paddingVertical: 11, borderRadius: radius.md, overflow: 'hidden',
              backgroundColor: s === value ? palette.ink : palette.cardSunk,
              color: s === value ? palette.paper : palette.inkSoft,
              ...type.bodyMed,
            }}
          >
            {s}
          </Text>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="−1" tone="quiet" size="sm" onPress={() => onChange(Math.max(min, value - 1))} />
        <Button title="+1" tone="quiet" size="sm" onPress={() => onChange(Math.min(max, value + 1))} />
      </View>
    </View>
  );
}

/** One scrollable row of pick-one options — the building block behind DateWheels. */
function Wheel({ label, options, value, onChange }: { label: string; options: { value: number; label: string }[]; value: number; onChange: (v: number) => void }) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    if (idx < 0) return;
    // Rough per-item width (they vary a little with label length) — good enough to
    // bring the current selection on screen without the user hunting for it.
    scrollRef.current?.scrollTo({ x: Math.max(0, idx * 48 - 60), animated: false });
    // Only re-run when the selected value moves to a different index — not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View style={{ gap: 6 }}>
      <Small>{label}</Small>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
        {options.map((o) => (
          <Text
            key={o.value}
            onPress={() => { tap(); onChange(o.value); }}
            style={{
              minWidth: 42, textAlign: 'center', paddingVertical: 11, paddingHorizontal: 10, borderRadius: radius.md, overflow: 'hidden',
              backgroundColor: o.value === value ? palette.ink : palette.cardSunk,
              color: o.value === value ? palette.paper : palette.inkSoft,
              ...type.bodyMed,
            }}
          >
            {o.label}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

/** Day / month / year pickers for an exact birth date — three scrollable wheels, no native date picker needed. */
function DateWheels({
  day, month, year, maxDay, minYear, maxYear, onChangeDay, onChangeMonth, onChangeYear,
}: {
  day: number; month: number; year: number; maxDay: number; minYear: number; maxYear: number;
  onChangeDay: (v: number) => void; onChangeMonth: (v: number) => void; onChangeYear: (v: number) => void;
}) {
  const days = Array.from({ length: maxDay }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
  const months = MONTHS.map((m, i) => ({ value: i, label: m.slice(0, 3) }));
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({ value: minYear + i, label: String(minYear + i) })).reverse();
  return (
    <View style={{ gap: 14 }}>
      <Wheel label="Day" options={days} value={day} onChange={onChangeDay} />
      <Wheel label="Month" options={months} value={month} onChange={onChangeMonth} />
      <Wheel label="Year" options={years} value={year} onChange={onChangeYear} />
    </View>
  );
}
