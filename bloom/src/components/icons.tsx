import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { palette } from '@/theme';

/**
 * A drawn settings gear rather than the ⚙ glyph, whose shape and weight change
 * with whatever font happens to be resolving. Eight teeth around a solid ring
 * with the hub knocked out, so it stays legible down to about 18px.
 */
export function Gear({ size = 22, color = palette.inkSoft }: { size?: number; color?: string }) {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {teeth.map((deg) => (
        <Rect
          key={deg}
          x={10.25}
          y={1.9}
          width={3.5}
          height={4.8}
          rx={1.15}
          fill={color}
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      {/* Ring and hub as one even-odd path: the inner circle cuts a real hole. */}
      <Path
        d="M12 4.3 a7.7 7.7 0 1 0 0.01 0 Z M12 8.75 a3.25 3.25 0 1 0 0.01 0 Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

/**
 * A water bottle. Unicode has no emoji for one — the closest, 🧴, is a lotion
 * bottle — so the water tracker's 500ml vessel is drawn: a screw cap, a collar,
 * a tall body with a waist, and a fill line just below the shoulder.
 */
export function WaterBottle({ size = 26, color = palette.blue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Cap and the collar under it. */}
      <Rect x={9.1} y={1.6} width={5.8} height={3} rx={0.9} fill={color} />
      <Rect x={9.6} y={4.6} width={4.8} height={1.5} rx={0.5} fill={color} opacity={0.55} />
      {/* Body: shoulders out to the waist, in at the middle, out to a flat base. */}
      <Path
        d="M9.7 6.1 C9.7 7.6 6.7 8.6 6.7 11.2 L6.7 13.4 C6.7 14.1 7.2 14.4 7.2 15 C7.2 15.6 6.7 15.9 6.7 16.6 L6.7 20.2 C6.7 21.3 7.5 22.1 8.6 22.1 L15.4 22.1 C16.5 22.1 17.3 21.3 17.3 20.2 L17.3 16.6 C17.3 15.9 16.8 15.6 16.8 15 C16.8 14.4 17.3 14.1 17.3 13.4 L17.3 11.2 C17.3 8.6 14.3 7.6 14.3 6.1 Z"
        fill={color}
        opacity={0.22}
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      {/* The water inside, level with the waist. */}
      <Path
        d="M6.9 16.4 L17.1 16.4 L17.1 20.2 C17.1 21.2 16.4 21.9 15.4 21.9 L8.6 21.9 C7.6 21.9 6.9 21.2 6.9 20.2 Z"
        fill={color}
        opacity={0.75}
      />
    </Svg>
  );
}
