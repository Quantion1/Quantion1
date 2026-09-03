import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LockedRow } from '@/components/PremiumGate';
import { Body, Button, Card, Chip, Field, Heading, Label, Small, Title, Wrap, styles, tap } from '@/components/ui';
import { formatRelative } from '@/lib/date';
import { useNest } from '@/state/hooks';
import { usePremium, useStore } from '@/state/store';
import { palette, radius, type } from '@/theme';

const FREE_PHOTOS = 12;

const FIRSTS_BABY = [
  { key: 'first_smile', emoji: '😊', label: 'First real smile' },
  { key: 'first_bath', emoji: '🛁', label: 'First bath' },
  { key: 'first_outing', emoji: '🌳', label: 'First trip outside' },
  { key: 'first_bottle', emoji: '🍼', label: 'First bottle' },
  { key: 'first_laugh', emoji: '😆', label: 'First proper laugh' },
  { key: 'first_food', emoji: '🥄', label: 'First taste of food' },
  { key: 'first_tooth', emoji: '🦷', label: 'First tooth' },
  { key: 'first_haircut', emoji: '✂️', label: 'First haircut' },
  { key: 'first_steps', emoji: '👣', label: 'First steps' },
];

const FIRSTS_PREG = [
  { key: 'first_test', emoji: '🧪', label: 'The test' },
  { key: 'first_scan', emoji: '🖥️', label: 'First scan photo' },
  { key: 'first_bump', emoji: '🤰', label: 'First bump photo' },
  { key: 'first_kick_felt', emoji: '👣', label: 'Felt from outside' },
  { key: 'first_nursery', emoji: '🧸', label: 'The room, ready' },
];

const GLYPHS = ['📷', '🤰', '🖥️', '👣', '🛁', '🎂', '🧸', '🌳', '🚗', '👵', '🐶', '😊'];

export default function PhotosScreen() {
  const router = useRouter();
  const nest = useNest();
  const premium = usePremium();
  const memories = useStore((s) => s.memories);
  const addMemory = useStore((s) => s.addMemory);
  const deleteMemory = useStore((s) => s.deleteMemory);
  const progress = useStore((s) => s.progress);
  const mark = useStore((s) => s.mark);

  const [adding, setAdding] = useState(false);
  const [glyph, setGlyph] = useState('📷');
  const [caption, setCaption] = useState('');
  const [firstKey, setFirstKey] = useState<string | undefined>();

  const firsts = nest.stage === 'pregnancy' ? FIRSTS_PREG : FIRSTS_BABY;
  const done = firsts.filter((f) => memories.some((m) => m.firstKey === f.key) || progress.marks[f.key]).length;
  const atLimit = !premium && memories.length >= FREE_PHOTOS;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 4 }}>
          <Title>Photos</Title>
          <Body>{memories.length} saved. They stay on this phone — no cloud, no sync, no backup.</Body>
        </View>

        {adding ? (
          <Card>
            <Heading>A picture and a date</Heading>
            <Small style={{ marginTop: 2, marginBottom: 10 }}>
              The camera is not wired up in this prototype. Pick a stand-in and write the caption.
            </Small>
            <Wrap>
              {GLYPHS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => { tap(); setGlyph(g); }}
                  style={{
                    width: 50, height: 50, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: glyph === g ? palette.claySoft : palette.cardSunk,
                    borderWidth: 1.5, borderColor: glyph === g ? palette.clay : palette.line,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{g}</Text>
                </Pressable>
              ))}
            </Wrap>
            <View style={{ marginTop: 12, gap: 10 }}>
              <Field value={caption} onChangeText={setCaption} placeholder="what was happening" />
              <Label>Tag it as a first (optional)</Label>
              <Wrap>
                {firsts.map((f) => (
                  <Chip key={f.key} small label={f.label} emoji={f.emoji} selected={firstKey === f.key} onPress={() => setFirstKey(firstKey === f.key ? undefined : f.key)} />
                ))}
              </Wrap>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button title="Cancel" tone="quiet" style={{ flex: 1 }} onPress={() => setAdding(false)} />
                <Button
                  title="Save"
                  tone="ink"
                  style={{ flex: 1 }}
                  onPress={() => {
                    addMemory({ glyph, caption: caption.trim() || 'Untitled', at: new Date().toISOString(), firstKey });
                    if (firstKey) mark(firstKey);
                    setCaption('');
                    setFirstKey(undefined);
                    setAdding(false);
                  }}
                />
              </View>
            </View>
          </Card>
        ) : atLimit ? (
          <LockedRow label={`${FREE_PHOTOS} photos on the free plan`} />
        ) : (
          <Button title="Add a photo" tone="ink" full icon="＋" onPress={() => setAdding(true)} />
        )}

        {/* ────────────────────────────────────────────────────── firsts */}
        <View style={{ gap: 10 }}>
          <Label>Firsts · {done}/{firsts.length}</Label>
          <Small>A photo and a date. The ones you will actually want in ten years.</Small>
          {firsts.map((f) => {
            const memory = memories.find((m) => m.firstKey === f.key);
            return (
              <View
                key={f.key}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
                  borderRadius: radius.md, backgroundColor: memory ? palette.card : palette.cardSunk,
                  borderWidth: 1, borderColor: memory ? palette.dot : palette.line,
                }}
              >
                <Text style={{ fontSize: 19, opacity: memory ? 1 : 0.4 }}>{f.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...type.bodyMed, color: memory ? palette.ink : palette.inkSoft }}>{f.label}</Text>
                  {memory ? <Small>{formatRelative(memory.at)}</Small> : <Small>not yet</Small>}
                </View>
                {!memory && (
                  <Button title="Add" tone="quiet" size="sm" onPress={() => { setFirstKey(f.key); setAdding(true); }} />
                )}
              </View>
            );
          })}
        </View>

        {/* ───────────────────────────────────────────────────── gallery */}
        <View style={{ gap: 10 }}>
          <Label>Every photo</Label>
          {memories.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {memories.map((m) => (
                <Pressable
                  key={m.id}
                  onLongPress={() =>
                    Alert.alert('Delete this photo?', m.caption, [
                      { text: 'Keep', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteMemory(m.id) },
                    ])
                  }
                  style={{
                    width: '48%', aspectRatio: 1, borderRadius: radius.lg, backgroundColor: palette.card,
                    borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center', padding: 12, gap: 6,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>{m.glyph}</Text>
                  <Text style={{ ...type.small, color: palette.ink, textAlign: 'center' }} numberOfLines={2}>{m.caption}</Text>
                  <Small style={{ fontSize: 10 }}>{formatRelative(m.at)}</Small>
                </Pressable>
              ))}
            </View>
          ) : (
            <Small>Nothing yet. Long-press a photo to delete it once there is one.</Small>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
