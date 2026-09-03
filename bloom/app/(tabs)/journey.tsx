import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { confirmAlert } from '@/components/Confirm';
import { TimeInput } from '@/components/DateInput';
import { CardFace } from '@/components/CardFace';
import { MiniCalendarGrid } from '@/components/MiniCalendarGrid';
import { Body, Button, Card, Chip, Field, Heading, Label, Segmented, Small, Title, Wrap, styles, tap } from '@/components/ui';
import { BADGE_GROUPS, evaluateBadges } from '@/domain/badges';
import { ALBUM_WEEKS, cardFor, PACKS } from '@/domain/cards';
import { careState, careSystem, type CareItem } from '@/domain/care';
import { allMoments, eraStates, isCaptured, road, usually, type EraState, type Moment } from '@/domain/moments';
import type { PlanItem, Progress } from '@/domain/types';
import { exportToCalendar } from '@/lib/calendarExport';
import { addDays, fromDayKey, MONTHS, toDayKey, todayKey } from '@/lib/date';
import { useCardSync, useNest } from '@/state/hooks';
import { useProfile, usePremium, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

type Tab = 'moments' | 'cards' | 'badges' | 'plan';

const KINDS: { k: PlanItem['kind']; label: string; emoji: string }[] = [
  { k: 'appointment', label: 'Appointment', emoji: '🩺' },
  { k: 'scan', label: 'Scan', emoji: '🖥️' },
  { k: 'class', label: 'Class', emoji: '📚' },
  { k: 'visitor', label: 'Visitor', emoji: '🚪' },
  { k: 'reminder', label: 'Reminder', emoji: '🔔' },
];
const KIND_EMOJI: Record<PlanItem['kind'], string> = {
  appointment: '🩺', scan: '🖥️', class: '📚', visitor: '🚪', reminder: '🔔', care: '📅',
};

interface UpcomingRow {
  key: string;
  title: string;
  date: string;
  time?: string;
  emoji: string;
  subtitle?: string;
  planId?: string;
  careItem?: CareItem;
}

function formatWhen(dateKey: string, time?: string): string {
  const d = fromDayKey(dateKey);
  const rel =
    dateKey === todayKey() ? 'Today'
    : dateKey === toDayKey(addDays(new Date(), 1)) ? 'Tomorrow'
    : `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
  return time ? `${rel} · ${time}` : rel;
}

const shortDate = (at: string) => {
  const d = new Date(at);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};

export default function JourneyScreen() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const router = useRouter();
  const nest = useNest();
  const profile = useProfile();
  const progress = useStore((s) => s.progress);
  const entries = useStore((s) => s.entries);
  const plans = useStore((s) => s.plans);
  const addPlan = useStore((s) => s.addPlan);
  const updatePlan = useStore((s) => s.updatePlan);
  const deletePlan = useStore((s) => s.deletePlan);
  const setPack = useStore((s) => s.setPack);
  const premium = usePremium();
  const [tab, setTab] = useState<Tab>('moments');
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [kind, setKind] = useState<PlanItem['kind']>('appointment');
  useCardSync();

  const chapters = eraStates(nest.stage, progress, nest.position);
  const ahead = road(nest.stage, progress, nest.position);
  const total = allMoments(nest.stage).length;

  const badges = useMemo(() => evaluateBadges({ entries, progress }), [entries, progress]);
  const earned = badges.filter((b) => b.done).length;

  const maxWeek = nest.stage === 'pregnancy' ? Math.min(40, nest.week) : 40;

  const open = (m: Moment) => { tap(); router.push(`/moment/${m.id}`); };

  // ────────────────────────────────────────────────────────── coming up
  const care = careSystem(profile.country);
  const carePhase = nest.stage === 'pregnancy' ? 'preg' : 'baby';
  const carePos = nest.stage === 'pregnancy' ? nest.week : nest.days;

  /** A calendar guess for a week-ranged care item. Pregnancy items count back
   * from the due date; baby items count forward from the birth date, or, while
   * still pregnant, from the due date as the best stand-in for "day zero". */
  const estimateFor = (item: CareItem) => {
    if (item.phase === 'preg' && profile.dueDate) return toDayKey(addDays(new Date(profile.dueDate), -(40 - item.from) * 7));
    if (profile.birthDate) return toDayKey(addDays(new Date(profile.birthDate), item.from));
    if (profile.dueDate) return toDayKey(addDays(new Date(profile.dueDate), item.from));
    return todayKey();
  };

  const upcoming: UpcomingRow[] = useMemo(() => {
    const rows: UpcomingRow[] = [];
    for (const p of plans) {
      if (p.done) continue;
      const emoji = (p.careKey && care.items.find((i) => i.key === p.careKey)?.emoji) || KIND_EMOJI[p.kind] || '📌';
      rows.push({ key: p.id, title: p.title, date: p.date, time: p.time, emoji, planId: p.id });
    }
    for (const item of care.items) {
      const state = careState(item, carePhase, carePos);
      if (state === 'passed') continue;
      if (plans.some((p) => p.careKey === item.key)) continue;
      // A window that has already opened reads as "today", not the day it opened.
      const date = state === 'due' ? todayKey() : estimateFor(item);
      rows.push({ key: `care:${item.key}`, title: item.label, date, emoji: item.emoji, subtitle: item.what, careItem: item });
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '99:99').localeCompare(b.time ?? '99:99'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, care, carePhase, carePos, profile.dueDate, profile.birthDate]);

  const [hero, ...rest] = upcoming;
  const peek = 2;

  const resetForm = () => { setTitle(''); setDate(''); setTime(''); setKind('appointment'); };

  const exportRow = (row: UpcomingRow) => {
    tap();
    exportToCalendar({
      uid: row.planId ?? `care-${row.careItem?.key}`,
      title: row.title,
      description: row.subtitle,
      date: fromDayKey(row.date),
      time: row.time,
    }).catch(() => {});
  };

  const planCareItem = (item: CareItem) => {
    tap();
    addPlan({ title: item.label, date: estimateFor(item), kind: 'care', careKey: item.key });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 2 }}>
          <Title>The collection</Title>
          <Small>
            {nest.captured} of {total} moments · {nest.era}
          </Small>
        </View>

        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'moments', label: 'Moments' },
            { value: 'cards', label: 'Cards' },
            { value: 'badges', label: 'Badges' },
            { value: 'plan', label: 'Plan' },
          ]}
        />

        {/* ──────────────────────────────────────────────────── moments */}
        {tab === 'moments' && (
          <View style={{ gap: 18 }}>
            {ahead ? (
              <Card tint={palette.sageSoft}>
                <Label>Next chapter</Label>
                <Heading style={{ marginTop: 2 }}>{ahead.era.name}</Heading>
                <Body style={{ fontSize: 13, marginTop: 2 }}>{ahead.era.blurb}</Body>
                <Meter value={ahead.progress} />
                {/* Age first: it is the real gate, and the one that moves on its own. */}
                <Small>
                  {ahead.away > 0
                    ? nest.stage === 'pregnancy'
                      ? `Opens in ${ahead.away} ${ahead.away === 1 ? 'week' : 'weeks'}, as they grow into it.`
                      : `Opens in ${ahead.away} ${ahead.away === 1 ? 'day' : 'days'}, as they grow into it.`
                    : ahead.blocking.length
                      ? `Old enough — waiting on ${ahead.blocking.length} ${ahead.blocking.length === 1 ? 'moment' : 'moments'} from the chapter above.`
                      : 'Opening now.'}
                </Small>
              </Card>
            ) : (
              <Card tint={palette.sageSoft}>
                <Label>The road</Label>
                <Heading style={{ marginTop: 2 }}>Every chapter is open</Heading>
                <Body style={{ fontSize: 13, marginTop: 2 }}>
                  Nothing left to unlock — only things left to happen.
                </Body>
              </Card>
            )}

            {chapters.map((c) => (
              <Chapter key={c.era.id} state={c} progress={progress} stage={nest.stage} onOpen={open} />
            ))}

            <Small style={{ textAlign: 'center' }}>
              Moments come from the baby's life, not the app's. Nothing you log here can speed one up.
            </Small>
          </View>
        )}

        {/* ────────────────────────────────────────────────────── cards */}
        {tab === 'cards' && (
          <View style={{ gap: 14 }}>
            <Body style={{ fontSize: 13 }}>
              {nest.stage === 'pregnancy'
                ? 'One card a week, four to forty, earned by reaching the week. Open one to read what was being built in there at the time.'
                : 'The pregnancy is over, so the album is open in full. Open any week to read what was being built in there at the time.'}
              {' '}The pack changes what the baby is compared to — never the measurements.
            </Body>

            <Wrap>
              {PACKS.map((p) => (
                <Chip
                  key={p.id}
                  label={p.premium && !premium ? `${p.name} 🔒` : p.name}
                  selected={progress.activePack === p.id}
                  onPress={() => (p.premium && !premium ? router.push('/paywall') : setPack(p.id))}
                />
              ))}
            </Wrap>
            <Small>{PACKS.find((p) => p.id === progress.activePack)?.blurb}</Small>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }}>
              {ALBUM_WEEKS.map((w) => {
                const reachable = w <= maxWeek;
                return (
                  <Pressable
                    key={w}
                    onPress={() => { if (reachable) { tap(); router.push(`/card/${w}`); } }}
                    style={{ opacity: reachable ? 1 : 0.4 }}
                  >
                    <CardFace card={cardFor(progress.activePack, w)} collected={progress.cards.includes(w)} size="sm" />
                  </Pressable>
                );
              })}
            </View>
            <Small style={{ textAlign: 'center' }}>
              {progress.cards.length} of {ALBUM_WEEKS.length} collected · tap a card to open it
            </Small>
          </View>
        )}

        {/* ───────────────────────────────────────────────────── badges */}
        {tab === 'badges' && (
          <View style={{ gap: 18 }}>
            <Body style={{ fontSize: 13 }}>
              Badges are about you, not the baby — showing up, logging at strange hours, and sheer accumulated volume.
              {' '}{earned} of {badges.length} so far.
            </Body>
            {BADGE_GROUPS.map((g) => (
              <View key={g} style={{ gap: 8 }}>
                <Label>{g}</Label>
                {badges.filter((b) => b.def.group === g).map((b) => (
                  <View
                    key={b.def.id}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
                      borderRadius: radius.md, backgroundColor: b.done ? palette.card : palette.cardSunk,
                      borderWidth: 1, borderColor: b.done ? palette.dot : palette.line,
                    }}
                  >
                    <Text style={{ fontSize: 21, opacity: b.done ? 1 : 0.35 }}>{b.def.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...type.bodyMed, color: b.done ? palette.ink : palette.inkSoft }}>{b.def.name}</Text>
                      <Small numberOfLines={1}>{b.def.description}</Small>
                    </View>
                    <Text style={{ ...type.label, color: b.done ? palette.sage : palette.inkFaint }}>
                      {b.done ? 'DONE' : `${b.current}/${b.target}`}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ─────────────────────────────────────────────────────── plan */}
        {tab === 'plan' && (
          <View style={{ gap: 14 }}>
            <Body style={{ fontSize: 13 }}>
              {upcoming.length
                ? `${upcoming.length} thing${upcoming.length === 1 ? '' : 's'} on the way, ${care.flag} ${care.label} pathway included.`
                : `Nothing on the way. ${care.flag} ${care.label} pathway included once anything is due.`}
            </Body>

            {hero ? (
              <Card tint={palette.dotSoft}>
                <Label>Next up</Label>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginTop: 4 }}>
                  <Text style={{ fontSize: 26 }}>{hero.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Heading>{hero.title}</Heading>
                    <Small>{formatWhen(hero.date, hero.time)}</Small>
                    {!!hero.subtitle && <Body style={{ fontSize: 13, marginTop: 6 }}>{hero.subtitle}</Body>}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  {hero.planId ? (
                    <>
                      <Button title="📆 Calendar" tone="quiet" size="sm" style={{ flex: 1 }} onPress={() => exportRow(hero)} />
                      <Button title="Done" tone="ink" size="sm" style={{ flex: 1 }} onPress={() => { tap(); updatePlan(hero.planId!, { done: true }); }} />
                    </>
                  ) : (
                    <Button title="Plan it" tone="ink" size="sm" full onPress={() => planCareItem(hero.careItem!)} />
                  )}
                </View>
              </Card>
            ) : (
              <Card tint={palette.sageSoft}>
                <Heading>All clear</Heading>
                <Body style={{ fontSize: 13, marginTop: 2 }}>Nothing scheduled and nothing due yet.</Body>
              </Card>
            )}

            {rest.length > 0 && (
              <View style={{ gap: 8 }}>
                {(expanded ? rest : rest.slice(0, peek)).map((row) => (
                  <UpcomingRowCard
                    key={row.key}
                    row={row}
                    onExport={exportRow}
                    onPlan={planCareItem}
                    onDone={(id) => updatePlan(id, { done: true })}
                    onDelete={(id) =>
                      confirmAlert('Delete this?', undefined, [
                        { text: 'Keep', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deletePlan(id) },
                      ])
                    }
                  />
                ))}
                {rest.length > peek && (
                  <Pressable onPress={() => { tap(); setExpanded((v) => !v); }}>
                    <Small style={{ textAlign: 'center' }}>
                      {expanded ? 'Show less' : `Show ${rest.length - peek} more`}
                    </Small>
                  </Pressable>
                )}
              </View>
            )}

            {adding ? (
              <Card>
                <Field value={title} onChangeText={setTitle} placeholder="What is it?" />
                <View style={{ marginTop: 10 }}>
                  <Wrap>
                    {KINDS.map((k) => (
                      <Chip key={k.k} small label={k.label} emoji={k.emoji} selected={kind === k.k} onPress={() => setKind(k.k)} />
                    ))}
                  </Wrap>
                </View>
                <View style={{ marginTop: 12 }}>
                  <Label>When</Label>
                  <View style={{ marginTop: 6 }}>
                    <MiniCalendarGrid value={date} onChange={setDate} />
                  </View>
                </View>
                <View style={{ marginTop: 12 }}>
                  <Label>Time, optional</Label>
                  <View style={{ marginTop: 6 }}>
                    <TimeInput value={time} onChange={setTime} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  <Button title="Cancel" tone="quiet" size="sm" style={{ flex: 1 }} onPress={() => { setAdding(false); resetForm(); }} />
                  <Button
                    title="Add"
                    tone="ink"
                    size="sm"
                    style={{ flex: 1 }}
                    disabled={!title.trim() || !date}
                    onPress={() => {
                      addPlan({ title: title.trim(), date, time: time || undefined, kind });
                      resetForm();
                      setAdding(false);
                    }}
                  />
                </View>
              </Card>
            ) : (
              <Button title="Add a reminder" tone="quiet" full icon="＋" onPress={() => { tap(); setAdding(true); }} />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/** The age bar. It fills with the baby growing, not with anything you do. */
function Meter({ value }: { value: number }) {
  return (
    <View style={{ height: 7, borderRadius: 4, backgroundColor: palette.cardSunk, marginVertical: 10, overflow: 'hidden' }}>
      <View style={{ width: `${Math.round(value * 100)}%`, height: '100%', backgroundColor: palette.sage, borderRadius: 4 }} />
    </View>
  );
}

/**
 * One chapter. An open one shows what has been captured, dated, followed by
 * what is still out there to catch. A sealed one shows nothing but its name and
 * how many moments are waiting inside it.
 */
function Chapter({
  state, progress, stage, onOpen,
}: {
  state: EraState;
  progress: Progress;
  stage: 'pregnancy' | 'baby';
  onOpen: (m: Moment) => void;
}) {
  const captured = state.moments
    .filter((m) => isCaptured(progress, m.id))
    .sort((a, b) => (progress.moments[a.id] || '').localeCompare(progress.moments[b.id] || ''));
  const waiting = state.moments.filter((m) => !isCaptured(progress, m.id));

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Label style={{ flex: 1 }}>{state.era.name}</Label>
        <Text style={{ ...type.label, color: state.open ? palette.sage : palette.inkFaint }}>
          {state.open ? `${state.captured}/${state.moments.length}` : 'SEALED'}
        </Text>
      </View>
      <Small>{state.era.blurb}</Small>

      {!state.open ? (
        <View
          style={{
            padding: 14, borderRadius: radius.lg, backgroundColor: palette.cardSunk,
            borderWidth: 1, borderColor: palette.line, borderStyle: 'dashed', alignItems: 'center', gap: 4,
          }}
        >
          <Text style={{ fontSize: 18, letterSpacing: 6, color: palette.inkFaint }}>
            {state.moments.map(() => '·').join('')}
          </Text>
          <Small>
            {state.moments.length} moments, still sealed
            {state.waitingOn === 'previous' ? ' until the chapter above is done' : ''}
          </Small>
        </View>
      ) : (
        <>
          {captured.map((m) => {
            const at = progress.moments[m.id];
            return (
              // Openable: it is where the moment can be read back, and where a
              // date that was never recorded gets filled in.
              <Pressable
                key={m.id}
                onPress={() => onOpen(m)}
                style={{
                  flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.lg,
                  backgroundColor: palette.card, borderWidth: 1, borderColor: palette.dot,
                }}
              >
                <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...type.heading, fontSize: 15.5, color: palette.ink }}>{m.title}</Text>
                  <Small>{m.done}</Small>
                  <Text style={{ ...type.label, color: at ? palette.sage : palette.dotDeep, marginTop: 4 }}>
                    {at ? shortDate(at) : 'NO DATE YET · TAP TO SET'}
                  </Text>
                </View>
                <Text style={{ ...type.label, color: palette.inkFaint }}>OPEN</Text>
              </Pressable>
            );
          })}

          {waiting.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => onOpen(m)}
              style={{
                flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.lg,
                backgroundColor: palette.dotSoft, borderWidth: 1, borderColor: palette.line,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, opacity: 0.5 }}>{m.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.heading, fontSize: 15.5, color: palette.ink }}>{m.title}</Text>
                <Small>{m.question}</Small>
                <Text style={{ ...type.label, color: palette.inkFaint, marginTop: 4 }}>
                  USUALLY {usually(stage, m.openFrom).toUpperCase()}
                </Text>
              </View>
              <Text style={{ ...type.label, color: palette.dotDeep }}>CAPTURE</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}

/**
 * One row in the coming-up list — a planned reminder you can mark done, hand
 * to the phone's own calendar, or long-press to delete; or a care-pathway
 * item that has not been planned yet, which only offers "plan it".
 */
function UpcomingRowCard({
  row, onExport, onPlan, onDone, onDelete,
}: {
  row: UpcomingRow;
  onExport: (row: UpcomingRow) => void;
  onPlan: (item: CareItem) => void;
  onDone: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Pressable
      onLongPress={() => row.planId && onDelete(row.planId)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: palette.cardSunk }}
    >
      <Text style={{ fontSize: 16 }}>{row.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ ...type.bodyMed, color: palette.ink }} numberOfLines={1}>{row.title}</Text>
        <Small>{formatWhen(row.date, row.time)}</Small>
      </View>
      {row.planId ? (
        <>
          <Pressable onPress={() => { tap(); onExport(row); }} hitSlop={8}>
            <Text style={{ fontSize: 15 }}>📆</Text>
          </Pressable>
          <Pressable onPress={() => { tap(); onDone(row.planId!); }} hitSlop={8}>
            <Text style={{ fontSize: 16, color: palette.inkFaint }}>☐</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => onPlan(row.careItem!)} hitSlop={8}>
          <Text style={{ ...type.label, color: palette.dotDeep }}>PLAN IT</Text>
        </Pressable>
      )}
    </Pressable>
  );
}
