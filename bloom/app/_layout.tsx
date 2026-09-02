import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { XpToast } from '@/components/XpToast';
import { useStore } from '@/state/store';
import { palette } from '@/theme';

function useHydrated() {
  const [hydrated, setHydrated] = useState(() => useStore.persist.hasHydrated());
  useEffect(() => {
    const done = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return done;
  }, []);
  return hydrated;
}

export default function RootLayout() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Mascot size={120} mood="happy" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="log/[type]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="stage/[index]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="streak" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="history" options={{ animation: 'slide_from_right' }} />
      </Stack>
      <XpToast />
    </SafeAreaProvider>
  );
}
