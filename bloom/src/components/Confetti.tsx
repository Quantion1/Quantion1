import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, View } from 'react-native';

import { palette } from '@/theme';

/**
 * A short burst of paper for the moment a milestone lands. Deliberately cheap:
 * a couple of dozen small views on the native driver, one run, no loop, and it
 * stops moving the second it is off the bottom.
 */
export function Confetti({ count = 28, height = 640 }: { count?: number; height?: number }) {
  const width = Dimensions.get('window').width;
  const drivers = useRef<Animated.Value[]>([]);
  if (drivers.current.length !== count) {
    drivers.current = Array.from({ length: count }, () => new Animated.Value(0));
  }

  // Fixed per mount so the pieces do not reshuffle on every re-render.
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i / count) * width + (Math.random() - 0.5) * (width / count) * 2,
        drift: (Math.random() - 0.5) * 90,
        size: 6 + Math.random() * 7,
        delay: Math.random() * 320,
        duration: 1500 + Math.random() * 900,
        spin: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3),
        square: Math.random() > 0.45,
        color: [palette.dot, palette.clay, palette.sage, palette.blue, palette.plum][i % 5],
      })),
    [count, width],
  );

  useEffect(() => {
    Animated.stagger(
      26,
      drivers.current.map((v, i) =>
        Animated.timing(v, {
          toValue: 1,
          duration: pieces[i].duration,
          delay: pieces[i].delay,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [pieces]);

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {pieces.map((p, i) => {
        const v = drivers.current[i];
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: -20,
              width: p.size,
              height: p.square ? p.size : p.size * 0.45,
              borderRadius: p.square ? 2 : p.size,
              backgroundColor: p.color,
              opacity: v.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }),
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, height] }) },
                { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, p.drift] }) },
                {
                  rotate: v.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${p.spin * 360}deg`],
                  }),
                },
              ],
            }}
          />
        );
      })}
    </View>
  );
}
