import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { success, tick } from '../feedback/haptics';
import { useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { useEntitlements } from '../state/useEntitlements';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

function Feature({ text }: { text: string }) {
  return (
    <View style={styles.feature}>
      <Icon name="checkmark-circle" size={22} color="#3FA34D" />
      <AppText style={styles.featureTxt}>{text}</AppText>
    </View>
  );
}

export default function PaywallScreen({ navigation }: ScreenProps<'Paywall'>) {
  const t = useT();
  const setPremium = useEntitlements((s) => s.setPremium);
  const restore = useEntitlements((s) => s.restore);

  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.close}>
        <Icon name="close" size={26} color="#7A6F5D" />
      </Pressable>

      <View style={styles.hero}>
        <Icon name="color-palette" size={56} color="#F2A65A" />
        <AppText style={styles.title}>{t('paywall.title')}</AppText>
        <AppText style={styles.subtitle}>{t('paywall.subtitle')}</AppText>
      </View>

      <View style={styles.features}>
        <Feature text={t('paywall.f1')} />
        <Feature text={t('paywall.f2')} />
        <Feature text={t('paywall.f3')} />
        <Feature text={t('paywall.f4')} />
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.cta}
          onPress={() => {
            success();
            // Mock: real build calls Purchases.purchasePackage(...)
            setPremium(true);
            navigation.goBack();
          }}
        >
          <AppText style={styles.ctaTxt}>{t('paywall.cta')}</AppText>
        </Pressable>
        <View style={styles.secondaryRow}>
          <Pressable onPress={async () => { tick(); await restore(); }} hitSlop={8}>
            <AppText style={styles.secondaryTxt}>{t('paywall.restore')}</AppText>
          </Pressable>
          <Pressable onPress={() => { tick(); navigation.goBack(); }} hitSlop={8}>
            <AppText style={styles.secondaryTxt}>{t('paywall.notNow')}</AppText>
          </Pressable>
        </View>
        <AppText style={styles.mockNote}>{t('paywall.mockNote')}</AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F1E3', padding: 24 },
  close: { alignSelf: 'flex-end' },
  hero: { alignItems: 'center', gap: 8, marginTop: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#2B2D42', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#7A6F5D', textAlign: 'center' },
  features: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    gap: 14,
    marginTop: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureTxt: { fontSize: 16, fontWeight: '600', color: '#2B2D42', flex: 1 },
  footer: { marginTop: 'auto', gap: 14, alignItems: 'center' },
  cta: { backgroundColor: '#3FA34D', borderRadius: 18, paddingVertical: 16, alignItems: 'center', alignSelf: 'stretch' },
  ctaTxt: { color: '#fff', fontWeight: '800', fontSize: 18 },
  secondaryRow: { flexDirection: 'row', gap: 24 },
  secondaryTxt: { fontSize: 14, fontWeight: '700', color: '#7A6F5D' },
  mockNote: { fontSize: 12, color: 'rgba(43,45,66,0.4)', textAlign: 'center' },
});
