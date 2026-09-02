import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tap } from '@/components/ui';
import { palette, radius } from '@/theme';

const TABS = [
  { name: 'today', label: 'Today', emoji: '🏡', color: palette.blossom, soft: palette.blossomSoft },
  { name: 'track', label: 'Track', emoji: '➕', color: palette.mint, soft: palette.mintSoft },
  { name: 'insights', label: 'Insights', emoji: '📊', color: palette.sky, soft: palette.skySoft },
  { name: 'journey', label: 'Journey', emoji: '🗺️', color: palette.sunny, soft: palette.sunnySoft },
  { name: 'me', label: 'Me', emoji: '🙋', color: palette.grape, soft: palette.grapeSoft },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: palette.bg } }}
      tabBar={({ state, navigation }) => (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: palette.white,
            borderTopWidth: 2,
            borderTopColor: palette.line,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 8),
            paddingHorizontal: 6,
          }}
        >
          {state.routes.map((route, i) => {
            const cfg = TABS.find((t) => t.name === route.name);
            if (!cfg) return null;
            const focused = state.index === i;
            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  tap();
                  if (!focused) navigation.navigate(route.name);
                }}
                style={{ flex: 1, alignItems: 'center' }}
              >
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: radius.md,
                    backgroundColor: focused ? cfg.soft : 'transparent',
                    borderWidth: 2,
                    borderColor: focused ? cfg.color : 'transparent',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{cfg.emoji}</Text>
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '900',
                    marginTop: 3,
                    color: focused ? cfg.color : palette.inkFaint,
                  }}
                >
                  {cfg.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} />
      ))}
    </Tabs>
  );
}
