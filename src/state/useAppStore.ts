import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';

import { SUPPORTED_LANGUAGES, type Language } from '../i18n/translations';

export type Handedness = 'left' | 'right';

type Persisted = {
  handedness: Handedness;
  haptics: boolean;
  sound: boolean;
  name: string;
  avatarColor: string;
  language: Language;
};

type AppState = Persisted & {
  loaded: boolean;
  hydrate: () => Promise<void>;
  update: (patch: Partial<Persisted>) => void;
};

const KEY = 'crayonhero.settings.v1';

function deviceLanguage(): Language {
  try {
    const code = getLocales()[0]?.languageCode ?? 'en';
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(code) ? (code as Language) : 'en';
  } catch {
    return 'en';
  }
}

const DEFAULTS: Persisted = {
  handedness: 'right',
  haptics: true,
  sound: false, // sound not wired yet (no audio asset) — see BUILD_PLAN
  name: 'Little Artist',
  avatarColor: '#F6C90E',
  language: deviceLanguage(),
};

export const useAppStore = create<AppState>((set, get) => ({
  ...DEFAULTS,
  loaded: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) set(JSON.parse(raw) as Persisted);
    } catch {
      // ignore corrupt/missing settings
    }
    set({ loaded: true });
  },
  update: (patch) => {
    set(patch);
    const s = get();
    const persisted: Persisted = {
      handedness: s.handedness,
      haptics: s.haptics,
      sound: s.sound,
      name: s.name,
      avatarColor: s.avatarColor,
      language: s.language,
    };
    AsyncStorage.setItem(KEY, JSON.stringify(persisted)).catch(() => {});
  },
}));
