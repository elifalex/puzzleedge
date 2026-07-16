/**
 * Core type definitions for PuzzleEdge
 */

import { Difficulty } from './gameConfig';

// Puzzle Engine Interface
export interface PuzzleEngine<T> {
  generate(difficulty: Difficulty, seed?: number): T;
  validate(puzzle: T, solution: T): ValidationResult;
  solve(puzzle: T): T;
  getDailySeed(): number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Queens Puzzle Types
export interface QueensPuzzle {
  size: number;
  regions: number[][]; // 2D array, each cell is a region ID (0–N)
  regionColors: string[]; // hex color per region ID
  solution: [number, number][]; // [row, col] per queen
  seed: number;
  difficulty: Difficulty;
}

// Tango Puzzle Types
export interface TangoPuzzle {
  size: number;
  grid: (0 | 1 | null)[][]; // 0=sun, 1=moon, null=empty
  solution: (0 | 1)[][];
  constraints: TangoConstraint[];
  seed: number;
  difficulty: Difficulty;
}

export interface TangoConstraint {
  cell1: [number, number];
  cell2: [number, number];
  type: 'equal' | 'opposite';
}

// Zip Puzzle Types
export interface ZipPuzzle {
  size: number;
  checkpoints: { position: [number, number]; order: number }[];
  walls: ZipWall[]; // walls between cells
  solution: [number, number][]; // ordered cells in solution path
  seed: number;
  difficulty: Difficulty;
}

export interface ZipWall {
  cell: [number, number]; // cell position
  direction: 'right' | 'down'; // wall on right side or bottom side of cell
}

// Game State Types
export interface GameScore {
  time: number; // in milliseconds
  hintsUsed: number;
  completed: boolean;
  date: string; // ISO date string
}

export interface GameStreak {
  current: number;
  longest: number;
  lastPlayed: string; // ISO date string
}

export interface DailyCompletion {
  gameType: string;
  date: string;
  completed: boolean;
  score?: GameScore;
}
