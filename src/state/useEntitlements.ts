import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// Phase 3 entitlements — a MOCK stand-in for RevenueCat.
// `premium` is toggled locally (Parent Zone preview / mock paywall). When we move
// to a dev build, replace setPremium/restore with react-native-purchases calls;
// the rest of the app only reads `premium`, so nothing else changes.

type EntitlementState = {
  loaded: boolean;
  premium: boolean;
  hydrate: () => Promise<void>;
  setPremium: (v: boolean) => void;
  restore: () => Promise<boolean>;
};

const KEY = 'crayonhero.entitlements.v1';

export const useEntitlements = create<EntitlementState>((set, get) => ({
  loaded: false,
  premium: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) set({ premium: !!JSON.parse(raw).premium });
    } catch {
      // ignore
    }
    set({ loaded: true });
  },
  setPremium: (v) => {
    set({ premium: v });
    AsyncStorage.setItem(KEY, JSON.stringify({ premium: v })).catch(() => {});
  },
  restore: async () => {
    // Mock: real implementation calls Purchases.restorePurchases().
    return get().premium;
  },
}));
