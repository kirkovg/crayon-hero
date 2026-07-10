import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import { useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { useEntitlements } from '../state/useEntitlements';
import { useProgress } from '../state/useProgress';
import { subjectsByCategory, type CategoryId } from '../subjects/catalog';
import { SubjectCanvas } from '../subjects/SubjectRenderer';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

export default function SubjectPickerScreen({ route, navigation }: ScreenProps<'SubjectPicker'>) {
  const t = useT();
  const subjects = subjectsByCategory(route.params.category as CategoryId);
  const bestStars = useProgress((s) => s.bestStars);
  const premium = useEntitlements((s) => s.premium);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} />
        </Pressable>
        <AppText style={styles.title}>{t('draw.pickOne')}</AppText>
        <View style={styles.headerBtn} />
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(s) => s.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const best = bestStars[item.id] ?? 0;
          const locked = !!item.premium && !premium;
          return (
            <Pressable
              style={styles.cell}
              onPress={() => {
                tick();
                if (locked) navigation.navigate('Paywall');
                else navigation.navigate('Editor', { mode: 'draw', subjectId: item.id });
              }}
            >
              <View>
                <SubjectCanvas subject={item} size={110} mode="filled" paper style={styles.preview} />
                {locked ? (
                  <View style={styles.lockBadge}>
                    <Icon name="lock-closed" size={14} color="#fff" />
                  </View>
                ) : null}
              </View>
              <AppText style={styles.name}>{t(`subjects.${item.id}`)}</AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3].map((n) => (
                  <Icon
                    key={n}
                    name={n <= best ? 'star' : 'star-outline'}
                    size={14}
                    color={n <= best ? '#F6C90E' : '#D8CBB6'}
                  />
                ))}
              </View>
            </Pressable>
          );
        }}
      />
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
  title: { fontSize: 18, fontWeight: '800', color: '#2B2D42' },
  grid: { padding: 12, gap: 12 },
  column: { gap: 12 },
  cell: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  preview: { borderRadius: 12 },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(43,45,66,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 15, fontWeight: '700', color: '#2B2D42' },
  starsRow: { flexDirection: 'row', gap: 3 },
});
