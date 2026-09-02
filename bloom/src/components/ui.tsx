import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { accent, AccentName, palette, radius, shadow, type } from '@/theme';

export function tap(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  if (Platform.OS !== 'web') Haptics.impactAsync(style).catch(() => {});
}

export function success() {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

/* ------------------------------------------------------------------ text */

export const Title = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[type.title, { color: palette.ink }, style]}>{children}</Text>
);

export const Heading = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[type.heading, { color: palette.ink }, style]}>{children}</Text>
);

export const Body = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[type.body, { color: palette.inkSoft }, style]}>{children}</Text>
);

export const Label = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[type.label, { color: palette.inkFaint, textTransform: 'uppercase' }, style]}>{children}</Text>
);

/* --------------------------------------------------------------- button */

interface Button3DProps extends PressableProps {
  title: string;
  tone?: AccentName | 'neutral' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * The signature Duolingo control: a flat slab with a darker bottom edge that
 * collapses by the depth of that edge while pressed.
 */
export function Button3D({ title, tone = 'mint', size = 'md', icon, full, style, ...rest }: Button3DProps) {
  const depth = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;
  const press = useRef(new Animated.Value(0)).current;
  const disabled = !!rest.disabled;

  const colors =
    tone === 'neutral'
      ? { base: palette.white, dark: palette.line, text: palette.ink, border: palette.line }
      : tone === 'ghost'
        ? { base: 'transparent', dark: 'transparent', text: palette.inkSoft, border: 'transparent' }
        : { ...accent(tone), text: palette.white, border: 'transparent' };

  const translate = press.interpolate({ inputRange: [0, 1], outputRange: [0, depth] });

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        Animated.timing(press, { toValue: 1, duration: 60, useNativeDriver: true }).start();
        tap();
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(press, { toValue: 0, friction: 6, tension: 200, useNativeDriver: true }).start();
        rest.onPressOut?.(e);
      }}
      style={[full && { alignSelf: 'stretch' }, { opacity: disabled ? 0.45 : 1 }, style]}
    >
      <View style={{ paddingBottom: depth }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: depth,
            bottom: 0,
            borderRadius: radius.md,
            backgroundColor: tone === 'ghost' ? 'transparent' : colors.dark,
          }}
        />
        <Animated.View
          style={{
            transform: [{ translateY: translate }],
            backgroundColor: colors.base,
            borderRadius: radius.md,
            borderWidth: tone === 'neutral' ? 2 : 0,
            borderColor: colors.border,
            paddingVertical: size === 'sm' ? 9 : size === 'lg' ? 17 : 13,
            paddingHorizontal: size === 'sm' ? 14 : 20,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {!!icon && <Text style={{ fontSize: size === 'lg' ? 20 : 16 }}>{icon}</Text>}
          <Text
            style={{
              color: colors.text,
              fontSize: size === 'sm' ? 13 : size === 'lg' ? 17 : 15,
              fontWeight: '900',
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

/* ----------------------------------------------------------------- card */

export function Card({
  children,
  style,
  tone,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: AccentName;
  onPress?: () => void;
}) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={
        onPress
          ? () => {
              tap();
              onPress();
            }
          : undefined
      }
      style={[
        {
          backgroundColor: palette.card,
          borderRadius: radius.lg,
          borderWidth: 2,
          borderColor: tone ? accent(tone).soft : palette.line,
          padding: 16,
        },
        shadow.card,
        style,
      ]}
    >
      {children}
    </Wrapper>
  );
}

export function Pill({
  children,
  color = palette.cloud,
  textColor = palette.inkSoft,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: color,
          borderRadius: radius.pill,
          paddingHorizontal: 10,
          paddingVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        style,
      ]}
    >
      <Text style={{ color: textColor, fontSize: 12, fontWeight: '900' }}>{children}</Text>
    </View>
  );
}

/* ----------------------------------------------------------------- chip */

export function Chip({
  label,
  emoji,
  selected,
  onPress,
  tone = 'blossom',
}: {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress: () => void;
  tone?: AccentName;
}) {
  const a = accent(tone);
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: radius.pill,
        borderWidth: 2,
        borderColor: selected ? a.base : palette.line,
        backgroundColor: selected ? a.soft : palette.white,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {!!emoji && <Text style={{ fontSize: 15 }}>{emoji}</Text>}
      <Text style={{ fontWeight: '800', fontSize: 14, color: selected ? a.dark : palette.inkSoft }}>{label}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------ segmented */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  tone = 'grape',
}: {
  options: { value: T; label: string; locked?: boolean }[];
  value: T;
  onChange: (v: T) => void;
  tone?: AccentName;
}) {
  const a = accent(tone);
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: palette.cloud,
        borderRadius: radius.pill,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => {
              tap();
              onChange(o.value);
            }}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: radius.pill,
              backgroundColor: active ? palette.white : 'transparent',
              alignItems: 'center',
              ...(active ? shadow.card : null),
            }}
          >
            <Text style={{ fontWeight: '900', fontSize: 13, color: active ? a.dark : palette.inkFaint }}>
              {o.locked ? `🔒 ${o.label}` : o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* --------------------------------------------------------------- stepper */

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  suffix,
  decimals = 0,
  tone = 'sky',
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  decimals?: number;
  tone?: AccentName;
}) {
  const a = accent(tone);
  const btn = (delta: number, label: string) => (
    <Pressable
      onPress={() => {
        tap();
        onChange(Math.min(max, Math.max(min, +(value + delta).toFixed(3))));
      }}
      style={{
        width: 52,
        height: 52,
        borderRadius: radius.md,
        backgroundColor: a.soft,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: '900', color: a.dark, marginTop: -3 }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {btn(-step, '−')}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 34, fontWeight: '900', color: palette.ink, letterSpacing: -1 }}>
          {value.toFixed(decimals)}
          {suffix ? <Text style={{ fontSize: 16, color: palette.inkFaint }}> {suffix}</Text> : null}
        </Text>
      </View>
      {btn(step, '+')}
    </View>
  );
}

/* ---------------------------------------------------------------- other */

export const Divider = () => <View style={{ height: 2, backgroundColor: palette.line, borderRadius: 2 }} />;

export const Row = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
);

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  content: { padding: 16, gap: 14, paddingBottom: 120 },
});
