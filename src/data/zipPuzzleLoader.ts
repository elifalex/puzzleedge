/**
 * Zip Puzzle Loader
 * Loads puzzles by board size (5x5, 6x6, 7x7)
 */

import { ZipPuzzle } from '../constants/types';

export interface ZipPuzzleEntry extends ZipPuzzle {
  id: string;
}

export type ZipBoardSize = 5 | 6 | 7;

// Lazy-loaded puzzle data
let puzzles5x5: ZipPuzzleEntry[] | null = null;
let puzzles6x6: ZipPuzzleEntry[] | null = null;
let puzzles7x7: ZipPuzzleEntry[] | null = null;

/**
 * Load puzzles for a specific board size
 */
async function loadPuzzlesForSize(size: ZipBoardSize): Promise<ZipPuzzleEntry[]> {
  const fileName = `puzzles-${size}x${size}.json`;

  try {
    // Add cache-busting timestamp to force fresh data load
    const response = await fetch(`/data/zip/${fileName}?v=${Date.now()}`);
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
export async function getZipPuzzlesBySize(size: ZipBoardSize): Promise<ZipPuzzleEntry[]> {
  switch (size) {
    case 5:
      if (!puzzles5x5) {
        puzzles5x5 = await loadPuzzlesForSize(5);
      }
      return puzzles5x5;

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

    default:
      return [];
  }
}

/**
 * Get a random puzzle for practice mode
 */
export async function getRandomZipPuzzle(size: ZipBoardSize): Promise<ZipPuzzleEntry | null> {
  const puzzles = await getZipPuzzlesBySize(size);
  if (puzzles.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

/**
 * Get puzzle by index (0-based)
 */
export async function getZipPuzzleByIndex(size: ZipBoardSize, index: number): Promise<ZipPuzzleEntry | null> {
  const puzzles = await getZipPuzzlesBySize(size);
  if (index < 0 || index >= puzzles.length) return null;

  return puzzles[index];
}

/**
 * Get puzzle by ID (e.g., "5x5-0042")
 */
export async function getZipPuzzleById(puzzleId: string): Promise<ZipPuzzleEntry | null> {
  const [sizeStr] = puzzleId.split('-');
  const size = parseInt(sizeStr.split('x')[0]) as ZipBoardSize;

  if (![5, 6, 7].includes(size)) return null;

  const puzzles = await getZipPuzzlesBySize(size);
  return puzzles.find(p => p.id === puzzleId) || null;
}

/**
 * Get daily puzzle using deterministic seed
 */
export async function getDailyZipPuzzle(size: ZipBoardSize, seed: number): Promise<ZipPuzzleEntry | null> {
  const puzzles = await getZipPuzzlesBySize(size);
  if (puzzles.length === 0) return null;

  const index = seed % puzzles.length;
  return puzzles[index];
}

/**
 * Get puzzle count for a board size
 */
export async function getZipPuzzleCount(size: ZipBoardSize): Promise<number> {
  const puzzles = await getZipPuzzlesBySize(size);
  return puzzles.length;
}

/**
 * Get all available board sizes
 */
export function getAvailableZipSizes(): ZipBoardSize[] {
  return [5, 6, 7];
}

/**
 * Clear cached puzzles (useful for development/testing)
 */
export function clearZipPuzzleCache(): void {
  puzzles5x5 = null;
  puzzles6x6 = null;
  puzzles7x7 = null;
}
