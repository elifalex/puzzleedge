import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
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

// Custom storage with better error handling and logging
const createWebStorage = (): StateStorage => {
  return {
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
    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(name);
        sessionStorage.removeItem(name);
      } catch (error) {
        console.error('[PuzzleEdge Settings] Error removing from storage:', error);
      }
    },
  };
};

const storeImpl = (set: any) => ({
  soundEnabled: true,
  preferredDifficulty: 'medium' as Difficulty,
  hintsRemaining: {},

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
  Platform.OS === 'web'
    ? persist(
        storeImpl,
        {
          name: 'puzzleedge-settings-storage',
          storage: createJSONStorage(() => createWebStorage()),
          version: 1,
          // Migrate from old localStorage format if it exists
          migrate: (persistedState: any, version: number) => {
            console.log('[PuzzleEdge Settings] Migrating settings, version:', version);

            // Check for old format data
            try {
              const oldData = localStorage.getItem('puzzleedge-settings');
              if (oldData && !persistedState) {
                console.log('[PuzzleEdge Settings] Found old format data, migrating...');
                const parsed = JSON.parse(oldData);
                return {
                  soundEnabled: parsed.soundEnabled !== undefined ? parsed.soundEnabled : true,
                  preferredDifficulty: parsed.preferredDifficulty || 'medium',
                  hintsRemaining: parsed.hintsRemaining || {},
                };
              }
            } catch (error) {
              console.error('[PuzzleEdge Settings] Error migrating old data:', error);
            }

            return persistedState as SettingsStore;
          },
          onRehydrateStorage: () => {
            console.log('[PuzzleEdge Settings] Starting hydration...');
            return (state, error) => {
              if (error) {
                console.error('[PuzzleEdge Settings] Hydration error:', error);
              } else {
                console.log('[PuzzleEdge Settings] Hydration complete');
              }
            };
          },
        }
      )
    : storeImpl
);
