import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { palette } from '@/theme';

const AXIS = palette.line;
const LABEL = palette.inkFaint;

export interface BarDatum {
  label: string;
  value: number;
  /** Optional stacked second value drawn on top of `value`. */
  value2?: number;
  highlight?: boolean;
}

export function BarChart({
  data,
  width,
  height = 160,
  color = palette.grape,
  color2,
  unit = '',
  target,
  targetLabel,
  maxTicks = 4,
  formatValue,
}: {
  data: BarDatum[];
  width: number;
  height?: number;
  color?: string;
  color2?: string;
  unit?: string;
  target?: { low: number; high: number };
  targetLabel?: string;
  maxTicks?: number;
  formatValue?: (v: number) => string;
}) {
  const padL = 34;
  const padB = 20;
  const padT = 8;
  const innerW = Math.max(10, width - padL - 8);
  const innerH = height - padB - padT;
  const max = Math.max(
    1,
    ...data.map((d) => d.value + (d.value2 ?? 0)),
    target ? target.high : 0,
  );
  const niceMax = Math.ceil(max * 1.12);
  const bw = innerW / Math.max(1, data.length);
  const barW = Math.max(3, Math.min(26, bw * 0.62));
  const y = (v: number) => padT + innerH - (v / niceMax) * innerH;
  const fmt = formatValue ?? ((v: number) => `${Math.round(v)}`);

  const ticks = Array.from({ length: maxTicks + 1 }, (_, i) => (niceMax / maxTicks) * i);
  const labelEvery = Math.ceil(data.length / 7);

  return (
    <Svg width={width} height={height}>
      {ticks.map((t, i) => (
        <G key={i}>
          <Line x1={padL} y1={y(t)} x2={width - 8} y2={y(t)} stroke={AXIS} strokeWidth={1} />
          <SvgText x={padL - 6} y={y(t) + 4} fontSize={9} fontWeight="700" fill={LABEL} textAnchor="end">
            {fmt(t)}
          </SvgText>
        </G>
      ))}
      {target && (
        <>
          <Rect
            x={padL}
            y={y(target.high)}
            width={innerW}
            height={Math.max(2, y(target.low) - y(target.high))}
            fill={palette.mint}
            opacity={0.13}
          />
          {!!targetLabel && (
            <SvgText x={width - 12} y={y(target.high) - 4} fontSize={9} fontWeight="800" fill={palette.mintDark} textAnchor="end">
              {targetLabel}
            </SvgText>
          )}
        </>
      )}
      {data.map((d, i) => {
        const x = padL + i * bw + (bw - barW) / 2;
        const h1 = Math.max(d.value > 0 ? 2 : 0, (d.value / niceMax) * innerH);
        const h2 = d.value2 ? Math.max(2, (d.value2 / niceMax) * innerH) : 0;
        return (
          <G key={i}>
            {h2 > 0 && (
              <Rect x={x} y={y(d.value + (d.value2 ?? 0))} width={barW} height={h2} rx={barW / 3} fill={color2 ?? palette.sky} />
            )}
            {h1 > 0 && (
              <Rect
                x={x}
                y={y(d.value)}
                width={barW}
                height={h1 + (h2 > 0 ? 4 : 0)}
                rx={barW / 3}
                fill={d.highlight ? palette.blossom : color}
              />
            )}
            {i % labelEvery === 0 && (
              <SvgText x={x + barW / 2} y={height - 5} fontSize={9} fontWeight="700" fill={LABEL} textAnchor="middle">
                {d.label}
              </SvgText>
            )}
          </G>
        );
      })}
      {!!unit && (
        <SvgText x={width - 8} y={padT + 8} fontSize={9} fontWeight="800" fill={LABEL} textAnchor="end">
          {unit}
        </SvgText>
      )}
    </Svg>
  );
}

export interface LinePoint {
  x: number;
  y: number;
}

export function LineChart({
  points,
  band,
  width,
  height = 180,
  color = palette.blossom,
  xLabel,
  yLabel,
  formatX,
  formatY,
}: {
  points: LinePoint[];
  band?: { x: number; low: number; high: number }[];
  width: number;
  height?: number;
  color?: string;
  xLabel?: string;
  yLabel?: string;
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
}) {
  const padL = 36;
  const padB = 24;
  const padT = 10;
  const innerW = Math.max(10, width - padL - 12);
  const innerH = height - padB - padT;

  const allY = [...points.map((p) => p.y), ...(band?.flatMap((b) => [b.low, b.high]) ?? [])];
  const allX = [...points.map((p) => p.x), ...(band?.map((b) => b.x) ?? [])];
  if (!allX.length) return <View style={{ height }} />;

  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(0, ...allY);
  const maxY = Math.max(1, ...allY) * 1.1;

  const sx = (v: number) => padL + ((v - minX) / Math.max(0.0001, maxX - minX)) * innerW;
  const sy = (v: number) => padT + innerH - ((v - minY) / Math.max(0.0001, maxY - minY)) * innerH;

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x)} ${sy(p.y)}`).join(' ');
  const bandPath = band?.length
    ? `${band.map((b, i) => `${i === 0 ? 'M' : 'L'} ${sx(b.x)} ${sy(b.high)}`).join(' ')} ${[...band]
        .reverse()
        .map((b) => `L ${sx(b.x)} ${sy(b.low)}`)
        .join(' ')} Z`
    : null;

  const ticks = 4;
  const fmtY = formatY ?? ((v: number) => v.toFixed(1));
  const fmtX = formatX ?? ((v: number) => `${Math.round(v)}`);

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.22" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {Array.from({ length: ticks + 1 }, (_, i) => minY + ((maxY - minY) / ticks) * i).map((t, i) => (
        <G key={i}>
          <Line x1={padL} y1={sy(t)} x2={width - 12} y2={sy(t)} stroke={AXIS} strokeWidth={1} />
          <SvgText x={padL - 6} y={sy(t) + 4} fontSize={9} fontWeight="700" fill={LABEL} textAnchor="end">
            {fmtY(t)}
          </SvgText>
        </G>
      ))}
      {bandPath && <Path d={bandPath} fill={palette.mint} opacity={0.16} />}
      {points.length > 1 && (
        <Path
          d={`${line} L ${sx(points[points.length - 1].x)} ${sy(minY)} L ${sx(points[0].x)} ${sy(minY)} Z`}
          fill="url(#fill)"
        />
      )}
      <Path d={line} stroke={color} strokeWidth={3.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <Circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={i === points.length - 1 ? 5 : 3} fill={palette.white} stroke={color} strokeWidth={3} />
      ))}
      {[minX, (minX + maxX) / 2, maxX].map((t, i) => (
        <SvgText key={i} x={sx(t)} y={height - 8} fontSize={9} fontWeight="700" fill={LABEL} textAnchor="middle">
          {fmtX(t)}
        </SvgText>
      ))}
      {!!yLabel && (
        <SvgText x={padL - 6} y={padT} fontSize={9} fontWeight="800" fill={LABEL} textAnchor="end">
          {yLabel}
        </SvgText>
      )}
      {!!xLabel && (
        <SvgText x={width - 12} y={height - 8} fontSize={9} fontWeight="800" fill={LABEL} textAnchor="end">
          {xLabel}
        </SvgText>
      )}
    </Svg>
  );
}

/** 24-hour sleep raster: one row per day, dark blocks where the baby slept. */
export function SleepRaster({
  segments,
  days,
  labels,
  width,
  rowHeight = 12,
}: {
  segments: { dayIndex: number; startMin: number; endMin: number; night: boolean }[];
  days: number;
  labels: string[];
  width: number;
  rowHeight?: number;
}) {
  const padL = 28;
  const padT = 14;
  const innerW = Math.max(10, width - padL - 8);
  const height = padT + days * rowHeight + 16;
  const x = (min: number) => padL + (min / 1440) * innerW;

  return (
    <Svg width={width} height={height}>
      {[0, 6, 12, 18, 24].map((h) => (
        <G key={h}>
          <Line x1={x(h * 60)} y1={padT} x2={x(h * 60)} y2={padT + days * rowHeight} stroke={AXIS} strokeWidth={1} />
          <SvgText x={x(h * 60)} y={padT - 4} fontSize={9} fontWeight="800" fill={LABEL} textAnchor="middle">
            {h === 24 ? '24' : `${h}`}
          </SvgText>
        </G>
      ))}
      {Array.from({ length: days }, (_, i) => (
        <SvgText key={i} x={padL - 5} y={padT + i * rowHeight + rowHeight - 2} fontSize={8} fontWeight="700" fill={LABEL} textAnchor="end">
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
          fill={s.night ? palette.grapeDark : palette.sky}
          opacity={0.92}
        />
      ))}
    </Svg>
  );
}

export function Donut({
  slices,
  size = 132,
  thickness = 22,
  centerLabel,
  centerSub,
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
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={s.color}
                strokeWidth={thickness}
                fill="none"
                strokeDasharray={`${Math.max(0, len - 2)} ${c}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += len;
            return el;
          })}
        </G>
      </Svg>
      <View style={{ alignItems: 'center' }}>
        {!!centerLabel && <Text style={{ fontSize: 22, fontWeight: '900', color: palette.ink }}>{centerLabel}</Text>}
        {!!centerSub && <Text style={{ fontSize: 10, fontWeight: '800', color: palette.inkFaint }}>{centerSub}</Text>}
      </View>
    </View>
  );
}

export function Heatmap({
  rows,
  cols,
  valueAt,
  width,
  cell = 20,
  color = palette.blossom,
}: {
  rows: string[];
  cols: string[];
  valueAt: (row: string, col: string) => number;
  width: number;
  cell?: number;
  color?: string;
}) {
  const padL = 78;
  const gap = 3;
  const cw = Math.max(8, Math.min(cell, (width - padL - 8) / Math.max(1, cols.length) - gap));
  const height = 18 + rows.length * (cell + gap);
  let max = 1;
  rows.forEach((r) => cols.forEach((c) => (max = Math.max(max, valueAt(r, c)))));

  return (
    <Svg width={width} height={height}>
      {cols.map((c, i) =>
        i % Math.ceil(cols.length / 6) === 0 ? (
          <SvgText key={c} x={padL + i * (cw + gap) + cw / 2} y={10} fontSize={8} fontWeight="800" fill={LABEL} textAnchor="middle">
            {c}
          </SvgText>
        ) : null,
      )}
      {rows.map((r, ri) => (
        <G key={r}>
          <SvgText x={padL - 6} y={18 + ri * (cell + gap) + cell * 0.7} fontSize={9} fontWeight="800" fill={palette.inkSoft} textAnchor="end">
            {r}
          </SvgText>
          {cols.map((c, ci) => {
            const v = valueAt(r, c);
            return (
              <Rect
                key={c}
                x={padL + ci * (cw + gap)}
                y={18 + ri * (cell + gap)}
                width={cw}
                height={cell}
                rx={4}
                fill={v ? color : palette.cloud}
                opacity={v ? 0.25 + 0.75 * (v / max) : 1}
              />
            );
          })}
        </G>
      ))}
    </Svg>
  );
}
