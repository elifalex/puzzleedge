/**
 * Mini Sudoku Puzzle Engine
 * Generates 6x6 Sudoku puzzles with 2x3 boxes
 * Rules: Each row, column, and 2x3 box must contain digits 1-6 exactly once
 */

import { Difficulty } from '../constants/gameConfig';
import { MiniSudokuPuzzle, PuzzleEngine, ValidationResult } from '../constants/types';

// Mulberry32 PRNG - Fast and deterministic seeded random number generator
function mulberry32(seed: number) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffle array using seeded random
function shuffleArray<T>(array: T[], random: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

class MiniSudokuEngine implements PuzzleEngine<MiniSudokuPuzzle> {
  private readonly GRID_SIZE = 6;
  private readonly BOX_ROWS = 2;
  private readonly BOX_COLS = 3;

  /**
   * Generate a deterministic daily seed from current date
   */
  getDailySeed(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return year * 10000 + month * 100 + day;
  }

  /**
   * Map difficulty to number of clues
   */
  private difficultyToClueCount(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy':
        return 18; // More clues = easier (50% filled, 18 cells to solve)
      case 'medium':
        return 14; // Moderate clues (39% filled, 22 cells to solve)
      case 'hard':
        return 11; // Fewer clues = harder (31% filled, 25 cells to solve)
      default:
        return 14;
    }
  }

  /**
   * Get box index for a cell position
   */
  private getBoxIndex(row: number, col: number): number {
    const boxRow = Math.floor(row / this.BOX_ROWS);
    const boxCol = Math.floor(col / this.BOX_COLS);
    return boxRow * 2 + boxCol; // 0-5 (6 boxes total)
  }

  /**
   * Check if value is valid in position (row, col)
   */
  private isValid(grid: (number | null)[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let c = 0; c < this.GRID_SIZE; c++) {
      if (grid[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < this.GRID_SIZE; r++) {
      if (grid[r][col] === num) return false;
    }

    // Check 2x3 box
    const boxRowStart = Math.floor(row / this.BOX_ROWS) * this.BOX_ROWS;
    const boxColStart = Math.floor(col / this.BOX_COLS) * this.BOX_COLS;

    for (let r = boxRowStart; r < boxRowStart + this.BOX_ROWS; r++) {
      for (let c = boxColStart; c < boxColStart + this.BOX_COLS; c++) {
        if (grid[r][c] === num) return false;
      }
    }

    return true;
  }

  /**
   * Fill grid using backtracking (creates a valid complete Sudoku)
   */
  private fillGrid(grid: (number | null)[][], random: () => number): boolean {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (grid[row][col] === null) {
          // Try numbers 1-6 in random order
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6], random);

          for (const num of numbers) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;

              if (this.fillGrid(grid, random)) {
                return true; // Successfully filled entire grid
              }

              grid[row][col] = null; // Backtrack
            }
          }

          return false; // No valid number found
        }
      }
    }

    return true; // Grid is filled
  }

  /**
   * Solve a Sudoku puzzle using backtracking
   * Returns true if solvable, modifies grid in place
   */
  private solveSudoku(grid: (number | null)[][]): boolean {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (grid[row][col] === null) {
          for (let num = 1; num <= 6; num++) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;

              if (this.solveSudoku(grid)) {
                return true;
              }

              grid[row][col] = null;
            }
          }

          return false;
        }
      }
    }

    return true;
  }

  /**
   * Count solutions for a puzzle (to ensure unique solution)
   */
  private countSolutions(grid: (number | null)[][], limit: number = 2): number {
    let count = 0;

    const solve = (g: (number | null)[][]): void => {
      if (count >= limit) return; // Early exit if we found multiple solutions

      for (let row = 0; row < this.GRID_SIZE; row++) {
        for (let col = 0; col < this.GRID_SIZE; col++) {
          if (g[row][col] === null) {
            for (let num = 1; num <= 6; num++) {
              if (this.isValid(g, row, col, num)) {
                g[row][col] = num;
                solve(g);
                g[row][col] = null;
              }
            }
            return;
          }
        }
      }

      count++; // Found a solution
    };

    const gridCopy = grid.map(row => [...row]);
    solve(gridCopy);
    return count;
  }

  /**
   * Remove cells from a filled grid to create a puzzle
   */
  private createPuzzle(solution: number[][], clueCount: number, random: () => number): (number | null)[][] {
    const puzzle: (number | null)[][] = solution.map(row => row.map(cell => cell as number | null));

    // Get all cell positions
    const positions: [number, number][] = [];
    for (let r = 0; r < this.GRID_SIZE; r++) {
      for (let c = 0; c < this.GRID_SIZE; c++) {
        positions.push([r, c]);
      }
    }

    // Shuffle positions
    const shuffledPositions = shuffleArray(positions, random);

    // Try to remove cells
    const totalCells = this.GRID_SIZE * this.GRID_SIZE;
    const cellsToRemove = totalCells - clueCount;
    let removed = 0;

    for (const [row, col] of shuffledPositions) {
      if (removed >= cellsToRemove) break;

      const backup = puzzle[row][col];
      puzzle[row][col] = null;

      // Check if puzzle still has unique solution
      const solutions = this.countSolutions(puzzle, 2);

      if (solutions === 1) {
        removed++;
      } else {
        // Restore if removing creates multiple solutions
        puzzle[row][col] = backup;
      }
    }

    return puzzle;
  }

  /**
   * Generate a Mini Sudoku puzzle
   */
  generate(difficulty: Difficulty, seed?: number): MiniSudokuPuzzle {
    const actualSeed = seed || Math.floor(Math.random() * 1000000);
    const random = mulberry32(actualSeed);
    const clueCount = this.difficultyToClueCount(difficulty);

    // Create empty grid
    const grid: (number | null)[][] = Array(this.GRID_SIZE)
      .fill(null)
      .map(() => Array(this.GRID_SIZE).fill(null));

    // Fill grid with a valid solution
    this.fillGrid(grid, random);

    // Save the solution
    const solution: number[][] = grid.map(row => row.map(cell => cell as number));

    // Create puzzle by removing cells
    const puzzle = this.createPuzzle(solution, clueCount, random);

    return {
      size: 6,
      grid: puzzle,
      solution,
      seed: actualSeed,
      difficulty,
    };
  }

  /**
   * Validate a user's solution
   */
  validate(puzzle: MiniSudokuPuzzle, userSolution: MiniSudokuPuzzle): ValidationResult {
    const errors: string[] = [];
    const userGrid = userSolution.grid;

    // Check if all cells are filled
    for (let r = 0; r < this.GRID_SIZE; r++) {
      for (let c = 0; c < this.GRID_SIZE; c++) {
        if (userGrid[r][c] === null) {
          errors.push('Puzzle is not complete - some cells are empty');
          return { isValid: false, errors };
        }
      }
    }

    // Check each row has 1-6
    for (let r = 0; r < this.GRID_SIZE; r++) {
      const rowNumbers = new Set(userGrid[r]);
      if (rowNumbers.size !== 6 || !Array.from(rowNumbers).every(n => n && n >= 1 && n <= 6)) {
        errors.push(`Row ${r + 1} does not contain all digits 1-6`);
      }
    }

    // Check each column has 1-6
    for (let c = 0; c < this.GRID_SIZE; c++) {
      const colNumbers = new Set(userGrid.map(row => row[c]));
      if (colNumbers.size !== 6 || !Array.from(colNumbers).every(n => n && n >= 1 && n <= 6)) {
        errors.push(`Column ${c + 1} does not contain all digits 1-6`);
      }
    }

    // Check each 2x3 box has 1-6
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 2; boxCol++) {
        const boxNumbers: (number | null)[] = [];
        const rowStart = boxRow * this.BOX_ROWS;
        const colStart = boxCol * this.BOX_COLS;

        for (let r = rowStart; r < rowStart + this.BOX_ROWS; r++) {
          for (let c = colStart; c < colStart + this.BOX_COLS; c++) {
            boxNumbers.push(userGrid[r][c]);
          }
        }

        const boxSet = new Set(boxNumbers);
        if (boxSet.size !== 6 || !Array.from(boxSet).every(n => n && n >= 1 && n <= 6)) {
          errors.push(`Box at row ${boxRow + 1}, column ${boxCol + 1} does not contain all digits 1-6`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Solve a puzzle (returns solution)
   */
  solve(puzzle: MiniSudokuPuzzle): MiniSudokuPuzzle {
    // Return the puzzle with solution already embedded
    return puzzle;
  }
}

// Export singleton instance
export const miniSudokuEngine = new MiniSudokuEngine();
