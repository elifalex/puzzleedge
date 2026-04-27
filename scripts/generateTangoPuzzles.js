/**
 * Generate Tango Puzzles Script
 * Run with: node scripts/generateTangoPuzzles.js
 */

const fs = require('fs');
const path = require('path');

const GRID_SIZE = 6;
const SYMBOLS_PER_ROW = GRID_SIZE / 2;

// Seeded random number generator
function createRNG(seed) {
  let rng = seed;
  return function() {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };
}

// Generate a valid Tango grid
function generateValidGrid(seed) {
  const random = createRNG(seed);
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(-1));

  function isValid(row, col, value) {
    // Check row constraint
    const rowCount = grid[row].filter(v => v === value).length;
    if (rowCount >= SYMBOLS_PER_ROW) return false;

    // Check column constraint
    let colCount = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][col] === value) colCount++;
    }
    if (colCount >= SYMBOLS_PER_ROW) return false;

    // Check no-three-in-a-row horizontal
    if (col >= 2 && grid[row][col - 1] === value && grid[row][col - 2] === value) {
      return false;
    }

    // Check no-three-in-a-row vertical
    if (row >= 2 && grid[row - 1][col] === value && grid[row - 2][col] === value) {
      return false;
    }

    return true;
  }

  function backtrack(row, col) {
    if (row === GRID_SIZE) return true;

    const nextCol = (col + 1) % GRID_SIZE;
    const nextRow = nextCol === 0 ? row + 1 : row;

    const values = random() > 0.5 ? [0, 1] : [1, 0];

    for (const value of values) {
      if (isValid(row, col, value)) {
        grid[row][col] = value;
        if (backtrack(nextRow, nextCol)) {
          return true;
        }
        grid[row][col] = -1;
      }
    }

    return false;
  }

  backtrack(0, 0);
  return grid;
}

// Generate constraints
function generateConstraints(solution, difficulty, seed) {
  const random = createRNG(seed + 1000);
  const constraints = [];

  const constraintCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 6 : 4;

  const attempted = new Set();

  while (constraints.length < constraintCount) {
    const row = Math.floor(random() * GRID_SIZE);
    const col = Math.floor(random() * (GRID_SIZE - 1));

    const key = `${row},${col}`;
    if (attempted.has(key)) continue;
    attempted.add(key);

    const cell1 = [row, col];
    const cell2 = [row, col + 1];

    const value1 = solution[cell1[0]][cell1[1]];
    const value2 = solution[cell2[0]][cell2[1]];

    const type = value1 === value2 ? 'equal' : 'opposite';

    constraints.push({ cell1, cell2, type });
  }

  return constraints;
}

// Create puzzle from solution
function createPuzzleFromSolution(solution, difficulty, seed) {
  const random = createRNG(seed + 2000);

  const totalCells = GRID_SIZE * GRID_SIZE;
  const prefilledRatio = difficulty === 'easy' ? 0.6 : difficulty === 'medium' ? 0.4 : 0.25;
  const prefilledCount = Math.floor(totalCells * prefilledRatio);

  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

  const cellPositions = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      cellPositions.push([r, c]);
    }
  }

  // Shuffle
  for (let i = cellPositions.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cellPositions[i], cellPositions[j]] = [cellPositions[j], cellPositions[i]];
  }

  // Pre-fill
  for (let i = 0; i < prefilledCount; i++) {
    const [r, c] = cellPositions[i];
    grid[r][c] = solution[r][c];
  }

  return grid;
}

// Generate a puzzle
function generateTangoPuzzle(difficulty, seed) {
  const solution = generateValidGrid(seed);
  const constraints = generateConstraints(solution, difficulty, seed);
  const grid = createPuzzleFromSolution(solution, difficulty, seed);

  return {
    id: `tango-${difficulty}-${seed.toString().padStart(4, '0')}`,
    size: GRID_SIZE,
    grid,
    solution,
    constraints,
    seed,
    difficulty,
  };
}

// Generate puzzle set
function generatePuzzleSet(difficulty, count, startSeed) {
  const puzzles = [];
  for (let i = 0; i < count; i++) {
    const seed = startSeed + i;
    const puzzle = generateTangoPuzzle(difficulty, seed);
    puzzles.push(puzzle);

    if ((i + 1) % 100 === 0) {
      console.log(`Generated ${i + 1}/${count} ${difficulty} puzzles`);
    }
  }
  return puzzles;
}

// Main function
function main() {
  console.log('🎮 Generating Tango Puzzles...\n');

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'public', 'data', 'tango');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate easy puzzles
  console.log('📝 Generating Easy Puzzles...');
  const easyPuzzles = generatePuzzleSet('easy', 400, 1000);
  fs.writeFileSync(
    path.join(outputDir, 'puzzles-easy.json'),
    JSON.stringify(easyPuzzles, null, 2)
  );
  console.log(`✅ Saved 400 easy puzzles\n`);

  // Generate medium puzzles
  console.log('📝 Generating Medium Puzzles...');
  const mediumPuzzles = generatePuzzleSet('medium', 400, 2000);
  fs.writeFileSync(
    path.join(outputDir, 'puzzles-medium.json'),
    JSON.stringify(mediumPuzzles, null, 2)
  );
  console.log(`✅ Saved 400 medium puzzles\n`);

  // Generate hard puzzles
  console.log('📝 Generating Hard Puzzles...');
  const hardPuzzles = generatePuzzleSet('hard', 400, 3000);
  fs.writeFileSync(
    path.join(outputDir, 'puzzles-hard.json'),
    JSON.stringify(hardPuzzles, null, 2)
  );
  console.log(`✅ Saved 400 hard puzzles\n`);

  console.log('🎉 Successfully generated 1,200 Tango puzzles!');
  console.log(`📂 Puzzles saved to: ${outputDir}`);
}

// Run the script
main();
