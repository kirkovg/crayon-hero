import { Skia, type SkPath } from '@shopify/react-native-skia';

// Path builders in unit space (all coords 0..1). Rendered by scaling by the
// target size, so subjects are resolution-independent.

export function circle(cx: number, cy: number, r: number): SkPath {
  const p = Skia.Path.Make();
  p.addCircle(cx, cy, r);
  return p;
}

export function oval(cx: number, cy: number, rx: number, ry: number): SkPath {
  const p = Skia.Path.Make();
  p.addOval(Skia.XYWHRect(cx - rx, cy - ry, rx * 2, ry * 2));
  return p;
}

export function rect(x: number, y: number, w: number, h: number): SkPath {
  const p = Skia.Path.Make();
  p.addRect(Skia.XYWHRect(x, y, w, h));
  return p;
}

export function poly(points: [number, number][]): SkPath {
  const p = Skia.Path.Make();
  points.forEach(([x, y], i) => (i === 0 ? p.moveTo(x, y) : p.lineTo(x, y)));
  p.close();
  return p;
}
