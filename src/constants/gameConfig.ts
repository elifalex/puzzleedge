/**
 * Game configuration and difficulty settings
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameConfig {
  name: string;
  slug: string;
  description: string;
  difficulty: {
    easy: { gridSize: number; description: string };
    medium: { gridSize: number; description: string };
    hard: { gridSize: number; description: string };
  };
}

export const GAMES_CONFIG: Record<string, GameConfig> = {
  queens: {
    name: 'Queens',
    slug: 'queens',
    description: 'Place one queen per row, column, and colored region. No two queens can touch.',
    difficulty: {
      easy: { gridSize: 7, description: '7x7 grid' },
      medium: { gridSize: 9, description: '9x9 grid' },
      hard: { gridSize: 11, description: '11x11 grid' },
    },
  },
  tango: {
    name: 'Tango',
    slug: 'tango',
    description: 'Fill the grid with suns and moons. No 3 in a row, balanced rows/columns.',
    difficulty: {
      easy: { gridSize: 6, description: '6x6 grid' },
      medium: { gridSize: 8, description: '8x8 grid' },
      hard: { gridSize: 10, description: '10x10 grid' },
    },
  },
  zip: {
    name: 'Zip',
    slug: 'zip',
    description: 'Draw a single path visiting every cell, following numbered checkpoints.',
    difficulty: {
      easy: { gridSize: 5, description: '5x5 grid' },
      medium: { gridSize: 6, description: '6x6 grid' },
      hard: { gridSize: 7, description: '7x7 grid' },
    },
  },
  miniSudoku: {
    name: 'Mini Sudoku',
    slug: 'mini-sudoku',
    description: '6x6 Sudoku with digits 1-6 and 2x3 boxes.',
    difficulty: {
      easy: { gridSize: 6, description: '28 clues' },
      medium: { gridSize: 6, description: '22 clues' },
      hard: { gridSize: 6, description: '16 clues' },
    },
  },
  crossclimb: {
    name: 'Crossclimb',
    slug: 'crossclimb',
    description: 'Word ladder - change one letter per step, unscramble each rung.',
    difficulty: {
      easy: { gridSize: 5, description: '5 rungs' },
      medium: { gridSize: 6, description: '6 rungs' },
      hard: { gridSize: 8, description: '8 rungs' },
    },
  },
};

// Base domain for canonical URLs (update before launch)
export const BASE_URL = 'https://puzzleedge.app';

// Feature flags
export const FEATURES = {
  analytics: true,
  ads: true,
  shareFunction: true,
} as const;
