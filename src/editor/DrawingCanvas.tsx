import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  Canvas,
  Fill,
  Path,
  Shader,
  Skia,
  type SkImage,
  type SkPath,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { crayonDown } from '../feedback/haptics';
import { GRAIN_SRC } from './grainShader';
import { PAPER, type PaintStyle } from './palette';
import { buildRibbon, type Pt } from './ribbon';
import type { Stroke } from './types';

const MAX_HW = 8;
const MIN_HW = 2.5;
const SPEED_REF = 28;
const SMOOTH = 0.35;

export type CanvasHandle = { makeImageSnapshot: () => SkImage | undefined };

type Props = {
  strokes: Stroke[];
  activeStyle: PaintStyle;
  thicknessScale: number;
  onCommitStroke: (svg: string) => void;
  canvasRef: React.RefObject<any>;
};

function CommittedStroke({
  stroke,
  effect,
}: {
  stroke: Stroke;
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

export default function DrawingCanvas({
  strokes,
  activeStyle,
  thicknessScale,
  onCommitStroke,
  canvasRef,
}: Props) {
  const effect = useMemo(() => Skia.RuntimeEffect.Make(GRAIN_SRC), []);

  const points = useSharedValue<Pt[]>([]);
  const activePath = useDerivedValue(() => buildRibbon(points.value));

  const pan = useMemo(() => {
    const maxHw = MAX_HW * thicknessScale;
    const minHw = MIN_HW * thicknessScale;
    return Gesture.Pan()
      .maxPointers(1)
      .minDistance(0)
      .onBegin((e) => {
        'worklet';
        points.value = [{ x: e.x, y: e.y, w: maxHw * 0.7 }];
        runOnJS(crayonDown)();
      })
      .onChange((e) => {
        'worklet';
        const pts = points.value;
        const last = pts.length ? pts[pts.length - 1] : undefined;
        const d = Math.sqrt(e.changeX * e.changeX + e.changeY * e.changeY);
        const t = Math.min(d / SPEED_REF, 1);
        const target = maxHw - t * (maxHw - minHw);
        const w = last ? last.w + (target - last.w) * SMOOTH : target;
        points.value = [...pts, { x: e.x, y: e.y, w }];
      })
      .onEnd(() => {
        'worklet';
        const svg = activePath.value.toSVGString();
        runOnJS(onCommitStroke)(svg);
        points.value = [];
      })
      .onFinalize(() => {
        'worklet';
        if (points.value.length) points.value = [];
      });
  }, [thicknessScale, onCommitStroke, points, activePath]);

  return (
    <GestureDetector gesture={pan}>
      <Canvas ref={canvasRef} style={StyleSheet.absoluteFill}>
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
  );
}
