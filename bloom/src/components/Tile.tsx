import React from 'react';
import { Text, View } from 'react-native';

import { tracker } from '@/domain/trackers';
import { accent, AccentName, palette, radius, shadow, type } from '@/theme';

/** Tiles that are not trackers — they open a screen rather than a log sheet. */
const SPECIAL: Record<string, { label: string; emoji: string; accent: AccentName }> = {
  today: { label: 'Today', emoji: '📖', accent: 'blue' },
};

/**
 * The look of a home tile. Position, size and every gesture belong to TileGrid —
 * this only decides how a tile of a given shape presents itself.
 */
export function TileFace({
  tkey, wide, tall, meta, raised,
}: {
  tkey: string;
  wide: boolean;
  tall: boolean;
  meta: string;
  raised?: boolean;
}) {
  const t = SPECIAL[tkey] ?? tracker(tkey);
  const a = accent(t.accent);
  const row = wide && !tall;

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: a.soft,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: raised ? a.base : palette.line,
          padding: 14,
          gap: 4,
          justifyContent: tall ? 'center' : 'space-between',
        },
        raised ? shadow.lift : shadow.rest,
      ]}
    >
      <View style={{ flexDirection: row ? 'row' : 'column', alignItems: row ? 'center' : 'flex-start', gap: row ? 12 : 6 }}>
        <Text style={{ fontSize: tall ? 34 : 24 }}>{t.emoji}</Text>
        <View style={{ flex: row ? 1 : undefined }}>
          <Text style={{ ...type.heading, fontSize: tall ? 18 : 15.5, color: a.base }} numberOfLines={1}>{t.label}</Text>
          <Text style={{ ...type.small, color: palette.inkSoft }} numberOfLines={tall ? 3 : 1}>{meta}</Text>
        </View>
      </View>
    </View>
  );
}
