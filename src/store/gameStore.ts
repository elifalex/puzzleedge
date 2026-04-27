import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import { GameScore, GameStreak, DailyCompletion } from '../constants/types';
import { BoardSize } from '../data/queensPuzzleLoader';

interface PuzzleCompletion {
  puzzleId: string;
  score: GameScore;
}

interface GameStore {
  dailyCompletions: Record<string, DailyCompletion>;
  streaks: Record<string, GameStreak>;
  scores: Record<string, GameScore[]>;
  completedPuzzles: Record<string, PuzzleCompletion[]>; // key: boardSize (e.g., '6x6')

  // Actions
  markDailyComplete: (gameType: string, date: string, score: GameScore) => void;
  updateStreak: (gameType: string) => void;
  addScore: (gameType: string, score: GameScore) => void;
  getDailyCompletion: (gameType: string, date: string) => DailyCompletion | null;
  markPuzzleComplete: (boardSize: BoardSize, puzzleId: string, score: GameScore) => void;
  isPuzzleCompleted: (boardSize: BoardSize, puzzleId: string) => boolean;
  getCompletedPuzzleIds: (boardSize: BoardSize) => string[];
}

// Custom storage with better error handling and logging
const createWebStorage = (): StateStorage => {
  return {
    getItem: (name: string): string | null => {
      try {
        const value = localStorage.getItem(name);
        if (value) {
          console.log('[PuzzleEdge Storage] Successfully loaded data from localStorage');
        }
        return value;
      } catch (error) {
        console.error('[PuzzleEdge Storage] Error reading from localStorage:', error);
        // Try to fallback to sessionStorage
        try {
          const value = sessionStorage.getItem(name);
          if (value) {
            console.log('[PuzzleEdge Storage] Loaded data from sessionStorage fallback');
          }
          return value;
        } catch (fallbackError) {
          console.error('[PuzzleEdge Storage] SessionStorage fallback also failed:', fallbackError);
          return null;
        }
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        localStorage.setItem(name, value);
        console.log('[PuzzleEdge Storage] Successfully saved data to localStorage');
      } catch (error) {
        console.error('[PuzzleEdge Storage] Error writing to localStorage:', error);
        // Try to fallback to sessionStorage
        try {
          sessionStorage.setItem(name, value);
          console.log('[PuzzleEdge Storage] Saved data to sessionStorage fallback');
        } catch (fallbackError) {
          console.error('[PuzzleEdge Storage] SessionStorage fallback also failed:', fallbackError);
          console.warn('[PuzzleEdge Storage] Your progress may not be saved. Check browser privacy settings.');
        }
      }
    },
    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(name);
        sessionStorage.removeItem(name);
      } catch (error) {
        console.error('[PuzzleEdge Storage] Error removing from storage:', error);
      }
    },
  };
};

const storeImpl = (set: any, get: any) => ({
  dailyCompletions: {},
  streaks: {},
  scores: {},
  completedPuzzles: {},

  markDailyComplete: (gameType: string, date: string, score: GameScore) => {
    set((state: GameStore) => ({
      dailyCompletions: {
        ...state.dailyCompletions,
        [`${gameType}-${date}`]: {
          gameType,
          date,
          completed: true,
          score,
        },
      },
    }));
    get().updateStreak(gameType);
  },

  updateStreak: (gameType: string) => {
    const currentStreak = get().streaks[gameType] || { current: 0, longest: 0, lastPlayed: '' };
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newCurrent = 1;
    if (currentStreak.lastPlayed === yesterday) {
      newCurrent = currentStreak.current + 1;
    } else if (currentStreak.lastPlayed === today) {
      newCurrent = currentStreak.current;
    }

    set((state: GameStore) => ({
      streaks: {
        ...state.streaks,
        [gameType]: {
          current: newCurrent,
          longest: Math.max(newCurrent, currentStreak.longest),
          lastPlayed: today,
        },
      },
    }));
  },

  addScore: (gameType: string, score: GameScore) => {
    set((state: GameStore) => ({
      scores: {
        ...state.scores,
        [gameType]: [...(state.scores[gameType] || []), score],
      },
    }));
  },

  getDailyCompletion: (gameType: string, date: string) => {
    return get().dailyCompletions[`${gameType}-${date}`] || null;
  },

  markPuzzleComplete: (boardSize: BoardSize, puzzleId: string, score: GameScore) => {
    const key = `${boardSize}x${boardSize}`;

    set((state: GameStore) => {
      const existing = state.completedPuzzles[key] || [];

      // Check if already completed
      const alreadyCompleted = existing.some(p => p.puzzleId === puzzleId);

      if (alreadyCompleted) {
        // Update the score
        return {
          completedPuzzles: {
            ...state.completedPuzzles,
            [key]: existing.map(p =>
              p.puzzleId === puzzleId
                ? { ...p, score }
                : p
            ),
          },
        };
      } else {
        // Add new completion
        return {
          completedPuzzles: {
            ...state.completedPuzzles,
            [key]: [...existing, { puzzleId, score }],
          },
        };
      }
    });

    console.log(`[PuzzleEdge] Marked puzzle ${puzzleId} as complete`);
  },

  isPuzzleCompleted: (boardSize: BoardSize, puzzleId: string) => {
    const key = `${boardSize}x${boardSize}`;
    const completions = get().completedPuzzles[key] || [];
    return completions.some(p => p.puzzleId === puzzleId);
  },

  getCompletedPuzzleIds: (boardSize: BoardSize) => {
    const key = `${boardSize}x${boardSize}`;
    const completions = get().completedPuzzles[key] || [];
    return completions.map(p => p.puzzleId);
  },
});

export const useGameStore = create<GameStore>()(
  Platform.OS === 'web'
    ? persist(
        storeImpl,
        {
          name: 'puzzleedge-game-storage',
          storage: createJSONStorage(() => createWebStorage()),
          version: 1,
          // Migrate from old localStorage format if it exists
          migrate: (persistedState: any, version: number) => {
            console.log('[PuzzleEdge Storage] Migrating storage, version:', version);

            // Check for old format data
            try {
              const oldData = localStorage.getItem('puzzleedge-storage');
              if (oldData && !persistedState) {
                console.log('[PuzzleEdge Storage] Found old format data, migrating...');
                const parsed = JSON.parse(oldData);
                return {
                  dailyCompletions: parsed.dailyCompletions || {},
                  streaks: parsed.streaks || {},
                  scores: parsed.scores || {},
                  completedPuzzles: parsed.completedPuzzles || {},
                };
              }
            } catch (error) {
              console.error('[PuzzleEdge Storage] Error migrating old data:', error);
            }

            return persistedState as GameStore;
          },
          onRehydrateStorage: () => {
            console.log('[PuzzleEdge Storage] Starting hydration...');
            return (state, error) => {
              if (error) {
                console.error('[PuzzleEdge Storage] Hydration error:', error);
              } else {
                console.log('[PuzzleEdge Storage] Hydration complete, loaded state:', state);
              }
            };
          },
        }
      )
    : storeImpl
);
