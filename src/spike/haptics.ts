import * as Haptics from 'expo-haptics';

// Soft "tick" when the crayon touches down. Called via runOnJS from the gesture worklet.
export function crayonDown() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// Light selection tick when picking a crayon.
export function crayonSelect() {
  Haptics.selectionAsync().catch(() => {});
}
