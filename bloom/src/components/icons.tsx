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
