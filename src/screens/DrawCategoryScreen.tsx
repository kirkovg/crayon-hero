import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import type { ScreenProps } from '../navigation/types';
import { CATEGORIES } from '../subjects/catalog';

export default function DrawCategoryScreen({ navigation }: ScreenProps<'DrawCategory'>) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backTxt}>‹ Home</Text>
        </Pressable>
        <Text style={styles.title}>What should we draw?</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.cards}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.card, { backgroundColor: c.color }]}
            onPress={() => {
              tick();
              navigation.navigate('SubjectPicker', { category: c.id });
            }}
          >
            <Text style={styles.emoji}>{c.emoji}</Text>
            <Text style={styles.cardTitle}>{c.name}</Text>
          </Pressable>
        ))}
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
  title: { fontSize: 18, fontWeight: '800', color: '#2B2D42' },
  cards: { padding: 16, gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 22,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emoji: { fontSize: 40 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
});
