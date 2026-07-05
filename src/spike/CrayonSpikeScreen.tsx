import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import {
  Canvas,
  Fill,
  Path,
  Shader,
  Skia,
  type SkPath,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';

import CrayonTray from './CrayonTray';
import FpsMeter from './FpsMeter';
import { crayonDown, crayonSelect } from './haptics';
import { GRAIN_SRC } from './grainShader';
import { CRAYONS, ERASER, PAPER, styleFor, type BlendName, type Crayon } from './palette';
import { buildRibbon, type Pt } from './ribbon';

// Half-width range (px) and the speed (px/frame) at which the crayon thins out.
const MAX_HW = 8;
const MIN_HW = 2.5;
const SPEED_REF = 28;
const SMOOTH = 0.35;

type Committed = { id: number; svg: string; color: number[]; grain: number; blend: BlendName };

// One finished stroke. The SkPath is rebuilt from its SVG string exactly once.
function CommittedStroke({
  stroke,
  effect,
}: {
  stroke: Committed;
  effect: ReturnType<typeof Skia.RuntimeEffect.Make>;
}) {
  const path = useMemo<SkPath>(
    () => Skia.Path.MakeFromSVGString(stroke.svg) ?? Skia.Path.Make(),
    [stroke.svg],
  );
  return (
    <Path path={path} style="fill" blendMode={stroke.blend}>
      <Shader source={effect!} uniforms={{ u_color: stroke.color, u_grain: stroke.grain }} />
    </Path>
  );
}

export default function CrayonSpikeScreen() {
  const effect = useMemo(() => Skia.RuntimeEffect.Make(GRAIN_SRC), []);

  const [selectedId, setSelectedId] = useState<string>(CRAYONS[0].id);
  const [strokes, setStrokes] = useState<Committed[]>([]);

  const current: Crayon = useMemo(
    () => (selectedId === ERASER.id ? ERASER : CRAYONS.find((c) => c.id === selectedId) ?? CRAYONS[0]),
    [selectedId],
  );
  const activeStyle = useMemo(() => styleFor(current), [current]);

  // Keep the latest selection available to the (JS) commit callback without
  // making the drawing worklet depend on React state.
  const selRef = useRef<Crayon>(current);
  useEffect(() => {
    selRef.current = current;
  }, [current]);

  const idRef = useRef(0);

  // The active stroke lives entirely on the UI thread.
  const points = useSharedValue<Pt[]>([]);
  const activePath = useDerivedValue(() => buildRibbon(points.value));

  const commit = useCallback((svg: string) => {
    if (!svg) return;
    const st = styleFor(selRef.current);
    setStrokes((prev) => [
      ...prev,
      { id: idRef.current++, svg, color: st.color, grain: st.grain, blend: st.blend },
    ]);
  }, []);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .maxPointers(1)
        .minDistance(0)
        .onBegin((e) => {
          'worklet';
          points.value = [{ x: e.x, y: e.y, w: MAX_HW * 0.7 }];
          runOnJS(crayonDown)();
        })
        .onChange((e) => {
          'worklet';
          const pts = points.value;
          const last = pts.length ? pts[pts.length - 1] : undefined;
          const d = Math.sqrt(e.changeX * e.changeX + e.changeY * e.changeY);
          const t = Math.min(d / SPEED_REF, 1);
          const target = MAX_HW - t * (MAX_HW - MIN_HW);
          const w = last ? last.w + (target - last.w) * SMOOTH : target;
          points.value = [...pts, { x: e.x, y: e.y, w }];
        })
        .onEnd(() => {
          'worklet';
          const svg = activePath.value.toSVGString();
          runOnJS(commit)(svg);
          points.value = [];
        })
        .onFinalize(() => {
          'worklet';
          if (points.value.length) points.value = [];
        }),
    [commit, points, activePath],
  );

  const onSelect = useCallback((id: string) => {
    crayonSelect();
    setSelectedId(id);
  }, []);

  const undo = useCallback(() => setStrokes((prev) => prev.slice(0, -1)), []);
  const clear = useCallback(() => setStrokes([]), []);

  return (
    <View style={styles.root}>
      <GestureDetector gesture={pan}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Fill color={PAPER} />
          {strokes.map((s) => (
            <CommittedStroke key={s.id} stroke={s} effect={effect} />
          ))}
          <Path path={activePath} style="fill" blendMode={activeStyle.blend}>
            <Shader
              source={effect!}
              uniforms={{ u_color: activeStyle.color, u_grain: activeStyle.grain }}
            />
          </Path>
        </Canvas>
      </GestureDetector>

      {/* Overlays */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRow} pointerEvents="box-none">
          <View style={styles.controls}>
            <Pressable onPress={undo} style={styles.btn} hitSlop={8}>
              <Text style={styles.btnTxt}>↶ Undo</Text>
            </Pressable>
            <Pressable onPress={clear} style={styles.btn} hitSlop={8}>
              <Text style={styles.btnTxt}>Clear</Text>
            </Pressable>
          </View>
          <FpsMeter />
        </View>

        <Text style={styles.hint}>Draw with your finger ✏️</Text>
      </SafeAreaView>

      <CrayonTray crayons={CRAYONS} eraser={ERASER} selectedId={selectedId} onSelect={onSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PAPER },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  controls: { flexDirection: 'row', gap: 8 },
  btn: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  btnTxt: { fontSize: 13, fontWeight: '700', color: '#2B2D42' },
  hint: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    color: 'rgba(43,45,66,0.45)',
    fontSize: 14,
    fontWeight: '600',
  },
});
