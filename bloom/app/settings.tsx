import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { confirmAlert } from '@/components/Confirm';
import { DateInput } from '@/components/DateInput';
import { Body, Button, Card, Chip, Field, Heading, Label, Rule, Segmented, Small, Title, Wrap, tap } from '@/components/ui';
import { CARE_SYSTEMS, COUNTRY_ORDER } from '@/domain/care';
import { DRINKS } from '@/domain/drinks';
import type { ThemePref, UnitSystem } from '@/domain/types';
import { useNest } from '@/state/hooks';
import { usePremium, useProfile, useSettings, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

export default function Settings() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const router = useRouter();
  const profile = useProfile();
  const settings = useSettings();
  const nest = useNest();
  const premium = usePremium();
  const setProfile = useStore((s) => s.setProfile);
  const setSettings = useStore((s) => s.setSettings);
  const seedDemo = useStore((s) => s.seedDemo);
  const resetAll = useStore((s) => s.resetAll);
  const progress = useStore((s) => s.progress);

  const [due, setDue] = useState(profile.dueDate ?? '');
  const [birth, setBirth] = useState(profile.birthDate ?? '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.paper }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18 }}>
        <Pressable onPress={() => { tap(); router.back(); }} hitSlop={14}>
          <Text style={{ fontSize: 20, color: palette.inkSoft }}>‹</Text>
        </Pressable>
        <Title style={{ fontSize: 21 }}>Settings</Title>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: 0, gap: 16, paddingBottom: 44 }}>
        <Card>
          <Heading>Appearance</Heading>
          <Small style={{ marginTop: 2, marginBottom: 10 }}>
            Dark is a warm night parchment, not a grey app. System follows your phone.
          </Small>
          <Segmented<ThemePref>
            value={settings.theme}
            onChange={(v) => setSettings({ theme: v })}
            options={[
              { value: 'system', label: 'System' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </Card>

        <Card>
          <Heading>Units and time</Heading>
          <View style={{ gap: 10, marginTop: 12 }}>
            <Label>Units</Label>
            <Segmented<UnitSystem>
              value={settings.units}
              onChange={(v) => setSettings({ units: v })}
              options={[
                { value: 'metric', label: 'kg · cm · ml' },
                { value: 'imperial', label: 'lb · in · oz' },
              ]}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <Body style={{ color: palette.ink }}>24-hour clock</Body>
            <Switch value={settings.clock24h} onValueChange={(v) => setSettings({ clock24h: v })} trackColor={{ true: palette.dot, false: palette.line }} thumbColor={palette.card} />
          </View>
        </Card>

        <Card>
          <Heading>Drink buttons</Heading>
          <Small style={{ marginTop: 2, marginBottom: 10 }}>Which vessels show up on the water tile.</Small>
          <Wrap>
            {DRINKS.map((d) => {
              const on = settings.drinks.includes(d.id);
              return (
                <Chip
                  key={d.id}
                  label={d.label}
                  emoji={d.emoji}
                  icon={d.icon ? <d.icon size={16} color={on ? palette.clay : palette.inkSoft} /> : undefined}
                  selected={on}
                  onPress={() => setSettings({ drinks: on ? settings.drinks.filter((x) => x !== d.id) : [...settings.drinks, d.id] })}
                />
              );
            })}
          </Wrap>
        </Card>

        <Card>
          <Heading>Where you're having care</Heading>
          <Small style={{ marginTop: 2, marginBottom: 10 }}>Sets the care pathway on the Plan tab.</Small>
          <Wrap>
            {COUNTRY_ORDER.map((c) => (
              <Chip
                key={c}
                label={`${CARE_SYSTEMS[c].flag} ${CARE_SYSTEMS[c].label}`}
                selected={profile.country === c}
                onPress={() => setProfile({ country: c })}
              />
            ))}
          </Wrap>
        </Card>

        <Card>
          <Heading>{profile.stage === 'pregnancy' ? 'Your pregnancy' : 'Your baby'}</Heading>
          <View style={{ gap: 10, marginTop: 12 }}>
            <Label>Your name</Label>
            <Field value={profile.parentName} onChangeText={(v) => setProfile({ parentName: v })} placeholder="Robin" />

            {profile.stage === 'pregnancy' ? (
              <>
                <Label>Due date</Label>
                <DateInput value={due} onChange={setDue} />
                <Button title="Update" tone="quiet" size="sm" style={{ alignSelf: 'flex-start' }} disabled={!due || due === profile.dueDate} onPress={() => setProfile({ dueDate: due })} />
                <Rule style={{ marginVertical: 8 }} />
                <Heading>Baby arrived?</Heading>
                <Body style={{ fontSize: 13.5 }}>Hatching keeps every entry, level and card. It only changes what the app tracks.</Body>
                <Button title="Crack the egg" tone="dot" full onPress={() => router.push('/hatch')} />
              </>
            ) : (
              <>
                <Label>Baby's name</Label>
                <Field value={profile.babyName} onChangeText={(v) => setProfile({ babyName: v })} placeholder="Ada" />
                <Label>Born on</Label>
                <DateInput value={birth} onChange={setBirth} max={new Date()} />
                <Button title="Update" tone="quiet" size="sm" style={{ alignSelf: 'flex-start' }} disabled={!birth || birth === profile.birthDate} onPress={() => setProfile({ birthDate: birth })} />
                <Wrap>
                  {(['girl', 'boy', 'unknown'] as const).map((s) => (
                    <Chip key={s} small label={s === 'unknown' ? 'Rather not say' : s} selected={profile.babySex === s} onPress={() => setProfile({ babySex: s })} />
                  ))}
                </Wrap>
              </>
            )}
          </View>
        </Card>

        <Card>
          <Heading>Your data</Heading>
          <Body style={{ marginTop: 4, marginBottom: 12, fontSize: 13.5 }}>
            All of it lives on this phone. No account, no server, nothing leaves.
          </Body>
          <View style={{ gap: 8 }}>
            <Button
              title="Load sixty days of demo data"
              tone="quiet"
              full
              onPress={() =>
                confirmAlert('Replace everything?', 'This overwrites whatever is stored now.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Pregnancy', onPress: () => seedDemo('pregnancy') },
                  { text: 'Newborn', onPress: () => seedDemo('baby') },
                ])
              }
            />
            <Button title={premium ? 'Export CSV' : 'Export CSV (premium)'} tone="quiet" full onPress={() => (premium ? null : router.push('/paywall'))} />
            <Button title="See everything logged" tone="quiet" full onPress={() => router.push('/history')} />
            <Button
              title="Start over"
              tone="danger"
              full
              onPress={() =>
                confirmAlert('Delete everything?', 'Every log, photo, plan, level and badge on this device. This cannot be undone.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete it all', style: 'destructive', onPress: () => { resetAll(); router.replace('/onboarding'); } },
                ])
              }
            />
          </View>
        </Card>

        <View style={{ paddingHorizontal: 8, gap: 6 }}>
          <Small style={{ textAlign: 'center' }}>
            Nest keeps records and shows you patterns in them. It does not diagnose anything, and every "typical range"
            it shows is a published population figure, not a target. Anything that worries you goes to your midwife,
            doctor or consultatiebureau.
          </Small>
          <Small style={{ textAlign: 'center', fontSize: 10.5 }}>
            {nest.stage} · level {nest.level} · {progress.badges.length} badges · {progress.cards.length} cards
          </Small>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
