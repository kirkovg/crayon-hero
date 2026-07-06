import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import type { ScreenProps } from '../navigation/types';
import { useProgress } from '../state/useProgress';
import { subjectsByCategory, type CategoryId } from '../subjects/catalog';
import { SubjectCanvas } from '../subjects/SubjectRenderer';

export default function SubjectPickerScreen({ route, navigation }: ScreenProps<'SubjectPicker'>) {
  const subjects = subjectsByCategory(route.params.category as CategoryId);
  const bestStars = useProgress((s) => s.bestStars);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backTxt}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Pick one</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(s) => s.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const best = bestStars[item.id] ?? 0;
          return (
            <Pressable
              style={styles.cell}
              onPress={() => {
                tick();
                navigation.navigate('Editor', { mode: 'draw', subjectId: item.id });
              }}
            >
              <SubjectCanvas subject={item} size={110} mode="filled" paper style={styles.preview} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.stars}>
                {best > 0 ? '★'.repeat(best) + '☆'.repeat(3 - best) : '☆☆☆'}
              </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backTxt: { fontSize: 15, fontWeight: '700', color: '#2B2D42', width: 60 },
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
  name: { fontSize: 15, fontWeight: '700', color: '#2B2D42' },
  stars: { fontSize: 14, color: '#F6C90E', letterSpacing: 1 },
});
