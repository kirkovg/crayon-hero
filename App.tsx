import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CrayonSpikeScreen from './src/spike/CrayonSpikeScreen';

// Crayon Hero — Phase 0 spike.
// A throwaway screen whose only job is to prove the crayon "feel" on-device.
export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <CrayonSpikeScreen />
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
