import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { ProgressBar } from '@/components/ProgressRing';
import { StatTile } from '@/components/StatTile';
import { TopBar } from '@/components/TopBar';
import { Body, Button3D, Card, Chip, Divider, Heading, Label, Segmented, Title, styles, tap } from '@/components/ui';
import { evaluateBadges } from '@/domain/badges';
import { levelForXp, levelTitle } from '@/domain/levels';
import type { UnitSystem } from '@/domain/types';
import { toDayKey } from '@/lib/date';
import { useGame, useProfile, useSettings, useStore, usePremium } from '@/state/store';
import { palette, radius } from '@/theme';

export default function MeScreen() {
  const router = useRouter();
  const profile = useProfile();
  const settings = useSettings();
  const game = useGame();
  const premium = usePremium();
  const entries = useStore((s) => s.entries);
  const setProfile = useStore((s) => s.setProfile);
  const setSettings = useStore((s) => s.setSettings);
  const seedDemo = useStore((s) => s.seedDemo);
  const resetAll = useStore((s) => s.resetAll);
  const cancelPremium = useStore((s) => s.cancelPremium);

  const plan = useStore((s) => s.sub.plan) ?? 'monthly';
  const level = levelForXp(game.xp);
  const badges = useMemo(() => evaluateBadges({ entries, game, profile }), [entries, game, profile]);
  const unlocked = badges.filter((b) => b.done).length;

  const [birthInput, setBirthInput] = useState(profile.birthDate ?? toDayKey(new Date()));
  const [dueInput, setDueInput] = useState(profile.dueDate ?? '');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* -------------------------------------------------------- head */}
        <Card tone="grape">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Mascot size={80} mood="proud" />
            <View style={{ flex: 1, gap: 4 }}>
              <Title style={{ fontSize: 20 }}>{profile.parentName || 'Bloom parent'}</Title>
              <Text style={{ fontSize: 13, fontWeight: '900', color: palette.grapeDark }}>
                Level {level.level} · {levelTitle(level.level)}
              </Text>
              <ProgressBar progress={level.progress} color={palette.grape} height={10} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: palette.inkFaint }}>
                {game.xp} XP total · {level.toNext} to next level
              </Text>
            </View>
          </View>
        </Card>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <StatTile emoji="📝" tone="sky" value={`${entries.length}`} label="Entries" />
          <StatTile emoji="🔥" tone="coral" value={`${game.streak}`} label="Streak" sub={`best ${game.longestStreak}`} />
          <StatTile emoji="🏅" tone="sunny" value={`${unlocked}`} label="Badges" sub={`of ${badges.length}`} />
        </View>

        {/* ----------------------------------------------------- premium */}
        <Card tone={premium ? 'grape' : 'sunny'}>
          <Heading>{premium ? '👑 Bloom Premium active' : '⚡ Bloom Premium'}</Heading>
          <Body style={{ marginTop: 4, marginBottom: 12 }}>
            {premium
              ? `Plan: ${plan}. Everything unlocked.`
              : 'Full analytics, unlimited history, growth percentiles, PDF export and multi-caregiver sharing.'}
          </Body>
          {premium ? (
            <Button3D title="Manage subscription" tone="neutral" full onPress={() => cancelPremium()} />
          ) : (
            <Button3D title="See plans" tone="grape" full icon="👑" onPress={() => router.push('/paywall')} />
          )}
        </Card>

        {/* ---------------------------------------------------- settings */}
        <Card>
          <Heading>Preferences</Heading>

          <View style={{ marginTop: 14, gap: 10 }}>
            <Label>Units</Label>
            <Segmented<UnitSystem>
              tone="mint"
              value={settings.units}
              onChange={(v) => setSettings({ units: v })}
              options={[
                { value: 'metric', label: 'Metric (kg · cm · ml)' },
                { value: 'imperial', label: 'Imperial (lb · in · oz)' },
              ]}
            />
          </View>

          <View style={{ marginTop: 16, gap: 10 }}>
            <Label>Daily goal</Label>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {[
                { xp: 20, label: 'Casual · 20 XP' },
                { xp: 30, label: 'Regular · 30 XP' },
                { xp: 50, label: 'Serious · 50 XP' },
                { xp: 80, label: 'Intense · 80 XP' },
              ].map((g) => (
                <Chip
                  key={g.xp}
                  tone="sunny"
                  label={g.label}
                  selected={settings.dailyGoalXp === g.xp}
                  onPress={() => setSettings({ dailyGoalXp: g.xp })}
                />
              ))}
            </View>
          </View>

          <View style={{ marginTop: 16, gap: 12 }}>
            <ToggleRow
              label="24-hour clock"
              value={settings.clock24h}
              onChange={(v) => setSettings({ clock24h: v })}
            />
            <ToggleRow
              label="Streak reminders"
              value={settings.remindersOn}
              onChange={(v) => setSettings({ remindersOn: v })}
            />
          </View>
        </Card>

        {/* -------------------------------------------------------- dates */}
        <Card>
          <Heading>{profile.mode === 'pregnancy' ? 'Pregnancy' : 'Your baby'}</Heading>

          <View style={{ marginTop: 12, gap: 10 }}>
            <Label>Name</Label>
            <Field
              value={profile.mode === 'pregnancy' ? profile.parentName : profile.babyName ?? ''}
              onChangeText={(v) => (profile.mode === 'pregnancy' ? setProfile({ parentName: v }) : setProfile({ babyName: v }))}
              placeholder={profile.mode === 'pregnancy' ? 'Your name' : 'Baby name'}
            />
          </View>

          {profile.mode === 'pregnancy' ? (
            <>
              <View style={{ marginTop: 14, gap: 10 }}>
                <Label>Due date (YYYY-MM-DD)</Label>
                <Field value={dueInput} onChangeText={setDueInput} placeholder="2026-12-01" />
                <Button3D
                  title="Update due date"
                  tone="mint"
                  size="sm"
                  onPress={() => isDate(dueInput) && setProfile({ dueDate: dueInput })}
                />
              </View>

              <Divider />

              <View style={{ marginTop: 14, gap: 10 }}>
                <Heading>Baby arrived? 👶</Heading>
                <Body style={{ fontSize: 13 }}>
                  Switching to newborn mode keeps every pregnancy entry, badge and XP point. Only the tracking screens
                  change.
                </Body>
                <Label>Birth date (YYYY-MM-DD)</Label>
                <Field value={birthInput} onChangeText={setBirthInput} placeholder="2026-12-01" />
                <Button3D
                  title="Switch to newborn mode"
                  tone="blossom"
                  full
                  onPress={() => {
                    if (!isDate(birthInput)) return;
                    setProfile({ mode: 'baby', birthDate: birthInput });
                    router.push('/(tabs)/today');
                  }}
                />
              </View>
            </>
          ) : (
            <View style={{ marginTop: 14, gap: 10 }}>
              <Label>Birth date (YYYY-MM-DD)</Label>
              <Field value={birthInput} onChangeText={setBirthInput} placeholder="2026-05-01" />
              <Button3D
                title="Update birth date"
                tone="mint"
                size="sm"
                onPress={() => isDate(birthInput) && setProfile({ birthDate: birthInput })}
              />
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                {(['girl', 'boy', 'surprise'] as const).map((s) => (
                  <Chip
                    key={s}
                    tone="blossom"
                    label={s === 'surprise' ? 'Prefer not to say' : s}
                    selected={profile.babySex === s}
                    onPress={() => setProfile({ babySex: s })}
                  />
                ))}
              </View>
            </View>
          )}
        </Card>

        {/* --------------------------------------------------------- data */}
        <Card>
          <Heading>Your data</Heading>
          <Body style={{ marginTop: 4, marginBottom: 12, fontSize: 13 }}>
            Everything lives on this device only. No account, no server, nothing shared.
          </Body>
          <View style={{ gap: 8 }}>
            <Button3D
              title="Load 60 days of demo data"
              tone="sky"
              full
              onPress={() =>
                Alert.alert('Load demo data?', 'This replaces what is currently stored.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Pregnancy', onPress: () => seedDemo('pregnancy') },
                  { text: 'Newborn', onPress: () => seedDemo('baby') },
                ])
              }
            />
            <Button3D
              title={premium ? 'Export CSV' : 'Export CSV (premium)'}
              tone="neutral"
              full
              onPress={() => (premium ? null : router.push('/paywall'))}
            />
            <Button3D
              title="Reset everything"
              tone="neutral"
              full
              onPress={() =>
                Alert.alert('Reset Bloom?', 'This deletes all entries, XP and badges on this device.', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete all',
                    style: 'destructive',
                    onPress: () => {
                      resetAll();
                      router.replace('/onboarding');
                    },
                  },
                ])
              }
            />
          </View>
        </Card>

        <Text style={{ fontSize: 11, fontWeight: '700', color: palette.inkFaint, textAlign: 'center', paddingHorizontal: 20 }}>
          Bloom is a tracking and reflection tool. It does not provide medical advice, diagnosis or treatment. Always
          talk to your midwife, doctor or health visitor about anything that concerns you.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(+new Date(v));

function Field({ value, onChangeText, placeholder }: { value: string; onChangeText: (v: string) => void; placeholder?: string }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={palette.inkFaint}
      autoCapitalize="none"
      style={{
        borderWidth: 2,
        borderColor: palette.line,
        borderRadius: radius.md,
        padding: 13,
        fontSize: 15,
        fontWeight: '700',
        color: palette.ink,
      }}
    />
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onChange(!value);
      }}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Text style={{ fontSize: 15, fontWeight: '800', color: palette.ink }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: palette.mint, false: palette.line }}
        thumbColor={palette.white}
      />
    </Pressable>
  );
}
