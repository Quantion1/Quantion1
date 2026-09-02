import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryRow } from '@/components/EntryRow';
import { Mascot } from '@/components/Mascot';
import { Body, Button3D, Chip, Divider, Heading, Label, Stepper, Title, success, tap } from '@/components/ui';
import { monthInfo } from '@/domain/baby';
import { logTypeConfig } from '@/domain/logTypes';
import type { Entry, LogType } from '@/domain/types';
import { formatDuration, formatTime } from '@/lib/date';
import { lbToKg, inToCm, kgToLb, cmToIn, mlToOz, ozToMl } from '@/lib/units';
import { useProfile, useSettings, useStore } from '@/state/store';
import { accent, palette, radius } from '@/theme';

const SYMPTOMS = [
  'Nausea', 'Fatigue', 'Heartburn', 'Back pain', 'Headache', 'Cravings',
  'Insomnia', 'Swelling', 'Braxton Hicks', 'Dizziness', 'Cramps', 'Reflux',
];
const BABY_TAGS = ['Happy', 'Fussy', 'Gassy', 'Teething', 'Clingy', 'Playful', 'Congested', 'Rash', 'Fever'];
const APPT_KINDS = [
  { k: 'scan', label: 'Scan', emoji: '🩻' },
  { k: 'midwife', label: 'Midwife', emoji: '🤱' },
  { k: 'doctor', label: 'Doctor', emoji: '🩺' },
  { k: 'class', label: 'Class', emoji: '📚' },
  { k: 'vaccine', label: 'Vaccine', emoji: '💉' },
  { k: 'other', label: 'Other', emoji: '📌' },
] as const;

export default function LogScreen() {
  const { type } = useLocalSearchParams<{ type: LogType }>();
  const router = useRouter();
  const settings = useSettings();
  const profile = useProfile();
  const addEntry = useStore((s) => s.addEntry);
  const entries = useStore((s) => s.entries);
  const cfg = logTypeConfig(type as LogType);
  const a = accent(cfg.accent);

  const [minutesAgo, setMinutesAgo] = useState(0);
  const [note, setNote] = useState('');
  const at = useMemo(() => new Date(Date.now() - minutesAgo * 60000).toISOString(), [minutesAgo]);

  // ---- per-type local state
  const [feedMethod, setFeedMethod] = useState<'left' | 'right' | 'bottle' | 'solids'>('left');
  const [feedMinutes, setFeedMinutes] = useState(12);
  const [feedMl, setFeedMl] = useState(120);

  const [sleepKind, setSleepKind] = useState<'nap' | 'night'>('nap');
  const [sleepMinutes, setSleepMinutes] = useState(45);
  const [wakings, setWakings] = useState(0);

  const [diaperKind, setDiaperKind] = useState<'wet' | 'dirty' | 'mixed' | 'dry'>('wet');

  const lastGrowth = entries.find((e) => e.type === 'growth') as any;
  const [weightKg, setWeightKg] = useState<number>(lastGrowth?.weightKg ?? 4.5);
  const [lengthCm, setLengthCm] = useState<number>(lastGrowth?.lengthCm ?? 55);
  const [headCm, setHeadCm] = useState<number>(lastGrowth?.headCm ?? 38);

  const [mood, setMood] = useState(4);
  const [severity, setSeverity] = useState(2);
  const [tags, setTags] = useState<string[]>([]);

  const lastWeight = entries.find((e) => e.type === 'weight') as any;
  const [motherKg, setMotherKg] = useState<number>(lastWeight?.kg ?? profile.prePregnancyWeightKg ?? 65);

  const [milestoneKey, setMilestoneKey] = useState('');
  const [apptTitle, setApptTitle] = useState('');
  const [apptKind, setApptKind] = useState<(typeof APPT_KINDS)[number]['k']>('midwife');
  const [apptInDays, setApptInDays] = useState(7);

  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const save = (extra: Partial<Entry>) => {
    addEntry({ type: type as LogType, at, note: note.trim() || undefined, ...(extra as any) } as any);
    success();
    router.back();
  };

  const canSave =
    type === 'milestone' ? !!milestoneKey.trim() : type === 'appointment' ? !!apptTitle.trim() : true;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 2,
            borderBottomColor: palette.line,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: radius.md,
              backgroundColor: a.soft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 21 }}>{cfg.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Title style={{ fontSize: 19 }}>{cfg.label}</Title>
            <Text style={{ fontSize: 11, fontWeight: '800', color: a.dark }}>+{cfg.xp} XP</Text>
          </View>
          <Pressable
            onPress={() => {
              tap();
              router.back();
            }}
            hitSlop={12}
          >
            <Text style={{ fontSize: 22, color: palette.inkFaint, fontWeight: '900' }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, gap: 18, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          {/* ------------------------------------------------------- FEED */}
          {type === 'feed' && (
            <>
              <Section title="Method">
                <Wrap>
                  {(['left', 'right', 'bottle', 'solids'] as const).map((m) => (
                    <Chip
                      key={m}
                      tone="sky"
                      label={m === 'left' ? 'Left breast' : m === 'right' ? 'Right breast' : m === 'bottle' ? 'Bottle' : 'Solids'}
                      emoji={m === 'bottle' ? '🍼' : m === 'solids' ? '🥄' : '🤱'}
                      selected={feedMethod === m}
                      onPress={() => setFeedMethod(m)}
                    />
                  ))}
                </Wrap>
              </Section>
              {feedMethod === 'bottle' ? (
                <Section title={`Volume (${settings.units === 'metric' ? 'ml' : 'oz'})`}>
                  <Stepper
                    tone="sky"
                    value={settings.units === 'metric' ? feedMl : +mlToOz(feedMl).toFixed(1)}
                    decimals={settings.units === 'metric' ? 0 : 1}
                    step={settings.units === 'metric' ? 10 : 0.5}
                    min={0}
                    max={settings.units === 'metric' ? 400 : 14}
                    suffix={settings.units === 'metric' ? 'ml' : 'oz'}
                    onChange={(v) => setFeedMl(settings.units === 'metric' ? v : ozToMl(v))}
                  />
                </Section>
              ) : feedMethod === 'solids' ? (
                <Body>Log what they tried in the note below — useful when you are watching for reactions.</Body>
              ) : (
                <Section title="Duration">
                  <LiveTimer minutes={feedMinutes} onChange={setFeedMinutes} tone="sky" />
                </Section>
              )}
            </>
          )}

          {/* ------------------------------------------------------ SLEEP */}
          {type === 'sleep' && (
            <>
              <Section title="Kind">
                <Wrap>
                  <Chip tone="grape" label="Nap" emoji="☀️" selected={sleepKind === 'nap'} onPress={() => setSleepKind('nap')} />
                  <Chip tone="grape" label="Night sleep" emoji="🌙" selected={sleepKind === 'night'} onPress={() => setSleepKind('night')} />
                </Wrap>
              </Section>
              <Section title="How long?">
                <LiveTimer minutes={sleepMinutes} onChange={setSleepMinutes} tone="grape" step={5} />
              </Section>
              {sleepKind === 'night' && (
                <Section title="Wakings during this block">
                  <Stepper tone="grape" value={wakings} onChange={setWakings} min={0} max={12} />
                </Section>
              )}
              <Hint text={`Typical total sleep at this age: ${sleepHint(profile.birthDate)}`} />
            </>
          )}

          {/* ----------------------------------------------------- DIAPER */}
          {type === 'diaper' && (
            <Section title="What was in there?">
              <Wrap>
                {(['wet', 'dirty', 'mixed', 'dry'] as const).map((k) => (
                  <Chip
                    key={k}
                    tone="mint"
                    label={k[0].toUpperCase() + k.slice(1)}
                    emoji={k === 'wet' ? '💧' : k === 'dirty' ? '💩' : k === 'mixed' ? '🌊' : '☁️'}
                    selected={diaperKind === k}
                    onPress={() => setDiaperKind(k)}
                  />
                ))}
              </Wrap>
            </Section>
          )}

          {/* ----------------------------------------------------- GROWTH */}
          {type === 'growth' && (
            <>
              <Section title={`Weight (${settings.units === 'metric' ? 'kg' : 'lb'})`}>
                <Stepper
                  tone="coral"
                  value={settings.units === 'metric' ? weightKg : +kgToLb(weightKg).toFixed(1)}
                  decimals={settings.units === 'metric' ? 2 : 1}
                  step={settings.units === 'metric' ? 0.05 : 0.1}
                  min={1}
                  max={settings.units === 'metric' ? 20 : 44}
                  suffix={settings.units === 'metric' ? 'kg' : 'lb'}
                  onChange={(v) => setWeightKg(settings.units === 'metric' ? v : lbToKg(v))}
                />
              </Section>
              <Section title={`Length (${settings.units === 'metric' ? 'cm' : 'in'})`}>
                <Stepper
                  tone="coral"
                  value={settings.units === 'metric' ? lengthCm : +cmToIn(lengthCm).toFixed(1)}
                  decimals={1}
                  step={settings.units === 'metric' ? 0.5 : 0.25}
                  min={30}
                  max={settings.units === 'metric' ? 100 : 40}
                  suffix={settings.units === 'metric' ? 'cm' : 'in'}
                  onChange={(v) => setLengthCm(settings.units === 'metric' ? v : inToCm(v))}
                />
              </Section>
              <Section title={`Head circumference (${settings.units === 'metric' ? 'cm' : 'in'})`}>
                <Stepper
                  tone="coral"
                  value={settings.units === 'metric' ? headCm : +cmToIn(headCm).toFixed(1)}
                  decimals={1}
                  step={settings.units === 'metric' ? 0.2 : 0.1}
                  min={25}
                  max={settings.units === 'metric' ? 60 : 24}
                  suffix={settings.units === 'metric' ? 'cm' : 'in'}
                  onChange={(v) => setHeadCm(settings.units === 'metric' ? v : inToCm(v))}
                />
              </Section>
            </>
          )}

          {/* -------------------------------------------------- BABY MOOD */}
          {type === 'babyMood' && (
            <>
              <Section title="How was the day?">
                <MoodPicker value={mood} onChange={setMood} />
              </Section>
              <Section title="Anything going on?">
                <Wrap>
                  {BABY_TAGS.map((t) => (
                    <Chip key={t} tone="sunny" label={t} selected={tags.includes(t)} onPress={() => setTags(toggle(tags, t))} />
                  ))}
                </Wrap>
              </Section>
            </>
          )}

          {/* -------------------------------------------------- MILESTONE */}
          {type === 'milestone' && (
            <>
              <Section title="Suggested for this age">
                <Wrap>
                  {monthInfo(monthsOld(profile.birthDate)).milestones.map((m) => (
                    <Chip key={m} tone="blossom" label={m} selected={milestoneKey === m} onPress={() => setMilestoneKey(m)} />
                  ))}
                </Wrap>
              </Section>
              <Section title="Or write your own">
                <Input value={milestoneKey} onChangeText={setMilestoneKey} placeholder="Slept through the night!" />
              </Section>
            </>
          )}

          {/* ---------------------------------------------------- SYMPTOM */}
          {type === 'symptom' && (
            <>
              <Section title="How are you feeling?">
                <MoodPicker value={mood} onChange={setMood} />
              </Section>
              <Section title="Symptoms today">
                <Wrap>
                  {SYMPTOMS.map((s) => (
                    <Chip key={s} tone="blossom" label={s} selected={tags.includes(s)} onPress={() => setTags(toggle(tags, s))} />
                  ))}
                </Wrap>
              </Section>
              <Section title="How intense overall?">
                <Stepper tone="blossom" value={severity} onChange={setSeverity} min={1} max={5} suffix="/ 5" />
              </Section>
            </>
          )}

          {/* ----------------------------------------------------- WEIGHT */}
          {type === 'weight' && (
            <>
              <Section title={`Your weight (${settings.units === 'metric' ? 'kg' : 'lb'})`}>
                <Stepper
                  tone="mint"
                  value={settings.units === 'metric' ? motherKg : +kgToLb(motherKg).toFixed(1)}
                  decimals={1}
                  step={settings.units === 'metric' ? 0.1 : 0.2}
                  min={35}
                  max={settings.units === 'metric' ? 180 : 400}
                  suffix={settings.units === 'metric' ? 'kg' : 'lb'}
                  onChange={(v) => setMotherKg(settings.units === 'metric' ? v : lbToKg(v))}
                />
              </Section>
              <Hint text="Weigh yourself at the same time of day — first thing in the morning is the most consistent." />
            </>
          )}

          {/* ------------------------------------------------------ KICKS */}
          {type === 'kicks' && <KickCounter onDone={(count, durationMin) => save({ count, durationMin } as any)} />}

          {/* ------------------------------------------------ CONTRACTION */}
          {type === 'contraction' && <ContractionTimer />}

          {/* ------------------------------------------------ APPOINTMENT */}
          {type === 'appointment' && (
            <>
              <Section title="What is it?">
                <Input value={apptTitle} onChangeText={setApptTitle} placeholder="20-week anomaly scan" />
              </Section>
              <Section title="Kind">
                <Wrap>
                  {APPT_KINDS.map((k) => (
                    <Chip key={k.k} tone="sky" label={k.label} emoji={k.emoji} selected={apptKind === k.k} onPress={() => setApptKind(k.k)} />
                  ))}
                </Wrap>
              </Section>
              <Section title="When?">
                <Stepper tone="sky" value={apptInDays} onChange={setApptInDays} min={-30} max={200} suffix="days from now" />
              </Section>
            </>
          )}

          {/* --------------------------------------------------- shared -- */}
          {type !== 'kicks' && type !== 'contraction' && (
            <>
              <Divider />
              <Section title="When did it happen?">
                <Wrap>
                  {[0, 15, 30, 60, 120].map((m) => (
                    <Chip
                      key={m}
                      tone={cfg.accent}
                      label={m === 0 ? 'Now' : `${m < 60 ? `${m}m` : `${m / 60}h`} ago`}
                      selected={minutesAgo === m}
                      onPress={() => setMinutesAgo(m)}
                    />
                  ))}
                </Wrap>
                <Text style={{ marginTop: 8, fontSize: 12, fontWeight: '800', color: palette.inkFaint }}>
                  Saving as {formatTime(at, settings.clock24h)}
                </Text>
              </Section>

              <Section title="Note (optional)">
                <Input value={note} onChangeText={setNote} placeholder="Anything worth remembering?" multiline />
              </Section>

              <Button3D
                title={`Save · +${cfg.xp} XP`}
                tone={cfg.accent}
                size="lg"
                full
                disabled={!canSave}
                onPress={() => {
                  switch (type) {
                    case 'feed':
                      return save(
                        feedMethod === 'bottle'
                          ? ({ method: 'bottle', ml: Math.round(feedMl) } as any)
                          : feedMethod === 'solids'
                            ? ({ method: 'solids' } as any)
                            : ({ method: feedMethod, minutes: feedMinutes } as any),
                      );
                    case 'sleep':
                      return save({ minutes: sleepMinutes, kind: sleepKind, wakings } as any);
                    case 'diaper':
                      return save({ kind: diaperKind } as any);
                    case 'growth':
                      return save({ weightKg, lengthCm, headCm } as any);
                    case 'babyMood':
                      return save({ mood, tags } as any);
                    case 'milestone':
                      return save({ key: milestoneKey.trim() } as any);
                    case 'symptom':
                      return save({ symptoms: tags, severity, mood } as any);
                    case 'weight':
                      return save({ kg: +motherKg.toFixed(1) } as any);
                    case 'appointment':
                      return save({
                        title: apptTitle.trim(),
                        kind: apptKind,
                        at: new Date(Date.now() + apptInDays * 86400000).toISOString(),
                      } as any);
                    default:
                      return save({} as any);
                  }
                }}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------ helpers */

const monthsOld = (birthDate?: string) =>
  birthDate ? (Date.now() - +new Date(birthDate)) / (30.4375 * 86_400_000) : 0;

const sleepHint = (birthDate?: string) => {
  const info = monthInfo(monthsOld(birthDate));
  return `${info.sleepLow}–${info.sleepHigh}h across 24h, in ${info.wakeWindowMin}–${info.wakeWindowMax} min wake windows.`;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Label>{title}</Label>
      {children}
    </View>
  );
}

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>
);

function Hint({ text }: { text: string }) {
  return (
    <View style={{ backgroundColor: palette.cloud, borderRadius: radius.md, padding: 12, flexDirection: 'row', gap: 8 }}>
      <Text>💡</Text>
      <Body style={{ flex: 1, fontSize: 13 }}>{text}</Body>
    </View>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={palette.inkFaint}
      multiline={multiline}
      style={{
        borderWidth: 2,
        borderColor: palette.line,
        borderRadius: radius.md,
        padding: 14,
        fontSize: 15,
        fontWeight: '600',
        color: palette.ink,
        minHeight: multiline ? 76 : 50,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
    />
  );
}

const MOOD_FACES = ['😖', '🙁', '😐', '🙂', '😄'];

function MoodPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {MOOD_FACES.map((f, i) => {
        const v = i + 1;
        const selected = value === v;
        return (
          <Pressable
            key={f}
            onPress={() => {
              tap();
              onChange(v);
            }}
            style={{
              width: 58,
              height: 58,
              borderRadius: radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? palette.sunnySoft : palette.cloud,
              borderWidth: 2,
              borderColor: selected ? palette.sunny : 'transparent',
            }}
          >
            <Text style={{ fontSize: 28, opacity: selected ? 1 : 0.5 }}>{f}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Stepper with an optional live stopwatch that writes into the same value. */
function LiveTimer({
  minutes,
  onChange,
  tone,
  step = 1,
}: {
  minutes: number;
  onChange: (v: number) => void;
  tone: any;
  step?: number;
}) {
  const [running, setRunning] = useState(false);
  const startRef = useRef<number>(0);
  const [, force] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const elapsed = running ? Math.round((Date.now() - startRef.current) / 60000) : 0;

  return (
    <View style={{ gap: 12 }}>
      <Stepper tone={tone} value={running ? elapsed : minutes} onChange={onChange} step={step} min={0} max={720} suffix="min" />
      <Button3D
        title={running ? `Stop timer · ${formatDuration(elapsed)}` : 'Start live timer'}
        tone={running ? 'coral' : 'neutral'}
        size="sm"
        full
        onPress={() => {
          if (running) {
            onChange(Math.max(1, Math.round((Date.now() - startRef.current) / 60000)));
            setRunning(false);
          } else {
            startRef.current = Date.now();
            setRunning(true);
          }
        }}
      />
    </View>
  );
}

function KickCounter({ onDone }: { onDone: (count: number, durationMin: number) => void }) {
  const [count, setCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    if (startedAt == null) return;
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const elapsedMin = startedAt ? (Date.now() - startedAt) / 60000 : 0;
  const done = count >= 10;

  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <Mascot size={90} mood={done ? 'cheer' : 'happy'} />
      <Heading>{done ? '10 kicks — session complete!' : 'Tap every time you feel a movement'}</Heading>
      <Body style={{ textAlign: 'center' }}>
        A common guide is 10 movements within two hours. Patterns matter more than the count — tell your midwife if it
        changes.
      </Body>

      <Pressable
        onPress={() => {
          tap();
          if (startedAt == null) setStartedAt(Date.now());
          setCount((c) => Math.min(10, c + 1));
        }}
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: done ? palette.mintSoft : palette.sunnySoft,
          borderWidth: 5,
          borderColor: done ? palette.mint : palette.sunny,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 64, fontWeight: '900', color: done ? palette.mintDark : palette.sunnyDark }}>{count}</Text>
        <Text style={{ fontSize: 13, fontWeight: '900', color: palette.inkSoft }}>of 10 kicks</Text>
        <Text style={{ fontSize: 12, fontWeight: '800', color: palette.inkFaint, marginTop: 4 }}>
          {startedAt ? formatDuration(elapsedMin) : 'tap to start'}
        </Text>
      </Pressable>

      <Button3D
        title={done ? 'Save session' : `Save ${count} kicks`}
        tone="sunny"
        size="lg"
        full
        disabled={count === 0}
        onPress={() => onDone(count, Math.max(1, Math.round(elapsedMin)))}
      />
    </View>
  );
}

function ContractionTimer() {
  const addEntry = useStore((s) => s.addEntry);
  const entries = useStore((s) => s.entries);
  const [runningSince, setRunningSince] = useState<number | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    if (runningSince == null) return;
    const id = setInterval(() => force((n) => n + 1), 500);
    return () => clearInterval(id);
  }, [runningSince]);

  const recent = entries.filter((e) => e.type === 'contraction').slice(0, 6) as any[];
  const elapsedSec = runningSince ? (Date.now() - runningSince) / 1000 : 0;

  // 5-1-1 rule readout: contractions 5 minutes apart, lasting 1 minute, for 1 hour.
  const lastThree = recent.slice(0, 3);
  const avgInterval = lastThree.length
    ? lastThree.reduce((s, e) => s + (e.intervalSec ?? 0), 0) / lastThree.length / 60
    : 0;
  const avgDuration = lastThree.length ? lastThree.reduce((s, e) => s + e.durationSec, 0) / lastThree.length : 0;

  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <Heading>{runningSince ? 'Contraction in progress' : 'Ready when you are'}</Heading>
      <Pressable
        onPress={() => {
          tap();
          if (runningSince == null) {
            setRunningSince(Date.now());
          } else {
            const durationSec = Math.round((Date.now() - runningSince) / 1000);
            const prev = entries.find((e) => e.type === 'contraction');
            const intervalSec = prev ? Math.round((runningSince - +new Date(prev.at)) / 1000) : undefined;
            addEntry({ type: 'contraction', at: new Date(runningSince).toISOString(), durationSec, intervalSec } as any);
            setRunningSince(null);
            success();
          }
        }}
        style={{
          width: 210,
          height: 210,
          borderRadius: 105,
          backgroundColor: runningSince ? palette.coralSoft : palette.cloud,
          borderWidth: 5,
          borderColor: runningSince ? palette.coral : palette.line,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 52, fontWeight: '900', color: runningSince ? palette.coralDark : palette.ink }}>
          {Math.floor(elapsedSec / 60)}:{`${Math.floor(elapsedSec % 60)}`.padStart(2, '0')}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '900', color: palette.inkSoft, marginTop: 4 }}>
          {runningSince ? 'TAP TO STOP' : 'TAP TO START'}
        </Text>
      </Pressable>

      {lastThree.length >= 2 && (
        <View style={{ backgroundColor: palette.cloud, borderRadius: radius.md, padding: 14, alignSelf: 'stretch', gap: 4 }}>
          <Text style={{ fontWeight: '900', color: palette.ink }}>Last three contractions</Text>
          <Body style={{ fontSize: 13 }}>
            About {avgInterval.toFixed(1)} min apart, lasting {Math.round(avgDuration)}s on average.
          </Body>
          <Body style={{ fontSize: 13 }}>
            {avgInterval <= 5 && avgDuration >= 45
              ? 'That matches the 5-1-1 pattern many hospitals ask about. Call your midwife.'
              : 'Keep timing. Many services ask you to call at 5 minutes apart, lasting 1 minute, for 1 hour.'}
          </Body>
        </View>
      )}

      {!!recent.length && (
        <View style={{ alignSelf: 'stretch' }}>
          <Label>Recent</Label>
          {recent.map((e) => (
            <EntryRow key={e.id} entry={e} showRelative />
          ))}
        </View>
      )}
    </View>
  );
}
