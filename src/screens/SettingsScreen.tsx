import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CRAYONS } from '../editor/palette';
import { tick } from '../feedback/haptics';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../state/useAppStore';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  const { handedness, haptics, sound, name, avatarColor, update } = useAppStore();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backTxt}>‹ Home</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artist</Text>
        <Row label="Name">
          <TextInput
            value={name}
            onChangeText={(t) => update({ name: t })}
            style={styles.input}
            placeholder="Your name"
            maxLength={20}
          />
        </Row>
        <Text style={styles.subLabel}>Avatar color</Text>
        <View style={styles.colorRow}>
          {CRAYONS.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => {
                tick();
                update({ avatarColor: c.hex });
              }}
              style={[styles.swatch, { backgroundColor: c.hex }, avatarColor === c.hex && styles.swatchActive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Drawing</Text>
        <Row label="Crayon tray side">
          <View style={styles.segment}>
            {(['left', 'right'] as const).map((side) => (
              <Pressable
                key={side}
                onPress={() => {
                  tick();
                  update({ handedness: side });
                }}
                style={[styles.segBtn, handedness === side && styles.segBtnActive]}
              >
                <Text style={[styles.segTxt, handedness === side && styles.segTxtActive]}>
                  {side === 'left' ? 'Left' : 'Right'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Row>
        <Row label="Haptics">
          <Switch value={haptics} onValueChange={(v) => update({ haptics: v })} />
        </Row>
        <Row label="Sound (coming soon)">
          <Switch value={sound} onValueChange={(v) => update({ sound: v })} disabled />
        </Row>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backTxt: { fontSize: 15, fontWeight: '700', color: '#2B2D42', width: 60 },
  title: { fontSize: 20, fontWeight: '800', color: '#2B2D42' },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
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
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: '#2B2D42' },
  segment: { flexDirection: 'row', backgroundColor: '#F2E9DE', borderRadius: 10, padding: 3 },
  segBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  segBtnActive: { backgroundColor: '#fff' },
  segTxt: { fontSize: 14, fontWeight: '700', color: '#7A6F5D' },
  segTxtActive: { color: '#2B2D42' },
});
