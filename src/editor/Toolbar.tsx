import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '../i18n';
import { AppText } from '../ui/AppText';
import { Icon, type IconName } from '../ui/Icon';

type Props = {
  onBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onPrimary: () => void;
  primaryLabel: string;
  primaryIcon: IconName;
  canUndo: boolean;
  canRedo: boolean;
  canPrimary: boolean;
  center?: ReactNode;
};

function TBtn({
  icon,
  label,
  onPress,
  disabled,
  primary,
}: {
  icon: IconName;
  label: string;
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
      <Icon name={icon} size={18} color={primary ? '#fff' : '#2B2D42'} />
      <AppText style={[styles.label, primary && styles.labelPrimary]}>{label}</AppText>
    </Pressable>
  );
}

export default function Toolbar({
  onBack,
  onUndo,
  onRedo,
  onClear,
  onPrimary,
  primaryLabel,
  primaryIcon,
  canUndo,
  canRedo,
  canPrimary,
  center,
}: Props) {
  const t = useT();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 6 }]} pointerEvents="box-none">
      <Pressable onPress={onBack} hitSlop={8} style={styles.back}>
        <Icon name="chevron-back" size={18} />
        <AppText style={styles.backTxt}>{t('common.home')}</AppText>
      </Pressable>

      <View style={styles.center}>{center}</View>

      <View style={styles.tools}>
        <TBtn icon="arrow-undo" label={t('editor.undo')} onPress={onUndo} disabled={!canUndo} />
        <TBtn icon="arrow-redo" label={t('editor.redo')} onPress={onRedo} disabled={!canRedo} />
        <TBtn icon="trash-outline" label={t('editor.clear')} onPress={onClear} disabled={!canUndo} />
        <TBtn icon={primaryIcon} label={primaryLabel} onPress={onPrimary} disabled={!canPrimary} primary />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
  label: { fontSize: 10, fontWeight: '700', color: '#2B2D42', marginTop: 1 },
  labelPrimary: { color: '#fff' },
});
