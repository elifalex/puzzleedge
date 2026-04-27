/**
 * Tango Puzzle Generator
 * Generates valid Tango puzzles with all possible permutations
 */

import { TangoPuzzle, TangoConstraint } from '../constants/types';
import { Difficulty } from '../constants/gameConfig';

const GRID_SIZE = 6; // 6x6 grid standard for Tango
const SYMBOLS_PER_ROW = GRID_SIZE / 2; // 3 suns, 3 moons per row/column

/**
 * Generate a complete valid Tango grid (solution)
 */
function generateValidGrid(seed: number): (0 | 1)[][] {
  // Use seed for deterministic generation
  let rng = seed;
  const random = () => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };

  const grid: (0 | 1)[][] = [];

  // Initialize empty grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = new Array(GRID_SIZE).fill(-1) as (0 | 1)[];
  }

  // Fill grid row by row using backtracking
  function isValid(row: number, col: number, value: 0 | 1): boolean {
    // Check row constraint: can't exceed SYMBOLS_PER_ROW of each type
    const rowCount = grid[row].filter(v => v === value).length;
    if (rowCount >= SYMBOLS_PER_ROW) return false;

    // Check column constraint
    let colCount = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][col] === value) colCount++;
    }
    if (colCount >= SYMBOLS_PER_ROW) return false;

    // Check no-three-in-a-row horizontal
    if (col >= 2) {
      if (grid[row][col - 1] === value && grid[row][col - 2] === value) {
        return false;
      }
    }
    if (col >= 1 && col < GRID_SIZE - 1) {
      if (grid[row][col - 1] === value && col + 1 < GRID_SIZE) {
        // This will be checked when placing next cell
      }
    }

    // Check no-three-in-a-row vertical
    if (row >= 2) {
      if (grid[row - 1][col] === value && grid[row - 2][col] === value) {
        return false;
      }
    }

    return true;
  }

  function backtrack(row: number, col: number): boolean {
    if (row === GRID_SIZE) {
      return true; // Successfully filled entire grid
    }

    const nextCol = (col + 1) % GRID_SIZE;
    const nextRow = nextCol === 0 ? row + 1 : row;

    // Try both values (randomized order for variety)
    const values: (0 | 1)[] = random() > 0.5 ? [0, 1] : [1, 0];

    for (const value of values) {
      if (isValid(row, col, value)) {
        grid[row][col] = value;
        if (backtrack(nextRow, nextCol)) {
          return true;
        }
        grid[row][col] = -1 as any;
      }
    }

    return false;
  }

  backtrack(0, 0);
  return grid;
}

/**
 * Create constraints between cells
 */
function generateConstraints(
  solution: (0 | 1)[][],
  difficulty: Difficulty,
  seed: number
): TangoConstraint[] {
  let rng = seed + 1000;
  const random = () => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };

  const constraints: TangoConstraint[] = [];

  // Determine number of constraints based on difficulty
  const constraintCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 6 : 4;

  // Generate random cell pairs and add constraints
  const attempted = new Set<string>();

  while (constraints.length < constraintCount) {
    const row = Math.floor(random() * GRID_SIZE);
    const col = Math.floor(random() * (GRID_SIZE - 1)); // -1 because we pair with next col

    const key = `${row},${col}`;
    if (attempted.has(key)) continue;
    attempted.add(key);

    const cell1: [number, number] = [row, col];
    const cell2: [number, number] = [row, col + 1];

    const value1 = solution[cell1[0]][cell1[1]];
    const value2 = solution[cell2[0]][cell2[1]];

    const type: 'equal' | 'opposite' = value1 === value2 ? 'equal' : 'opposite';

    constraints.push({ cell1, cell2, type });
  }

  return constraints;
}

/**
 * Create puzzle by removing symbols from solution
 */
function createPuzzleFromSolution(
  solution: (0 | 1)[][],
  difficulty: Difficulty,
  seed: number
): (0 | 1 | null)[][] {
  let rng = seed + 2000;
  const random = () => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };

  // Determine how many cells to pre-fill based on difficulty
  const totalCells = GRID_SIZE * GRID_SIZE;
  const prefilledRatio = difficulty === 'easy' ? 0.6 : difficulty === 'medium' ? 0.4 : 0.25;
  const prefilledCount = Math.floor(totalCells * prefilledRatio);

  const grid: (0 | 1 | null)[][] = solution.map(row => row.map(() => null));

  // Randomly select cells to pre-fill
  const cellPositions: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      cellPositions.push([r, c]);
    }
  }

  // Shuffle cell positions
  for (let i = cellPositions.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cellPositions[i], cellPositions[j]] = [cellPositions[j], cellPositions[i]];
  }

  // Pre-fill selected cells
  for (let i = 0; i < prefilledCount; i++) {
    const [r, c] = cellPositions[i];
    grid[r][c] = solution[r][c];
  }

  return grid;
}

/**
 * Generate a complete Tango puzzle
 */
export function generateTangoPuzzle(difficulty: Difficulty, seed: number): TangoPuzzle {
  const solution = generateValidGrid(seed);
  const constraints = generateConstraints(solution, difficulty, seed);
  const grid = createPuzzleFromSolution(solution, difficulty, seed);

  return {
    size: GRID_SIZE,
    grid,
    solution,
    constraints,
    seed,
    difficulty,
  };
}

/**
 * Generate multiple puzzles for a difficulty level
 */
export function generatePuzzleSet(difficulty: Difficulty, count: number, startSeed: number): TangoPuzzle[] {
  const puzzles: TangoPuzzle[] = [];

  for (let i = 0; i < count; i++) {
    const seed = startSeed + i;
    const puzzle = generateTangoPuzzle(difficulty, seed);
    puzzles.push(puzzle);
  }

  return puzzles;
}

/**
 * Generate all puzzles for all difficulties (1,200 total)
 */
export function generateAllPuzzles(): {
  easy: TangoPuzzle[];
  medium: TangoPuzzle[];
  hard: TangoPuzzle[];
} {
  console.log('Generating Tango puzzles...');

  const easy = generatePuzzleSet('easy', 400, 1000);
  console.log('Generated 400 easy puzzles');

  const medium = generatePuzzleSet('medium', 400, 2000);
  console.log('Generated 400 medium puzzles');

  const hard = generatePuzzleSet('hard', 400, 3000);
  console.log('Generated 400 hard puzzles');

  return { easy, medium, hard };
}
