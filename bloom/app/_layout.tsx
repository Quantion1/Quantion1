import { Fraunces_600SemiBold, Fraunces_700Bold, useFonts } from '@expo-google-fonts/fraunces';
import { NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/components/Confirm';
import { Dot } from '@/components/Dot';
import { Toast } from '@/components/Toast';
import { useStore } from '@/state/store';
import { palette } from '@/theme';
import { useScheme } from '@/theme/scheme';

function useHydrated() {
  const [hydrated, setHydrated] = useState(() => useStore.persist.hasHydrated());
  useEffect(() => {
    if (useStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const done = useStore.persist.onFinishHydration(() => setHydrated(true));
    // Storage can be unavailable or slow in some hosting contexts (a sandboxed
    // preview, a browser blocking site data). Never let that wedge the app on
    // the splash screen forever — fall back to defaults after a short wait.
    const timeout = setTimeout(() => setHydrated(true), 2000);
    return () => {
      done();
      clearTimeout(timeout);
    };
  }, []);
  return hydrated;
}

export default function RootLayout() {
  const hydrated = useHydrated();
  // The root subscription: it repaints the splash, the Stack's own background,
  // the status bar, and the two overlays mounted below the navigator.
  const scheme = useScheme();
  // Custom fonts are a progressive enhancement, not a gate: if this environment
  // can't fetch the font files (e.g. a single-file web preview with no asset
  // server behind it), the UI must still render and work in the fallback font
  // rather than sit on the splash screen forever.
  useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  });

  if (!hydrated) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: palette.paper, alignItems: 'center', justifyContent: 'center' }}>
          <Dot stage="egg1" size={140} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.paper } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="log/[key]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="library" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="review" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="hatch" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="moment/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="history" options={{ animation: 'slide_from_right' }} />
        </Stack>
        <Toast />
        <ConfirmDialog />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
