import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Dot } from '@/components/Dot';
import { Sheet } from '@/components/Sheet';
import {
  Body, Button, Chip, Field, Heading, Label, Rule, Section, Small, Stepper, Wrap, ping, tap,
} from '@/components/ui';
import { DRINKS } from '@/domain/drinks';
import { tracker } from '@/domain/trackers';
import type { Block, Entry } from '@/domain/types';
import { formatDuration, formatTime } from '@/lib/date';
import { fromDisplay, toDisplay } from '@/lib/units';
import { useSettings, useStore } from '@/state/store';
import { accent, palette, radius, shadow, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

type Draft = Partial<Omit<Entry, 'id' | 'createdAt' | 'tracker'>>;

const TEETH = [
  'Lower left central', 'Lower right central', 'Upper left central', 'Upper right central',
  'Upper left lateral', 'Upper right lateral', 'Lower left lateral', 'Lower right lateral',
  'Upper left first molar', 'Upper right first molar', 'Lower left first molar', 'Lower right first molar',
  'Upper left canine', 'Upper right canine', 'Lower left canine', 'Lower right canine',
];

export default function LogSheet() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const { key } = useLocalSearchParams<{ key: string }>();
  const router = useRouter();
  const settings = useSettings();
  const addEntry = useStore((s) => s.addEntry);
  const showToast = useStore((s) => s.showToast);
  const entries = useStore((s) => s.entries);

  const t = tracker(key as string);
  const a = accent(t.accent);

  const [draft, setDraft] = useState<Draft>({});
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [note, setNote] = useState('');
  const [details, setDetails] = useState(false);
  const at = useMemo(() => new Date(Date.now() - minutesAgo * 60000).toISOString(), [minutesAgo]);

  const set = (patch: Draft) => setDraft((d) => ({ ...d, ...patch }));

  // Seed defaults declared by the spec.
  useEffect(() => {
    const seed: Draft = {};
    for (const b of t.blocks) {
      if (b.t === 'number') {
        const field = b.field === 'amount2' ? 'amount2' : 'amount';
        (seed as any)[field] = b.def ?? 0;
      }
      if (b.t === 'pick' && b.def) seed.kind = b.def as string;
      if (b.t === 'faces') seed.face = 3;
      if (b.t === 'sides') seed.side = 'left';
      if (b.t === 'counter') seed.count = 0;
    }
    setDraft(seed);
  }, [key]);

  const save = (extra: Draft = {}, silent = false) => {
    addEntry({ tracker: t.key, at, note: note.trim() || undefined, ...draft, ...extra });
    if (!silent) ping();
    router.back();
  };

  // Blocks that already commit the entry themselves — a counter with its own
  // save, a drink you tap, an event you stamp. Appending the standard
  // when/note/save tail to these gave the sheet two save buttons and a second,
  // emptier way to log the same thing.
  const selfClosing = new Set(['confirm', 'counter', 'drinks', 'events', 'textlist']);
  const instant = t.blocks.length === 1 && (selfClosing.has(t.blocks[0].t) || t.blocks[0].instant);

  return (
    <Sheet emoji={t.emoji} emojiTint={a.soft} title={t.label} subtitle={t.blurb}>
      {t.blocks.map((b, i) => (
        <BlockView
          key={i}
          block={b}
          tone={t.accent}
          draft={draft}
          set={set}
          settings={settings}
          onInstant={(extra) => save(extra)}
          entries={entries}
          trackerKey={t.key}
        />
      ))}

      {!instant && (
        <>
          <Rule />

          {/* Almost every entry is "now, no note". Asking for both every time
              cost more height than the tracker itself, so they fold into one
              line that states what will be saved and opens if it is wrong. */}
          {details ? (
            <>
              <Section title="When">
                <Wrap>
                  {[0, 15, 30, 60, 120].map((m) => (
                    <Chip
                      key={m}
                      tone={t.accent}
                      small
                      label={m === 0 ? 'Now' : m < 60 ? `${m}m ago` : `${m / 60}h ago`}
                      selected={minutesAgo === m}
                      onPress={() => setMinutesAgo(m)}
                    />
                  ))}
                </Wrap>
              </Section>

              <Section title="Note (optional)">
                <Field value={note} onChangeText={setNote} placeholder="anything worth remembering" multiline />
              </Section>
            </>
          ) : (
            <Pressable onPress={() => { tap(); setDetails(true); }} hitSlop={8}>
              <Small>
                Saving as {formatTime(at, settings.clock24h)}
                <Small style={{ color: a.base }}>  ·  change the time or add a note</Small>
              </Small>
            </Pressable>
          )}

          <Button title="Save" tone={t.accent} size="lg" full onPress={() => save()} />
        </>
      )}
    </Sheet>
  );
}

/* ─────────────────────────────────────────────────────────────── blocks */

function BlockView({
  block, tone, draft, set, settings, onInstant, entries, trackerKey,
}: {
  block: Block;
  tone: any;
  draft: Draft;
  set: (p: Draft) => void;
  settings: any;
  onInstant: (extra: Draft) => void;
  entries: Entry[];
  trackerKey: string;
}) {
  // A fallback input stays folded until asked for: showing it beside the
  // primary one implies both need answering, and doubles the sheet.
  if (block.secondary) {
    return <Folded label={block.label ?? 'OR ENTER IT BY HAND'} tone={tone}>{body()}</Folded>;
  }
  return body();

  function body() {
  switch (block.t) {
    case 'timer':
      return <TimerBlock optional={block.optional} minutes={draft.minutes ?? 0} onChange={(m) => set({ minutes: m })} tone={tone} />;

    case 'timepair':
      return <TimePair block={block} draft={draft} set={set} />;

    case 'number': {
      const field = block.field === 'amount2' ? 'amount2' : 'amount';
      const raw = (draft as any)[field] ?? Number(block.def ?? 0);
      const d = toDisplay(raw, block.unit ?? '', settings.units);
      return (
        <Section title={block.label ?? d.unit.toUpperCase()}>
          <Stepper
            value={d.value}
            unit={d.unit}
            step={d.step}
            decimals={d.decimals}
            min={0}
            max={100000}
            presets={settings.units === 'metric' ? block.presets : undefined}
            onChange={(v) => set({ [field]: fromDisplay(v, block.unit ?? '', settings.units) } as Draft)}
          />
        </Section>
      );
    }

    case 'pick': {
      const opts = (block.opts ?? []) as [string, string][];
      return (
        <Section title={block.label ?? 'WHICH'}>
          <Wrap>
            {opts.map(([label, emoji]) => (
              <Chip
                key={label}
                tone={tone}
                label={label}
                emoji={emoji}
                selected={draft.kind === label}
                onPress={() => (block.instant ? onInstant({ kind: label }) : set({ kind: label }))}
              />
            ))}
          </Wrap>
        </Section>
      );
    }

    case 'chips': {
      const list = (block.opts ?? []) as string[];
      const chosen = draft.chips ?? [];
      return (
        <Section title={block.label ?? 'PICK ANY'}>
          <Wrap>
            {list.map((o) => (
              <Chip
                key={o}
                tone={tone}
                small
                label={o}
                selected={chosen.includes(o)}
                onPress={() => set({ chips: chosen.includes(o) ? chosen.filter((c) => c !== o) : [...chosen, o] })}
              />
            ))}
          </Wrap>
        </Section>
      );
    }

    case 'checks': {
      const list = (block.opts ?? []) as string[];
      const chosen = draft.checks ?? [];
      return (
        <Section title={block.label ?? 'TODAY'}>
          <View style={{ gap: 8 }}>
            {list.map((o) => {
              const on = chosen.includes(o);
              return (
                <Pressable
                  key={o}
                  onPress={() => { tap(); set({ checks: on ? chosen.filter((c) => c !== o) : [...chosen, o] }); }}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
                    borderRadius: radius.md, borderWidth: 1.5,
                    borderColor: on ? accent(tone).base : palette.line,
                    backgroundColor: on ? accent(tone).soft : palette.card,
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{on ? '☑' : '☐'}</Text>
                  <Body style={{ color: palette.ink }}>{o}</Body>
                </Pressable>
              );
            })}
          </View>
        </Section>
      );
    }

    case 'faces': {
      const faces = block.faces ?? ['😞', '😕', '😐', '🙂', '😄'];
      return (
        <Section title={block.label ?? 'HOW WAS IT'}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {faces.map((f, i) => {
              const v = i + 1;
              const on = draft.face === v;
              return (
                <Pressable
                  key={i}
                  onPress={() => { tap(); set({ face: v }); }}
                  style={{
                    width: 56, height: 56, borderRadius: radius.md,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: on ? accent(tone).soft : palette.cardSunk,
                    borderWidth: 1.5, borderColor: on ? accent(tone).base : palette.line,
                  }}
                >
                  <Text style={{ fontSize: 26, opacity: on ? 1 : 0.45 }}>{f}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>
      );
    }

    case 'text':
      return (
        <Section title={block.label ?? 'TEXT'}>
          <Field value={draft.text ?? ''} onChangeText={(v) => set({ text: v })} placeholder={block.ph} multiline />
        </Section>
      );

    case 'textlist':
      return <TextList block={block} entries={entries} trackerKey={trackerKey} onInstant={onInstant} />;

    case 'sides':
      return (
        <Section title="WHICH SIDE">
          <View style={{ gap: 12 }}>
            <Wrap>
              {(['left', 'right', 'both'] as const).map((s) => (
                <Chip
                  key={s}
                  tone={tone}
                  label={s === 'left' ? 'Left' : s === 'right' ? 'Right' : 'Both'}
                  emoji={s === 'left' ? '🫱' : s === 'right' ? '🫲' : '🤲'}
                  selected={draft.side === s}
                  onPress={() => set({ side: s })}
                />
              ))}
            </Wrap>
            <TimerBlock minutes={draft.minutes ?? 0} onChange={(m) => set({ minutes: m })} tone={tone} />
          </View>
        </Section>
      );

    case 'counter':
      return <Counter target={block.target ?? 10} count={draft.count ?? 0} tone={tone} set={set} onDone={onInstant} />;

    case 'confirm':
      return (
        <View style={{ alignItems: 'center', gap: 16, paddingVertical: 10 }}>
          <Dot stage="tummy" size={120} />
          <Heading>{block.label ?? 'Done'}</Heading>
          <Body style={{ textAlign: 'center' }}>One tap and it is written down. No minutes, no fuss.</Body>
          <Button title={block.label ?? 'Log it'} tone={tone} size="lg" full onPress={() => onInstant({ count: 1 })} />
        </View>
      );

    case 'drinks':
      return (
        <Section title="WHAT DID YOU DRINK">
          <Wrap>
            {DRINKS.filter((d) => settings.drinks.includes(d.id)).map((d) => (
              <Pressable
                key={d.id}
                onPress={() => { tap(); onInstant({ amount: d.ml, kind: d.label }); }}
                style={{
                  width: '48%', padding: 16, borderRadius: radius.lg,
                  backgroundColor: accent(tone).soft, borderWidth: 1, borderColor: palette.line,
                  alignItems: 'center', gap: 4,
                }}
              >
                {d.icon ? <d.icon size={30} color={accent(tone).base} /> : <Text style={{ fontSize: 26 }}>{d.emoji}</Text>}
                <Text style={{ ...type.bodyMed, color: palette.ink }}>{d.label}</Text>
                <Small>{d.ml} ml</Small>
              </Pressable>
            ))}
          </Wrap>
        </Section>
      );

    case 'teeth':
      return (
        <Section title="WHICH TOOTH CAME THROUGH">
          <Wrap>
            {TEETH.map((name) => (
              <Chip key={name} tone={tone} small label={name} selected={draft.text === name} onPress={() => set({ text: name })} />
            ))}
          </Wrap>
        </Section>
      );

    case 'events':
      return (
        <Section title="STAMP IT AS IT HAPPENS">
          <View style={{ gap: 8 }}>
            {(block.opts as string[]).map((o) => (
              <Button key={o} title={o} tone="quiet" full onPress={() => onInstant({ text: o })} />
            ))}
          </View>
        </Section>
      );

    case 'photo':
      return <PhotoBlock draft={draft} set={set} />;

    default:
      return null;
  }
  }
}

/**
 * A disclosure for an alternative input. Closed it costs one line; open it
 * behaves exactly as it did when it was always on screen.
 */
function Folded({ label, tone, children }: { label: string; tone: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const a = accent(tone);
  if (!open) {
    return (
      <Pressable onPress={() => { tap(); setOpen(true); }} hitSlop={8}>
        <Small style={{ color: a.base }}>{label.toLowerCase()}</Small>
      </Pressable>
    );
  }
  return <>{children}</>;
}

/* ─────────────────────────────────────────────────────── block helpers */

function TimerBlock({
  minutes, onChange, tone, optional,
}: {
  minutes: number;
  onChange: (m: number) => void;
  tone: any;
  optional?: boolean;
}) {
  const [running, setRunning] = useState(false);
  const [typing, setTyping] = useState(false);
  const startRef = useRef(0);
  const [, force] = useState(0);
  const a = accent(tone);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const elapsed = running ? (Date.now() - startRef.current) / 60000 : 0;

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Label>{optional ? 'TIME IT (OPTIONAL)' : 'TIME IT'}</Label>
        {/* Two entry methods stacked on top of each other doubled the height of
            every timed tracker. The timer is the one people came for; typing a
            number is the fallback, so it waits until it is asked for. */}
        {!running && (
          <Pressable onPress={() => { tap(); setTyping((v) => !v); }} hitSlop={8}>
            <Small style={{ color: a.base }}>{typing ? 'use the timer' : 'type it instead'}</Small>
          </Pressable>
        )}
      </View>

      {typing && !running ? (
        <Stepper value={minutes} unit="minutes" step={5} min={0} max={900} onChange={onChange} />
      ) : (
        <Pressable
          onPress={() => {
            tap();
            if (running) { onChange(Math.max(1, Math.round(elapsed))); setRunning(false); }
            else { startRef.current = Date.now(); setRunning(true); }
          }}
          style={{
            alignItems: 'center', paddingVertical: 22, borderRadius: radius.lg,
            backgroundColor: running ? a.soft : palette.cardSunk,
            borderWidth: 1.5, borderColor: running ? a.base : palette.line,
          }}
        >
          <Text style={{ ...type.numeral, color: running ? a.base : palette.ink }}>
            {running ? formatDuration(elapsed) : formatDuration(minutes)}
          </Text>
          <Small style={{ color: running ? a.base : palette.inkFaint }}>
            {running ? 'TAP TO STOP' : 'TAP TO START'}
          </Small>
        </Pressable>
      )}
    </View>
  );
}

function TimePair({ block, draft, set }: { block: Block; draft: Draft; set: (p: Draft) => void }) {
  const nowHM = (d: Date) => `${`${d.getHours()}`.padStart(2, '0')}:${`${d.getMinutes()}`.padStart(2, '0')}`;
  const [from, setFrom] = useState(() => nowHM(new Date(Date.now() - 60 * 60000)));
  const [to, setTo] = useState(() => nowHM(new Date()));

  const parse = (v: string) => {
    const [h, m] = v.split(':').map(Number);
    return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
  };

  useEffect(() => {
    if (block.single) return;
    const a = parse(from);
    const b = parse(to);
    if (a == null || b == null) return;
    const mins = b >= a ? b - a : 1440 - a + b;
    set({ minutes: mins });
  }, [from, to]);

  if (block.single) {
    return (
      <Section title={block.label ?? 'WHEN'}>
        <TimeInput value={to} onChange={setTo} />
      </Section>
    );
  }

  return (
    <Section title={block.label ?? (block.bedwake ? 'BED AND WAKE' : 'FROM AND TO')}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <TimeInput value={from} onChange={setFrom} />
        <Text style={{ ...type.body, color: palette.inkFaint }}>→</Text>
        <TimeInput value={to} onChange={setTo} />
      </View>
      <Small>{formatDuration(draft.minutes ?? 0)}</Small>
    </Section>
  );
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ flex: 1 }}>
      <Field value={value} onChangeText={onChange} placeholder="00:00" keyboardType="numeric" />
    </View>
  );
}

/**
 * One target to hit, one thing to tap. Everything a kick count needs is the
 * number and how long it took, so the circle carries both and the guidance is
 * a single line under it — a paragraph of reassurance is not what anyone is
 * reading at the twelfth kick.
 */
function Counter({
  target, count, tone, set, onDone,
}: {
  target: number;
  count: number;
  tone: any;
  set: (p: Draft) => void;
  onDone: (extra: Draft) => void;
}) {
  const startRef = useRef<number | null>(null);
  const [, force] = useState(0);
  const a = accent(tone);

  useEffect(() => {
    if (startRef.current == null) return;
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [count]);

  const elapsed = startRef.current ? (Date.now() - startRef.current) / 60000 : 0;
  const done = count >= target;

  return (
    <View style={{ alignItems: 'center', gap: 14 }}>
      <Pressable
        onPress={() => {
          tap();
          if (startRef.current == null) startRef.current = Date.now();
          set({ count: Math.min(target, count + 1), minutes: Math.max(1, Math.round(elapsed)) });
        }}
        style={{
          width: 208, height: 208, borderRadius: 104,
          backgroundColor: done ? palette.sageSoft : a.soft,
          borderWidth: 2, borderColor: done ? palette.sage : count ? a.base : palette.line,
          alignItems: 'center', justifyContent: 'center', gap: 2,
          ...shadow.rest,
        }}
      >
        <Text style={{ ...type.hero, fontSize: 64, color: done ? palette.sage : a.base }}>{count}</Text>
        {/* The elapsed time only appears once it means something. */}
        <Small style={{ color: a.base }}>
          {startRef.current ? `${formatDuration(elapsed)} · tap for every kick` : 'tap for every kick'}
        </Small>
      </Pressable>

      <Small style={{ textAlign: 'center' }}>Ten kicks within two hours is the usual check.</Small>

      <Button
        title="Save kick counter"
        tone={tone}
        size="lg"
        full
        disabled={count === 0}
        onPress={() => onDone({ count, minutes: Math.max(1, Math.round(elapsed)) })}
      />
    </View>
  );
}

function TextList({
  block, entries, trackerKey, onInstant,
}: {
  block: Block;
  entries: Entry[];
  trackerKey: string;
  onInstant: (extra: Draft) => void;
}) {
  const [value, setValue] = useState('');
  const mine = entries.filter((e) => e.tracker === trackerKey).slice(0, 8);

  return (
    <Section title={block.label ?? 'LIST'}>
      <Field value={value} onChangeText={setValue} placeholder={block.ph} multiline />
      <Button title="Add to the list" tone="quiet" full disabled={!value.trim()} onPress={() => onInstant({ text: value.trim() })} />
      {!!mine.length && (
        <View style={{ gap: 8, marginTop: 6 }}>
          {mine.map((e) => (
            <View key={e.id} style={{ flexDirection: 'row', gap: 8, padding: 12, backgroundColor: palette.cardSunk, borderRadius: radius.md }}>
              <Text>·</Text>
              <Body style={{ flex: 1, color: palette.ink }}>{e.text}</Body>
            </View>
          ))}
        </View>
      )}
    </Section>
  );
}

const GLYPHS = ['📷', '🤰', '🖥️', '👣', '🛁', '🎂', '🧸', '🌳', '🚗', '👵', '🐶', '🎄'];

function PhotoBlock({ draft, set }: { draft: Draft; set: (p: Draft) => void }) {
  return (
    <Section title="THE PHOTO">
      <Body style={{ fontSize: 13 }}>
        The camera is not wired up in this prototype — pick a stand-in and write the caption you would have written.
      </Body>
      <Wrap>
        {GLYPHS.map((g) => (
          <Pressable
            key={g}
            onPress={() => { tap(); set({ kind: g }); }}
            style={{
              width: 54, height: 54, borderRadius: radius.md,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: draft.kind === g ? palette.claySoft : palette.cardSunk,
              borderWidth: 1.5, borderColor: draft.kind === g ? palette.clay : palette.line,
            }}
          >
            <Text style={{ fontSize: 24 }}>{g}</Text>
          </Pressable>
        ))}
      </Wrap>
      <Field value={draft.text ?? ''} onChangeText={(v) => set({ text: v })} placeholder="caption" />
    </Section>
  );
}
