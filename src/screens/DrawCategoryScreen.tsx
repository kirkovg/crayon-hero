import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import { useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { CATEGORIES, type CategoryId } from '../subjects/catalog';
import { AppText } from '../ui/AppText';
import { Icon, type IconName } from '../ui/Icon';

const CAT_ICON: Record<CategoryId, IconName> = {
  household: 'home',
  flora: 'leaf',
  fauna: 'paw',
};

export default function DrawCategoryScreen({ navigation }: ScreenProps<'DrawCategory'>) {
  const t = useT();
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} />
        </Pressable>
        <AppText style={styles.title}>{t('draw.whatDraw')}</AppText>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.cards}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.card, { backgroundColor: c.color }]}
            onPress={() => { tick(); navigation.navigate('SubjectPicker', { category: c.id }); }}
          >
            <View style={styles.iconWrap}>
              <Icon name={CAT_ICON[c.id]} size={30} color="#fff" />
            </View>
            <AppText style={styles.cardTitle}>{t(`categories.${c.id}`)}</AppText>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
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
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
});
