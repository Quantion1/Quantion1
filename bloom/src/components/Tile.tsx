import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { tracker } from '@/domain/trackers';
import { accent, AccentName, palette, radius, shadow, type } from '@/theme';
import { tap } from './ui';

/** Tiles that are not trackers — they open a screen rather than a log sheet. */
const SPECIAL: Record<string, { label: string; emoji: string; accent: AccentName }> = {
  today: { label: 'Today', emoji: '📖', accent: 'blue' },
};

/**
 * A home-screen tile. In edit mode it grows handles for resize, remove and
 * reordering — the grid is the parent's, not ours.
 */
export function Tile({
  tkey, span, meta, editing, onPress, onRemove, onResize, onMove, atStart, atEnd,
}: {
  tkey: string;
  span: 1 | 2;
  meta: string;
  editing?: boolean;
  onPress: () => void;
  onRemove: () => void;
  onResize: () => void;
  onMove: (delta: number) => void;
  atStart?: boolean;
  atEnd?: boolean;
}) {
  const special = SPECIAL[tkey];
  const t = special ?? tracker(tkey);
  const a = accent(t.accent);
  const wide = span === 2;

  return (
    <View style={{ width: wide ? '100%' : '48.4%' }}>
      <Pressable
        onPress={() => { if (!editing) { tap(); onPress(); } }}
        style={[
          {
            backgroundColor: a.soft,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: palette.line,
            padding: 14,
            minHeight: wide ? 84 : 104,
            gap: 4,
            justifyContent: 'space-between',
          },
          shadow.rest,
        ]}
      >
        <View style={{ flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'flex-start', gap: wide ? 12 : 4 }}>
          <Text style={{ fontSize: 24 }}>{t.emoji}</Text>
          <View style={{ flex: wide ? 1 : undefined }}>
            <Text style={{ ...type.heading, fontSize: 15.5, color: a.base }} numberOfLines={1}>{t.label}</Text>
            <Text style={{ ...type.small, color: palette.inkSoft }} numberOfLines={1}>{meta}</Text>
          </View>
        </View>
        {!wide && <View style={{ height: 2 }} />}
      </Pressable>

      {editing && (
        <View style={{ position: 'absolute', top: -8, left: -6, right: -6, bottom: -6, justifyContent: 'space-between' }} pointerEvents="box-none">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Handle glyph="✕" tone={palette.danger} onPress={onRemove} />
            <Handle glyph="⤡" tone={palette.ink} onPress={onResize} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            <Handle glyph="‹" tone={palette.ink} onPress={() => onMove(-1)} disabled={atStart} />
            <Handle glyph="›" tone={palette.ink} onPress={() => onMove(1)} disabled={atEnd} />
          </View>
        </View>
      )}
    </View>
  );
}

function Handle({ glyph, tone, onPress, disabled }: { glyph: string; tone: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={() => { if (!disabled) { tap(); onPress(); } }}
      style={{
        width: 26, height: 26, borderRadius: 13,
        backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line,
        alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.3 : 1,
        ...shadow.rest,
      }}
    >
      <Text style={{ color: tone, fontSize: 13, marginTop: -1 }}>{glyph}</Text>
    </Pressable>
  );
}
