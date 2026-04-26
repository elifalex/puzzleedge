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

    // Manual persistence for web
    if (Platform.OS === 'web') {
      webStorage.setItem('puzzleedge-storage', JSON.stringify(get()));
    }
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

    // Manual persistence for web
    if (Platform.OS === 'web') {
      webStorage.setItem('puzzleedge-storage', JSON.stringify(get()));
    }
  },

  addScore: (gameType: string, score: GameScore) => {
    set((state: GameStore) => ({
      scores: {
        ...state.scores,
        [gameType]: [...(state.scores[gameType] || []), score],
      },
    }));

    // Manual persistence for web
    if (Platform.OS === 'web') {
      webStorage.setItem('puzzleedge-storage', JSON.stringify(get()));
    }
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

    // Manual persistence for web
    if (Platform.OS === 'web') {
      webStorage.setItem('puzzleedge-storage', JSON.stringify(get()));
    }
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
      const stored = webStorage.getItem('puzzleedge-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          dailyCompletions: parsed.dailyCompletions || {},
          streaks: parsed.streaks || {},
          scores: parsed.scores || {},
          completedPuzzles: parsed.completedPuzzles || {},
        };
      }
    } catch {
      // Ignore parsing errors
    }
  }
  return {};
};

export const useGameStore = create<GameStore>()((set, get) => ({
  ...getInitialState(),
  ...storeImpl(set, get),
}));
