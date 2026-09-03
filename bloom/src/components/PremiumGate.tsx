import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { usePremium } from '@/state/store';
import { palette, radius } from '@/theme';
import { Body, Button, Heading } from './ui';

/** Shows the real thing, dimmed, rather than an empty locked box. */
export function PremiumGate({
  children, title = 'Premium', blurb, minHeight = 180,
}: {
  children: React.ReactNode;
  title?: string;
  blurb: string;
  minHeight?: number;
}) {
  const premium = usePremium();
  const router = useRouter();
  if (premium) return <>{children}</>;

  return (
    <View style={{ borderRadius: radius.lg, overflow: 'hidden', minHeight }}>
      <View style={{ opacity: 0.22 }} pointerEvents="none">{children}</View>
      <View
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          alignItems: 'center', justifyContent: 'center', padding: 18, gap: 7,
          backgroundColor: palette.scrim,
        }}
      >
        <Text style={{ fontSize: 20 }}>🔒</Text>
        <Heading style={{ textAlign: 'center' }}>{title}</Heading>
        <Body style={{ textAlign: 'center', fontSize: 13, maxWidth: 260 }}>{blurb}</Body>
        <Button title="See what's in it" tone="quiet" size="sm" onPress={() => router.push('/paywall')} />
      </View>
    </View>
  );
}

export function LockedRow({ label }: { label: string }) {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: palette.cardSunk, borderRadius: radius.md, padding: 14,
        borderWidth: 1, borderColor: palette.line,
      }}
    >
      <Body style={{ flex: 1 }}>🔒 {label}</Body>
      <Button title="Unlock" tone="quiet" size="sm" onPress={() => router.push('/paywall')} />
    </View>
  );
}
