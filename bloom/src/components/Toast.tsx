import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/state/store';
import { palette, radius, shadow, type } from '@/theme';
import { Body, Button, Title } from './ui';
import { Dot } from './Dot';
import { useNest } from '@/state/hooks';

/** Small confirmations slide in at the top; a level-up gets the whole screen. */
export function Toast() {
  const toast = useStore((s) => s.toast);
  const clear = useStore((s) => s.clearToast);
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  const nest = useNest();

  useEffect(() => {
    if (!toast || toast.big) return;
    anim.setValue(0);
    Animated.sequence([
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 6 }),
      Animated.delay(1500),
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => clear());
  }, [toast, anim, clear]);

  if (!toast) return null;

  if (toast.big) {
    return (
      <Modal transparent animationType="fade" onRequestClose={clear}>
        <View style={{ flex: 1, backgroundColor: palette.backdrop, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <View style={[{ backgroundColor: palette.card, borderRadius: radius.xl, padding: 26, alignItems: 'center', gap: 10, width: '100%', maxWidth: 340 }, shadow.lift]}>
            <Dot stage={nest.dot as any} size={130} />
            <Text style={{ ...type.label, color: palette.dotDeep, textTransform: 'uppercase' }}>{toast.sub ?? 'Nice'}</Text>
            <Title style={{ textAlign: 'center' }}>{toast.title}</Title>
            <Body style={{ textAlign: 'center' }}>Dot noticed.</Body>
            <Button title="Good" tone="ink" full onPress={clear} style={{ marginTop: 6 }} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', top: insets.top + 10, left: 0, right: 0, alignItems: 'center',
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
      }}
    >
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: palette.ink, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill }, shadow.lift]}>
        <Text style={{ fontSize: 15 }}>{toast.emoji}</Text>
        <Text style={{ ...type.bodyMed, fontSize: 14, color: palette.paper }}>{toast.title}</Text>
      </View>
    </Animated.View>
  );
}
