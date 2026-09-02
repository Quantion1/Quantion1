import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { usePremium } from '@/state/store';
import { palette, radius } from '@/theme';
import { Button3D } from './ui';

/**
 * Wraps a piece of analysis. Free users see a dimmed teaser of the real chart
 * with an unlock prompt on top — the value is visible, just not readable.
 */
export function PremiumGate({
  children,
  title = 'Premium insight',
  blurb = 'Unlock the full analysis, unlimited history and doctor-ready exports.',
  minHeight = 180,
}: {
  children: React.ReactNode;
  title?: string;
  blurb?: string;
  minHeight?: number;
}) {
  const premium = usePremium();
  const router = useRouter();
  if (premium) return <>{children}</>;

  return (
    <View style={{ borderRadius: radius.lg, overflow: 'hidden', minHeight }}>
      <View style={{ opacity: 0.26 }} pointerEvents="none">
        {children}
      </View>
      <View
        style={{
          ...StyleSheetAbsolute,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          gap: 8,
          backgroundColor: 'rgba(255,255,255,0.62)',
        }}
      >
        <Text style={{ fontSize: 26 }}>🔒</Text>
        <Text style={{ fontSize: 16, fontWeight: '900', color: palette.ink, textAlign: 'center' }}>{title}</Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: palette.inkSoft, textAlign: 'center', maxWidth: 280 }}>
          {blurb}
        </Text>
        <Button3D title="Unlock" tone="grape" size="sm" icon="👑" onPress={() => router.push('/paywall')} />
      </View>
    </View>
  );
}

const StyleSheetAbsolute = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export function LockedRow({ label }: { label: string }) {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: palette.cloud,
        borderRadius: radius.md,
        padding: 14,
      }}
    >
      <Text style={{ fontWeight: '800', color: palette.inkFaint }}>🔒 {label}</Text>
      <Button3D title="Unlock" tone="grape" size="sm" onPress={() => router.push('/paywall')} />
    </View>
  );
}
