import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumGate } from '@/components/PremiumGate';
import { StatTile } from '@/components/StatTile';
import { TopBar } from '@/components/TopBar';
import { Body, Button3D, Card, Heading, Label, Segmented, Title, styles } from '@/components/ui';
import { BarChart, Donut, Heatmap, LineChart, SleepRaster } from '@/charts';
import { WHO_WEIGHT_MEDIAN } from '@/domain/baby';
import {
  breastBalance,
  buildInsights,
  dailyFeeds,
  dailySleep,
  feedIntervalHistogram,
  growthSeries,
  kickSeries,
  moodSeries,
  sleepRaster,
  symptomHeatmap,
  weightSeries,
} from '@/analytics';
import { fromDayKey, WEEKDAY_INITIALS } from '@/lib/date';
import { mlToOz } from '@/lib/units';
import { useProfile, useSettings, useStore, usePremium } from '@/state/store';
import { palette } from '@/theme';

type Range = '7' | '30' | '90';

export default function InsightsScreen() {
  const { width } = useWindowDimensions();
  const chartW = width - 64;
  const profile = useProfile();
  const settings = useSettings();
  const premium = usePremium();
  const entries = useStore((s) => s.entries);
  const router = useRouter();
  const [range, setRange] = useState<Range>('7');

  const days = premium ? Number(range) : 7;
  const insights = useMemo(() => buildInsights(entries, profile, days), [entries, profile, days]);

  const dayLabel = (key: string) => WEEKDAY_INITIALS[fromDayKey(key).getDay()];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 4 }}>
          <Title>Insights</Title>
          <Body>Patterns from what you logged. Descriptive only — never medical advice.</Body>
        </View>

        <Segmented<Range>
          value={premium ? range : '7'}
          onChange={(v) => (premium ? setRange(v) : router.push('/paywall'))}
          options={[
            { value: '7', label: '7 days' },
            { value: '30', label: '30 days', locked: !premium },
            { value: '90', label: '90 days', locked: !premium },
          ]}
        />

        {/* ----------------------------------------------- read-outs */}
        <Card tone="sky">
          <Heading>What the data says</Heading>
          <View style={{ gap: 8, marginTop: 10 }}>
            {insights.slice(0, premium ? insights.length : 2).map((line, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={{ color: palette.sky, fontWeight: '900' }}>•</Text>
                <Body style={{ flex: 1, fontSize: 13, color: palette.ink }}>{line}</Body>
              </View>
            ))}
            {!insights.length && <Body>Log a few days and the analysis appears here.</Body>}
            {!premium && insights.length > 2 && (
              <View style={{ gap: 8, marginTop: 4 }}>
                <Body style={{ fontSize: 13 }}>🔒 {insights.length - 2} more read-outs in Premium.</Body>
                <Button3D title="See everything" tone="grape" size="sm" onPress={() => router.push('/paywall')} />
              </View>
            )}
          </View>
        </Card>

        {profile.mode === 'baby' ? (
          <BabyCharts chartW={chartW} days={days} entries={entries} dayLabel={dayLabel} units={settings.units} profile={profile} />
        ) : (
          <PregnancyCharts chartW={chartW} days={days} entries={entries} dayLabel={dayLabel} profile={profile} premium={premium} />
        )}

        <Card tone="grape">
          <Heading>Doctor-ready export</Heading>
          <Body style={{ marginTop: 4, marginBottom: 12 }}>
            Turn any range into a one-page PDF summary for your midwife, health visitor or paediatrician.
          </Body>
          <Button3D
            title={premium ? 'Generate PDF' : 'Premium feature'}
            tone={premium ? 'grape' : 'neutral'}
            full
            onPress={() => (premium ? null : router.push('/paywall'))}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

/* --------------------------------------------------------------- baby */

function BabyCharts({ chartW, days, entries, dayLabel, units, profile }: any) {
  const sleep = useMemo(() => dailySleep(entries, days), [entries, days]);
  const feeds = useMemo(() => dailyFeeds(entries, days), [entries, days]);
  const raster = useMemo(() => sleepRaster(entries, days), [entries, days]);
  const balance = useMemo(() => breastBalance(entries, days), [entries, days]);
  const hist = useMemo(() => feedIntervalHistogram(entries, days), [entries, days]);
  const growth = useMemo(() => growthSeries(entries, profile), [entries, profile]);

  const withData = sleep.filter((d: any) => d.totalMin > 0);
  const avgSleep = withData.length ? withData.reduce((s: number, d: any) => s + d.totalMin, 0) / withData.length / 60 : 0;
  const avgLongest = withData.length ? withData.reduce((s: number, d: any) => s + d.longestMin, 0) / withData.length / 60 : 0;
  const feedDays = feeds.filter((d: any) => d.count > 0);
  const avgFeeds = feedDays.length ? feedDays.reduce((s: number, d: any) => s + d.count, 0) / feedDays.length : 0;
  const nightShare =
    feedDays.length
      ? feedDays.reduce((s: number, d: any) => s + (d.count ? d.nightCount / d.count : 0), 0) / feedDays.length
      : 0;

  const sex = profile.babySex === 'boy' ? 'boy' : 'girl';

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <StatTile emoji="😴" tone="grape" value={`${avgSleep.toFixed(1)}h`} label="Sleep / day" sub="average" />
        <StatTile emoji="🌙" tone="sky" value={`${avgLongest.toFixed(1)}h`} label="Longest stretch" sub="average" />
        <StatTile emoji="🍼" tone="mint" value={avgFeeds.toFixed(1)} label="Feeds / day" />
      </View>

      <Card>
        <Heading>Sleep per day</Heading>
        <Label>Night (purple) stacked with naps (blue), in hours</Label>
        <View style={{ marginTop: 10 }}>
          <BarChart
            data={sleep.map((d: any) => ({ label: dayLabel(d.day), value: d.nightMin / 60, value2: d.napMin / 60 }))}
            width={chartW}
            height={170}
            color={palette.grapeDark}
            color2={palette.sky}
            unit="h"
          />
        </View>
      </Card>

      <Card>
        <Heading>24-hour sleep pattern</Heading>
        <Label>One row per day — where sleep actually landed</Label>
        <PremiumGate title="See the full raster" blurb="Spot the night that finally consolidated, and which naps are drifting." minHeight={200}>
          <View style={{ marginTop: 10 }}>
            <SleepRaster segments={raster} days={days} labels={sleep.map((d: any) => dayLabel(d.day))} width={chartW} />
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
              <Legend color={palette.grapeDark} label="Night sleep" />
              <Legend color={palette.sky} label="Naps" />
            </View>
          </View>
        </PremiumGate>
      </Card>

      <Card>
        <Heading>Longest sleep stretch</Heading>
        <Label>The number every parent actually cares about</Label>
        <PremiumGate title="Track the trend" blurb="Watch the longest stretch grow week by week." minHeight={190}>
          <View style={{ marginTop: 10 }}>
            <LineChart
              points={sleep.map((d: any, i: number) => ({ x: i, y: d.longestMin / 60 }))}
              width={chartW}
              height={175}
              color={palette.grape}
              formatX={(v) => dayLabel(sleep[Math.round(v)]?.day ?? sleep[0].day)}
              formatY={(v) => `${v.toFixed(1)}h`}
            />
          </View>
        </PremiumGate>
      </Card>

      <Card>
        <Heading>Feeds per day</Heading>
        <Label>Count of all feeds, day and night</Label>
        <View style={{ marginTop: 10 }}>
          <BarChart data={feeds.map((d: any) => ({ label: dayLabel(d.day), value: d.count }))} width={chartW} height={150} color={palette.mint} />
        </View>
      </Card>

      <Card>
        <Heading>Bottle volume per day</Heading>
        <Label>{units === 'metric' ? 'millilitres' : 'fluid ounces'}</Label>
        <PremiumGate title="Volume analysis" blurb="Daily intake, trends and night-feed share." minHeight={190}>
          <View style={{ marginTop: 10 }}>
            <BarChart
              data={feeds.map((d: any) => ({ label: dayLabel(d.day), value: units === 'metric' ? d.ml : mlToOz(d.ml) }))}
              width={chartW}
              height={160}
              color={palette.sky}
              unit={units === 'metric' ? 'ml' : 'oz'}
            />
          </View>
        </PremiumGate>
      </Card>

      <Card>
        <Heading>Balance & rhythm</Heading>
        <PremiumGate title="Feeding balance" blurb="Left/right balance, day-vs-night split and the gap between feeds." minHeight={230}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 }}>
            <Donut
              slices={[
                { label: 'Left', value: balance.left, color: palette.blossom },
                { label: 'Right', value: balance.right, color: palette.sky },
                { label: 'Bottle', value: balance.bottle * 10, color: palette.sunny },
              ]}
              size={118}
              centerLabel={`${Math.round(nightShare * 100)}%`}
              centerSub="at night"
            />
            <View style={{ flex: 1, gap: 6 }}>
              <Legend color={palette.blossom} label={`Left breast · ${Math.round(balance.left)} min`} />
              <Legend color={palette.sky} label={`Right breast · ${Math.round(balance.right)} min`} />
              <Legend color={palette.sunny} label={`Bottles · ${balance.bottle}`} />
            </View>
          </View>
          <View style={{ marginTop: 14 }}>
            <Label>Gap between feeds</Label>
            <BarChart data={hist.map((h) => ({ label: h.label, value: h.value }))} width={chartW} height={130} color={palette.coral} maxTicks={3} />
          </View>
        </PremiumGate>
      </Card>

      <Card>
        <Heading>Growth vs WHO median</Heading>
        <Label>Weight for age, first year</Label>
        <PremiumGate title="Percentile curves" blurb="Plot weight, length and head circumference against WHO reference curves." minHeight={200}>
          <View style={{ marginTop: 10 }}>
            {growth.length >= 2 ? (
              <LineChart
                points={growth.map((g: any) => ({ x: g.month, y: g.weightKg }))}
                band={WHO_WEIGHT_MEDIAN[sex].map((m, i) => ({ x: i, low: m * 0.88, high: m * 1.12 }))}
                width={chartW}
                height={200}
                color={palette.coral}
                formatX={(v) => `${Math.round(v)}mo`}
                formatY={(v) => `${v.toFixed(1)}kg`}
              />
            ) : (
              <Body style={{ marginTop: 10 }}>Add at least two growth measurements to see the curve.</Body>
            )}
          </View>
        </PremiumGate>
      </Card>
    </>
  );
}

/* ---------------------------------------------------------- pregnancy */

function PregnancyCharts({ chartW, days, entries, dayLabel, profile, premium }: any) {
  const weights = useMemo(() => weightSeries(entries, profile), [entries, profile]);
  const kicks = useMemo(() => kickSeries(entries, days), [entries, days]);
  const heat = useMemo(() => symptomHeatmap(entries, profile), [entries, profile]);
  const mood = useMemo(() => moodSeries(entries, days), [entries, days]);

  const shown = premium ? weights : weights.slice(-3);
  const kickDays = kicks.filter((k: any) => k.sessions > 0);
  const avgTime = kickDays.length ? kickDays.reduce((s: number, k: any) => s + k.minutes, 0) / kickDays.length : 0;
  const last = weights[weights.length - 1];

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <StatTile emoji="⚖️" tone="mint" value={last ? `${last.gain.toFixed(1)}kg` : '—'} label="Total gain" sub={last ? `by week ${last.week}` : ''} />
        <StatTile emoji="🦶" tone="sunny" value={`${Math.round(avgTime)}m`} label="Time to 10 kicks" sub="average" />
        <StatTile emoji="📆" tone="blossom" value={`${kickDays.length}`} label="Days counted" sub={`of ${days}`} />
      </View>

      <Card>
        <Heading>Weight gain vs guideline band</Heading>
        <Label>Your gain against the IOM band for a normal starting BMI</Label>
        <View style={{ marginTop: 10 }}>
          {shown.length >= 2 ? (
            <LineChart
              points={shown.map((w: any) => ({ x: w.week, y: w.gain }))}
              band={shown.map((w: any) => ({ x: w.week, low: w.low, high: w.high }))}
              width={chartW}
              height={200}
              color={palette.mintDark}
              formatX={(v) => `w${Math.round(v)}`}
              formatY={(v) => `${v.toFixed(1)}kg`}
            />
          ) : (
            <Body style={{ marginTop: 8 }}>Log your weight at least twice to draw the curve.</Body>
          )}
          {!premium && weights.length > 3 && (
            <Body style={{ marginTop: 8, fontSize: 12 }}>
              🔒 Showing your last 3 weigh-ins. Premium plots the whole pregnancy.
            </Body>
          )}
        </View>
      </Card>

      <Card>
        <Heading>Kick sessions</Heading>
        <Label>Minutes needed to reach 10 movements — consistency is what matters</Label>
        <View style={{ marginTop: 10 }}>
          <BarChart
            data={kicks.map((k: any) => ({ label: dayLabel(k.day), value: k.minutes, highlight: k.minutes > 60 }))}
            width={chartW}
            height={160}
            color={palette.sunny}
            unit="min"
          />
        </View>
      </Card>

      <Card>
        <Heading>Symptom heatmap</Heading>
        <Label>Which symptoms show up in which gestational week</Label>
        <PremiumGate title="Full symptom history" blurb="See every symptom across every week, and how severity tracks with it." minHeight={200}>
          <View style={{ marginTop: 10 }}>
            {heat.symptoms.length ? (
              <Heatmap
                rows={heat.symptoms.map((s: any) => s.name)}
                cols={heat.weeks.map((w: number) => `w${w}`)}
                valueAt={(row, col) => {
                  const s = heat.symptoms.find((x: any) => x.name === row);
                  const week = Number(col.slice(1));
                  return s?.byWeek.get(week) ?? 0;
                }}
                width={chartW}
              />
            ) : (
              <Body>Log a few symptom check-ins to build the heatmap.</Body>
            )}
          </View>
        </PremiumGate>
      </Card>

      <Card>
        <Heading>Mood & symptom load</Heading>
        <Label>Daily mood (pink) against average symptom severity</Label>
        <PremiumGate title="Correlate mood with symptoms" blurb="See how the rough weeks line up with what you were feeling." minHeight={190}>
          <View style={{ marginTop: 10 }}>
            <LineChart
              points={mood.map((m: any, i: number) => ({ x: i, y: m.mood }))}
              band={mood.map((m: any, i: number) => ({ x: i, low: 0, high: m.severity }))}
              width={chartW}
              height={180}
              color={palette.blossom}
              formatX={(v) => dayLabel(mood[Math.round(v)]?.day ?? mood[0].day)}
              formatY={(v) => v.toFixed(1)}
            />
          </View>
        </PremiumGate>
      </Card>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 11, fontWeight: '800', color: palette.inkSoft }}>{label}</Text>
    </View>
  );
}
