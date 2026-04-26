/**
 * Queens Puzzle Validator
 * Ensures puzzles have unique solutions and validates user placements
 */

import { QueensPuzzle } from '../constants/types';

/**
 * Check if a queen placement is valid (no adjacent queens, same row/col/region)
 */
function isValidPlacement(
  existingQueens: [number, number][],
  row: number,
  col: number,
  regions: number[][]
): boolean {
  const region = regions[row][col];

  for (const [qRow, qCol] of existingQueens) {
    // Check same row or column
    if (qRow === row || qCol === col) {
      return false;
    }

    // Check same region
    if (regions[qRow][qCol] === region) {
      return false;
    }

    // Check if adjacent (including diagonals)
    const rowDiff = Math.abs(row - qRow);
    const colDiff = Math.abs(col - qCol);
    if (rowDiff <= 1 && colDiff <= 1) {
      return false;
    }
  }

  return true;
}

/**
 * Count all possible solutions for a puzzle using backtracking
 * Returns early if more than 1 solution is found
 */
export function countSolutions(puzzle: QueensPuzzle, maxCount: number = 2): number {
  const { size, regions } = puzzle;
  let solutionCount = 0;

  function backtrack(
    row: number,
    placedQueens: [number, number][],
    usedCols: Set<number>,
    usedRegions: Set<number>
  ): void {
    // Early exit if we already found multiple solutions
    if (solutionCount >= maxCount) {
      return;
    }

    // Base case: all queens placed
    if (row === size) {
      solutionCount++;
      return;
    }

    // Try each column in this row
    for (let col = 0; col < size; col++) {
      const region = regions[row][col];

      // Check if this placement is valid
      if (
        !usedCols.has(col) &&
        !usedRegions.has(region) &&
        isValidPlacement(placedQueens, row, col, regions)
      ) {
        // Place queen
        placedQueens.push([row, col]);
        usedCols.add(col);
        usedRegions.add(region);

        // Recursively try to place remaining queens
        backtrack(row + 1, placedQueens, usedCols, usedRegions);

        // Backtrack: remove queen and try next column
        placedQueens.pop();
        usedCols.delete(col);
        usedRegions.delete(region);

        // Early exit if we found enough solutions
        if (solutionCount >= maxCount) {
          return;
        }
      }
    }
  }

  backtrack(0, [], new Set(), new Set());
  return solutionCount;
}

/**
 * Check if a puzzle has exactly one unique solution
 */
export function hasUniqueSolution(puzzle: QueensPuzzle): boolean {
  const count = countSolutions(puzzle, 2); // Only need to count up to 2
  return count === 1;
}

/**
 * Check if current queen placements can lead to a solution
 */
export function canCompletePuzzle(
  puzzle: QueensPuzzle,
  placedQueens: [number, number][]
): boolean {
  const { size, regions } = puzzle;

  // Build sets of used rows, columns, and regions
  const usedRows = new Set(placedQueens.map(([r]) => r));
  const usedCols = new Set(placedQueens.map(([, c]) => c));
  const usedRegions = new Set(placedQueens.map(([r, c]) => regions[r][c]));

  // Try to complete the puzzle from current state
  function backtrack(
    row: number,
    queens: [number, number][],
    cols: Set<number>,
    regs: Set<number>
  ): boolean {
    // Success: all queens placed
    if (queens.length === size) {
      return true;
    }

    // Try next available row
    while (row < size && usedRows.has(row)) {
      row++;
    }

    if (row >= size) {
      return false;
    }

    // Try each column in this row
    for (let col = 0; col < size; col++) {
      const region = regions[row][col];

      if (
        !cols.has(col) &&
        !regs.has(region) &&
        isValidPlacement(queens, row, col, regions)
      ) {
        // Place queen
        queens.push([row, col]);
        cols.add(col);
        regs.add(region);

        // Recursively try to complete
        if (backtrack(row + 1, queens, cols, regs)) {
          return true;
        }

        // Backtrack
        queens.pop();
        cols.delete(col);
        regs.delete(region);
      }
    }

    return false;
  }

  // Start from first unused row
  let startRow = 0;
  while (startRow < size && usedRows.has(startRow)) {
    startRow++;
  }

  return backtrack(startRow, [...placedQueens], usedCols, usedRegions);
}

/**
 * Get color name from hex code
 */
function getColorName(hexColor: string): string {
  const colorMap: Record<string, string> = {
    '#FFB6C1': 'pink',
    '#FFE4E1': 'light pink',
    '#87CEEB': 'blue',
    '#E0BBE4': 'purple',
    '#98FB98': 'green',
    '#FFDAB9': 'peach',
    '#FFD700': 'yellow',
    '#DDA0DD': 'plum',
    '#FFA07A': 'coral',
    '#87CEFA': 'light blue',
    '#F0E68C': 'khaki',
    '#E6E6FA': 'lavender',
    '#B0E0E6': 'powder blue',
  };
  return colorMap[hexColor] || 'colored';
}

/**
 * Analyze WHY a placement makes the puzzle unsolvable
 */
function analyzeUnsolvableReason(
  puzzle: QueensPuzzle,
  placedQueens: [number, number][],
  newQueen: [number, number]
): string {
  const { size, regions, regionColors } = puzzle;
  const [newRow, newCol] = newQueen;
  const allQueens = [...placedQueens, newQueen];

  const usedRows = new Set(allQueens.map(([r]) => r));
  const usedCols = new Set(allQueens.map(([, c]) => c));
  const usedRegions = new Set(allQueens.map(([r, c]) => regions[r][c]));

  // Find regions with limited row span that are now blocked
  for (let regionId = 0; regionId < size; regionId++) {
    if (usedRegions.has(regionId)) continue;

    const regionRows = new Set<number>();
    const regionCells: [number, number][] = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (regions[r][c] === regionId) {
          regionRows.add(r);
          regionCells.push([r, c]);
        }
      }
    }

    // Check if all possible rows for this region are now blocked
    const availableRows = Array.from(regionRows).filter(r => !usedRows.has(r));

    if (availableRows.length === 0 && regionRows.size > 0) {
      const colorName = getColorName(regionColors[regionId]);
      const rowList = Array.from(regionRows).map(r => r + 1).join(', ');

      return `The ${colorName} region can only place its queen on rows ${rowList}, but all these rows are now occupied. Try a different placement.`;
    }

    // Check if region has valid cells remaining
    let hasValidCell = false;
    for (const [r, c] of regionCells) {
      if (!usedRows.has(r) && !usedCols.has(c) && isValidPlacement(allQueens.filter(([qr, qc]) => !(qr === newRow && qc === newCol)), r, c, regions)) {
        hasValidCell = true;
        break;
      }
    }

    if (!hasValidCell && regionCells.length > 0) {
      const colorName = getColorName(regionColors[regionId]);
      return `The ${colorName} region has no valid cells remaining after this placement. All its cells are blocked by queens or conflicts.`;
    }
  }

  // Generic message if we can't determine specific reason
  return `This placement makes the puzzle impossible to complete. Try a different location.`;
}

/**
 * Validate a user's queen placement
 */
export interface PlacementValidation {
  isValid: boolean;
  reason?: string;
  type?: 'conflict' | 'unsolvable' | 'wrong_solution';
}

export function validateQueenPlacement(
  puzzle: QueensPuzzle,
  placedQueens: [number, number][],
  newQueen: [number, number]
): PlacementValidation {
  const [newRow, newCol] = newQueen;
  const { regions, solution } = puzzle;

  // Check 1: Rule violations (conflicts with existing queens)
  for (const [qRow, qCol] of placedQueens) {
    // Same row
    if (qRow === newRow) {
      return {
        isValid: false,
        reason: `Each row can only have one queen. Row ${newRow + 1} already has a queen.`,
        type: 'conflict',
      };
    }

    // Same column
    if (qCol === newCol) {
      return {
        isValid: false,
        reason: `Each column can only have one queen. Column ${newCol + 1} already has a queen.`,
        type: 'conflict',
      };
    }

    // Same region
    const newRegion = regions[newRow][newCol];
    const existingRegion = regions[qRow][qCol];
    if (newRegion === existingRegion) {
      return {
        isValid: false,
        reason: `Each colored region can only have one queen. This region already has a queen.`,
        type: 'conflict',
      };
    }

    // Adjacent (including diagonals)
    const rowDiff = Math.abs(newRow - qRow);
    const colDiff = Math.abs(newCol - qCol);
    if (rowDiff <= 1 && colDiff <= 1) {
      return {
        isValid: false,
        reason: `Queens cannot touch each other, even diagonally. This queen is adjacent to another queen.`,
        type: 'conflict',
      };
    }
  }

  // All basic constraints are satisfied - placement is valid
  // We don't check if it matches the solution because users should be allowed to explore
  return { isValid: true };
}

/**
 * Get all valid cells in a region that hasn't been used yet
 */
export function getValidCellsInRegion(
  puzzle: QueensPuzzle,
  regionId: number,
  placedQueens: [number, number][],
  markedCells: Set<string>
): [number, number][] {
  const { size, regions } = puzzle;
  const validCells: [number, number][] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (regions[r][c] === regionId) {
        const cellKey = `${r}-${c}`;

        // Skip if already marked or has a queen
        if (markedCells.has(cellKey)) continue;
        if (placedQueens.some(([qr, qc]) => qr === r && qc === c)) continue;

        // Check if valid placement
        if (isValidPlacement(placedQueens, r, c, regions)) {
          validCells.push([r, c]);
        }
      }
    }
  }

  return validCells;
}
