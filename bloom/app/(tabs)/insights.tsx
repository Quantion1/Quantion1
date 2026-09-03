import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarChart, Donut, LineChart, SleepRaster } from '@/charts';
import { PremiumGate } from '@/components/PremiumGate';
import { Body, Button, Card, Empty, Heading, Label, Segmented, Small, Title, styles } from '@/components/ui';
import {
  buildInsights, contractionSeries, dailyFeeds, dailySleep, feedIntervalHistogram,
  growthSeries, kickSeries, mySleepSeries, sideBalance, sleepRaster, weightSeries,
} from '@/analytics';
import { WHO_WEIGHT_MEDIAN } from '@/domain/stage';
import { fromDayKey, WEEKDAY_INITIALS } from '@/lib/date';
import { mlToOz } from '@/lib/units';
import { useNest } from '@/state/hooks';
import { usePremium, useProfile, useSettings, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

type Range = '7' | '30' | '90';

export default function InsightsScreen() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const { width } = useWindowDimensions();
  const chartW = width - 66;
  const router = useRouter();
  const nest = useNest();
  const profile = useProfile();
  const settings = useSettings();
  const premium = usePremium();
  const entries = useStore((s) => s.entries);
  const [range, setRange] = useState<Range>('7');

  const days = premium ? Number(range) : 7;
  const insights = useMemo(() => buildInsights(entries, profile, days, nest.months), [entries, profile, days, nest.months]);
  const label = (k: string) => WEEKDAY_INITIALS[fromDayKey(k).getDay()];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 4 }}>
          <Title>Insights</Title>
          <Body>Everything here is computed from what you logged. Nothing is estimated, and none of it is medical advice.</Body>
        </View>

        <Card tint={palette.blueSoft} onPress={() => router.push('/review')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 26 }}>📖</Text>
            <View style={{ flex: 1 }}>
              <Heading>Today's review</Heading>
              <Small>The rhythm, the numbers, and what I would try tomorrow.</Small>
            </View>
            <Text style={{ fontSize: 16, color: palette.inkFaint }}>›</Text>
          </View>
        </Card>

        <Segmented<Range>
          value={premium ? range : '7'}
          onChange={(v) => (premium ? setRange(v) : router.push('/paywall'))}
          options={[
            { value: '7', label: '7 days' },
            { value: '30', label: '30 days', locked: !premium },
            { value: '90', label: '90 days', locked: !premium },
          ]}
        />

        {insights.length > 0 && (
          <Card>
            <Heading>What the data says</Heading>
            <View style={{ gap: 8, marginTop: 10 }}>
              {insights.slice(0, premium ? insights.length : 2).map((line, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                  <Text style={{ color: palette.dotDeep, fontSize: 17, lineHeight: 20 }}>·</Text>
                  <Body style={{ flex: 1, fontSize: 13.5, color: palette.ink }}>{line}</Body>
                </View>
              ))}
              {!premium && insights.length > 2 && (
                <View style={{ gap: 8, marginTop: 4 }}>
                  <Small>🔒 {insights.length - 2} more read-outs with Premium.</Small>
                  <Button title="See what's in it" tone="quiet" size="sm" style={{ alignSelf: 'flex-start' }} onPress={() => router.push('/paywall')} />
                </View>
              )}
            </View>
          </Card>
        )}

        {nest.stage === 'baby' ? (
          <BabyCharts chartW={chartW} days={days} entries={entries} label={label} units={settings.units} profile={profile} />
        ) : (
          <PregnancyCharts chartW={chartW} days={days} entries={entries} label={label} profile={profile} premium={premium} />
        )}

        <Card>
          <Heading>Take it to an appointment</Heading>
          <Body style={{ marginTop: 4, marginBottom: 12, fontSize: 13.5 }}>
            Turn any range into a one-page summary for the midwife, the consultatiebureau or the GP.
          </Body>
          <Button title={premium ? 'Generate PDF' : 'Premium'} tone={premium ? 'ink' : 'quiet'} full onPress={() => (premium ? null : router.push('/paywall'))} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Panel({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <Card>
      <Heading>{title}</Heading>
      <Small style={{ marginTop: 2 }}>{note}</Small>
      <View style={{ marginTop: 12 }}>{children}</View>
    </Card>
  );
}

function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: palette.card, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.line, padding: 14 }}>
      <Text style={{ ...type.title, fontSize: 21, color: palette.ink }}>{value}</Text>
      <Text style={{ ...type.label, color: palette.inkSoft }}>{label.toUpperCase()}</Text>
      {!!note && <Small style={{ fontSize: 11 }}>{note}</Small>}
    </View>
  );
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : 0);

function BabyCharts({ chartW, days, entries, label, units, profile }: any) {
  const sleep = useMemo(() => dailySleep(entries, days), [entries, days]);
  const feeds = useMemo(() => dailyFeeds(entries, days), [entries, days]);
  const raster = useMemo(() => sleepRaster(entries, days), [entries, days]);
  const balance = useMemo(() => sideBalance(entries, days), [entries, days]);
  const hist = useMemo(() => feedIntervalHistogram(entries, days), [entries, days]);
  const growth = useMemo(() => growthSeries(entries, profile), [entries, profile]);

  const withData = sleep.filter((d: any) => d.totalMin > 0);
  if (!withData.length && !feeds.some((f: any) => f.count)) {
    return (
      <Card>
        <Empty emoji="🫙" title="Nothing to analyse yet" text="Log a few sleeps and feeds and the charts fill themselves in. Until then there is deliberately nothing here." />
      </Card>
    );
  }

  const feedDays = feeds.filter((d: any) => d.count > 0);
  const nightShare = feedDays.length ? avg(feedDays.map((d: any) => (d.count ? d.nightCount / d.count : 0))) : 0;
  const sex = profile.babySex === 'boy' ? 'boy' : 'girl';

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat value={`${(avg(withData.map((d: any) => d.totalMin)) / 60).toFixed(1)}h`} label="Sleep / day" note="average" />
        <Stat value={`${(avg(withData.map((d: any) => d.longestMin)) / 60).toFixed(1)}h`} label="Longest" note="average" />
        <Stat value={avg(feedDays.map((d: any) => d.count)).toFixed(1)} label="Feeds / day" />
      </View>

      <Panel title="Sleep per day" note="Night in blue, naps in teal — hours">
        <BarChart
          data={sleep.map((d: any) => ({ label: label(d.day), value: d.nightMin / 60, value2: d.napMin / 60 }))}
          width={chartW} height={165} color={palette.blue} color2={palette.teal} unit="h"
        />
      </Panel>

      <Panel title="Twenty-four hour pattern" note="One row per day — where sleep actually landed">
        <PremiumGate blurb="See the night that finally consolidated, and which naps are drifting." minHeight={200}>
          <SleepRaster segments={raster} days={days} labels={sleep.map((d: any) => label(d.day))} width={chartW} />
        </PremiumGate>
      </Panel>

      <Panel title="Longest stretch" note="The number every parent actually cares about">
        <PremiumGate blurb="Watch the longest stretch grow, week by week." minHeight={190}>
          <LineChart
            points={sleep.map((d: any, i: number) => ({ x: i, y: d.longestMin / 60 }))}
            width={chartW} height={175} color={palette.blue}
            formatX={(v) => label(sleep[Math.round(v)]?.day ?? sleep[0].day)}
            formatY={(v) => `${v.toFixed(1)}h`}
          />
        </PremiumGate>
      </Panel>

      <Panel title="Feeds per day" note="Breast and bottle together">
        <BarChart data={feeds.map((d: any) => ({ label: label(d.day), value: d.count }))} width={chartW} height={150} color={palette.gold} />
      </Panel>

      <Panel title="Balance and rhythm" note="Sides, night share, and the gap between feeds">
        <PremiumGate blurb="Left/right balance, the day-versus-night split, and how far apart the feeds fall." minHeight={230}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Donut
              slices={[
                { label: 'Left', value: balance.left, color: palette.rose },
                { label: 'Right', value: balance.right, color: palette.blue },
                { label: 'Bottle', value: balance.bottle * 10, color: palette.gold },
              ]}
              size={112}
              centerLabel={`${Math.round(nightShare * 100)}%`}
              centerSub="AT NIGHT"
            />
            <View style={{ flex: 1, gap: 6 }}>
              <Legend color={palette.rose} label={`Left · ${Math.round(balance.left)} min`} />
              <Legend color={palette.blue} label={`Right · ${Math.round(balance.right)} min`} />
              <Legend color={palette.gold} label={`Bottles · ${balance.bottle}`} />
            </View>
          </View>
          <View style={{ marginTop: 14 }}>
            <Label>Gap between feeds</Label>
            <BarChart data={hist} width={chartW} height={128} color={palette.clay} maxTicks={3} />
          </View>
        </PremiumGate>
      </Panel>

      <Panel title="Weight against the WHO band" note="Weight for age, first year">
        <PremiumGate blurb="Plot weight against the WHO reference curve for this age." minHeight={200}>
          {growth.length >= 2 ? (
            <LineChart
              points={growth.map((g: any) => ({ x: g.month, y: g.kg }))}
              band={WHO_WEIGHT_MEDIAN[sex].map((m, i) => ({ x: i, low: m * 0.88, high: m * 1.12 }))}
              width={chartW} height={195} color={palette.plum}
              formatX={(v) => `${Math.round(v)}mo`} formatY={(v) => `${v.toFixed(1)}kg`}
            />
          ) : (
            <Body>Two weights and this draws itself.</Body>
          )}
        </PremiumGate>
      </Panel>
    </>
  );
}

function PregnancyCharts({ chartW, days, entries, label, profile, premium }: any) {
  const weights = useMemo(() => weightSeries(entries, profile), [entries, profile]);
  const kicks = useMemo(() => kickSeries(entries, days), [entries, days]);
  const contr = useMemo(() => contractionSeries(entries), [entries]);
  const mine = useMemo(() => mySleepSeries(entries, days), [entries, days]);

  const shown = premium ? weights : weights.slice(-3);
  const kickDays = kicks.filter((k: any) => k.sessions > 0);
  const last = weights[weights.length - 1];
  const mineDays = mine.filter((m: any) => m.minutes > 0);

  if (!weights.length && !kickDays.length) {
    return (
      <Card>
        <Empty emoji="🫙" title="Nothing to analyse yet" text="Log a weight or count some kicks and this page starts filling in. A fresh install shows nothing, not sample data." />
      </Card>
    );
  }

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat value={last ? `${last.gain.toFixed(1)}kg` : '—'} label="Total gain" note={last ? `by week ${last.week}` : ''} />
        <Stat value={`${Math.round(avg(kickDays.map((k: any) => k.minutes)))}m`} label="To ten kicks" note="average" />
        <Stat value={`${kickDays.length}`} label="Days counted" note={`of ${days}`} />
      </View>

      <Panel title="Weight against the guideline band" note="Your gain versus the IOM band for a normal starting BMI">
        {shown.length >= 2 ? (
          <>
            <LineChart
              points={shown.map((w: any) => ({ x: w.week, y: w.gain }))}
              band={shown.map((w: any) => ({ x: w.week, low: w.low, high: w.high }))}
              width={chartW} height={195} color={palette.sage}
              formatX={(v) => `w${Math.round(v)}`} formatY={(v) => `${v.toFixed(1)}kg`}
            />
            {!premium && weights.length > 3 && <Small style={{ marginTop: 8 }}>🔒 Showing your last three. Premium plots the whole pregnancy.</Small>}
          </>
        ) : (
          <Body>Log your weight twice and the curve appears.</Body>
        )}
      </Panel>

      <Panel title="Kick sessions" note="Minutes to reach ten — consistency is the point, not speed">
        <BarChart
          data={kicks.map((k: any) => ({ label: label(k.day), value: k.minutes, highlight: k.minutes > 60 }))}
          width={chartW} height={155} color={palette.clay} unit="min"
        />
      </Panel>

      <Panel title="Your own sleep" note="Hours a night, and how you rated them">
        <PremiumGate blurb="Nobody else tracks the parent. Here is your sleep next to everything else." minHeight={180}>
          {mineDays.length >= 2 ? (
            <BarChart data={mine.map((m: any) => ({ label: label(m.day), value: m.minutes / 60 }))} width={chartW} height={155} color={palette.plum} unit="h" />
          ) : (
            <Body>Log a couple of nights and this fills in.</Body>
          )}
        </PremiumGate>
      </Panel>

      {contr.length > 0 && (
        <Panel title="Contractions" note="Length and the gap between them">
          <View style={{ gap: 8 }}>
            {contr.slice(-6).reverse().map((c: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: palette.line }}>
                <Body style={{ color: palette.ink }}>{c.durationSec}s</Body>
                <Small>{c.intervalMin ? `${c.intervalMin.toFixed(0)} min apart` : 'first one'}</Small>
              </View>
            ))}
            <Small>
              Many services ask you to call at five minutes apart, lasting a minute, for an hour.
            </Small>
          </View>
        </Panel>
      )}
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
      <Small>{label}</Small>
    </View>
  );
}
