import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateInput } from '@/components/DateInput';
import { Dot } from '@/components/Dot';
import { Body, Button, Card, Field, Heading, Label, Title, ping, tap } from '@/components/ui';
import { addDays, todayKey } from '@/lib/date';
import { useStore } from '@/state/store';
import { palette } from '@/theme';

/** The one irreversible action in the app, so it asks properly. */
export default function Hatch() {
  const router = useRouter();
  const hatch = useStore((s) => s.hatch);
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayKey());

  // DateInput reports '' for anything that is not a whole, in-range date.
  const valid = !!date;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.paper }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 18 }}>
        <Pressable onPress={() => { tap(); router.back(); }} hitSlop={14}>
          <Text style={{ fontSize: 20, color: palette.inkFaint }}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 0, gap: 18 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Dot stage="egg3" size={150} />
          <Title style={{ textAlign: 'center' }}>Crack the egg?</Title>
        </View>

        <Card tint={palette.dotSoft}>
          <Body style={{ color: palette.ink }}>
            This is the big one. It closes the pregnancy track, starts baby tracking from the birth date, and hatches
            Dot. Everything you logged stays exactly where it is — but only do this once the baby is actually here.
          </Body>
        </Card>

        <View style={{ gap: 8 }}>
          <Label>Name — leave it empty and we'll say Nugget</Label>
          <Field value={name} onChangeText={setName} placeholder="Ada" />
        </View>

        <View style={{ gap: 8 }}>
          <Label>Born on</Label>
          <DateInput value={date} onChange={setDate} min={addDays(new Date(), -60)} max={new Date()} outOfRange="A birth date can't be in the future." />
        </View>

        <Button
          title="Yes — the baby is here"
          tone="dot"
          size="lg"
          full
          disabled={!valid}
          onPress={() => {
            hatch(date, name.trim() || 'The Nugget');
            ping();
            router.replace('/(tabs)/home');
          }}
        />
        <Button title="Not yet" tone="quiet" full onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}
