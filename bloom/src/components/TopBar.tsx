import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useGame, usePremium } from '@/state/store';
import { palette, radius } from '@/theme';
import { tap } from './ui';

export function TopBar({ subtitle }: { subtitle?: string }) {
  const game = useGame();
  const premium = usePremium();
  const router = useRouter();

  const stat = (emoji: string, value: React.ReactNode, color: string, onPress?: () => void) => (
    <Pressable
      onPress={
        onPress
          ? () => {
              tap();
              onPress();
            }
          : undefined
      }
      style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
    >
      <Text style={{ fontSize: 19 }}>{emoji}</Text>
      <Text style={{ fontSize: 17, fontWeight: '900', color }}>{value}</Text>
    </Pressable>
  );

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 10, gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {stat('🔥', game.streak, palette.coral, () => router.push('/streak'))}
          {stat('💎', game.gems, palette.sky)}
          {stat('❄️', game.streakFreezes, palette.grape, () => router.push('/streak'))}
        </View>
        <Pressable
          onPress={() => {
            tap();
            router.push('/paywall');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: premium ? palette.grapeSoft : palette.sunnySoft,
            borderRadius: radius.pill,
            paddingHorizontal: 11,
            paddingVertical: 6,
          }}
        >
          <Text style={{ fontSize: 13 }}>{premium ? '👑' : '⚡'}</Text>
          <Text style={{ fontSize: 12, fontWeight: '900', color: premium ? palette.grapeDark : palette.sunnyDark }}>
            {premium ? 'PREMIUM' : 'GO PREMIUM'}
          </Text>
        </Pressable>
      </View>
      {!!subtitle && <Text style={{ fontSize: 12, fontWeight: '700', color: palette.inkFaint }}>{subtitle}</Text>}
    </View>
  );
}
