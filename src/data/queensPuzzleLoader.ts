/**
 * Queens Puzzle Loader
 * Loads puzzles by board size (7x7, 8x8, 9x9)
 */

import { QueensPuzzle } from '../constants/types';

export interface PuzzleEntry extends QueensPuzzle {
  id: string;
}

export type BoardSize = 6 | 7 | 8 | 9;

// Lazy-loaded puzzle data
let puzzles6x6: PuzzleEntry[] | null = null;
let puzzles7x7: PuzzleEntry[] | null = null;
let puzzles8x8: PuzzleEntry[] | null = null;
let puzzles9x9: PuzzleEntry[] | null = null;

/**
 * Load puzzles for a specific board size
 */
async function loadPuzzlesForSize(size: BoardSize): Promise<PuzzleEntry[]> {
  const fileName = `puzzles-${size}x${size}.json`;

  try {
    const response = await fetch(`/data/queens/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading puzzles for ${size}x${size}:`, error);
    return [];
  }
}

/**
 * Get puzzles by board size (cached after first load)
 */
export async function getPuzzlesBySize(size: BoardSize): Promise<PuzzleEntry[]> {
  switch (size) {
    case 6:
      if (!puzzles6x6) {
        puzzles6x6 = await loadPuzzlesForSize(6);
      }
      return puzzles6x6;

    case 7:
      if (!puzzles7x7) {
        puzzles7x7 = await loadPuzzlesForSize(7);
      }
      return puzzles7x7;

    case 8:
      if (!puzzles8x8) {
        puzzles8x8 = await loadPuzzlesForSize(8);
      }
      return puzzles8x8;

    case 9:
      if (!puzzles9x9) {
        puzzles9x9 = await loadPuzzlesForSize(9);
      }
      return puzzles9x9;

    default:
      return [];
  }
}

/**
 * Get a random puzzle for practice mode
 */
export async function getRandomPuzzle(size: BoardSize): Promise<PuzzleEntry | null> {
  const puzzles = await getPuzzlesBySize(size);
  if (puzzles.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

/**
 * Get puzzle by index (0-based)
 */
export async function getPuzzleByIndex(size: BoardSize, index: number): Promise<PuzzleEntry | null> {
  const puzzles = await getPuzzlesBySize(size);
  if (index < 0 || index >= puzzles.length) return null;

  return puzzles[index];
}

/**
 * Get puzzle by ID (e.g., "7x7-0042")
 */
export async function getPuzzleById(puzzleId: string): Promise<PuzzleEntry | null> {
  const [sizeStr] = puzzleId.split('-');
  const size = parseInt(sizeStr.split('x')[0]) as BoardSize;

  if (![6, 7, 8, 9].includes(size)) return null;

  const puzzles = await getPuzzlesBySize(size);
  return puzzles.find(p => p.id === puzzleId) || null;
}

/**
 * Get daily puzzle using deterministic seed
 */
export async function getDailyPuzzle(size: BoardSize, seed: number): Promise<PuzzleEntry | null> {
  const puzzles = await getPuzzlesBySize(size);
  if (puzzles.length === 0) return null;

  const index = seed % puzzles.length;
  return puzzles[index];
}

/**
 * Get puzzle count for a board size
 */
export async function getPuzzleCount(size: BoardSize): Promise<number> {
  const puzzles = await getPuzzlesBySize(size);
  return puzzles.length;
}

/**
 * Get all available board sizes
 */
export function getAvailableSizes(): BoardSize[] {
  return [6, 7, 8, 9];
}
