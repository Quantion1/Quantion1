import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { Tile as TileT } from '@/domain/types';
import { palette, radius, shadow, type } from '@/theme';
import { TileFace } from './Tile';

const COLS = 2;
const GAP = 10;
const ROW = 104;

const SPRING = { damping: 18, stiffness: 190, mass: 0.7 } as const;

interface Placed {
  tile: TileT;
  index: number;
  col: number;
  row: number;
  w: 1 | 2;
  h: 1 | 2;
}

/**
 * Packs tiles into a two-column grid the way a launcher does: each one takes the
 * first slot it fits in, so a half-width tile can fill the gap a previous row left.
 */
function pack(tiles: TileT[]): { placed: Placed[]; rows: number } {
  const taken: boolean[][] = [];
  const cell = (r: number, c: number) => (taken[r] ??= [])[c] === true;
  const fill = (r: number, c: number, w: number, h: number) => {
    for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) (taken[y] ??= [])[x] = true;
  };

  const placed: Placed[] = [];
  let rows = 0;

  tiles.forEach((tile, index) => {
    const w = tile.span;
    const h = tile.h ?? 1;
    let row = 0;
    let col = 0;
    outer: for (let r = 0; ; r++) {
      for (let c = 0; c + w <= COLS; c++) {
        let free = true;
        for (let y = r; y < r + h && free; y++) for (let x = c; x < c + w && free; x++) if (cell(y, x)) free = false;
        if (free) { row = r; col = c; break outer; }
      }
    }
    fill(row, col, w, h);
    placed.push({ tile, index, col, row, w, h });
    rows = Math.max(rows, row + h);
  });

  return { placed, rows };
}

export function TileGrid({
  tiles, width, editing, meta, onEnterEdit, onOpen, onRemove, onMove, onResize,
}: {
  tiles: TileT[];
  width: number;
  editing: boolean;
  meta: (key: string) => string;
  onEnterEdit: () => void;
  onOpen: (t: TileT) => void;
  onRemove: (key: string) => void;
  onMove: (key: string, to: number) => void;
  onResize: (key: string, span: 1 | 2, h: 1 | 2) => void;
}) {
  const cellW = (width - GAP * (COLS - 1)) / COLS;
  const { placed, rows } = useMemo(() => pack(tiles), [tiles]);

  const box = useCallback(
    (p: Placed) => ({
      left: p.col * (cellW + GAP),
      top: p.row * (ROW + GAP),
      width: p.w * cellW + (p.w - 1) * GAP,
      height: p.h * ROW + (p.h - 1) * GAP,
    }),
    [cellW],
  );

  /** Which tile a dragged tile's centre is currently over — its landing index. */
  const targetIndexFor = useCallback(
    (x: number, y: number) => {
      const col = Math.max(0, Math.min(COLS - 1, Math.floor(x / (cellW + GAP))));
      const row = Math.max(0, Math.floor(y / (ROW + GAP)));
      const hit = placed.find((p) => col >= p.col && col < p.col + p.w && row >= p.row && row < p.row + p.h);
      return hit ? hit.index : placed.length - 1;
    },
    [placed, cellW],
  );

  return (
    <View style={{ width, height: Math.max(rows * ROW + Math.max(0, rows - 1) * GAP, ROW) }}>
      {placed.map((p) => (
        <GridTile
          key={p.tile.key}
          placed={p}
          frame={box(p)}
          cellW={cellW}
          editing={editing}
          meta={meta(p.tile.key)}
          onEnterEdit={onEnterEdit}
          onOpen={() => onOpen(p.tile)}
          onRemove={() => onRemove(p.tile.key)}
          onResize={(w, h) => onResize(p.tile.key, w, h)}
          onDrop={(x, y) => onMove(p.tile.key, targetIndexFor(x, y))}
        />
      ))}
    </View>
  );
}

function GridTile({
  placed, frame, cellW, editing, meta, onEnterEdit, onOpen, onRemove, onResize, onDrop,
}: {
  placed: Placed;
  frame: { left: number; top: number; width: number; height: number };
  cellW: number;
  editing: boolean;
  meta: string;
  onEnterEdit: () => void;
  onOpen: () => void;
  onRemove: () => void;
  onResize: (span: 1 | 2, h: 1 | 2) => void;
  onDrop: (x: number, y: number) => void;
}) {
  const dx = useSharedValue(0);
  const dy = useSharedValue(0);
  const rx = useSharedValue(0);
  const ry = useSharedValue(0);
  const resizing = useSharedValue(0);
  const lifted = useSharedValue(0);
  const wobble = useSharedValue(0);
  const [dragging, setDragging] = useState(false);

  // The pixel sizes a tile is allowed to snap between: one cell to two.
  const minW = cellW;
  const maxW = cellW * 2 + GAP;
  const minH = ROW;
  const maxH = ROW * 2 + GAP;

  // The gentle tilt that says "these are movable now" — One UI's jiggle, quieter.
  React.useEffect(() => {
    if (editing && !dragging) {
      wobble.value = withRepeat(
        withSequence(withTiming(1, { duration: 950 }), withTiming(-1, { duration: 950 })),
        -1,
        true,
      );
    } else {
      cancelAnimation(wobble);
      wobble.value = withTiming(0, { duration: 160 });
    }
  }, [editing, dragging, wobble]);

  const buzz = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const startDrag = () => { setDragging(true); buzz(); };
  const endDrag = () => setDragging(false);

  const tap = Gesture.Tap()
    .enabled(!editing)
    .onEnd((_e, ok) => {
      if (ok) runOnJS(onOpen)();
    });

  // Holding a tile both enters edit mode and picks it up, the way a launcher does.
  const drag = Gesture.Pan()
    .activateAfterLongPress(editing ? 0 : 320)
    .onStart(() => {
      lifted.value = withSpring(1, SPRING);
      runOnJS(startDrag)();
      if (!editing) runOnJS(onEnterEdit)();
    })
    .onChange((e) => {
      dx.value += e.changeX;
      dy.value += e.changeY;
    })
    .onEnd(() => {
      runOnJS(onDrop)(frame.left + dx.value + frame.width / 2, frame.top + dy.value + frame.height / 2);
    })
    .onFinalize(() => {
      dx.value = withSpring(0, SPRING);
      dy.value = withSpring(0, SPRING);
      lifted.value = withSpring(0, SPRING);
      runOnJS(endDrag)();
    });

  // The corner grip stretches the tile under the finger, then snaps to whole cells.
  const grip = Gesture.Pan()
    .enabled(editing)
    .onStart(() => {
      resizing.value = 1;
    })
    .onChange((e) => {
      rx.value = Math.max(minW - frame.width, Math.min(maxW - frame.width, rx.value + e.changeX));
      ry.value = Math.max(minH - frame.height, Math.min(maxH - frame.height, ry.value + e.changeY));
    })
    .onEnd(() => {
      const w: 1 | 2 = frame.width + rx.value > (minW + maxW) / 2 ? 2 : 1;
      const h: 1 | 2 = frame.height + ry.value > (minH + maxH) / 2 ? 2 : 1;
      if (w !== placed.w || h !== placed.h) runOnJS(onResize)(w, h);
    })
    .onFinalize(() => {
      resizing.value = 0;
      rx.value = 0;
      ry.value = 0;
    });

  const composed = Gesture.Race(drag, tap);

  const boxStyle = useAnimatedStyle(() => ({
    left: withSpring(frame.left, SPRING),
    top: withSpring(frame.top, SPRING),
    // While the grip is held the tile follows the finger exactly; otherwise it springs.
    width: resizing.value ? frame.width + rx.value : withSpring(frame.width, SPRING),
    height: resizing.value ? frame.height + ry.value : withSpring(frame.height, SPRING),
  }));

  const liftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dx.value },
      { translateY: dy.value },
      { scale: 1 + lifted.value * 0.05 },
      { rotate: `${wobble.value * 0.7}deg` },
    ],
    opacity: 1 - lifted.value * 0.08,
    zIndex: lifted.value > 0 ? 10 : 1,
  }));

  const gripStyle = useAnimatedStyle(() => ({ opacity: withTiming(editing ? 1 : 0, { duration: 140 }) }));

  return (
    <Animated.View style={[{ position: 'absolute' }, boxStyle, liftStyle]}>
      <GestureDetector gesture={composed}>
        <View style={{ flex: 1 }}>
          <TileFace tkey={placed.tile.key} wide={placed.w === 2} tall={placed.h === 2} meta={meta} raised={dragging} />
        </View>
      </GestureDetector>

      {editing && (
        <>
          <Animated.View style={[{ position: 'absolute', top: -7, left: -7 }, gripStyle]}>
            <Pressable
              onPress={() => { buzz(); onRemove(); }}
              hitSlop={8}
              style={{
                width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, ...shadow.rest,
              }}
            >
              <Text style={{ color: palette.danger, fontSize: 12, marginTop: -1 }}>✕</Text>
            </Pressable>
          </Animated.View>

          <GestureDetector gesture={grip}>
            <Animated.View
              style={[{ position: 'absolute', right: -9, bottom: -9, padding: 6 }, gripStyle]}
              hitSlop={10}
            >
              <View
                style={{
                  width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: palette.ink, ...shadow.rest,
                }}
              >
                <Text style={{ color: palette.paper, fontSize: 11, marginTop: -1 }}>⤡</Text>
              </View>
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </Animated.View>
  );
}

export function EditBanner({ onDone }: { onDone: () => void }) {
  return (
    <View
      style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: palette.dotSoft, borderRadius: radius.pill, paddingLeft: 16, paddingRight: 6, paddingVertical: 6,
      }}
    >
      <Text style={{ ...type.small, color: palette.dotDeep, flex: 1 }}>Drag to move · pull ⤡ to resize</Text>
      <Pressable
        onPress={onDone}
        style={{ backgroundColor: palette.ink, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 7 }}
      >
        <Text style={{ ...type.label, color: palette.paper }}>DONE</Text>
      </Pressable>
    </View>
  );
}
