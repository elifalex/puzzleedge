/**
 * Mini Sudoku Validation Functions
 * Provides real-time validation, conflict detection, and candidate calculation
 */

import { MiniSudokuPuzzle } from '../constants/types';

const GRID_SIZE = 6;
const BOX_ROWS = 2;
const BOX_COLS = 3;

/**
 * Get box index for a cell position
 */
function getBoxIndex(row: number, col: number): number {
  const boxRow = Math.floor(row / BOX_ROWS);
  const boxCol = Math.floor(col / BOX_COLS);
  return boxRow * 2 + boxCol;
}

/**
 * Get all cells in the same box as the given cell
 */
export function getCellsInBox(row: number, col: number): [number, number][] {
  const cells: [number, number][] = [];
  const boxRowStart = Math.floor(row / BOX_ROWS) * BOX_ROWS;
  const boxColStart = Math.floor(col / BOX_COLS) * BOX_COLS;

  for (let r = boxRowStart; r < boxRowStart + BOX_ROWS; r++) {
    for (let c = boxColStart; c < boxColStart + BOX_COLS; c++) {
      cells.push([r, c]);
    }
  }

  return cells;
}

/**
 * Check if placing a number at (row, col) is valid
 */
export function isValidPlacement(
  grid: (number | null)[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && grid[row][c] === num) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col] === num) {
      return false;
    }
  }

  // Check 2x3 box
  const boxCells = getCellsInBox(row, col);
  for (const [r, c] of boxCells) {
    if ((r !== row || c !== col) && grid[r][c] === num) {
      return false;
    }
  }

  return true;
}

/**
 * Find all cells that conflict with the given cell
 * Returns array of [row, col] positions that have the same number
 */
export function findConflicts(
  grid: (number | null)[][],
  row: number,
  col: number
): [number, number][] {
  const num = grid[row][col];
  if (num === null) return [];

  const conflicts: [number, number][] = [];

  // Check row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && grid[row][c] === num) {
      conflicts.push([row, c]);
    }
  }

  // Check column
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col] === num) {
      conflicts.push([r, col]);
    }
  }

  // Check box
  const boxCells = getCellsInBox(row, col);
  for (const [r, c] of boxCells) {
    if (r !== row && c !== col && grid[r][c] === num) {
      // Check if not already in conflicts (could be in same row/col)
      if (!conflicts.some(([cr, cc]) => cr === r && cc === c)) {
        conflicts.push([r, c]);
      }
    }
  }

  return conflicts;
}

/**
 * Find all conflicting cells in the entire grid
 * Returns a Set of "row-col" keys for cells with conflicts
 */
export function findAllConflicts(grid: (number | null)[][]): Set<string> {
  const conflictSet = new Set<string>();

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== null) {
        const conflicts = findConflicts(grid, row, col);
        if (conflicts.length > 0) {
          conflictSet.add(`${row}-${col}`);
          conflicts.forEach(([r, c]) => conflictSet.add(`${r}-${c}`));
        }
      }
    }
  }

  return conflictSet;
}

/**
 * Get candidate numbers for a cell (numbers that can be placed)
 */
export function getCandidates(grid: (number | null)[][], row: number, col: number): number[] {
  if (grid[row][col] !== null) return []; // Cell is already filled

  const candidates: number[] = [];

  for (let num = 1; num <= 6; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      candidates.push(num);
    }
  }

  return candidates;
}

/**
 * Check if the puzzle is complete and correct
 */
export function isComplete(grid: (number | null)[][], solution: number[][]): boolean {
  // Check if all cells are filled
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) return false;
      if (grid[r][c] !== solution[r][c]) return false;
    }
  }

  return true;
}

/**
 * Validate a single cell placement
 */
export interface CellValidation {
  isValid: boolean;
  reason?: string;
  conflictingCells?: [number, number][];
}

export function validateCellPlacement(
  puzzle: MiniSudokuPuzzle,
  grid: (number | null)[][],
  row: number,
  col: number,
  num: number
): CellValidation {
  // Check if cell is a given clue (shouldn't be modified)
  if (puzzle.grid[row][col] !== null) {
    return {
      isValid: false,
      reason: 'Cannot modify given clues',
    };
  }

  // Check if number is correct according to solution
  if (puzzle.solution[row][col] !== num) {
    return {
      isValid: false,
      reason: `This cell should be ${puzzle.solution[row][col]}, not ${num}`,
    };
  }

  // Check if placement creates conflicts
  const tempGrid = grid.map(row => [...row]);
  tempGrid[row][col] = num;
  const conflicts = findConflicts(tempGrid, row, col);

  if (conflicts.length > 0) {
    return {
      isValid: false,
      reason: 'This number conflicts with other cells',
      conflictingCells: conflicts,
    };
  }

  return { isValid: true };
}

/**
 * Get all empty cells in the grid
 */
export function getEmptyCells(grid: (number | null)[][]): [number, number][] {
  const emptyCells: [number, number][] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) {
        emptyCells.push([r, c]);
      }
    }
  }

  return emptyCells;
}

/**
 * Find cells with only one candidate (Naked Singles)
 */
export function findNakedSingles(grid: (number | null)[][]): Array<{
  row: number;
  col: number;
  value: number;
}> {
  const nakedSingles: Array<{ row: number; col: number; value: number }> = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) {
        const candidates = getCandidates(grid, r, c);
        if (candidates.length === 1) {
          nakedSingles.push({ row: r, col: c, value: candidates[0] });
        }
      }
    }
  }

  return nakedSingles;
}

/**
 * Find hidden singles in a row, column, or box
 */
export function findHiddenSingles(grid: (number | null)[][]): Array<{
  row: number;
  col: number;
  value: number;
  location: 'row' | 'column' | 'box';
}> {
  const hiddenSingles: Array<{
    row: number;
    col: number;
    value: number;
    location: 'row' | 'column' | 'box';
  }> = [];

  // Check each row
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let num = 1; num <= 6; num++) {
      // Skip if number already in row
      if (grid[row].includes(num)) continue;

      // Find cells in this row where num can go
      const possibleCols: number[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === null && isValidPlacement(grid, row, col, num)) {
          possibleCols.push(col);
        }
      }

      // If only one cell can have this number, it's a hidden single
      if (possibleCols.length === 1) {
        hiddenSingles.push({
          row,
          col: possibleCols[0],
          value: num,
          location: 'row',
        });
      }
    }
  }

  // Check each column
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let num = 1; num <= 6; num++) {
      // Skip if number already in column
      if (grid.some(row => row[col] === num)) continue;

      // Find cells in this column where num can go
      const possibleRows: number[] = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        if (grid[row][col] === null && isValidPlacement(grid, row, col, num)) {
          possibleRows.push(row);
        }
      }

      // If only one cell can have this number, it's a hidden single
      if (possibleRows.length === 1) {
        const row = possibleRows[0];
        // Check if not already found as row hidden single
        if (!hiddenSingles.some(hs => hs.row === row && hs.col === col && hs.value === num)) {
          hiddenSingles.push({
            row,
            col,
            value: num,
            location: 'column',
          });
        }
      }
    }
  }

  // Check each 2x3 box
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 2; boxCol++) {
      const rowStart = boxRow * BOX_ROWS;
      const colStart = boxCol * BOX_COLS;

      for (let num = 1; num <= 6; num++) {
        // Check if number already in box
        let found = false;
        for (let r = rowStart; r < rowStart + BOX_ROWS; r++) {
          for (let c = colStart; c < colStart + BOX_COLS; c++) {
            if (grid[r][c] === num) {
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) continue;

        // Find cells in this box where num can go
        const possibleCells: [number, number][] = [];
        for (let r = rowStart; r < rowStart + BOX_ROWS; r++) {
          for (let c = colStart; c < colStart + BOX_COLS; c++) {
            if (grid[r][c] === null && isValidPlacement(grid, r, c, num)) {
              possibleCells.push([r, c]);
            }
          }
        }

        // If only one cell can have this number, it's a hidden single
        if (possibleCells.length === 1) {
          const [row, col] = possibleCells[0];
          // Check if not already found
          if (!hiddenSingles.some(hs => hs.row === row && hs.col === col && hs.value === num)) {
            hiddenSingles.push({
              row,
              col,
              value: num,
              location: 'box',
            });
          }
        }
      }
    }
  }

  return hiddenSingles;
}
