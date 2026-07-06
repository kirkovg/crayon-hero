import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import type { ScreenProps } from '../navigation/types';
import { getSubject } from '../subjects/catalog';
import { SubjectCanvas } from '../subjects/SubjectRenderer';

const MESSAGES: Record<number, string> = {
  3: 'Amazing! 🌟',
  2: 'Great job! 🎉',
  1: 'Nice work! 👍',
  0: "Let's add a bit more!",
};

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }]} />
      </View>
    </View>
  );
}

export default function ScoreScreen({ route, navigation }: ScreenProps<'Score'>) {
  const { subjectId, stars, points, coverage, colorMatch, containment } = route.params;
  const subject = getSubject(subjectId);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.card}>
        {subject ? (
          <SubjectCanvas subject={subject} size={96} mode="filled" paper style={styles.ref} />
        ) : null}

        <Text style={styles.message}>{MESSAGES[stars] ?? MESSAGES[1]}</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3].map((n) => (
            <Text key={n} style={[styles.star, n <= stars ? styles.starOn : styles.starOff]}>
              ★
            </Text>
          ))}
        </View>

        <Text style={styles.points}>+{points} points</Text>

        <View style={styles.bars}>
          <Bar label="Filled it in" value={coverage} />
          <Bar label="Right colors" value={colorMatch} />
          <Bar label="In the lines" value={containment} />
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => {
            tick();
            navigation.replace('Editor', { mode: 'draw', subjectId });
          }}
        >
          <Text style={styles.btnSecondaryTxt}>Try again</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => {
            tick();
            navigation.popToTop();
          }}
        >
          <Text style={styles.btnPrimaryTxt}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F1E3', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  ref: { borderRadius: 16, marginBottom: 4 },
  message: { fontSize: 24, fontWeight: '800', color: '#2B2D42' },
  starsRow: { flexDirection: 'row', gap: 6 },
  star: { fontSize: 44 },
  starOn: { color: '#F6C90E' },
  starOff: { color: '#E0D6C6' },
  points: { fontSize: 18, fontWeight: '800', color: '#3FA34D' },
  bars: { alignSelf: 'stretch', gap: 8, marginTop: 8 },
  barRow: { gap: 4 },
  barLabel: { fontSize: 13, fontWeight: '700', color: '#7A6F5D' },
  barTrack: { height: 10, borderRadius: 5, backgroundColor: '#EFE7DA', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, backgroundColor: '#3FA34D' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20, width: '100%', maxWidth: 380 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  btnSecondary: { backgroundColor: '#EFE7DA' },
  btnSecondaryTxt: { fontSize: 16, fontWeight: '800', color: '#2B2D42' },
  btnPrimary: { backgroundColor: '#3FA34D' },
  btnPrimaryTxt: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
