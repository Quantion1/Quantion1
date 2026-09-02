import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { palette } from '@/theme';

export type MascotMood = 'happy' | 'cheer' | 'sleepy' | 'wave' | 'sad' | 'proud';

/**
 * Pip — Bloom's mascot. A sprouting seed with an unreasonable amount of
 * enthusiasm for logging diaper changes.
 */
export function Mascot({ size = 96, mood = 'happy' }: { size?: number; mood?: MascotMood }) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: mood === 'sleepy' ? 2400 : 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: mood === 'sleepy' ? 2400 : 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, mood]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, mood === 'cheer' ? -8 : -4] });
  const rotate = bob.interpolate({ inputRange: [0, 1], outputRange: mood === 'wave' ? ['-4deg', '4deg'] : ['0deg', '0deg'] });

  const eye = (cx: number) => {
    if (mood === 'sleepy') {
      return <Path key={cx} d={`M ${cx - 7} 52 q 7 6 14 0`} stroke={palette.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
    }
    if (mood === 'cheer' || mood === 'proud') {
      return <Path key={cx} d={`M ${cx - 7} 53 q 7 -8 14 0`} stroke={palette.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
    }
    return (
      <G key={cx}>
        <Circle cx={cx} cy={51} r={7.5} fill={palette.white} />
        <Circle cx={cx + 1} cy={52} r={4.2} fill={palette.ink} />
        <Circle cx={cx + 2.6} cy={49.6} r={1.5} fill={palette.white} />
      </G>
    );
  };

  const mouth =
    mood === 'sad' ? (
      <Path d="M 43 68 q 7 -6 14 0" stroke={palette.ink} strokeWidth={3.2} strokeLinecap="round" fill="none" />
    ) : mood === 'cheer' ? (
      <Path d="M 41 63 q 9 14 18 0 z" fill={palette.ink} />
    ) : (
      <Path d="M 42 64 q 8 8 16 0" stroke={palette.ink} strokeWidth={3.2} strokeLinecap="round" fill="none" />
    );

  return (
    <Animated.View style={{ transform: [{ translateY }, { rotate }] }}>
      <View>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {/* sprout */}
          <Path d="M50 22 C 50 12, 44 8, 38 6 C 38 16, 43 20, 50 22 Z" fill={palette.mint} />
          <Path d="M50 22 C 52 14, 58 11, 64 10 C 62 19, 57 22, 50 22 Z" fill={palette.mintDark} />
          <Rect x={48.5} y={20} width={3} height={8} rx={1.5} fill={palette.mintDark} />

          {/* body */}
          <Ellipse cx={50} cy={58} rx={32} ry={31} fill={palette.blossom} />
          <Ellipse cx={50} cy={64} rx={23} ry={21} fill={palette.blossomSoft} />

          {/* arms */}
          {mood === 'wave' ? (
            <Path d="M 80 52 q 10 -8 8 -18" stroke={palette.blossomDark} strokeWidth={7} strokeLinecap="round" fill="none" />
          ) : (
            <Path d="M 80 58 q 8 2 10 8" stroke={palette.blossomDark} strokeWidth={7} strokeLinecap="round" fill="none" />
          )}
          <Path d="M 20 58 q -8 2 -10 8" stroke={palette.blossomDark} strokeWidth={7} strokeLinecap="round" fill="none" />

          {/* face */}
          {eye(38)}
          {eye(58)}
          <Circle cx={29} cy={62} r={5} fill={palette.blossom} opacity={0.55} />
          <Circle cx={71} cy={62} r={5} fill={palette.blossom} opacity={0.55} />
          {mouth}

          {mood === 'sleepy' && (
            <>
              <Path d="M78 26 h10 l-10 12 h10" stroke={palette.grape} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M90 12 h7 l-7 9 h7" stroke={palette.grape} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
        </Svg>
      </View>
    </Animated.View>
  );
}
