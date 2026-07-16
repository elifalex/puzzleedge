/**
 * Zip Puzzle Hint Engine
 * Provides intelligent hints with visual path animation
 */

import { ZipPuzzle } from '../constants/types';
import { validateZipPath } from './zipValidator';

export interface ZipHint {
  message: string;
  pathSegment: [number, number][]; // cells to highlight (animated path from current to next N cells)
  highlightCells?: [number, number][]; // additional cells to highlight
}

/**
 * Get an intelligent hint for the current puzzle state
 */
export function getZipHint(
  puzzle: ZipPuzzle,
  currentPath: [number, number][]
): ZipHint | null {
  // If puzzle is complete, no hint needed
  const validation = validateZipPath(puzzle, currentPath);
  if (validation.isComplete) {
    return null;
  }

  // If there are conflicts, suggest fixing them first
  if (validation.conflicts.size > 0) {
    return {
      message: validation.message || 'Fix the highlighted errors first',
      pathSegment: [],
      highlightCells: Array.from(validation.conflicts).map(key => {
        const [r, c] = key.split(',').map(Number);
        return [r, c] as [number, number];
      }),
    };
  }

  // If path is empty, suggest starting at checkpoint 1
  if (currentPath.length === 0) {
    const checkpoint1 = puzzle.checkpoints.find(cp => cp.order === 1);
    if (checkpoint1) {
      return {
        message: 'Start by tapping checkpoint 1',
        pathSegment: [checkpoint1.position],
        highlightCells: [checkpoint1.position],
      };
    }
  }

  // Show next 3-5 cells from the solution
  const nextCellsCount = 3;
  const currentIndex = currentPath.length;
  const nextCells: [number, number][] = [];

  for (let i = currentIndex; i < Math.min(currentIndex + nextCellsCount, puzzle.solution.length); i++) {
    nextCells.push(puzzle.solution[i]);
  }

  // Check if next segment includes a checkpoint
  const nextCheckpoint = puzzle.checkpoints.find(cp => {
    return nextCells.some(([r, c]) => r === cp.position[0] && c === cp.position[1]);
  });

  let message = 'Follow the highlighted path';
  if (nextCheckpoint) {
    message = `Continue toward checkpoint ${nextCheckpoint.order}`;
  }

  return {
    message,
    pathSegment: nextCells,
    highlightCells: nextCells,
  };
}

/**
 * Get the next single step in the solution
 */
export function getNextStep(
  puzzle: ZipPuzzle,
  currentPath: [number, number][]
): [number, number] | null {
  if (currentPath.length >= puzzle.solution.length) {
    return null; // Already complete
  }

  return puzzle.solution[currentPath.length];
}

/**
 * Check if current path matches solution up to current point
 */
export function isPathCorrect(
  puzzle: ZipPuzzle,
  currentPath: [number, number][]
): boolean {
  if (currentPath.length > puzzle.solution.length) {
    return false;
  }

  for (let i = 0; i < currentPath.length; i++) {
    const [r1, c1] = currentPath[i];
    const [r2, c2] = puzzle.solution[i];

    if (r1 !== r2 || c1 !== c2) {
      return false;
    }
  }

  return true;
}

/**
 * Find where the user's path diverges from the solution
 */
export function findDivergencePoint(
  puzzle: ZipPuzzle,
  currentPath: [number, number][]
): number | null {
  for (let i = 0; i < Math.min(currentPath.length, puzzle.solution.length); i++) {
    const [r1, c1] = currentPath[i];
    const [r2, c2] = puzzle.solution[i];

    if (r1 !== r2 || c1 !== c2) {
      return i; // Index where divergence occurs
    }
  }

  return null; // No divergence yet
}
