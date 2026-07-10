import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import { useT } from '../i18n';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../state/useAppStore';
import { levelForPoints, useProgress } from '../state/useProgress';
import { AppText } from '../ui/AppText';
import { Icon, type IconName } from '../ui/Icon';

function BigCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.big, { backgroundColor: color }]}>
      <View style={styles.bigIcon}>
        <Icon name={icon} size={34} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <AppText style={styles.bigTitle}>{title}</AppText>
        <AppText style={styles.bigSub}>{subtitle}</AppText>
      </View>
    </Pressable>
  );
}

function SmallCard({ title, icon, onPress }: { title: string; icon: IconName; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.small}>
      <Icon name={icon} size={28} color="#4062BB" />
      <AppText style={styles.smallTitle}>{title}</AppText>
    </Pressable>
  );
}

function Stat({ label, value, flame }: { label: string; value: string; flame?: boolean }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statValueRow}>
        <AppText style={styles.statValue}>{value}</AppText>
        {flame ? <Icon name="flame" size={18} color="#F2A65A" /> : null}
      </View>
      <AppText style={styles.statLabel}>{label}</AppText>
    </View>
  );
}

export default function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const t = useT();
  const name = useAppStore((s) => s.name);
  const avatarColor = useAppStore((s) => s.avatarColor);
  const points = useProgress((s) => s.points);
  const streak = useProgress((s) => s.streak);
  const level = levelForPoints(points);

  const go = (fn: () => void) => {
    tick();
    fn();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Icon name="color-palette" size={28} color="#fff" />
        </View>
        <View>
          <AppText style={styles.hi}>{t('home.greeting', { name })}</AppText>
          <AppText style={styles.sub}>{t('home.prompt')}</AppText>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat label={t('home.level')} value={`${level}`} />
        <Stat label={t('home.points')} value={`${points}`} />
        <Stat label={t('home.streak')} value={streak > 0 ? `${streak}` : '—'} flame={streak > 0} />
      </View>

      <View style={styles.cards}>
        <BigCard
          title={t('home.freeDraw')}
          subtitle={t('home.freeDrawSub')}
          icon="create"
          color="#3FA34D"
          onPress={() => go(() => navigation.navigate('Editor', { mode: 'free' }))}
        />
        <BigCard
          title={t('home.drawSomething')}
          subtitle={t('home.drawSomethingSub')}
          icon="color-palette"
          color="#F2A65A"
          onPress={() => go(() => navigation.navigate('DrawCategory'))}
        />
        <View style={styles.row}>
          <SmallCard title={t('home.gallery')} icon="images" onPress={() => go(() => navigation.navigate('Gallery'))} />
          <SmallCard title={t('home.settings')} icon="settings-sharp" onPress={() => go(() => navigation.navigate('Settings'))} />
        </View>
      </View>

      <AppText style={styles.footer}>Crayon Hero</AppText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F1E3', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12, marginBottom: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  hi: { fontSize: 24, fontWeight: '800', color: '#2B2D42' },
  sub: { fontSize: 15, color: '#7A6F5D', marginTop: 2 },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#2B2D42' },
  statLabel: { fontSize: 12, color: '#7A6F5D', fontWeight: '700', marginTop: 2 },
  cards: { gap: 14 },
  big: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bigIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  bigSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  row: { flexDirection: 'row', gap: 14 },
  small: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  smallTitle: { fontSize: 15, fontWeight: '700', color: '#2B2D42' },
  footer: { marginTop: 'auto', textAlign: 'center', color: 'rgba(43,45,66,0.35)', fontWeight: '700', paddingBottom: 8 },
});
