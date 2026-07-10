import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { success, tick } from '../feedback/haptics';
import { useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { useEntitlements } from '../state/useEntitlements';
import { useProgress } from '../state/useProgress';
import { clearAllArtworks } from '../storage/gallery';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

const HOLD_MS = 1200;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {children}
    </View>
  );
}

export default function ParentZoneScreen({ navigation }: ScreenProps<'ParentZone'>) {
  const t = useT();
  const premium = useEntitlements((s) => s.premium);
  const setPremium = useEntitlements((s) => s.setPremium);
  const restore = useEntitlements((s) => s.restore);
  const resetProgress = useProgress((s) => s.reset);

  const [unlocked, setUnlocked] = useState(false);
  const progress = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHold = () => {
    progress.value = withTiming(1, { duration: HOLD_MS });
    timer.current = setTimeout(() => {
      success();
      setUnlocked(true);
    }, HOLD_MS);
  };
  const cancelHold = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    progress.value = withTiming(0, { duration: 150 });
  };
  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  const deleteData = () => {
    tick();
    Alert.alert(t('parent.deleteConfirmTitle'), t('parent.deleteConfirmMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await clearAllArtworks();
          resetProgress();
        },
      },
    ]);
  };

  if (!unlocked) {
    return (
      <SafeAreaView style={styles.gateRoot}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.gateBack}>
          <Icon name="close" size={26} color="#7A6F5D" />
        </Pressable>
        <Icon name="lock-closed" size={44} color="#7A6F5D" />
        <AppText style={styles.gateTitle}>{t('parent.gateTitle')}</AppText>
        <AppText style={styles.gateInstruction}>{t('parent.gateInstruction')}</AppText>
        <Pressable onPressIn={startHold} onPressOut={cancelHold} style={styles.holdBtn}>
          <Animated.View style={[styles.holdFill, fillStyle]} />
          <AppText style={styles.holdTxt}>{t('parent.title')}</AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} />
        </Pressable>
        <AppText style={styles.title}>{t('parent.title')}</AppText>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Section title={t('parent.status')}>
          <View style={styles.row}>
            <View style={styles.planRow}>
              <Icon name={premium ? 'star' : 'star-outline'} size={20} color={premium ? '#F6C90E' : '#7A6F5D'} />
              <AppText style={styles.rowLabel}>{premium ? t('parent.planPremium') : t('parent.planFree')}</AppText>
            </View>
          </View>
          {!premium ? (
            <Pressable
              style={styles.cta}
              onPress={() => {
                tick();
                navigation.navigate('Paywall');
              }}
            >
              <AppText style={styles.ctaTxt}>{t('parent.upgrade')}</AppText>
            </Pressable>
          ) : null}
          <Pressable
            style={styles.linkRow}
            onPress={async () => {
              tick();
              await restore();
            }}
          >
            <Icon name="refresh" size={18} color="#4062BB" />
            <AppText style={styles.linkTxt}>{t('parent.restore')}</AppText>
          </Pressable>
          <View style={styles.row}>
            <AppText style={styles.rowLabel}>{t('parent.previewLabel')}</AppText>
            <Switch value={premium} onValueChange={(v) => setPremium(v)} />
          </View>
        </Section>

        <Section title={t('parent.privacy')}>
          <Pressable
            style={styles.linkRow}
            onPress={() => {
              tick();
              Alert.alert(t('parent.exportData'), t('parent.exportDone'));
            }}
          >
            <Icon name="download-outline" size={18} color="#4062BB" />
            <AppText style={styles.linkTxt}>{t('parent.exportData')}</AppText>
          </Pressable>
          <Pressable style={styles.linkRow} onPress={deleteData}>
            <Icon name="trash-outline" size={18} color="#E4572E" />
            <AppText style={[styles.linkTxt, { color: '#E4572E' }]}>{t('parent.deleteData')}</AppText>
          </Pressable>
        </Section>
      </ScrollView>
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
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#7A6F5D', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLabel: { fontSize: 16, color: '#2B2D42', fontWeight: '600' },
  cta: { backgroundColor: '#3FA34D', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  linkTxt: { fontSize: 15, fontWeight: '700', color: '#4062BB' },

  gateRoot: { flex: 1, backgroundColor: '#F7F1E3', alignItems: 'center', justifyContent: 'center', padding: 28, gap: 14 },
  gateBack: { position: 'absolute', top: 52, right: 20 },
  gateTitle: { fontSize: 24, fontWeight: '800', color: '#2B2D42', marginTop: 4 },
  gateInstruction: { fontSize: 16, color: '#7A6F5D', textAlign: 'center' },
  holdBtn: {
    marginTop: 12,
    width: 220,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFE7DA',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  holdFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#C9BCA6' },
  holdTxt: { fontSize: 17, fontWeight: '800', color: '#2B2D42' },
});
