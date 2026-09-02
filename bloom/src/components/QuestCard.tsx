import React from 'react';
import { Text, View } from 'react-native';

import type { QuestDef } from '@/domain/quests';
import { accent, palette, radius } from '@/theme';
import { ProgressBar } from './ProgressRing';
import { Button3D, success } from './ui';

export function QuestCard({
  quest,
  progress,
  claimed,
  onClaim,
}: {
  quest: QuestDef;
  progress: number;
  claimed: boolean;
  onClaim: () => void;
}) {
  const a = accent(quest.accent);
  const pct = Math.min(1, progress / quest.target);
  const complete = progress >= quest.target;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: claimed ? palette.cloud : palette.white,
        borderRadius: radius.lg,
        borderWidth: 2,
        borderColor: complete && !claimed ? a.base : palette.line,
        padding: 14,
      }}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: radius.md,
          backgroundColor: a.soft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 22 }}>{claimed ? '✅' : quest.emoji}</Text>
      </View>

      <View style={{ flex: 1, gap: 6 }}>
        <Text style={{ fontSize: 14, fontWeight: '900', color: claimed ? palette.inkFaint : palette.ink }}>
          {quest.title}
        </Text>
        <ProgressBar progress={pct} color={a.base} height={11} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: palette.inkFaint }}>
            {Math.min(progress, quest.target)} / {quest.target}
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '800', color: palette.inkFaint }}>
            +{quest.xp} XP · 💎{quest.gems}
          </Text>
        </View>
      </View>

      {complete && !claimed && (
        <Button3D
          title="Claim"
          tone={quest.accent}
          size="sm"
          onPress={() => {
            success();
            onClaim();
          }}
        />
      )}
    </View>
  );
}
