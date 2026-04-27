import { create } from 'zustand';
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

// Enhanced localStorage implementation with better error handling and logging
const webStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name);
      if (value) {
        console.log('[PuzzleEdge Storage] Successfully loaded data from localStorage');
      }
      return value;
    } catch (error) {
      console.error('[PuzzleEdge Storage] Error reading from localStorage:', error);
      console.warn('[PuzzleEdge Storage] This may be due to browser privacy settings (e.g., Safari Private Browsing, Firefox Tracking Protection)');
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
      console.warn('[PuzzleEdge Storage] Your progress may not be saved. Common causes:');
      console.warn('  - Browser in private/incognito mode');
      console.warn('  - Storage quota exceeded');
      console.warn('  - Browser privacy settings blocking storage');
      // Try to fallback to sessionStorage
      try {
        sessionStorage.setItem(name, value);
        console.log('[PuzzleEdge Storage] Saved data to sessionStorage fallback (will persist until tab closes)');
      } catch (fallbackError) {
        console.error('[PuzzleEdge Storage] SessionStorage fallback also failed:', fallbackError);
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
          webStorage.setItem('puzzleedge-storage', JSON.stringify(state));
        } catch (error) {
          console.error('[PuzzleEdge Storage] Error persisting state:', error);
        }
      }
    },
    get,
    api
  );
  return store;
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

// Initialize store with persisted data on web
const getInitialState = () => {
  if (Platform.OS === 'web') {
    try {
      console.log('[PuzzleEdge Storage] Loading persisted data...');
      const stored = webStorage.getItem('puzzleedge-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[PuzzleEdge Storage] Successfully restored previous session data');
        return {
          dailyCompletions: parsed.dailyCompletions || {},
          streaks: parsed.streaks || {},
          scores: parsed.scores || {},
          completedPuzzles: parsed.completedPuzzles || {},
        };
      } else {
        console.log('[PuzzleEdge Storage] No previous session data found, starting fresh');
      }
    } catch (error) {
      console.error('[PuzzleEdge Storage] Error loading persisted data:', error);
    }
  }
  return {};
};

export const useGameStore = create<GameStore>()(
  persistMiddleware((set: any, get: any) => ({
    ...getInitialState(),
    ...storeImpl(set, get),
  }))
);
