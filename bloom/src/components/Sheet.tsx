import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Small, Title, tap } from './ui';
import { palette, radius, shadow } from '@/theme';

/** How far down you have to drag before letting go dismisses instead of settles. */
const DISMISS_DISTANCE = 110;
/** A quick flick dismisses even if it never travelled that far. */
const DISMISS_VELOCITY = 800;

export interface SheetProps {
  /** Shown on the left of the header — usually the tracker or screen emoji. */
  emoji?: string;
  /** Background behind the emoji, so a tracker keeps its own accent colour. */
  emojiTint?: string;
  title: string;
  subtitle?: string;
  /**
   * Fraction of the screen the scrolling body may occupy before it stops
   * growing and scrolls instead. The point of a sheet is that the screen
   * underneath stays visible, so this is deliberately well under 1.
   */
  maxBodyFraction?: number;
  /** Padding for the scroll body. Set false for content that manages its own. */
  padded?: boolean;
  /** Optional controls flanking the title — e.g. the review's day arrows. */
  left?: React.ReactNode;
  right?: React.ReactNode;
  /** Centre the title, for headers whose controls sit on both sides. */
  centerTitle?: boolean;
  children: React.ReactNode;
}

/**
 * A panel that rises from the bottom over whatever screen opened it, sized to
 * its own content rather than to the screen.
 *
 * The reason to prefer this over a full page: most of these screens ask for one
 * or two small things, and covering everything to ask them loses the person's
 * place. Keeping the origin visible (and dimmed) says "you are still there,
 * this is on top" — so dragging down or tapping the dimmed part to get back is
 * the obvious move, and both work.
 *
 * Route setup: the screen must be a `transparentModal` with a transparent
 * `contentStyle`, otherwise the navigator paints an opaque page behind this and
 * there is nothing to see through. See app/_layout.tsx.
 */
export function Sheet({
  emoji, emojiTint, title, subtitle, maxBodyFraction = 0.62, padded = true,
  left, right, centerTitle = false, children,
}: SheetProps) {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const y = useSharedValue(0);
  const closing = useSharedValue(false);

  const close = () => router.back();

  const dismiss = () => {
    // Slide the rest of the way out before unmounting, so leaving looks like
    // the reverse of arriving rather than a cut.
    closing.value = true;
    y.value = withTiming(height, { duration: 180 }, (done) => {
      if (done) runOnJS(close)();
    });
  };

  const drag = Gesture.Pan()
    .onChange((e) => {
      if (closing.value) return;
      // Downward only: dragging up would peel the sheet off its own bottom edge.
      y.value = Math.max(0, y.value + e.changeY);
    })
    .onEnd((e) => {
      if (closing.value) return;
      if (y.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        closing.value = true;
        y.value = withTiming(height, { duration: 180 }, (done) => {
          if (done) runOnJS(close)();
        });
      } else {
        y.value = withSpring(0, { damping: 20, stiffness: 220 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  // The dim fades out as the sheet is dragged away, so the screen underneath
  // comes back as you pull rather than snapping back at the end.
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(1, y.value / (height * 0.6)),
  }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: 'flex-end' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: palette.backdrop }]}
          onPress={() => { tap(); dismiss(); }}
        />
      </Animated.View>

      <GestureDetector gesture={drag}>
        <Animated.View
          entering={SlideInDown.duration(260)}
          style={[
            {
              backgroundColor: palette.paper,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingBottom: Math.max(insets.bottom, 10),
              overflow: 'hidden',
            },
            shadow.lift,
            sheetStyle,
          ]}
        >
          <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 2 }}>
            <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: palette.line }} />
          </View>

          <View
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 12,
              paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14,
              borderBottomWidth: 1, borderBottomColor: palette.line,
            }}
          >
            {!!emoji && (
              <View
                style={{
                  width: 40, height: 40, borderRadius: radius.md,
                  backgroundColor: emojiTint ?? palette.cardSunk,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 20 }}>{emoji}</Text>
              </View>
            )}
            {left}
            <View style={{ flex: 1, alignItems: centerTitle ? 'center' : 'flex-start' }}>
              <Title style={{ fontSize: 19 }}>{title}</Title>
              {!!subtitle && <Small>{subtitle}</Small>}
            </View>
            {right}
            <Pressable onPress={() => { tap(); dismiss(); }} hitSlop={14}>
              <Text style={{ fontSize: 20, color: palette.inkFaint }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ maxHeight: height * maxBodyFraction }}
            contentContainerStyle={padded ? { padding: 18, gap: 22, paddingBottom: 24 } : undefined}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </KeyboardAvoidingView>
  );
}
