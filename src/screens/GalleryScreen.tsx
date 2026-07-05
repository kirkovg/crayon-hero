import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { tick } from '../feedback/haptics';
import type { ScreenProps } from '../navigation/types';
import { listArtworks, type Artwork } from '../storage/gallery';

export default function GalleryScreen({ navigation }: ScreenProps<'Gallery'>) {
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
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.back}>
          <Text style={styles.backTxt}>‹ Home</Text>
        </Pressable>
        <Text style={styles.title}>My Gallery</Text>
        <View style={styles.back} />
      </View>

      {items.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🖼️</Text>
          <Text style={styles.emptyTitle}>No drawings yet</Text>
          <Text style={styles.emptySub}>Tap “Free Draw” on the home screen to make one!</Text>
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
              onPress={() => {
                tick();
                navigation.navigate('ArtworkViewer', { id: item.id });
              }}
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  back: { minWidth: 70 },
  backTxt: { fontSize: 15, fontWeight: '700', color: '#2B2D42' },
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
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#2B2D42' },
  emptySub: { fontSize: 15, color: '#7A6F5D', textAlign: 'center' },
});
