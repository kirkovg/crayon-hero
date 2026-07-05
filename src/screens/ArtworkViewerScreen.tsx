import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import type { ScreenProps } from '../navigation/types';
import { deleteArtwork, getArtwork } from '../storage/gallery';

export default function ArtworkViewerScreen({ route, navigation }: ScreenProps<'ArtworkViewer'>) {
  const { id } = route.params;
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getArtwork(id).then((u) => {
      if (active) setUri(u);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const onDelete = () => {
    tick();
    Alert.alert('Delete this drawing?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteArtwork(id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.back}>
          <Text style={styles.backTxt}>‹ Gallery</Text>
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={8} style={styles.delete}>
          <Text style={styles.deleteTxt}>🗑 Delete</Text>
        </Pressable>
      </View>

      <View style={styles.stage}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.loading}>Loading…</Text>
        )}
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
  back: {},
  backTxt: { fontSize: 15, fontWeight: '700', color: '#2B2D42' },
  delete: { backgroundColor: 'rgba(228,87,46,0.12)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  deleteTxt: { fontSize: 14, fontWeight: '700', color: '#E4572E' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  loading: { color: '#7A6F5D', fontSize: 16 },
});
