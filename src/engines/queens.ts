/**
 * Queens Puzzle Engine
 * Uses pre-validated puzzle library for consistent, logically-solvable puzzles
 * Rules: One queen per row, column, and colored region. No two queens can touch (including diagonally).
 */

import { Difficulty } from '../constants/gameConfig';
import { QueensPuzzle, PuzzleEngine, ValidationResult } from '../constants/types';
import { queenRegionColors } from '../constants/colors';
import { getRandomPuzzle, getDailyPuzzle, PuzzleEntry } from '../data/queensPuzzleLoader';

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

class QueensEngine implements PuzzleEngine<QueensPuzzle> {
  /**
   * Generate a deterministic daily seed from current date
   */
  getDailySeed(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0-indexed
    const day = now.getDate();
    // Create seed as YYYYMMDD integer
    return year * 10000 + month * 100 + day;
  }

  /**
   * Map difficulty to board size
   */
  private difficultyToBoardSize(difficulty: Difficulty): 7 | 8 | 9 {
    switch (difficulty) {
      case 'easy':
        return 7;
      case 'medium':
        return 8;
      case 'hard':
        return 9;
      default:
        return 7;
    }
  }

  /**
   * Generate a Queens puzzle from pre-validated library
   */
  async generate(difficulty: Difficulty, seed?: number): Promise<QueensPuzzle> {
    const boardSize = this.difficultyToBoardSize(difficulty);

    let puzzle: PuzzleEntry | null;

    if (seed) {
      // For daily mode: use seed to deterministically select puzzle
      puzzle = await getDailyPuzzle(boardSize, seed);
    } else {
      // For practice mode: get random puzzle
      puzzle = await getRandomPuzzle(boardSize);
    }

    if (!puzzle) {
      throw new Error(`No puzzles available for ${boardSize}x${boardSize} board`);
    }

    // Add difficulty field for compatibility
    return {
      ...puzzle,
      difficulty,
    };
  }

  /**
   * Generate colored regions using flood-fill algorithm
   */
  private generateRegions(size: number, random: () => number): number[][] {
    const regions: number[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(-1));

    let regionId = 0;
    const targetRegionCount = size; // One region per queen

    // Track cells available for assignment
    const availableCells: [number, number][] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        availableCells.push([r, c]);
      }
    }

    // Shuffle to get random starting points
    const shuffled = shuffleArray(availableCells, random);

    for (let i = 0; i < targetRegionCount && shuffled.length > 0; i++) {
      // Find first unassigned cell
      let startCell: [number, number] | null = null;
      for (const cell of shuffled) {
        const [r, c] = cell;
        if (regions[r][c] === -1) {
          startCell = [r, c];
          break;
        }
      }

      if (!startCell) break;

      // Flood fill from this cell
      const targetSize = Math.floor(size * size / targetRegionCount);
      const minSize = Math.max(3, Math.floor(targetSize * 0.7));
      const maxSize = Math.ceil(targetSize * 1.3);

      this.floodFill(regions, startCell[0], startCell[1], regionId, size, random, minSize, maxSize);
      regionId++;
    }

    // Assign any remaining unassigned cells to nearest region
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (regions[r][c] === -1) {
          regions[r][c] = this.findNearestRegion(regions, r, c, size);
        }
      }
    }

    return regions;
  }

  /**
   * Flood fill algorithm to create connected regions
   */
  private floodFill(
    regions: number[][],
    row: number,
    col: number,
    regionId: number,
    size: number,
    random: () => number,
    minSize: number,
    maxSize: number
  ): void {
    const queue: [number, number][] = [[row, col]];
    let filled = 0;

    while (queue.length > 0 && filled < maxSize) {
      const [r, c] = queue.shift()!;

      if (r < 0 || r >= size || c < 0 || c >= size) continue;
      if (regions[r][c] !== -1) continue;

      regions[r][c] = regionId;
      filled++;

      // Add neighbors in random order
      const neighbors: [number, number][] = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      const shuffledNeighbors = shuffleArray(neighbors, random);

      // Add neighbors to queue with probability decreasing as we approach maxSize
      for (const neighbor of shuffledNeighbors) {
        if (filled < minSize || random() < 0.7) {
          queue.push(neighbor);
        }
      }
    }
  }

  /**
   * Find nearest region for orphaned cells
   */
  private findNearestRegion(regions: number[][], row: number, col: number, size: number): number {
    const neighbors = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];

    for (const [r, c] of neighbors) {
      if (r >= 0 && r < size && c >= 0 && c < size && regions[r][c] !== -1) {
        return regions[r][c];
      }
    }

    return 0; // fallback
  }

  /**
   * Solve for valid queen placements using backtracking
   */
  private solvePlacement(size: number, regions: number[][], random: () => number): [number, number][] {
    // Generate randomized column order for each row
    const columnOrders: number[][] = [];
    for (let i = 0; i < size; i++) {
      columnOrders.push(
        shuffleArray(
          Array.from({ length: size }, (_, j) => j),
          random
        )
      );
    }

    const solution: [number, number][] = [];
    const usedColumns = new Set<number>();
    const usedRegions = new Set<number>();

    // Recursive backtracking function
    const backtrack = (row: number): boolean => {
      // Base case: all queens placed
      if (row === size) {
        return true;
      }

      // Try each column in randomized order for this row
      for (const col of columnOrders[row]) {
        const region = regions[row][col];

        // Check if this placement is valid
        if (
          !usedColumns.has(col) &&
          !usedRegions.has(region) &&
          this.isValidPlacement(solution, row, col, size)
        ) {
          // Place queen
          solution.push([row, col]);
          usedColumns.add(col);
          usedRegions.add(region);

          // Recursively try to place remaining queens
          if (backtrack(row + 1)) {
            return true; // Solution found
          }

          // Backtrack: remove queen and try next column
          solution.pop();
          usedColumns.delete(col);
          usedRegions.delete(region);
        }
      }

      // No valid placement found in this row
      return false;
    };

    // Start backtracking from row 0
    if (!backtrack(0)) {
      // This should be extremely rare - region generation should ensure solvability
      // If it happens, regenerate the entire puzzle with a different seed
      throw new Error('Failed to place all queens - regenerating puzzle');
    }

    return solution;
  }

  /**
   * Check if a queen placement is valid (no adjacent queens)
   */
  private isValidPlacement(
    existingQueens: [number, number][],
    row: number,
    col: number,
    size: number
  ): boolean {
    for (const [qRow, qCol] of existingQueens) {
      // Check if adjacent (including diagonals)
      const rowDiff = Math.abs(row - qRow);
      const colDiff = Math.abs(col - qCol);

      if (rowDiff <= 1 && colDiff <= 1) {
        return false; // Queens are adjacent
      }
    }

    return true;
  }

  /**
   * Validate a user's solution
   */
  validate(puzzle: QueensPuzzle, userSolution: QueensPuzzle): ValidationResult {
    const errors: string[] = [];
    const { size, regions } = puzzle;
    const queens = userSolution.solution;

    // Check correct number of queens
    if (queens.length !== size) {
      errors.push(`Expected ${size} queens, found ${queens.length}`);
      return { isValid: false, errors };
    }

    // Check one per row
    const rows = new Set(queens.map(([r]) => r));
    if (rows.size !== size) {
      errors.push('Each row must have exactly one queen');
    }

    // Check one per column
    const cols = new Set(queens.map(([, c]) => c));
    if (cols.size !== size) {
      errors.push('Each column must have exactly one queen');
    }

    // Check one per region
    const regionCounts = new Map<number, number>();
    for (const [r, c] of queens) {
      const region = regions[r][c];
      regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
    }

    for (const [region, count] of regionCounts) {
      if (count > 1) {
        errors.push(`Region ${region} has ${count} queens (should have 1)`);
      }
    }

    // Check no adjacent queens
    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        const [r1, c1] = queens[i];
        const [r2, c2] = queens[j];
        const rowDiff = Math.abs(r1 - r2);
        const colDiff = Math.abs(c1 - c2);

        if (rowDiff <= 1 && colDiff <= 1) {
          errors.push(`Queens at (${r1},${c1}) and (${r2},${c2}) are adjacent`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Solve a puzzle (for hint system)
   */
  solve(puzzle: QueensPuzzle): QueensPuzzle {
    // Return the puzzle with solution already embedded
    return puzzle;
  }

  /**
   * Get a hint for the user (reveals one valid queen placement)
   */
  getHint(puzzle: QueensPuzzle, currentQueens: [number, number][]): [number, number] | null {
    const { solution } = puzzle;

    // Find a solution queen that hasn't been placed yet
    for (const solutionQueen of solution) {
      const isPlaced = currentQueens.some(
        ([r, c]) => r === solutionQueen[0] && c === solutionQueen[1]
      );

      if (!isPlaced) {
        return solutionQueen;
      }
    }

    return null; // All queens placed
  }
}

// Export singleton instance
export const queensEngine = new QueensEngine();
