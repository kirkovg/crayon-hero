import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tick } from '../feedback/haptics';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../state/useAppStore';

function BigCard({
  title,
  subtitle,
  emoji,
  color,
  onPress,
  disabled,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.big, { backgroundColor: color }, disabled && styles.disabled]}
    >
      <Text style={styles.bigEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.bigTitle}>{title}</Text>
        <Text style={styles.bigSub}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

function SmallCard({ title, emoji, onPress }: { title: string; emoji: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.small}>
      <Text style={styles.smallEmoji}>{emoji}</Text>
      <Text style={styles.smallTitle}>{title}</Text>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const name = useAppStore((s) => s.name);
  const avatarColor = useAppStore((s) => s.avatarColor);

  const go = (fn: () => void) => {
    tick();
    fn();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarTxt}>🎨</Text>
        </View>
        <View>
          <Text style={styles.hi}>Hi, {name}!</Text>
          <Text style={styles.sub}>What do you want to make?</Text>
        </View>
      </View>

      <View style={styles.cards}>
        <BigCard
          title="Free Draw"
          subtitle="Blank paper — draw anything!"
          emoji="✏️"
          color="#3FA34D"
          onPress={() => go(() => navigation.navigate('Editor', { mode: 'free' }))}
        />
        <BigCard title="Draw Something" subtitle="Coming soon" emoji="🐱" color="#C9BCA6" disabled />
        <View style={styles.row}>
          <SmallCard title="My Gallery" emoji="🖼️" onPress={() => go(() => navigation.navigate('Gallery'))} />
          <SmallCard title="Settings" emoji="⚙️" onPress={() => go(() => navigation.navigate('Settings'))} />
        </View>
      </View>

      <Text style={styles.footer}>Crayon Hero</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F1E3', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12, marginBottom: 26 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 26 },
  hi: { fontSize: 24, fontWeight: '800', color: '#2B2D42' },
  sub: { fontSize: 15, color: '#7A6F5D', marginTop: 2 },
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
  disabled: { opacity: 0.6 },
  bigEmoji: { fontSize: 40 },
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
  smallEmoji: { fontSize: 30 },
  smallTitle: { fontSize: 15, fontWeight: '700', color: '#2B2D42' },
  footer: { marginTop: 'auto', textAlign: 'center', color: 'rgba(43,45,66,0.35)', fontWeight: '700', paddingBottom: 8 },
});
