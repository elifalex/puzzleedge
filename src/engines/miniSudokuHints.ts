/**
 * Mini Sudoku Intelligent Hint System
 * Provides hints based on Sudoku solving techniques
 */

import { MiniSudokuPuzzle } from '../constants/types';
import {
  getCandidates,
  findNakedSingles,
  findHiddenSingles,
  findAllConflicts,
  findConflicts,
} from './miniSudokuValidator';

export interface HintResult {
  message: string;
  highlightCells?: [number, number][]; // Cells to highlight
  highlightNumber?: number; // Number to highlight (for specific techniques)
  type: 'error' | 'naked_single' | 'hidden_single' | 'suggestion' | 'correct_placement';
}

/**
 * Intelligent hint engine for Mini Sudoku
 */
export class MiniSudokuHintEngine {
  /**
   * Get the next logical hint based on current grid state
   * Priority: Wrong Numbers → Conflicts → Correct Placement → Naked Singles → Hidden Singles
   */
  getIntelligentHint(
    puzzle: MiniSudokuPuzzle,
    currentGrid: (number | null)[][]
  ): HintResult | null {
    // Priority 1: Detect incorrectly placed numbers (compare with solution)
    const wrongNumberHint = this.findWrongNumbers(puzzle, currentGrid);
    if (wrongNumberHint) return wrongNumberHint;

    // Priority 2: Detect conflicts (same number in row/column/box)
    const conflictHint = this.findConflictHint(currentGrid);
    if (conflictHint) return conflictHint;

    // Priority 3: Suggest correct placement from solution (solution-aware)
    const correctPlacementHint = this.suggestCorrectPlacement(puzzle, currentGrid);
    if (correctPlacementHint) return correctPlacementHint;

    // Priority 4: Find naked singles (cells with only one candidate)
    const nakedSingleHint = this.findNakedSingleHint(currentGrid);
    if (nakedSingleHint) return nakedSingleHint;

    // Priority 5: Find hidden singles (only one place for a number in row/col/box)
    const hiddenSingleHint = this.findHiddenSingleHint(currentGrid);
    if (hiddenSingleHint) return hiddenSingleHint;

    // No hints available (puzzle might be complete)
    return {
      message: 'Continue filling cells using logical deduction. Look for cells with limited options.',
      type: 'suggestion',
    };
  }

  /**
   * Priority 1: Find incorrectly placed numbers
   */
  private findWrongNumbers(
    puzzle: MiniSudokuPuzzle,
    grid: (number | null)[][]
  ): HintResult | null {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const userValue = grid[row][col];
        const correctValue = puzzle.solution[row][col];

        // Skip empty cells and given clues
        if (userValue === null || puzzle.grid[row][col] !== null) continue;

        // Check if user's number is wrong
        if (userValue !== correctValue) {
          return {
            message: `Cell at row ${row + 1}, column ${col + 1} contains ${userValue} but should be ${correctValue}. Remove it and try again.`,
            highlightCells: [[row, col]],
            type: 'error',
          };
        }
      }
    }

    return null;
  }

  /**
   * Priority 2: Find conflicts (rule violations)
   */
  private findConflictHint(grid: (number | null)[][]): HintResult | null {
    const conflicts = findAllConflicts(grid);

    if (conflicts.size > 0) {
      // Get first conflict cell
      const firstConflict = Array.from(conflicts)[0];
      const [row, col] = firstConflict.split('-').map(Number);
      const conflictingCells = findConflicts(grid, row, col);

      return {
        message: `The number ${grid[row][col]} at row ${row + 1}, column ${col + 1} conflicts with other cells. Each row, column, and 2×3 box must contain 1-6 exactly once.`,
        highlightCells: [[row, col], ...conflictingCells],
        type: 'error',
      };
    }

    return null;
  }

  /**
   * Priority 3: Suggest correct placement (solution-aware, but only when logically deducible)
   */
  private suggestCorrectPlacement(
    puzzle: MiniSudokuPuzzle,
    grid: (number | null)[][]
  ): HintResult | null {
    // Find cells with fewest candidates (most constrained)
    interface CellOption {
      row: number;
      col: number;
      candidates: number[];
      correctValue: number;
    }

    const cellOptions: CellOption[] = [];

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        // Skip filled cells and given clues
        if (grid[row][col] !== null || puzzle.grid[row][col] !== null) continue;

        const candidates = getCandidates(grid, row, col);
        const correctValue = puzzle.solution[row][col];

        // Only include cells where:
        // 1. There's exactly one candidate, AND
        // 2. That candidate is the correct value from the solution
        if (candidates.length === 1 && candidates[0] === correctValue) {
          cellOptions.push({ row, col, candidates, correctValue });
        }
      }
    }

    // Sort by fewest candidates first (all will be 1, but keep for consistency)
    cellOptions.sort((a, b) => a.candidates.length - b.candidates.length);

    if (cellOptions.length > 0) {
      const best = cellOptions[0];

      const reasoning = `Cell at row ${best.row + 1}, column ${best.col + 1} can only be ${best.correctValue}. After eliminating impossible numbers based on the current board, this is the only option.`;

      return {
        message: reasoning,
        highlightCells: [[best.row, best.col]],
        highlightNumber: best.correctValue,
        type: 'correct_placement',
      };
    }

    return null;
  }

  /**
   * Priority 4: Find naked singles (cells with only one candidate)
   */
  private findNakedSingleHint(grid: (number | null)[][]): HintResult | null {
    const nakedSingles = findNakedSingles(grid);

    if (nakedSingles.length > 0) {
      const { row, col, value } = nakedSingles[0];

      return {
        message: `Cell at row ${row + 1}, column ${col + 1} can only be ${value}. After eliminating impossible numbers, this is the only option for this cell.`,
        highlightCells: [[row, col]],
        highlightNumber: value,
        type: 'naked_single',
      };
    }

    return null;
  }

  /**
   * Priority 5: Find hidden singles
   */
  private findHiddenSingleHint(grid: (number | null)[][]): HintResult | null {
    const hiddenSingles = findHiddenSingles(grid);

    if (hiddenSingles.length > 0) {
      const { row, col, value, location } = hiddenSingles[0];

      let locationText = '';
      if (location === 'row') {
        locationText = `row ${row + 1}`;
      } else if (location === 'column') {
        locationText = `column ${col + 1}`;
      } else {
        const boxRow = Math.floor(row / 2) + 1;
        const boxCol = Math.floor(col / 3) + 1;
        locationText = `2×3 box at row ${boxRow}, column ${boxCol}`;
      }

      return {
        message: `In ${locationText}, the number ${value} can only go in cell at row ${row + 1}, column ${col + 1}. This is the only cell in that ${location} where ${value} fits.`,
        highlightCells: [[row, col]],
        highlightNumber: value,
        type: 'hidden_single',
      };
    }

    return null;
  }
}

// Export singleton instance
export const miniSudokuHintEngine = new MiniSudokuHintEngine();
