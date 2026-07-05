import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { runOnJS, useFrameCallback, useSharedValue } from 'react-native-reanimated';

// Measures UI-thread frame rate (the number that matters for drawing).
export default function FpsMeter() {
  const [fps, setFps] = useState(0);
  const frames = useSharedValue(0);
  const start = useSharedValue(0);

  useFrameCallback((info) => {
    'worklet';
    const t = info.timestamp;
    if (start.value === 0) {
      start.value = t;
      frames.value = 0;
      return;
    }
    frames.value += 1;
    const dt = t - start.value;
    if (dt >= 1000) {
      runOnJS(setFps)(Math.round((frames.value * 1000) / dt));
      frames.value = 0;
      start.value = t;
    }
  });

  return (
    <View style={styles.box} pointerEvents="none">
      <Text style={styles.txt}>{fps} fps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9,
  },
  txt: { fontSize: 11, fontWeight: '700', color: '#2B2D42', fontVariant: ['tabular-nums'] },
});
