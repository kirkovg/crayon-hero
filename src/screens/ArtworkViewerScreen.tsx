import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import { useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { deleteArtwork, getArtwork } from '../storage/gallery';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

export default function ArtworkViewerScreen({ route, navigation }: ScreenProps<'ArtworkViewer'>) {
  const t = useT();
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
    Alert.alert(t('viewer.deleteTitle'), t('viewer.deleteMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('viewer.delete'),
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
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} />
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={8} style={styles.delete}>
          <Icon name="trash-outline" size={18} color="#E4572E" />
          <AppText style={styles.deleteTxt}>{t('viewer.delete')}</AppText>
        </Pressable>
      </View>

      <View style={styles.stage}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.image} />
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  delete: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(228,87,46,0.12)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  deleteTxt: { fontSize: 14, fontWeight: '700', color: '#E4572E' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  image: { width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#fff' },
});
