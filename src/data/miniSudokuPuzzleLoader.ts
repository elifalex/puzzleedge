/**
 * Mini Sudoku Puzzle Loader
 * Loads pre-generated puzzles from JSON files
 */

import { MiniSudokuPuzzle, Difficulty } from '../constants/types';

// In-memory cache for puzzles
let easyPuzzles: MiniSudokuPuzzle[] | null = null;
let mediumPuzzles: MiniSudokuPuzzle[] | null = null;
let hardPuzzles: MiniSudokuPuzzle[] | null = null;

/**
 * Load puzzles from JSON file
 */
async function loadPuzzleFile(difficulty: Difficulty): Promise<MiniSudokuPuzzle[]> {
  const fileName = `puzzles-${difficulty}.json`;
  const response = await fetch(`/data/mini-sudoku/${fileName}`);

  if (!response.ok) {
    throw new Error(`Failed to load ${fileName}: ${response.statusText}`);
  }

  const puzzles = await response.json();

  // Add difficulty field to each puzzle (not stored in JSON to reduce file size)
  return puzzles.map((p: any) => ({
    ...p,
    size: 6,
    difficulty,
  }));
}

/**
 * Get all puzzles for a difficulty (cached)
 */
async function getPuzzlesForDifficulty(difficulty: Difficulty): Promise<MiniSudokuPuzzle[]> {
  switch (difficulty) {
    case 'easy':
      if (!easyPuzzles) {
        easyPuzzles = await loadPuzzleFile('easy');
      }
      return easyPuzzles;
    case 'medium':
      if (!mediumPuzzles) {
        mediumPuzzles = await loadPuzzleFile('medium');
      }
      return mediumPuzzles;
    case 'hard':
      if (!hardPuzzles) {
        hardPuzzles = await loadPuzzleFile('hard');
      }
      return hardPuzzles;
    default:
      throw new Error(`Unknown difficulty: ${difficulty}`);
  }
}

/**
 * Get a random puzzle for the given difficulty
 */
export async function getRandomPuzzle(difficulty: Difficulty): Promise<MiniSudokuPuzzle | null> {
  try {
    const puzzles = await getPuzzlesForDifficulty(difficulty);

    if (puzzles.length === 0) {
      console.error(`No puzzles available for difficulty: ${difficulty}`);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * puzzles.length);
    return puzzles[randomIndex];
  } catch (error) {
    console.error('Error loading random puzzle:', error);
    return null;
  }
}

/**
 * Get a specific puzzle by index (for deterministic daily puzzles)
 */
export async function getPuzzleByIndex(
  difficulty: Difficulty,
  index: number
): Promise<MiniSudokuPuzzle | null> {
  try {
    const puzzles = await getPuzzlesForDifficulty(difficulty);

    if (puzzles.length === 0) {
      console.error(`No puzzles available for difficulty: ${difficulty}`);
      return null;
    }

    // Wrap around if index exceeds puzzle count
    const safeIndex = index % puzzles.length;
    return puzzles[safeIndex];
  } catch (error) {
    console.error('Error loading puzzle by index:', error);
    return null;
  }
}

/**
 * Get daily puzzle using a seed to deterministically select a puzzle
 */
export async function getDailyPuzzle(
  difficulty: Difficulty,
  seed: number
): Promise<MiniSudokuPuzzle | null> {
  try {
    const puzzles = await getPuzzlesForDifficulty(difficulty);

    if (puzzles.length === 0) {
      console.error(`No puzzles available for difficulty: ${difficulty}`);
      return null;
    }

    // Use seed to deterministically select a puzzle
    const index = seed % puzzles.length;
    return puzzles[index];
  } catch (error) {
    console.error('Error loading daily puzzle:', error);
    return null;
  }
}

/**
 * Get total count of puzzles for a difficulty
 */
export async function getPuzzleCount(difficulty: Difficulty): Promise<number> {
  try {
    const puzzles = await getPuzzlesForDifficulty(difficulty);
    return puzzles.length;
  } catch (error) {
    console.error('Error getting puzzle count:', error);
    return 0;
  }
}
