import { create } from 'zustand';
import { Platform } from 'react-native';
import { Difficulty } from '../constants/gameConfig';

interface SettingsStore {
  soundEnabled: boolean;
  preferredDifficulty: Difficulty;
  hintsRemaining: Record<string, number>;

  setSoundEnabled: (enabled: boolean) => void;
  setPreferredDifficulty: (difficulty: Difficulty) => void;
  useHint: (gameType: string) => void;
  resetHints: (gameType: string) => void;
}

// Simple localStorage implementation for web
const webStorage = {
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Ignore storage errors
    }
  },
};

const persistState = (get: any) => {
  if (Platform.OS === 'web') {
    webStorage.setItem('puzzleedge-settings', JSON.stringify(get()));
  }
};

// Initialize store with persisted data on web
const getInitialState = () => {
  if (Platform.OS === 'web') {
    try {
      const stored = webStorage.getItem('puzzleedge-settings');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parsing errors
    }
  }
  return {
    soundEnabled: true,
    preferredDifficulty: 'medium' as Difficulty,
    hintsRemaining: {},
  };
};

export const useSettingsStore = create<SettingsStore>()((set, get) => ({
  ...getInitialState(),

  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled });
    persistState(get);
  },

  setPreferredDifficulty: (difficulty) => {
    set({ preferredDifficulty: difficulty });
    persistState(get);
  },

  useHint: (gameType) => {
    set((state) => ({
      hintsRemaining: {
        ...state.hintsRemaining,
        [gameType]: Math.max(0, (state.hintsRemaining[gameType] || 3) - 1),
      },
    }));
    persistState(get);
  },

  resetHints: (gameType) => {
    set((state) => ({
      hintsRemaining: {
        ...state.hintsRemaining,
        [gameType]: 3,
      },
    }));
    persistState(get);
  },
}));
