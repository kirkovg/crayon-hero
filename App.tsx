import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  useFonts,
} from '@expo-google-fonts/fredoka';

import RootStack from './src/navigation/RootStack';
import { useAppStore } from './src/state/useAppStore';
import { useEntitlements } from './src/state/useEntitlements';
import { useProgress } from './src/state/useProgress';

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrateProgress = useProgress((s) => s.hydrate);
  const hydrateEntitlements = useEntitlements((s) => s.hydrate);

  const [fontsLoaded] = useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });

  useEffect(() => {
    hydrate();
    hydrateProgress();
    hydrateEntitlements();
  }, [hydrate, hydrateProgress, hydrateEntitlements]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
