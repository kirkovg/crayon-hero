import type { BlendName } from './palette';

// One finished stroke: its geometry as an SVG string plus its paint settings.
export type Stroke = {
  id: number;
  svg: string;
  color: number[];
  grain: number;
  blend: BlendName;
};
