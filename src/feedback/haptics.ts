import * as Haptics from 'expo-haptics';
import { useAppStore } from '../state/useAppStore';

// All haptics respect the user's setting. Safe to call from runOnJS.
function enabled() {
  return useAppStore.getState().haptics;
}

// Soft "tick" when the crayon touches down.
export function crayonDown() {
  if (!enabled()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// Light selection tick (crayon/tool selection, buttons).
export function tick() {
  if (!enabled()) return;
  Haptics.selectionAsync().catch(() => {});
}

// Celebration on save.
export function success() {
  if (!enabled()) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
