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

// Enhanced localStorage implementation with better error handling
const webStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name);
      if (value) {
        console.log('[PuzzleEdge Settings] Successfully loaded settings from localStorage');
      }
      return value;
    } catch (error) {
      console.error('[PuzzleEdge Settings] Error reading from localStorage:', error);
      // Try to fallback to sessionStorage
      try {
        const value = sessionStorage.getItem(name);
        if (value) {
          console.log('[PuzzleEdge Settings] Loaded settings from sessionStorage fallback');
        }
        return value;
      } catch (fallbackError) {
        console.error('[PuzzleEdge Settings] SessionStorage fallback also failed:', fallbackError);
        return null;
      }
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
      console.log('[PuzzleEdge Settings] Successfully saved settings to localStorage');
    } catch (error) {
      console.error('[PuzzleEdge Settings] Error writing to localStorage:', error);
      // Try to fallback to sessionStorage
      try {
        sessionStorage.setItem(name, value);
        console.log('[PuzzleEdge Settings] Saved settings to sessionStorage fallback');
      } catch (fallbackError) {
        console.error('[PuzzleEdge Settings] SessionStorage fallback also failed:', fallbackError);
      }
    }
  },
};

// Subscribe to store changes and persist
const persistMiddleware = (config: any) => (set: any, get: any, api: any) => {
  const store = config(
    (...args: any[]) => {
      set(...args);
      // Persist after each state change on web
      if (Platform.OS === 'web') {
        try {
          const state = get();
          webStorage.setItem('puzzleedge-settings', JSON.stringify(state));
        } catch (error) {
          console.error('[PuzzleEdge Settings] Error persisting state:', error);
        }
      }
    },
    get,
    api
  );
  return store;
};

// Initialize store with persisted data on web
const getInitialState = () => {
  if (Platform.OS === 'web') {
    try {
      console.log('[PuzzleEdge Settings] Loading persisted settings...');
      const stored = webStorage.getItem('puzzleedge-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[PuzzleEdge Settings] Successfully restored settings');
        return parsed;
      }
    } catch (error) {
      console.error('[PuzzleEdge Settings] Error loading persisted settings:', error);
    }
  }
  return {
    soundEnabled: true,
    preferredDifficulty: 'medium' as Difficulty,
    hintsRemaining: {},
  };
};

const storeImpl = (set: any) => ({
  setSoundEnabled: (enabled: boolean) => {
    set({ soundEnabled: enabled });
  },

  setPreferredDifficulty: (difficulty: Difficulty) => {
    set({ preferredDifficulty: difficulty });
  },

  useHint: (gameType: string) => {
    set((state: SettingsStore) => ({
      hintsRemaining: {
        ...state.hintsRemaining,
        [gameType]: Math.max(0, (state.hintsRemaining[gameType] || 3) - 1),
      },
    }));
  },

  resetHints: (gameType: string) => {
    set((state: SettingsStore) => ({
      hintsRemaining: {
        ...state.hintsRemaining,
        [gameType]: 3,
      },
    }));
  },
});

export const useSettingsStore = create<SettingsStore>()(
  persistMiddleware((set: any) => {
    const initialData = getInitialState();
    return {
      // Initialize data properties with loaded state or defaults
      soundEnabled: initialData.soundEnabled !== undefined ? initialData.soundEnabled : true,
      preferredDifficulty: initialData.preferredDifficulty || ('medium' as Difficulty),
      hintsRemaining: initialData.hintsRemaining || {},
      // Add action methods
      ...storeImpl(set),
    };
  })
);
