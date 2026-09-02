import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { palette } from '@/theme';

export function ProgressRing({
  progress,
  size = 108,
  stroke = 12,
  color = palette.mint,
  track = palette.cloud,
  children,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * p} ${c}`}
            fill="none"
          />
        </G>
      </Svg>
      <View style={{ alignItems: 'center' }}>{children}</View>
    </View>
  );
}

export function ProgressBar({
  progress,
  color = palette.mint,
  height = 14,
  track = palette.cloud,
  label,
}: {
  progress: number;
  color?: string;
  height?: number;
  track?: string;
  label?: string;
}) {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ height, backgroundColor: track, borderRadius: height, overflow: 'hidden', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, backgroundColor: color, borderRadius: height }} />
      {p > 0.08 && (
        <View
          style={{
            position: 'absolute',
            left: 6,
            top: 3,
            height: Math.max(2, height * 0.22),
            width: `${Math.max(0, p * 100 - 10)}%`,
            backgroundColor: 'rgba(255,255,255,0.45)',
            borderRadius: 99,
          }}
        />
      )}
      {!!label && (
        <Text style={{ alignSelf: 'center', fontSize: 10, fontWeight: '900', color: palette.white }}>{label}</Text>
      )}
    </View>
  );
}
