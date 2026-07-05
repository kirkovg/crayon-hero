import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canSave: boolean;
  center?: ReactNode;
};

function TBtn({
  label,
  glyph,
  onPress,
  disabled,
  primary,
}: {
  label: string;
  glyph: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      style={[styles.btn, primary && styles.btnPrimary, disabled && styles.btnDisabled]}
    >
      <Text style={[styles.glyph, primary && styles.glyphPrimary]}>{glyph}</Text>
      <Text style={[styles.label, primary && styles.glyphPrimary]}>{label}</Text>
    </Pressable>
  );
}

export default function Toolbar({
  onBack,
  onUndo,
  onRedo,
  onClear,
  onSave,
  canUndo,
  canRedo,
  canSave,
  center,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 6 }]} pointerEvents="box-none">
      <Pressable onPress={onBack} hitSlop={8} style={styles.back}>
        <Text style={styles.backTxt}>‹ Home</Text>
      </Pressable>

      <View style={styles.center}>{center}</View>

      <View style={styles.tools}>
        <TBtn label="Undo" glyph="↶" onPress={onUndo} disabled={!canUndo} />
        <TBtn label="Redo" glyph="↷" onPress={onRedo} disabled={!canRedo} />
        <TBtn label="Clear" glyph="🗑" onPress={onClear} disabled={!canUndo} />
        <TBtn label="Save" glyph="💾" onPress={onSave} disabled={!canSave} primary />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 8,
  },
  back: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  backTxt: { fontSize: 15, fontWeight: '700', color: '#2B2D42' },
  center: { flex: 1, alignItems: 'center' },
  tools: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: 46,
  },
  btnPrimary: { backgroundColor: '#3FA34D' },
  btnDisabled: { opacity: 0.4 },
  glyph: { fontSize: 16, color: '#2B2D42' },
  glyphPrimary: { color: '#fff' },
  label: { fontSize: 10, fontWeight: '700', color: '#2B2D42', marginTop: 1 },
});
