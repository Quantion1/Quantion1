import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateInput } from '@/components/DateInput';
import { Dot } from '@/components/Dot';
import { Body, Button, Card, Chip, Field, Heading, Label, Small, Title, Wrap, ping, tap } from '@/components/ui';
import { CARE_SYSTEMS, COUNTRY_ORDER } from '@/domain/care';
import { cardFor } from '@/domain/cards';
import { babyAge, gestation } from '@/domain/stage';
import { starterTiles } from '@/domain/trackers';
import type { Stage } from '@/domain/types';
import { addDays, fromDayKey, MONTHS } from '@/lib/date';
import { useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

const STEPS = 4;

export default function Onboarding() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const setTiles = useStore((s) => s.setTiles);
  const captureMoment = useStore((s) => s.captureMoment);
  const seedDemo = useStore((s) => s.seedDemo);

  const today = new Date();

  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<Stage>('pregnancy');
  // Both are YYYY-MM-DD, or '' until a whole date has been typed in.
  const [dueDate, setDueDate] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [parentName, setParentName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [country, setCountry] = useState('NL');

  // A due date can be a few weeks past, for anyone overdue, and at most a whole
  // pregnancy ahead; a birth date is any day up to today.
  const dueMin = addDays(today, -21);
  const dueMax = addDays(today, 294);
  const birthMin = addDays(today, -365 * 3);

  const gest = dueDate ? gestation(dueDate) : undefined;
  const week = gest ? Math.min(40, Math.max(4, gest.week)) : 0;
  const age = birthDate ? babyAge(birthDate) : undefined;
  const dated = stage === 'pregnancy' ? !!dueDate : !!birthDate;

  const finish = (demo: boolean) => {
    if (demo) {
      seedDemo(stage);
    } else {
      setProfile({
        parentName: parentName.trim() || 'you',
        babyName: babyName.trim(),
        stage,
        country,
        dueDate: stage === 'pregnancy' ? dueDate || undefined : undefined,
        birthDate: stage === 'baby' ? birthDate || undefined : undefined,
        onboarded: true,
      });
      setTiles([{ key: 'today', span: 2 }, ...starterTiles(stage).map((key) => ({ key, span: 1 as const }))]);
      // The first moment is a given — you are here, reading this. A newborn's
      // is dated to the birth; a positive test has no date but the day you said so.
      captureMoment(
        stage === 'pregnancy' ? 'p_two_lines' : 'b_home',
        stage === 'baby' && birthDate ? fromDayKey(birthDate).toISOString() : new Date().toISOString(),
      );
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
                <Title>When are you due?</Title>
                <Body>The date from your dating scan, or your best guess. You can change it any time in settings.</Body>
                <DateInput
                  value={dueDate}
                  onChange={setDueDate}
                  min={dueMin}
                  max={dueMax}
                  outOfRange="A due date should be within the next forty-two weeks (or up to three weeks past)."
                />
                {gest ? (
                  <Card style={{ alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 46 }}>{cardFor('garden', week).emoji}</Text>
                    <Title style={{ fontSize: 26 }}>Week {gest.week}{gest.day ? ` + ${gest.day}` : ''}</Title>
                    <Body style={{ textAlign: 'center' }}>
                      About a {cardFor('garden', week).size} · {gest.daysLeft >= 0 ? `${gest.daysLeft} days to go` : `${-gest.daysLeft} days over`}
                    </Body>
                  </Card>
                ) : (
                  <Waiting text="Fill the date in and we'll work out which week you're on." />
                )}
              </>
            ) : (
              <>
                <Title>When was the baby born?</Title>
                <Body>The day of birth. Everything the app shows is counted from it.</Body>
                <DateInput
                  value={birthDate}
                  onChange={setBirthDate}
                  min={birthMin}
                  max={today}
                  outOfRange="A birth date can't be in the future, and Nest covers the first three years."
                />
                {age ? (
                  <Card style={{ alignItems: 'center', gap: 6 }}>
                    <Dot stage={age.weeks < 12 ? 'sleep' : age.weeks < 26 ? 'tummy' : 'sit'} size={110} />
                    <Title style={{ fontSize: 26 }}>{age.label}</Title>
                    <Body>Born {fromDayKey(birthDate).getDate()} {MONTHS[fromDayKey(birthDate).getMonth()]} {fromDayKey(birthDate).getFullYear()}</Body>
                  </Card>
                ) : (
                  <Waiting text="Fill the date in and we'll work out how old the baby is." />
                )}
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
          <Button
            title="Continue"
            tone="ink"
            size="lg"
            full
            disabled={step === 2 && !dated}
            onPress={() => { tap(); setStep((s) => s + 1); }}
          />
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

/** Stands in for the summary card until a whole date has been typed. */
function Waiting({ text }: { text: string }) {
  return (
    <Card style={{ alignItems: 'center', gap: 8, backgroundColor: palette.cardSunk }}>
      <Dot stage="egg1" size={80} />
      <Small style={{ textAlign: 'center' }}>{text}</Small>
    </Card>
  );
}
