import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/state/store';
import { palette, radius, shadow } from '@/theme';

/** Floating "+5 XP" pill that drops in on every logged entry. */
export function XpToast() {
  const event = useStore((s) => s.lastXpEvent);
  const clear = useStore((s) => s.clearXpEvent);
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!event) return;
    anim.setValue(0);
    Animated.sequence([
      Animated.spring(anim, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => clear());
  }, [event, anim, clear]);

  if (!event) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: insets.top + 54,
        left: 0,
        right: 0,
        alignItems: 'center',
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) }],
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: palette.ink,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: radius.pill,
          ...shadow.float,
        }}
      >
        <Text style={{ fontSize: 16 }}>{event.badges?.length ? '🏅' : '⚡'}</Text>
        <Text style={{ color: palette.white, fontWeight: '900', fontSize: 14 }}>
          {event.amount > 0 ? `+${event.amount} XP · ` : ''}
          {event.label}
        </Text>
      </View>
    </Animated.View>
  );
}
