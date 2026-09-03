import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { palette, type } from '@/theme';

const GRID = palette.line;
const LABEL = palette.inkFaint;
const FONT = type.label.fontFamily;

export interface BarDatum {
  label: string;
  value: number;
  value2?: number;
  highlight?: boolean;
}

export function BarChart({
  data, width, height = 160, color = palette.blue, color2, unit, maxTicks = 4, formatValue,
}: {
  data: BarDatum[];
  width: number;
  height?: number;
  color?: string;
  color2?: string;
  unit?: string;
  maxTicks?: number;
  formatValue?: (v: number) => string;
}) {
  const padL = 32;
  const padB = 18;
  const padT = 14;
  const innerW = Math.max(10, width - padL - 10);
  const innerH = height - padB - padT;
  const max = Math.max(1, ...data.map((d) => d.value + (d.value2 ?? 0)));
  const niceMax = Math.ceil(max * 1.12);
  const bw = innerW / Math.max(1, data.length);
  const barW = Math.max(3, Math.min(24, bw * 0.6));
  const y = (v: number) => padT + innerH - (v / niceMax) * innerH;
  const fmt = formatValue ?? ((v: number) => `${Math.round(v)}`);
  const labelEvery = Math.ceil(data.length / 7);

  return (
    <Svg width={width} height={height}>
      {Array.from({ length: maxTicks + 1 }, (_, i) => (niceMax / maxTicks) * i).map((t, i) => (
        <G key={i}>
          <Line x1={padL} y1={y(t)} x2={width - 10} y2={y(t)} stroke={GRID} strokeWidth={1} />
          <SvgText x={padL - 6} y={y(t) + 3.5} fontSize={9} fontFamily={FONT} fill={LABEL} textAnchor="end">{fmt(t)}</SvgText>
        </G>
      ))}
      {data.map((d, i) => {
        const x = padL + i * bw + (bw - barW) / 2;
        const h1 = d.value > 0 ? Math.max(2, (d.value / niceMax) * innerH) : 0;
        const h2 = d.value2 ? Math.max(2, (d.value2 / niceMax) * innerH) : 0;
        return (
          <G key={i}>
            {h2 > 0 && <Rect x={x} y={y(d.value + (d.value2 ?? 0))} width={barW} height={h2} rx={barW / 3} fill={color2 ?? palette.sage} />}
            {h1 > 0 && <Rect x={x} y={y(d.value)} width={barW} height={h1 + (h2 > 0 ? 4 : 0)} rx={barW / 3} fill={d.highlight ? palette.rose : color} />}
            {i % labelEvery === 0 && (
              <SvgText x={x + barW / 2} y={height - 4} fontSize={9} fontFamily={FONT} fill={LABEL} textAnchor="middle">{d.label}</SvgText>
            )}
          </G>
        );
      })}
      {!!unit && <SvgText x={width - 10} y={11} fontSize={9} fontFamily={FONT} fill={LABEL} textAnchor="end">{unit}</SvgText>}
    </Svg>
  );
}

export function LineChart({
  points, band, width, height = 180, color = palette.sage, formatX, formatY,
}: {
  points: { x: number; y: number }[];
  band?: { x: number; low: number; high: number }[];
  width: number;
  height?: number;
  color?: string;
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
}) {
  const padL = 36;
  const padB = 22;
  const padT = 12;
  const innerW = Math.max(10, width - padL - 12);
  const innerH = height - padB - padT;

  const allX = [...points.map((p) => p.x), ...(band?.map((b) => b.x) ?? [])];
  const allY = [...points.map((p) => p.y), ...(band?.flatMap((b) => [b.low, b.high]) ?? [])];
  if (!allX.length) return <View style={{ height }} />;

  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(0, ...allY);
  const maxY = Math.max(1, ...allY) * 1.12;
  const sx = (v: number) => padL + ((v - minX) / Math.max(0.0001, maxX - minX)) * innerW;
  const sy = (v: number) => padT + innerH - ((v - minY) / Math.max(0.0001, maxY - minY)) * innerH;

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x)} ${sy(p.y)}`).join(' ');
  const bandPath = band?.length
    ? `${band.map((b, i) => `${i === 0 ? 'M' : 'L'} ${sx(b.x)} ${sy(b.high)}`).join(' ')} ${[...band].reverse().map((b) => `L ${sx(b.x)} ${sy(b.low)}`).join(' ')} Z`
    : null;
  const fmtY = formatY ?? ((v: number) => v.toFixed(1));
  const fmtX = formatX ?? ((v: number) => `${Math.round(v)}`);

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.20" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {Array.from({ length: 5 }, (_, i) => minY + ((maxY - minY) / 4) * i).map((t, i) => (
        <G key={i}>
          <Line x1={padL} y1={sy(t)} x2={width - 12} y2={sy(t)} stroke={GRID} strokeWidth={1} />
          <SvgText x={padL - 6} y={sy(t) + 3.5} fontSize={9} fontFamily={FONT} fill={LABEL} textAnchor="end">{fmtY(t)}</SvgText>
        </G>
      ))}
      {bandPath && <Path d={bandPath} fill={palette.sage} opacity={0.14} />}
      {points.length > 1 && (
        <Path d={`${line} L ${sx(points[points.length - 1].x)} ${sy(minY)} L ${sx(points[0].x)} ${sy(minY)} Z`} fill="url(#lg)" />
      )}
      <Path d={line} stroke={color} strokeWidth={2.6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <Circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={i === points.length - 1 ? 4.5 : 2.6} fill={palette.card} stroke={color} strokeWidth={2.4} />
      ))}
      {[minX, (minX + maxX) / 2, maxX].map((t, i) => (
        <SvgText key={i} x={sx(t)} y={height - 6} fontSize={9} fontFamily={FONT} fill={LABEL} textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}>
          {fmtX(t)}
        </SvgText>
      ))}
    </Svg>
  );
}

/** One row per day, dark blocks where the baby slept. */
export function SleepRaster({
  segments, days, labels, width, rowHeight = 12,
}: {
  segments: { dayIndex: number; startMin: number; endMin: number; night: boolean }[];
  days: number;
  labels: string[];
  width: number;
  rowHeight?: number;
}) {
  const padL = 26;
  const padT = 14;
  const innerW = Math.max(10, width - padL - 8);
  const height = padT + days * rowHeight + 12;
  const x = (m: number) => padL + (m / 1440) * innerW;

  return (
    <Svg width={width} height={height}>
      {[0, 6, 12, 18, 24].map((h) => (
        <G key={h}>
          <Line x1={x(h * 60)} y1={padT} x2={x(h * 60)} y2={padT + days * rowHeight} stroke={GRID} strokeWidth={1} />
          <SvgText x={x(h * 60)} y={padT - 4} fontSize={8.5} fontFamily={FONT} fill={LABEL} textAnchor="middle">{h}</SvgText>
        </G>
      ))}
      {Array.from({ length: days }, (_, i) => (
        <SvgText key={i} x={padL - 5} y={padT + i * rowHeight + rowHeight - 2.5} fontSize={8} fontFamily={FONT} fill={LABEL} textAnchor="end">
          {labels[i] ?? ''}
        </SvgText>
      ))}
      {segments.map((s, i) => (
        <Rect
          key={i}
          x={x(s.startMin)}
          y={padT + s.dayIndex * rowHeight + 1.5}
          width={Math.max(1.5, x(s.endMin) - x(s.startMin))}
          height={rowHeight - 3}
          rx={2.5}
          fill={s.night ? palette.blue : palette.teal}
          opacity={0.9}
        />
      ))}
    </Svg>
  );
}

/** A single day on a 24-hour line: sleep blocks with feed and change marks. */
export function DayRhythm({
  segments, marks, width, height = 54,
}: {
  segments: { startMin: number; endMin: number; night: boolean }[];
  marks: { min: number; kind: string }[];
  width: number;
  height?: number;
}) {
  const padL = 6;
  const innerW = width - padL * 2;
  const barY = 16;
  const barH = 18;
  const x = (m: number) => padL + (m / 1440) * innerW;

  return (
    <Svg width={width} height={height}>
      <Rect x={padL} y={barY} width={innerW} height={barH} rx={6} fill={palette.cardSunk} />
      {segments.map((s, i) => (
        <Rect key={i} x={x(s.startMin)} y={barY} width={Math.max(2, x(s.endMin) - x(s.startMin))} height={barH} rx={5} fill={s.night ? palette.blue : palette.teal} opacity={0.88} />
      ))}
      {marks.map((m, i) => (
        <Circle key={i} cx={x(m.min)} cy={barY + barH + 8} r={3} fill={m.kind === 'feed' ? palette.gold : palette.sage} />
      ))}
      {[0, 6, 12, 18, 24].map((h) => (
        <SvgText key={h} x={x(h * 60)} y={11} fontSize={8.5} fontFamily={FONT} fill={LABEL} textAnchor={h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}>
          {h}
        </SvgText>
      ))}
    </Svg>
  );
}

export function Donut({
  slices, size = 128, thickness = 20, centerLabel, centerSub,
}: {
  slices: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          {slices.map((s, i) => {
            const len = (s.value / total) * c;
            const el = (
              <Circle key={i} cx={size / 2} cy={size / 2} r={r} stroke={s.color} strokeWidth={thickness}
                fill="none" strokeDasharray={`${Math.max(0, len - 2)} ${c}`} strokeDashoffset={-offset} strokeLinecap="round" />
            );
            offset += len;
            return el;
          })}
        </G>
      </Svg>
      <View style={{ alignItems: 'center' }}>
        {!!centerLabel && <Text style={{ ...type.title, color: palette.ink }}>{centerLabel}</Text>}
        {!!centerSub && <Text style={{ ...type.label, color: palette.inkFaint }}>{centerSub}</Text>}
      </View>
    </View>
  );
}
