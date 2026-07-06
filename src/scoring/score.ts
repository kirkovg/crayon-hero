import { AlphaType, ColorType, type SkImage } from '@shopify/react-native-skia';

import { hexToRgb01 } from '../editor/palette';
import type { Subject } from '../subjects/catalog';

export type ScoreResult = {
  stars: number; // 0..3 (0 only if nothing was drawn)
  points: number;
  coverage: number; // 0..1 how much of the subject got colored
  colorMatch: number; // 0..1 how close the colors are
  containment: number; // 0..1 how well it stayed in the lines
  drew: boolean;
};

export type Stage = { x: number; y: number; size: number };

const G = 64; // sample grid resolution
const PAPER = [247, 241, 227]; // #F7F1E3
const DRAW_THRESHOLD = 45; // color distance from paper to count a pixel as "drawn"

function gentleFallback(): ScoreResult {
  // Never crash / never hard-fail: award an encouraging 2 stars.
  return { stars: 2, points: 45, coverage: 0.6, colorMatch: 0.6, containment: 0.7, drew: true };
}

// Compares the user's drawing (a full-canvas snapshot) to the subject's target and
// returns a forgiving score.
//
// Approach (no offscreen surfaces — those can return null off the render thread):
//  - read the snapshot's pixels once,
//  - test target membership analytically with SkPath.contains() in unit space.
export function scoreDrawing(
  image: SkImage,
  subject: Subject,
  stage: Stage,
  canvasLogicalWidth: number,
): ScoreResult {
  try {
    const imgW = image.width();
    const imgH = image.height();
    if (!imgW || !imgH) {
      console.warn('[score] empty snapshot', imgW, imgH);
      return gentleFallback();
    }

    const px = image.readPixels(0, 0, {
      width: imgW,
      height: imgH,
      colorType: ColorType.RGBA_8888,
      alphaType: AlphaType.Unpremul,
    }) as Uint8Array | null;
    if (!px) {
      console.warn('[score] readPixels returned null');
      return gentleFallback();
    }

    const s = imgW / canvasLogicalWidth; // logical dp -> image px
    const sx = stage.x * s;
    const sy = stage.y * s;
    const sSize = stage.size * s;

    // Precompute region paths, unit-space bounds, and target RGB (0..255).
    const regions = subject.regions.map((r) => {
      const path = r.build();
      const b = path.getBounds();
      const [rr, gg, bb] = hexToRgb01(r.color);
      return { path, b, rgb: [rr * 255, gg * 255, bb * 255] };
    });

    let targetCount = 0;
    let userCount = 0;
    let covered = 0;
    let outside = 0;
    let colorDistSum = 0;

    for (let gy = 0; gy < G; gy++) {
      for (let gx = 0; gx < G; gx++) {
        const fx = (gx + 0.5) / G; // unit coords within the stage
        const fy = (gy + 0.5) / G;

        // Sample the user's pixel at this stage location.
        const devX = Math.min(imgW - 1, Math.max(0, Math.round(sx + fx * sSize)));
        const devY = Math.min(imgH - 1, Math.max(0, Math.round(sy + fy * sSize)));
        const o = (devY * imgW + devX) * 4;
        const ur = px[o], ug = px[o + 1], ub = px[o + 2];
        const drawn =
          Math.abs(ur - PAPER[0]) + Math.abs(ug - PAPER[1]) + Math.abs(ub - PAPER[2]) > DRAW_THRESHOLD;

        // Target membership: topmost region containing (fx, fy) wins its color.
        let inside = false;
        let tr = 0, tg = 0, tb = 0;
        for (let i = regions.length - 1; i >= 0; i--) {
          const reg = regions[i];
          if (
            fx >= reg.b.x &&
            fx <= reg.b.x + reg.b.width &&
            fy >= reg.b.y &&
            fy <= reg.b.y + reg.b.height &&
            reg.path.contains(fx, fy)
          ) {
            inside = true;
            tr = reg.rgb[0];
            tg = reg.rgb[1];
            tb = reg.rgb[2];
            break;
          }
        }

        if (inside) targetCount++;
        if (drawn) userCount++;
        if (inside && drawn) {
          covered++;
          colorDistSum += Math.abs(ur - tr) + Math.abs(ug - tg) + Math.abs(ub - tb);
        }
        if (drawn && !inside) outside++;
      }
    }

    const drew = userCount > G * G * 0.004;
    if (!drew) {
      return { stars: 0, points: 0, coverage: 0, colorMatch: 0, containment: 0, drew: false };
    }

    const coverage = targetCount ? covered / targetCount : 0;
    const containment = userCount ? 1 - outside / userCount : 0;
    const colorMatch = covered ? Math.max(0, 1 - colorDistSum / covered / (3 * 160)) : 0;

    const raw = 0.55 * coverage + 0.25 * colorMatch + 0.2 * containment;

    let stars = 1;
    if (raw >= 0.66) stars = 3;
    else if (raw >= 0.4) stars = 2;

    const points = 20 + Math.round(raw * 80) + stars * 10;

    return { stars, points, coverage, colorMatch, containment, drew: true };
  } catch (e) {
    console.warn('[score] error', (e as Error)?.message ?? e);
    return gentleFallback();
  }
}
