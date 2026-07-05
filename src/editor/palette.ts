// Crayon palette, thicknesses, and paint styling for the editor.

export type Crayon = { id: string; name: string; hex: string; erase?: boolean };
export type BlendName = 'multiply' | 'srcOver';
export type PaintStyle = { color: number[]; grain: number; blend: BlendName };
export type Thickness = { id: string; label: string; scale: number };

// Warm off-white "paper" tone.
export const PAPER = '#F7F1E3';

export const CRAYONS: Crayon[] = [
  { id: 'red', name: 'Cherry Red', hex: '#E4572E' },
  { id: 'orange', name: 'Tangerine', hex: '#F2A65A' },
  { id: 'yellow', name: 'Sunshine', hex: '#F6C90E' },
  { id: 'green', name: 'Grass', hex: '#3FA34D' },
  { id: 'teal', name: 'Lagoon', hex: '#2A9D8F' },
  { id: 'blue', name: 'Sky', hex: '#4062BB' },
  { id: 'purple', name: 'Grape', hex: '#7D5BA6' },
  { id: 'pink', name: 'Bubblegum', hex: '#EF6BA1' },
  { id: 'brown', name: 'Cocoa', hex: '#8D5B4C' },
  { id: 'black', name: 'Midnight', hex: '#2B2D42' },
];

export const ERASER: Crayon = { id: 'eraser', name: 'Eraser', hex: PAPER, erase: true };

export const THICKNESSES: Thickness[] = [
  { id: 'thin', label: 'Thin', scale: 0.6 },
  { id: 'normal', label: 'Normal', scale: 1 },
  { id: 'chunky', label: 'Chunky', scale: 1.7 },
];

export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return [r, g, b];
}

export function styleFor(c: Crayon): PaintStyle {
  if (c.erase) {
    const [r, g, b] = hexToRgb01(PAPER);
    // Eraser: opaque paper color, no grain, normal blend → paints over.
    return { color: [r, g, b, 1], grain: 0, blend: 'srcOver' };
  }
  const [r, g, b] = hexToRgb01(c.hex);
  // Crayon: slightly translucent, grainy, multiply blend so overlaps build up like wax.
  return { color: [r, g, b, 0.9], grain: 0.55, blend: 'multiply' };
}
