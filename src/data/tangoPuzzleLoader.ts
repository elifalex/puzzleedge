/**
 * Tango Puzzle Loader
 * Loads puzzles by difficulty (easy, medium, hard)
 */

import { TangoPuzzle } from '../constants/types';
import { Difficulty } from '../constants/gameConfig';

export interface TangoPuzzleEntry extends TangoPuzzle {
  id: string;
}

// Lazy-loaded puzzle data
let puzzlesEasy: TangoPuzzleEntry[] | null = null;
let puzzlesMedium: TangoPuzzleEntry[] | null = null;
let puzzlesHard: TangoPuzzleEntry[] | null = null;

/**
 * Load puzzles for a specific difficulty
 */
async function loadPuzzlesForDifficulty(difficulty: Difficulty): Promise<TangoPuzzleEntry[]> {
  const fileName = `puzzles-${difficulty}.json`;

  try {
    const response = await fetch(`/data/tango/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading puzzles for ${difficulty}:`, error);
    return [];
  }
}

/**
 * Get puzzles by difficulty (cached after first load)
 */
export async function getPuzzlesByDifficulty(difficulty: Difficulty): Promise<TangoPuzzleEntry[]> {
  switch (difficulty) {
    case 'easy':
      if (!puzzlesEasy) {
        puzzlesEasy = await loadPuzzlesForDifficulty('easy');
      }
      return puzzlesEasy;

    case 'medium':
      if (!puzzlesMedium) {
        puzzlesMedium = await loadPuzzlesForDifficulty('medium');
      }
      return puzzlesMedium;

    case 'hard':
      if (!puzzlesHard) {
        puzzlesHard = await loadPuzzlesForDifficulty('hard');
      }
      return puzzlesHard;

    default:
      return [];
  }
}

/**
 * Get a random puzzle for practice mode
 */
export async function getRandomPuzzle(difficulty: Difficulty): Promise<TangoPuzzleEntry | null> {
  const puzzles = await getPuzzlesByDifficulty(difficulty);
  if (puzzles.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

/**
 * Get puzzle by index (0-based)
 */
export async function getPuzzleByIndex(difficulty: Difficulty, index: number): Promise<TangoPuzzleEntry | null> {
  const puzzles = await getPuzzlesByDifficulty(difficulty);
  if (index < 0 || index >= puzzles.length) return null;

  return puzzles[index];
}

/**
 * Get puzzle by ID (e.g., "tango-easy-1042")
 */
export async function getPuzzleById(puzzleId: string): Promise<TangoPuzzleEntry | null> {
  // Extract difficulty from ID (format: "tango-{difficulty}-{seed}")
  const parts = puzzleId.split('-');
  if (parts.length < 3 || parts[0] !== 'tango') return null;

  const difficulty = parts[1] as Difficulty;
  if (!['easy', 'medium', 'hard'].includes(difficulty)) return null;

  const puzzles = await getPuzzlesByDifficulty(difficulty);
  return puzzles.find(p => p.id === puzzleId) || null;
}

/**
 * Get daily puzzle using deterministic seed
 */
export async function getDailyPuzzle(difficulty: Difficulty, seed: number): Promise<TangoPuzzleEntry | null> {
  const puzzles = await getPuzzlesByDifficulty(difficulty);
  if (puzzles.length === 0) return null;

  const index = seed % puzzles.length;
  return puzzles[index];
}

/**
 * Get puzzle count for a difficulty level
 */
export async function getPuzzleCount(difficulty: Difficulty): Promise<number> {
  const puzzles = await getPuzzlesByDifficulty(difficulty);
  return puzzles.length;
}

/**
 * Get all available difficulty levels
 */
export function getAvailableDifficulties(): Difficulty[] {
  return ['easy', 'medium', 'hard'];
}

/**
 * Get total puzzle count across all difficulties
 */
export async function getTotalPuzzleCount(): Promise<number> {
  const easyCount = await getPuzzleCount('easy');
  const mediumCount = await getPuzzleCount('medium');
  const hardCount = await getPuzzleCount('hard');
  return easyCount + mediumCount + hardCount;
}
