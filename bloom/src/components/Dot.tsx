import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

export type DotStage = 'egg0' | 'egg1' | 'egg2' | 'egg3' | 'sleep' | 'tummy' | 'sit' | 'stand' | 'walk';

const C = {
  body: '#F7D27C',
  bodyMid: '#EEBF62',
  bodyDeep: '#D9A544',
  belly: '#FCEBC4',
  line: '#C08F3C',
  bill: '#EE9F4F',
  billDeep: '#CE7C39',
  foot: '#EE8F45',
  footDeep: '#CE7031',
  cheek: '#EE9B92',
  eye: '#4A3526',
  bib: '#DEEAF4',
  bibEdge: '#B6D0E6',
  anchor: '#4E6E96',
  eggShell: '#FAF4E6',
  eggShade: '#EDE3CE',
  eggSpeck: '#DCCFB4',
  knitCream: '#F2EADA',
  knitBlue: '#CBDFE6',
  knitSage: '#D9E5CE',
  knitLine: '#FFFFFF',
};

/** The knitted blanket the newborn poses rest on. */
function Blanket({ y = 74, w = 108 }: { y?: number; w?: number }) {
  const stripes = [C.knitCream, C.knitBlue, C.knitSage, C.knitCream, C.knitBlue];
  const h = 26;
  const x = 60 - w / 2;
  return (
    <G>
      <Defs>
        <ClipPath id="blanket">
          <Path
            d={`M ${x + 4} ${y + 4}
                Q ${x - 2} ${y + h / 2} ${x + 6} ${y + h - 2}
                Q ${60} ${y + h + 5} ${x + w - 6} ${y + h - 2}
                Q ${x + w + 2} ${y + h / 2} ${x + w - 4} ${y + 4}
                Q ${60} ${y - 6} ${x + 4} ${y + 4} Z`}
          />
        </ClipPath>
      </Defs>
      <G clipPath="url(#blanket)">
        <Rect x={x - 6} y={y - 8} width={w + 12} height={h + 16} fill={C.knitCream} />
        {stripes.map((c, i) => (
          <Rect key={i} x={x - 6} y={y - 6 + i * 6.4} width={w + 12} height={5.2} fill={c} />
        ))}
        {/* knit texture: a light chevron grid */}
        {Array.from({ length: 9 }, (_, i) => (
          <Path
            key={`k${i}`}
            d={`M ${x - 4 + i * 13} ${y - 8} l 6 6 l -6 6 l 6 6 l -6 6 l 6 6 l -6 6`}
            stroke={C.knitLine}
            strokeWidth={1.4}
            fill="none"
            opacity={0.55}
          />
        ))}
      </G>
    </G>
  );
}

function Bib({ x = 60, y = 58, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Path d="M -11 -6 Q 0 -11 11 -6 Q 13 6 0 10 Q -13 6 -11 -6 Z" fill={C.bib} stroke={C.bibEdge} strokeWidth={1.4} />
      {/* anchor */}
      <G stroke={C.anchor} strokeWidth={1.3} fill="none" strokeLinecap="round">
        <Circle cx={0} cy={-3.4} r={1.5} />
        <Path d="M 0 -1.6 V 5" />
        <Path d="M -3.4 0.4 H 3.4" />
        <Path d="M -4.2 2.8 Q -3 5.6 0 5.6 Q 3 5.6 4.2 2.8" />
      </G>
    </G>
  );
}

function Eye({ x, y, closed, happy }: { x: number; y: number; closed?: boolean; happy?: boolean }) {
  if (closed) {
    return <Path d={`M ${x - 4.6} ${y} q 4.6 4.2 9.2 0`} stroke={C.eye} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
  }
  if (happy) {
    return <Path d={`M ${x - 4.6} ${y + 1.6} q 4.6 -5.4 9.2 0`} stroke={C.eye} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
  }
  return (
    <G>
      <Circle cx={x} cy={y} r={3.5} fill={C.eye} />
      <Circle cx={x + 1.2} cy={y - 1.3} r={1.2} fill="#FFFFFF" />
    </G>
  );
}

function Bill({ x, y, open }: { x: number; y: number; open?: boolean }) {
  return (
    <G>
      <Path
        d={`M ${x - 8} ${y} q 4 -4.6 9.5 -3.4 q 5 1.1 5.5 4 q -5 3.4 -10.5 2.4 q -3.6 -0.7 -4.5 -3 Z`}
        fill={C.bill}
        stroke={C.billDeep}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      {open && <Path d={`M ${x - 4} ${y + 2.2} q 4.5 3.4 9 0.4 q -4 -1.4 -9 -0.4 Z`} fill="#B4574B" />}
    </G>
  );
}

/** A rounded wing. `up` raises it into a wave. */
function Wing({ x, y, flip = false, up = false }: { x: number; y: number; flip?: boolean; up?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <G transform={`translate(${x} ${y}) scale(${s} 1) ${up ? 'rotate(-38)' : ''}`}>
      <Path
        d="M 0 0 q 11 -3 15 5 q 3.5 7 -3.5 9.5 q -8 2.5 -11.5 -4 Z"
        fill={C.bodyMid}
        stroke={C.line}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path d="M 4 4.5 q 7 -0.5 9 3.5" stroke={C.bodyDeep} strokeWidth={1.1} fill="none" strokeLinecap="round" />
    </G>
  );
}

function Foot({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <Path
        d="M 0 0 q -5.5 1.5 -6.5 5 q -0.5 2.6 2.5 3 q 5 0.6 8.5 -1.4 q 2.4 -1.6 1 -4 q -1.6 -2.6 -5.5 -2.6 Z"
        fill={C.foot}
        stroke={C.footDeep}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </G>
  );
}

/** The head, shared by every hatched pose. */
function Head({ x, y, closed, happy, open, tilt = 0 }: { x: number; y: number; closed?: boolean; happy?: boolean; open?: boolean; tilt?: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${tilt})`}>
      {/* tuft */}
      <Path d="M -3 -19 q -2 -7 3 -8 q -1 4 2 5 q 2 -5 6 -4 q -2 3 0 5 q 3 -3 6 -1 q -3 2 -3 5 Z" fill={C.bodyMid} stroke={C.line} strokeWidth={1.1} strokeLinejoin="round" />
      <Circle cx={0} cy={0} r={17} fill={C.body} stroke={C.line} strokeWidth={1.3} />
      <Ellipse cx={-4} cy={-5} rx={6} ry={4.5} fill={C.belly} opacity={0.55} />
      <Eye x={-6.5} y={-1} closed={closed} happy={happy} />
      <Eye x={7.5} y={-1} closed={closed} happy={happy} />
      <Circle cx={-12} cy={5.5} r={3.6} fill={C.cheek} opacity={0.5} />
      <Circle cx={13} cy={5.5} r={3.6} fill={C.cheek} opacity={0.5} />
      <Bill x={2} y={7} open={open} />
    </G>
  );
}

function Egg({ cracks }: { cracks: number }) {
  return (
    <G>
      <Blanket y={72} w={96} />
      <G>
        <Path
          d="M 60 22 C 78 22 88 44 88 58 C 88 74 75 84 60 84 C 45 84 32 74 32 58 C 32 44 42 22 60 22 Z"
          fill={C.eggShell}
          stroke={C.eggShade}
          strokeWidth={1.6}
        />
        <Path d="M 44 40 C 40 50 40 62 46 72" stroke={C.eggShade} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.6} />
        {[[50, 38], [68, 46], [58, 62], [72, 68], [46, 56]].map(([cx, cy], i) => (
          <Circle key={i} cx={cx} cy={cy} r={2} fill={C.eggSpeck} opacity={0.65} />
        ))}
        {cracks >= 1 && (
          <Path d="M 36 54 l 7 -4 l 5 5 l 7 -4" stroke={C.line} strokeWidth={1.8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {cracks >= 2 && (
          <Path d="M 55 51 l 8 5 l 6 -5 l 8 4" stroke={C.line} strokeWidth={1.8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {cracks >= 3 && (
          <>
            <Path d="M 40 63 l 6 5 l 7 -4 l 6 6 l 8 -5" stroke={C.line} strokeWidth={1.8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <Path d="M 62 30 q 4 6 -1 10" stroke={C.line} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          </>
        )}
      </G>
    </G>
  );
}

export function Dot({ stage = 'sleep', size = 120 }: { stage?: DotStage; size?: number }) {
  const bob = useRef(new Animated.Value(0)).current;
  const resting = stage === 'sleep' || stage.startsWith('egg');

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: resting ? 2600 : 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: resting ? 2600 : 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, resting]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, resting ? -2 : -4] });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <View>
        <Svg width={size} height={size * 0.84} viewBox="0 0 120 100">
          {stage.startsWith('egg') && <Egg cracks={Number(stage.slice(3))} />}

          {stage === 'sleep' && (
            <G>
              <Blanket y={68} w={108} />
              {/* body curled low in the blanket */}
              <Ellipse cx={68} cy={68} rx={26} ry={19} fill={C.body} stroke={C.line} strokeWidth={1.3} />
              <Ellipse cx={70} cy={72} rx={18} ry={12} fill={C.belly} opacity={0.75} />
              <Path d="M 88 58 q 9 -4 12 4 q -6 5 -12 2 Z" fill={C.bodyMid} stroke={C.line} strokeWidth={1.2} strokeLinejoin="round" />
              <Bib x={70} y={70} s={0.82} />
              <Wing x={62} y={62} />
              <Foot x={80} y={80} />
              <Foot x={64} y={82} flip />
              <Head x={44} y={54} closed tilt={-12} />
              {/* sleep marks */}
              <Path d="M 92 30 h 8 l -8 9 h 8" stroke={C.anchor} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
              <Path d="M 103 18 h 6 l -6 7 h 6" stroke={C.anchor} strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
            </G>
          )}

          {stage === 'tummy' && (
            <G>
              <Blanket y={70} w={110} />
              {/* body lying flat, tail up */}
              <Ellipse cx={70} cy={70} rx={28} ry={15} fill={C.body} stroke={C.line} strokeWidth={1.3} />
              <Path d="M 94 62 q 12 -8 16 0 q -7 7 -16 4 Z" fill={C.bodyMid} stroke={C.line} strokeWidth={1.2} strokeLinejoin="round" />
              <Ellipse cx={70} cy={74} rx={19} ry={8} fill={C.belly} opacity={0.6} />
              <Path d="M 44 72 q -12 2 -16 -3 q 7 -6 16 -3 Z" fill={C.bodyMid} stroke={C.line} strokeWidth={1.2} strokeLinejoin="round" />
              <Foot x={92} y={76} />
              <Bib x={54} y={64} s={0.8} />
              <Head x={48} y={44} happy open />
            </G>
          )}

          {stage === 'sit' && (
            <G>
              <Ellipse cx={60} cy={72} rx={27} ry={22} fill={C.body} stroke={C.line} strokeWidth={1.3} />
              <Ellipse cx={60} cy={78} rx={19} ry={14} fill={C.belly} opacity={0.7} />
              <Path d="M 84 62 q 12 -5 15 3 q -7 6 -15 2 Z" fill={C.bodyMid} stroke={C.line} strokeWidth={1.2} strokeLinejoin="round" />
              <Wing x={36} y={62} flip up />
              <Wing x={84} y={68} />
              <Foot x={50} y={88} flip />
              <Foot x={70} y={88} />
              <Bib x={60} y={66} s={0.92} />
              <Head x={60} y={38} open />
            </G>
          )}

          {stage === 'stand' && (
            <G>
              <Ellipse cx={60} cy={64} rx={23} ry={24} fill={C.body} stroke={C.line} strokeWidth={1.3} />
              <Ellipse cx={60} cy={70} rx={16} ry={16} fill={C.belly} opacity={0.7} />
              <Path d="M 80 54 q 12 -5 15 3 q -7 6 -15 2 Z" fill={C.bodyMid} stroke={C.line} strokeWidth={1.2} strokeLinejoin="round" />
              <Wing x={40} y={58} flip />
              <Wing x={80} y={58} />
              <Path d="M 52 86 v 6" stroke={C.footDeep} strokeWidth={3} strokeLinecap="round" />
              <Path d="M 68 86 v 6" stroke={C.footDeep} strokeWidth={3} strokeLinecap="round" />
              <Foot x={52} y={92} flip />
              <Foot x={68} y={92} />
              <Bib x={60} y={60} s={0.9} />
              <Head x={60} y={32} open />
            </G>
          )}

          {stage === 'walk' && (
            <G>
              <G transform="rotate(-6 60 60)">
                <Ellipse cx={60} cy={62} rx={23} ry={23} fill={C.body} stroke={C.line} strokeWidth={1.3} />
                <Ellipse cx={60} cy={68} rx={16} ry={15} fill={C.belly} opacity={0.7} />
                <Path d="M 80 52 q 12 -5 15 3 q -7 6 -15 2 Z" fill={C.bodyMid} stroke={C.line} strokeWidth={1.2} strokeLinejoin="round" />
                <Wing x={38} y={54} flip up />
                <Wing x={80} y={58} />
                <Bib x={60} y={58} s={0.9} />
              </G>
              <Path d="M 48 84 l -4 8" stroke={C.footDeep} strokeWidth={3} strokeLinecap="round" />
              <Path d="M 70 84 l 5 7" stroke={C.footDeep} strokeWidth={3} strokeLinecap="round" />
              <Foot x={42} y={92} flip />
              <Foot x={76} y={91} />
              <Head x={58} y={30} happy open tilt={-6} />
            </G>
          )}
        </Svg>
      </View>
    </Animated.View>
  );
}
