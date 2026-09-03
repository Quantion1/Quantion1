import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import {
  Animated, Platform, Pressable, PressableProps, StyleProp,
  Text, TextInput, TextStyle, View, ViewStyle,
} from 'react-native';

import { accent, AccentName, palette, radius, shadow, type } from '@/theme';

export function tap(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  if (Platform.OS !== 'web') Haptics.impactAsync(style).catch(() => {});
}
export function ping() {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

type Txt = { children: React.ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number };

export const Hero = ({ children, style, numberOfLines }: Txt) => (
  <Text numberOfLines={numberOfLines} style={[type.hero, { color: palette.ink }, style]}>{children}</Text>
);
export const Title = ({ children, style, numberOfLines }: Txt) => (
  <Text numberOfLines={numberOfLines} style={[type.title, { color: palette.ink }, style]}>{children}</Text>
);
export const Heading = ({ children, style, numberOfLines }: Txt) => (
  <Text numberOfLines={numberOfLines} style={[type.heading, { color: palette.ink }, style]}>{children}</Text>
);
export const Body = ({ children, style, numberOfLines }: Txt) => (
  <Text numberOfLines={numberOfLines} style={[type.body, { color: palette.inkSoft }, style]}>{children}</Text>
);
export const Small = ({ children, style, numberOfLines }: Txt) => (
  <Text numberOfLines={numberOfLines} style={[type.small, { color: palette.inkFaint }, style]}>{children}</Text>
);
export const Label = ({ children, style }: Txt) => (
  <Text style={[type.label, { color: palette.inkFaint, textTransform: 'uppercase' }, style]}>{children}</Text>
);

/* ---------------------------------------------------------------- button */

interface BtnProps extends PressableProps {
  title: string;
  tone?: AccentName | 'ink' | 'quiet' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Nest buttons press by settling, not by collapsing a slab — the whole design
 * avoids the toy-like 3D edge and leans on paper, rule and weight instead.
 */
export function Button({ title, tone = 'ink', size = 'md', icon, full, style, ...rest }: BtnProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const disabled = !!rest.disabled;

  const skin =
    tone === 'ink' ? { bg: palette.ink, fg: palette.paper, border: 'transparent' }
    : tone === 'quiet' ? { bg: palette.card, fg: palette.ink, border: palette.line }
    : tone === 'ghost' ? { bg: 'transparent', fg: palette.inkSoft, border: 'transparent' }
    : tone === 'danger' ? { bg: palette.dangerSoft, fg: palette.danger, border: 'transparent' }
    : { bg: accent(tone).base, fg: palette.white, border: 'transparent' };

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
        tap();
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
        rest.onPressOut?.(e);
      }}
      style={[full && { alignSelf: 'stretch' }, { opacity: disabled ? 0.4 : 1 }, style]}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
            backgroundColor: skin.bg,
            borderColor: skin.border,
            borderWidth: tone === 'quiet' ? 1.5 : 0,
            borderRadius: radius.pill,
            paddingVertical: size === 'sm' ? 9 : size === 'lg' ? 16 : 13,
            paddingHorizontal: size === 'sm' ? 14 : 22,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
          },
          tone !== 'ghost' && tone !== 'quiet' ? shadow.rest : null,
        ]}
      >
        {!!icon && <Text style={{ fontSize: size === 'lg' ? 17 : 14 }}>{icon}</Text>}
        <Text style={{ ...type.bodyMed, fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14.5, color: skin.fg }}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ card */

export function Card({
  children, style, onPress, tint, flat,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  tint?: string;
  flat?: boolean;
}) {
  const W: any = onPress ? Pressable : View;
  return (
    <W
      onPress={onPress ? () => { tap(); onPress(); } : undefined}
      style={[
        {
          backgroundColor: tint ?? palette.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: palette.line,
          padding: 16,
        },
        flat ? null : shadow.rest,
        style,
      ]}
    >
      {children}
    </W>
  );
}

export const Rule = ({ style }: { style?: StyleProp<ViewStyle> }) => (
  <View style={[{ height: 1, backgroundColor: palette.line }, style]} />
);

export const Row = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
);

export const Wrap = ({ children, gap = 8 }: { children: React.ReactNode; gap?: number }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>{children}</View>
);

/* ------------------------------------------------------------------ chip */

export function Chip({
  label, emoji, icon, selected, onPress, tone = 'clay', small,
}: {
  label: string;
  emoji?: string;
  /** Drawn in place of the emoji, for anything the emoji set has no glyph for. */
  icon?: React.ReactNode;
  selected?: boolean;
  onPress: () => void;
  tone?: AccentName;
  small?: boolean;
}) {
  const a = accent(tone);
  return (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      style={{
        paddingVertical: small ? 7 : 10,
        paddingHorizontal: small ? 11 : 14,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: selected ? a.base : palette.line,
        backgroundColor: selected ? a.soft : palette.card,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {icon ?? (!!emoji && <Text style={{ fontSize: small ? 13 : 15 }}>{emoji}</Text>)}
      <Text style={{ ...type.bodyMed, fontSize: small ? 12.5 : 14, color: selected ? a.base : palette.inkSoft }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------- segmented */

export function Segmented<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; locked?: boolean }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: palette.cardSunk, borderRadius: radius.pill, padding: 3, borderWidth: 1, borderColor: palette.line }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => { tap(); onChange(o.value); }}
            style={[
              { flex: 1, paddingVertical: 8, borderRadius: radius.pill, alignItems: 'center' },
              active ? { backgroundColor: palette.raised, ...shadow.rest } : null,
            ]}
          >
            <Text style={{ ...type.bodyMed, fontSize: 13, color: active ? palette.ink : palette.inkFaint }}>
              {o.locked ? `🔒 ${o.label}` : o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* --------------------------------------------------------------- numbers */

export function Stepper({
  value, onChange, step = 1, min = 0, max = 9999, unit, decimals = 0, presets,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  decimals?: number;
  presets?: number[];
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, +v.toFixed(4)));
  const btn = (delta: number, glyph: string) => (
    <Pressable
      onPress={() => { tap(); onChange(clamp(value + delta)); }}
      style={{
        width: 50, height: 50, borderRadius: radius.md,
        backgroundColor: palette.cardSunk, borderWidth: 1, borderColor: palette.line,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 24, color: palette.ink, marginTop: -2 }}>{glyph}</Text>
    </Pressable>
  );

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {btn(-step, '−')}
        <View style={{ alignItems: 'center', flex: 1 }}>
          <TextInput
            value={value.toFixed(decimals)}
            onChangeText={(t) => {
              const v = parseFloat(t.replace(',', '.'));
              if (!Number.isNaN(v)) onChange(clamp(v));
            }}
            keyboardType="decimal-pad"
            selectTextOnFocus
            style={{ ...type.numeral, color: palette.ink, textAlign: 'center', minWidth: 110, padding: 0 }}
          />
          {!!unit && <Small>{unit}</Small>}
        </View>
        {btn(step, '＋')}
      </View>
      {!!presets?.length && (
        <Wrap>
          {presets.map((p) => (
            <Chip key={p} small label={`${p}`} selected={Math.abs(value - p) < 0.001} onPress={() => onChange(clamp(p))} />
          ))}
        </Wrap>
      )}
    </View>
  );
}

export function Field({
  value, onChangeText, placeholder, multiline, keyboardType,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={palette.inkFaint}
      multiline={multiline}
      keyboardType={keyboardType}
      style={{
        borderWidth: 1.5,
        borderColor: palette.line,
        backgroundColor: palette.card,
        borderRadius: radius.md,
        padding: 14,
        ...type.body,
        color: palette.ink,
        minHeight: multiline ? 84 : 50,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
    />
  );
}

export function Section({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      {(!!title || !!action) && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {!!title && <Label>{title}</Label>}
          {action}
        </View>
      )}
      {children}
    </View>
  );
}

export function Empty({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 26, paddingHorizontal: 20, gap: 6 }}>
      <Text style={{ fontSize: 30 }}>{emoji}</Text>
      <Heading style={{ textAlign: 'center' }}>{title}</Heading>
      <Body style={{ textAlign: 'center' }}>{text}</Body>
    </View>
  );
}

/**
 * The chrome every screen shares. Deliberately not a StyleSheet: that freezes its
 * colours the moment this module is imported, and `screen` has to follow whichever
 * scheme is active when it is read.
 */
export const styles = {
  get screen(): ViewStyle {
    return { flex: 1, backgroundColor: palette.paper };
  },
  content: { padding: 16, gap: 14, paddingBottom: 130 } as ViewStyle,
};
