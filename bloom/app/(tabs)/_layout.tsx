import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tap } from '@/components/ui';
import { palette, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

const TABS = [
  { name: 'home', label: 'Home', glyph: '🏠' },
  { name: 'journey', label: 'Journey', glyph: '🐣' },
  { name: 'insights', label: 'Insights', glyph: '📊' },
  { name: 'plan', label: 'Plan', glyph: '🗓️' },
  { name: 'photos', label: 'Photos', glyph: '📸' },
];

export default function TabsLayout() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: palette.paper } }}
      tabBar={({ state, navigation }) => (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: palette.card,
            borderTopWidth: 1,
            borderTopColor: palette.line,
            paddingTop: 9,
            paddingBottom: Math.max(insets.bottom, 9),
          }}
        >
          {state.routes.map((route, i) => {
            const cfg = TABS.find((t) => t.name === route.name);
            if (!cfg) return null;
            const focused = state.index === i;
            return (
              <Pressable
                key={route.key}
                onPress={() => { tap(); if (!focused) navigation.navigate(route.name); }}
                style={{ flex: 1, alignItems: 'center', gap: 3 }}
              >
                <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.42 }}>{cfg.glyph}</Text>
                <Text style={{ ...type.label, fontSize: 9.5, color: focused ? palette.ink : palette.inkFaint }}>
                  {cfg.label.toUpperCase()}
                </Text>
                <View style={{ height: 2, width: 16, borderRadius: 2, backgroundColor: focused ? palette.dot : 'transparent' }} />
              </Pressable>
            );
          })}
        </View>
      )}
    >
      {TABS.map((t) => <Tabs.Screen key={t.name} name={t.name} />)}
    </Tabs>
  );
}
