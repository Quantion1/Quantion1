import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { ProgressBar } from '@/components/ProgressRing';
import { Body, Button3D, Card, Chip, Heading, Label, Title, success, tap } from '@/components/ui';
import { weekInfo } from '@/domain/pregnancy';
import type { Mode } from '@/domain/types';
import { addDays, toDayKey } from '@/lib/date';
import { useStore } from '@/state/store';
import { palette, radius } from '@/theme';

const STEPS = 4;

export default function Onboarding() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const setSettings = useStore((s) => s.setSettings);
  const seedDemo = useStore((s) => s.seedDemo);

  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>('pregnancy');
  const [weeksPregnant, setWeeksPregnant] = useState(20);
  const [babyWeeksOld, setBabyWeeksOld] = useState(6);
  const [parentName, setParentName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [goalXp, setGoalXp] = useState(30);

  const dueDate = toDayKey(addDays(new Date(), (40 - weeksPregnant) * 7));
  const birthDate = toDayKey(addDays(new Date(), -babyWeeksOld * 7));

  const finish = (demo: boolean) => {
    if (demo) {
      seedDemo(mode);
    } else {
      setProfile({
        parentName: parentName.trim() || 'Parent',
        babyName: babyName.trim() || undefined,
        mode,
        dueDate: mode === 'pregnancy' ? dueDate : undefined,
        birthDate: mode === 'baby' ? birthDate : undefined,
        onboarded: true,
      });
    }
    setSettings({ dailyGoalXp: goalXp });
    success();
    router.replace('/(tabs)/today');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <ProgressBar progress={(step + 1) / STEPS} color={palette.blossom} height={12} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={{ alignItems: 'center', gap: 16, paddingTop: 24 }}>
            <Mascot size={150} mood="wave" />
            <Title style={{ fontSize: 32, textAlign: 'center' }}>Hi, I’m Pip 🌱</Title>
            <Body style={{ textAlign: 'center', fontSize: 16, maxWidth: 320 }}>
              I’ll help you track every feed, nap, kick and milestone — and turn it into patterns you can actually use.
            </Body>
            <View style={{ gap: 10, alignSelf: 'stretch', marginTop: 10 }}>
              <Feature emoji="📊" title="Real analysis" text="Sleep rasters, feeding rhythms, weight curves." />
              <Feature emoji="🔥" title="Streaks that stick" text="Daily goals, quests and badges keep the habit going." />
              <Feature emoji="🔒" title="Private by default" text="Everything stays on your device." />
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 16 }}>
            <Title>Where are you right now?</Title>
            <Body>You can switch later — nothing is lost when the baby arrives.</Body>
            <Choice
              emoji="🤰"
              title="I’m expecting"
              text="Track symptoms, weight, kicks and contractions week by week."
              selected={mode === 'pregnancy'}
              onPress={() => setMode('pregnancy')}
            />
            <Choice
              emoji="👶"
              title="Baby is here"
              text="Track feeds, sleep, diapers, growth and milestones."
              selected={mode === 'baby'}
              onPress={() => setMode('baby')}
            />
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 16 }}>
            {mode === 'pregnancy' ? (
              <>
                <Title>How far along are you?</Title>
                <Card tone="blossom" style={{ alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 54 }}>{weekInfo(weeksPregnant).emoji}</Text>
                  <Text style={{ fontSize: 40, fontWeight: '900', color: palette.ink }}>Week {weeksPregnant}</Text>
                  <Body style={{ textAlign: 'center' }}>
                    About the size of a {weekInfo(weeksPregnant).size} · due around {dueDate}
                  </Body>
                </Card>
                <Slider value={weeksPregnant} min={4} max={40} onChange={setWeeksPregnant} tone={palette.blossom} />
              </>
            ) : (
              <>
                <Title>How old is your baby?</Title>
                <Card tone="sky" style={{ alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 54 }}>👶</Text>
                  <Text style={{ fontSize: 40, fontWeight: '900', color: palette.ink }}>
                    {babyWeeksOld} week{babyWeeksOld === 1 ? '' : 's'}
                  </Text>
                  <Body>Born around {birthDate}</Body>
                </Card>
                <Slider value={babyWeeksOld} min={0} max={52} onChange={setBabyWeeksOld} tone={palette.sky} />
              </>
            )}
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: 16 }}>
            <Title>Last bit</Title>
            <View style={{ gap: 8 }}>
              <Label>What should I call you?</Label>
              <Input value={parentName} onChangeText={setParentName} placeholder="Your name" />
            </View>
            {mode === 'baby' && (
              <View style={{ gap: 8 }}>
                <Label>And the baby?</Label>
                <Input value={babyName} onChangeText={setBabyName} placeholder="Baby name" />
              </View>
            )}
            <View style={{ gap: 10 }}>
              <Label>Pick a daily goal</Label>
              <Body style={{ fontSize: 13 }}>Hit it every day to keep your streak. You can change it any time.</Body>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { xp: 20, label: 'Casual · 20 XP' },
                  { xp: 30, label: 'Regular · 30 XP' },
                  { xp: 50, label: 'Serious · 50 XP' },
                  { xp: 80, label: 'Intense · 80 XP' },
                ].map((g) => (
                  <Chip key={g.xp} tone="sunny" label={g.label} selected={goalXp === g.xp} onPress={() => setGoalXp(g.xp)} />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 20, gap: 10 }}>
        {step < STEPS - 1 ? (
          <Button3D
            title="Continue"
            tone="mint"
            size="lg"
            full
            onPress={() => {
              tap();
              setStep((s) => s + 1);
            }}
          />
        ) : (
          <>
            <Button3D title="Start tracking" tone="mint" size="lg" full onPress={() => finish(false)} />
            <Button3D title="Explore with demo data" tone="neutral" full onPress={() => finish(true)} />
          </>
        )}
        {step > 0 && <Button3D title="Back" tone="ghost" full onPress={() => setStep((s) => s - 1)} />}
      </View>
    </SafeAreaView>
  );
}

function Feature({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.md,
          backgroundColor: palette.cloud,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 21 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '900', color: palette.ink }}>{title}</Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: palette.inkSoft }}>{text}</Text>
      </View>
    </View>
  );
}

function Choice({
  emoji,
  title,
  text,
  selected,
  onPress,
}: {
  emoji: string;
  title: string;
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Card tone={selected ? 'blossom' : undefined} onPress={onPress} style={{ borderWidth: 3, borderColor: selected ? palette.blossom : palette.line }}>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <Text style={{ fontSize: 38 }}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Heading>{title}</Heading>
          <Body style={{ fontSize: 13, marginTop: 2 }}>{text}</Body>
        </View>
        <Text style={{ fontSize: 20 }}>{selected ? '✅' : ''}</Text>
      </View>
    </Card>
  );
}

/** Chunky tap-to-set scale, avoiding an extra native slider dependency. */
function Slider({
  value,
  min,
  max,
  onChange,
  tone,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  tone: string;
}) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <View style={{ gap: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
        {steps.map((s) => (
          <Text
            key={s}
            onPress={() => {
              tap();
              onChange(s);
            }}
            style={{
              width: 44,
              textAlign: 'center',
              paddingVertical: 12,
              borderRadius: radius.md,
              overflow: 'hidden',
              backgroundColor: s === value ? tone : palette.cloud,
              color: s === value ? palette.white : palette.inkSoft,
              fontWeight: '900',
              fontSize: 15,
            }}
          >
            {s}
          </Text>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button3D title="−1" tone="neutral" size="sm" onPress={() => onChange(Math.max(min, value - 1))} />
        <Button3D title="+1" tone="neutral" size="sm" onPress={() => onChange(Math.min(max, value + 1))} />
      </View>
    </View>
  );
}

function Input({ value, onChangeText, placeholder }: { value: string; onChangeText: (v: string) => void; placeholder: string }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={palette.inkFaint}
      style={{
        borderWidth: 2,
        borderColor: palette.line,
        borderRadius: radius.md,
        padding: 14,
        fontSize: 16,
        fontWeight: '700',
        color: palette.ink,
      }}
    />
  );
}
