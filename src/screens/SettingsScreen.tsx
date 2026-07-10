import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CRAYONS } from '../editor/palette';
import { tick } from '../feedback/haptics';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../state/useAppStore';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <AppText style={styles.rowLabel}>{label}</AppText>
      {children}
    </View>
  );
}

export default function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  const t = useT();
  const { handedness, haptics, sound, name, avatarColor, language, update } = useAppStore();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} />
        </Pressable>
        <AppText style={styles.title}>{t('settings.title')}</AppText>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.section}>
        <AppText style={styles.sectionTitle}>{t('settings.artist')}</AppText>
        <Row label={t('settings.name')}>
          <TextInput
            value={name}
            onChangeText={(txt) => update({ name: txt })}
            style={styles.input}
            maxLength={20}
          />
        </Row>
        <AppText style={styles.subLabel}>{t('settings.avatarColor')}</AppText>
        <View style={styles.colorRow}>
          {CRAYONS.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => { tick(); update({ avatarColor: c.hex }); }}
              style={[styles.swatch, { backgroundColor: c.hex }, avatarColor === c.hex && styles.swatchActive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText style={styles.sectionTitle}>{t('settings.drawing')}</AppText>
        <Row label={t('settings.traySide')}>
          <View style={styles.segment}>
            {(['left', 'right'] as const).map((side) => (
              <Pressable
                key={side}
                onPress={() => { tick(); update({ handedness: side }); }}
                style={[styles.segBtn, handedness === side && styles.segBtnActive]}
              >
                <AppText style={[styles.segTxt, handedness === side && styles.segTxtActive]}>
                  {side === 'left' ? t('settings.left') : t('settings.right')}
                </AppText>
              </Pressable>
            ))}
          </View>
        </Row>
        <Row label={t('settings.haptics')}>
          <Switch value={haptics} onValueChange={(v) => update({ haptics: v })} />
        </Row>
        <Row label={t('settings.soundSoon')}>
          <Switch value={sound} onValueChange={(v) => update({ sound: v })} disabled />
        </Row>
      </View>

      <View style={styles.section}>
        <AppText style={styles.sectionTitle}>{t('settings.general')}</AppText>
        <AppText style={styles.subLabel}>{t('settings.language')}</AppText>
        <View style={styles.langWrap}>
          {SUPPORTED_LANGUAGES.map((lng) => (
            <Pressable
              key={lng}
              onPress={() => { tick(); update({ language: lng }); }}
              style={[styles.langBtn, language === lng && styles.langBtnActive]}
            >
              <AppText style={[styles.langTxt, language === lng && styles.langTxtActive]}>
                {LANGUAGE_LABELS[lng]}
              </AppText>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.parentRow} onPress={() => { tick(); navigation.navigate('ParentZone'); }}>
          <Icon name="lock-closed" size={18} color="#7A6F5D" />
          <AppText style={styles.parentTxt}>{t('settings.parentZone')}</AppText>
          <Icon name="chevron-forward" size={18} color="#B7AB97" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F1E3' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#2B2D42' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 18, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#7A6F5D', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rowLabel: { fontSize: 16, color: '#2B2D42', fontWeight: '600', flexShrink: 1 },
  subLabel: { fontSize: 13, color: '#7A6F5D', fontWeight: '700' },
  input: {
    backgroundColor: '#F2E9DE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#2B2D42',
    minWidth: 140,
    textAlign: 'right',
    fontFamily: 'Fredoka_500Medium',
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: '#2B2D42' },
  segment: { flexDirection: 'row', backgroundColor: '#F2E9DE', borderRadius: 10, padding: 3 },
  segBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  segBtnActive: { backgroundColor: '#fff' },
  segTxt: { fontSize: 14, fontWeight: '700', color: '#7A6F5D' },
  segTxtActive: { color: '#2B2D42' },
  langWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F2E9DE' },
  langBtnActive: { backgroundColor: '#4062BB' },
  langTxt: { fontSize: 14, fontWeight: '700', color: '#7A6F5D' },
  langTxtActive: { color: '#fff' },
  parentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 6 },
  parentTxt: { flex: 1, fontSize: 16, fontWeight: '700', color: '#2B2D42' },
});
