import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryRow } from '@/components/EntryRow';
import { TopBar } from '@/components/TopBar';
import { Body, Button3D, Card, Heading, Label, Title, styles, tap } from '@/components/ui';
import { logTypesForMode } from '@/domain/logTypes';
import { formatRelative } from '@/lib/date';
import { useProfile, useStore } from '@/state/store';
import { accent, palette, radius } from '@/theme';

export default function TrackScreen() {
  const router = useRouter();
  const profile = useProfile();
  const entries = useStore((s) => s.entries);
  const types = logTypesForMode(profile.mode);

  const lastOf = (t: string) => entries.find((e) => e.type === t);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 4 }}>
          <Title>Track</Title>
          <Body>Every entry earns XP and keeps your streak alive.</Body>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {types.map((t) => {
            const a = accent(t.accent);
            const last = lastOf(t.type);
            return (
              <Pressable
                key={t.type}
                onPress={() => {
                  tap();
                  router.push(`/log/${t.type}`);
                }}
                style={{
                  width: '48%',
                  backgroundColor: palette.white,
                  borderRadius: radius.lg,
                  borderWidth: 2,
                  borderColor: palette.line,
                  borderBottomWidth: 5,
                  borderBottomColor: a.base,
                  padding: 14,
                  gap: 6,
                  minHeight: 132,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: a.soft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{t.emoji}</Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: '900', color: palette.ink }}>{t.label}</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: palette.inkFaint }}>{t.blurb}</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ fontSize: 10, fontWeight: '800', color: a.dark }}>
                  {last ? `Last: ${formatRelative(last.at)}` : `+${t.xp} XP`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {profile.mode === 'pregnancy' && (
          <Card tone="blossom">
            <Heading>Baby arrived? 👶</Heading>
            <Body style={{ marginTop: 4, marginBottom: 12 }}>
              Switch Bloom into newborn mode. Your pregnancy history stays exactly where it is.
            </Body>
            <Button3D title="Register the birth" tone="blossom" full onPress={() => router.push('/(tabs)/me')} />
          </Card>
        )}

        <Card>
          <Heading>Latest entries</Heading>
          {entries.slice(0, 10).map((e) => (
            <EntryRow key={e.id} entry={e} showRelative />
          ))}
          {!entries.length && <Body style={{ marginTop: 8 }}>Nothing yet — pick a card above.</Body>}
        </Card>

        <Label>Bloom stores everything on this device. Nothing leaves your phone.</Label>
      </ScrollView>
    </SafeAreaView>
  );
}
