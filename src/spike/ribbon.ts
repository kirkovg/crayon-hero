import { Skia, type SkPath } from '@shopify/react-native-skia';

// A sampled stroke point with a per-point half-width (from speed).
export type Pt = { x: number; y: number; w: number };

// Builds a variable-width "ribbon" polygon from the sampled points.
// Runs on the UI thread (worklet) so the active stroke never touches React/JS.
export function buildRibbon(pts: Pt[]): SkPath {
  'worklet';
  const path = Skia.Path.Make();
  const n = pts.length;
  if (n === 0) return path;
  if (n === 1) {
    path.addCircle(pts[0].x, pts[0].y, Math.max(pts[0].w, 1));
    return path;
  }

  const left: { x: number; y: number }[] = [];
  const right: { x: number; y: number }[] = [];

  for (let i = 0; i < n; i++) {
    const prev = pts[i > 0 ? i - 1 : 0];
    const next = pts[i < n - 1 ? i + 1 : n - 1];
    let dx = next.x - prev.x;
    let dy = next.y - prev.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    dx /= len;
    dy /= len;
    const nx = -dy; // unit normal
    const ny = dx;
    const w = pts[i].w;
    left.push({ x: pts[i].x + nx * w, y: pts[i].y + ny * w });
    right.push({ x: pts[i].x - nx * w, y: pts[i].y - ny * w });
  }

  path.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < n; i++) path.lineTo(left[i].x, left[i].y);
  for (let i = n - 1; i >= 0; i--) path.lineTo(right[i].x, right[i].y);
  path.close();
  return path;
}
