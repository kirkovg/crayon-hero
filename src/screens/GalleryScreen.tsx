import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { tick } from '../feedback/haptics';
import { useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { listArtworks, type Artwork } from '../storage/gallery';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

export default function GalleryScreen({ navigation }: ScreenProps<'Gallery'>) {
  const t = useT();
  const [items, setItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const a = await listArtworks();
        if (active) {
          setItems(a);
          setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} />
        </Pressable>
        <AppText style={styles.title}>{t('gallery.title')}</AppText>
        <View style={styles.headerBtn} />
      </View>

      {items.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Icon name="images-outline" size={52} color="#B7AB97" />
          <AppText style={styles.emptyTitle}>{t('gallery.empty')}</AppText>
          <AppText style={styles.emptySub}>{t('gallery.emptySub')}</AppText>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <Pressable
              style={styles.cell}
              onPress={() => { tick(); navigation.navigate('ArtworkViewer', { id: item.id }); }}
            >
              {item.uri ? (
                <Image source={{ uri: item.uri }} style={styles.thumb} resizeMode="cover" />
              ) : (
                <View style={styles.thumb} />
              )}
            </Pressable>
          )}
        />
      )}
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
  grid: { padding: 12, gap: 12 },
  column: { gap: 12 },
  cell: {
    flex: 1,
    aspectRatio: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  thumb: { width: '100%', height: '100%', backgroundColor: '#F7F1E3' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#2B2D42' },
  emptySub: { fontSize: 15, color: '#7A6F5D', textAlign: 'center' },
});
