/**
 * Zip Puzzle Validator
 * Validates user's path against puzzle rules
 */

import { ZipPuzzle } from '../constants/types';

export interface ZipValidationResult {
  isValid: boolean;
  isComplete: boolean;
  conflicts: Set<string>; // cell keys that have errors
  message?: string;
}

/**
 * Validate the current path state
 */
export function validateZipPath(
  puzzle: ZipPuzzle,
  currentPath: [number, number][]
): ZipValidationResult {
  const conflicts = new Set<string>();
  let message: string | undefined;

  // If path is empty, it's valid but not complete
  if (currentPath.length === 0) {
    return { isValid: true, isComplete: false, conflicts };
  }

  // Check for duplicate cells in path
  const visitedCells = new Set<string>();
  for (let i = 0; i < currentPath.length; i++) {
    const [row, col] = currentPath[i];
    const key = `${row},${col}`;

    if (visitedCells.has(key)) {
      conflicts.add(key);
      message = 'Path cannot cross itself';
    }
    visitedCells.add(key);
  }

  // Check if path movements are valid (only horizontal/vertical, one cell at a time)
  for (let i = 0; i < currentPath.length - 1; i++) {
    const [r1, c1] = currentPath[i];
    const [r2, c2] = currentPath[i + 1];

    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);

    // Must move exactly one cell horizontally or vertically
    if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
      conflicts.add(`${r1},${c1}`);
      conflicts.add(`${r2},${c2}`);
      message = 'Path must move one cell at a time';
    }
  }

  // Check if path crosses any walls
  for (let i = 0; i < currentPath.length - 1; i++) {
    const [r1, c1] = currentPath[i];
    const [r2, c2] = currentPath[i + 1];

    for (const wall of puzzle.walls) {
      const [wr, wc] = wall.cell;

      if (wall.direction === 'right') {
        // Wall between (wr, wc) and (wr, wc+1)
        if ((r1 === wr && c1 === wc && r2 === wr && c2 === wc + 1) ||
            (r1 === wr && c1 === wc + 1 && r2 === wr && c2 === wc)) {
          conflicts.add(`${r1},${c1}`);
          conflicts.add(`${r2},${c2}`);
          message = 'Path cannot cross walls';
        }
      } else if (wall.direction === 'down') {
        // Wall between (wr, wc) and (wr+1, wc)
        if ((r1 === wr && c1 === wc && r2 === wr + 1 && c2 === wc) ||
            (r1 === wr + 1 && c1 === wc && r2 === wr && c2 === wc)) {
          conflicts.add(`${r1},${c1}`);
          conflicts.add(`${r2},${c2}`);
          message = 'Path cannot cross walls';
        }
      }
    }
  }

  // Check checkpoint order
  const checkpointsPassed: number[] = [];
  for (const [row, col] of currentPath) {
    const checkpoint = puzzle.checkpoints.find(
      cp => cp.position[0] === row && cp.position[1] === col
    );

    if (checkpoint) {
      checkpointsPassed.push(checkpoint.order);

      // Check if checkpoints are in order
      if (checkpointsPassed.length > 1) {
        const prev = checkpointsPassed[checkpointsPassed.length - 2];
        const curr = checkpointsPassed[checkpointsPassed.length - 1];

        if (curr !== prev + 1) {
          conflicts.add(`${row},${col}`);
          message = `Must pass through checkpoint ${prev + 1} first`;
        }
      } else {
        // First checkpoint must be #1
        if (checkpoint.order !== 1) {
          conflicts.add(`${row},${col}`);
          message = 'Must start at checkpoint 1';
        }
      }
    }
  }

  // Check if complete
  const isComplete =
    currentPath.length === puzzle.size * puzzle.size &&
    checkpointsPassed.length === puzzle.checkpoints.length &&
    conflicts.size === 0;

  const isValid = conflicts.size === 0;

  return { isValid, isComplete, conflicts, message };
}

/**
 * Check if puzzle is complete (all cells visited, all checkpoints in order)
 */
export function isZipPuzzleComplete(
  puzzle: ZipPuzzle,
  currentPath: [number, number][]
): boolean {
  const validation = validateZipPath(puzzle, currentPath);
  return validation.isComplete;
}

/**
 * Get cells adjacent to a given cell (no diagonals)
 */
export function getAdjacentCells(
  row: number,
  col: number,
  size: number
): [number, number][] {
  const adjacent: [number, number][] = [];

  if (row > 0) adjacent.push([row - 1, col]); // up
  if (row < size - 1) adjacent.push([row + 1, col]); // down
  if (col > 0) adjacent.push([row, col - 1]); // left
  if (col < size - 1) adjacent.push([row, col + 1]); // right

  return adjacent;
}

/**
 * Check if two cells are adjacent (no wall between them)
 */
export function canMoveBetweenCells(
  from: [number, number],
  to: [number, number],
  puzzle: ZipPuzzle
): boolean {
  const [r1, c1] = from;
  const [r2, c2] = to;

  // Check if cells are adjacent
  const rowDiff = Math.abs(r1 - r2);
  const colDiff = Math.abs(c1 - c2);

  if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
    return false; // Not adjacent
  }

  // Check if there's a wall between them
  for (const wall of puzzle.walls) {
    const [wr, wc] = wall.cell;

    if (wall.direction === 'right') {
      // Wall between (wr, wc) and (wr, wc+1)
      if ((r1 === wr && c1 === wc && r2 === wr && c2 === wc + 1) ||
          (r1 === wr && c1 === wc + 1 && r2 === wr && c2 === wc)) {
        return false; // Wall blocks movement
      }
    } else if (wall.direction === 'down') {
      // Wall between (wr, wc) and (wr+1, wc)
      if ((r1 === wr && c1 === wc && r2 === wr + 1 && c2 === wc) ||
          (r1 === wr + 1 && c1 === wc && r2 === wr && c2 === wc)) {
        return false; // Wall blocks movement
      }
    }
  }

  return true;
}
