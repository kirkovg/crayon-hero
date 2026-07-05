import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Crayon } from './palette';

type Props = {
  crayons: Crayon[];
  eraser: Crayon;
  selectedId: string;
  onSelect: (id: string) => void;
};

// The floating "crayon box" on the right. A first cut at the real product's tray:
// the selected crayon slides out toward the paper.
export default function CrayonTray({ crayons, eraser, selectedId, onSelect }: Props) {
  return (
    <View style={styles.tray} pointerEvents="box-none">
      {crayons.map((c) => {
        const selected = c.id === selectedId;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} hitSlop={6} style={styles.slot}>
            <View
              style={[
                styles.crayon,
                { backgroundColor: c.hex, transform: [{ translateX: selected ? -16 : 0 }] },
                selected && styles.crayonSelected,
              ]}
            >
              <View style={styles.tip} />
            </View>
          </Pressable>
        );
      })}

      <Pressable onPress={() => onSelect(eraser.id)} hitSlop={6} style={styles.slot}>
        <View style={[styles.eraser, selectedId === eraser.id && styles.eraserSelected]}>
          <Text style={styles.eraserTxt}>⌫</Text>
        </View>
      </Pressable>
    </View>
  );
}

const CRAYON_W = 96;
const CRAYON_H = 26;

const styles = StyleSheet.create({
  tray: {
    position: 'absolute',
    right: -8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
    paddingRight: 4,
  },
  slot: { alignItems: 'flex-end' },
  crayon: {
    width: CRAYON_W,
    height: CRAYON_H,
    borderTopLeftRadius: 13,
    borderBottomLeftRadius: 13,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    // soft "wax" shading
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 3,
    shadowOffset: { width: -1, height: 2 },
    elevation: 3,
  },
  crayonSelected: {
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tip: {
    width: 0,
    height: 0,
    marginLeft: 2,
    borderTopWidth: CRAYON_H / 2,
    borderBottomWidth: CRAYON_H / 2,
    borderLeftWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'rgba(0,0,0,0.18)',
  },
  eraser: {
    width: CRAYON_W - 24,
    height: CRAYON_H,
    borderRadius: 8,
    backgroundColor: '#F2E9DE',
    borderWidth: 2,
    borderColor: '#D8C8B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eraserSelected: {
    borderColor: '#2B2D42',
    transform: [{ translateX: -16 }],
  },
  eraserTxt: { fontSize: 14, color: '#6B5B4B', fontWeight: '700' },
});
