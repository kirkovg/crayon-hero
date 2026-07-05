import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Handedness } from '../state/useAppStore';
import type { Crayon, Thickness } from './palette';

type Props = {
  crayons: Crayon[];
  eraser: Crayon;
  selectedId: string;
  onSelect: (id: string) => void;
  thicknesses: Thickness[];
  thicknessId: string;
  onThickness: (id: string) => void;
  handedness: Handedness;
  open: boolean;
  onToggle: () => void;
};

export default function CrayonTray({
  crayons,
  eraser,
  selectedId,
  onSelect,
  thicknesses,
  thicknessId,
  onThickness,
  handedness,
  open,
  onToggle,
}: Props) {
  const side = handedness; // 'left' | 'right'
  const selectedHex =
    selectedId === eraser.id ? '#D8C8B4' : (crayons.find((c) => c.id === selectedId)?.hex ?? '#000');

  if (!open) {
    return (
      <View style={[styles.wrap, side === 'right' ? styles.right : styles.left]} pointerEvents="box-none">
        <Pressable onPress={onToggle} style={styles.reopen} hitSlop={8}>
          <View style={[styles.reopenDot, { backgroundColor: selectedHex }]} />
          <Text style={styles.chev}>{side === 'right' ? '‹' : '›'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, side === 'right' ? styles.right : styles.left]} pointerEvents="box-none">
      <View style={styles.panel}>
        <Pressable onPress={onToggle} style={styles.close} hitSlop={8}>
          <Text style={styles.chev}>{side === 'right' ? '›' : '‹'}</Text>
        </Pressable>

        <View style={styles.thicknessRow}>
          {thicknesses.map((t) => {
            const active = t.id === thicknessId;
            const size = 8 + t.scale * 6;
            return (
              <Pressable key={t.id} onPress={() => onThickness(t.id)} hitSlop={6} style={styles.thicknessSlot}>
                <View
                  style={[
                    styles.thicknessDot,
                    { width: size, height: size, borderRadius: size / 2 },
                    active && styles.thicknessActive,
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.crayons}>
          {crayons.map((c) => {
            const selected = c.id === selectedId;
            return (
              <Pressable key={c.id} onPress={() => onSelect(c.id)} hitSlop={4} style={styles.slot}>
                <View
                  style={[
                    styles.crayon,
                    { backgroundColor: c.hex, transform: [{ translateX: selected ? (side === 'right' ? -14 : 14) : 0 }] },
                    selected && styles.crayonSelected,
                  ]}
                >
                  <View style={styles.tip} />
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => onSelect(eraser.id)} hitSlop={6} style={styles.slot}>
          <View style={[styles.eraser, selectedId === eraser.id && styles.eraserSelected]}>
            <Text style={styles.eraserTxt}>⌫</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const CRAYON_W = 92;
const CRAYON_H = 24;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  right: { right: 6, alignItems: 'flex-end' },
  left: { left: 6, alignItems: 'flex-start' },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  close: { paddingHorizontal: 8, paddingVertical: 2 },
  chev: { fontSize: 22, fontWeight: '800', color: '#8A7E6B', lineHeight: 24 },
  thicknessRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 2 },
  thicknessSlot: { alignItems: 'center', justifyContent: 'center', width: 24, height: 24 },
  thicknessDot: { backgroundColor: '#B7AB97' },
  thicknessActive: { backgroundColor: '#2B2D42' },
  crayons: { gap: 7, alignItems: 'center' },
  slot: {},
  crayon: {
    width: CRAYON_W,
    height: CRAYON_H,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 3,
    shadowOffset: { width: -1, height: 2 },
    elevation: 3,
  },
  crayonSelected: { shadowOpacity: 0.32, shadowRadius: 5 },
  tip: {
    width: 0,
    height: 0,
    marginLeft: 2,
    borderTopWidth: CRAYON_H / 2,
    borderBottomWidth: CRAYON_H / 2,
    borderLeftWidth: 11,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'rgba(0,0,0,0.18)',
  },
  eraser: {
    width: CRAYON_W - 20,
    height: CRAYON_H,
    borderRadius: 8,
    backgroundColor: '#F2E9DE',
    borderWidth: 2,
    borderColor: '#D8C8B4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  eraserSelected: { borderColor: '#2B2D42' },
  eraserTxt: { fontSize: 13, color: '#6B5B4B', fontWeight: '700' },
  reopen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.82)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  reopenDot: { width: 20, height: 20, borderRadius: 10 },
});
