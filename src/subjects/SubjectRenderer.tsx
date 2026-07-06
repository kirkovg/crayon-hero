import { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Canvas, Fill, Group, Path } from '@shopify/react-native-skia';

import { PAPER } from '../editor/palette';
import type { Subject } from './catalog';

export type SubjectMode = 'filled' | 'outline' | 'guide';

type Props = {
  subject: Subject;
  size: number;
  mode: SubjectMode;
  paper?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Renders a subject into a square Skia canvas of the given size.
// - filled:  solid target colors (reference chip / picker cells)
// - outline: dark stroked lines to color inside (Color It)
// - guide:   faint filled hint (Draw It)
export function SubjectCanvas({ subject, size, mode, paper, style }: Props) {
  const paths = useMemo(
    () => subject.regions.map((r) => ({ path: r.build(), color: r.color })),
    [subject],
  );

  return (
    <Canvas style={[{ width: size, height: size }, style]}>
      {paper ? <Fill color={PAPER} /> : null}
      <Group transform={[{ scale: size }]}>
        {paths.map((r, i) => {
          if (mode === 'filled') return <Path key={i} path={r.path} color={r.color} style="fill" />;
          if (mode === 'guide')
            return <Path key={i} path={r.path} color={r.color} style="fill" opacity={0.16} />;
          return (
            <Path
              key={i}
              path={r.path}
              color="#3A3327"
              style="stroke"
              strokeWidth={0.014}
              strokeJoin="round"
              strokeCap="round"
            />
          );
        })}
      </Group>
    </Canvas>
  );
}
