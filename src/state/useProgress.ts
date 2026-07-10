import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type Persisted = {
  points: number;
  plays: number;
  bestStars: Record<string, number>;
  streak: number;
  lastDay: number | null; // integer day number (UTC)
};

type ProgressState = Persisted & {
  loaded: boolean;
  hydrate: () => Promise<void>;
  award: (subjectId: string, stars: number, points: number) => void;
  reset: () => void;
};

const KEY = 'crayonhero.progress.v1';
const POINTS_PER_LEVEL = 150;

const DEFAULTS: Persisted = { points: 0, plays: 0, bestStars: {}, streak: 0, lastDay: null };

function today(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export const levelForPoints = (points: number) => Math.floor(points / POINTS_PER_LEVEL) + 1;
export const levelProgress = (points: number) => (points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL;

export const useProgress = create<ProgressState>((set, get) => ({
  ...DEFAULTS,
  loaded: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) set(JSON.parse(raw) as Persisted);
    } catch {
      // ignore
    }
    set({ loaded: true });
  },
  award: (subjectId, stars, points) => {
    const s = get();
    const day = today();
    let streak = s.streak;
    if (s.lastDay === null) streak = 1;
    else if (day === s.lastDay) streak = s.streak || 1;
    else if (day - s.lastDay === 1) streak = s.streak + 1;
    else streak = 1;

    const bestStars = { ...s.bestStars, [subjectId]: Math.max(s.bestStars[subjectId] ?? 0, stars) };

    const next: Persisted = {
      points: s.points + points,
      plays: s.plays + 1,
      bestStars,
      streak,
      lastDay: day,
    };
    set(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  },
  reset: () => {
    set({ ...DEFAULTS });
    AsyncStorage.setItem(KEY, JSON.stringify(DEFAULTS)).catch(() => {});
  },
}));
