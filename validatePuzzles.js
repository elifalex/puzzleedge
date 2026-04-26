/**
 * Simple validation script to check puzzle uniqueness
 * Run with: node validatePuzzles.js
 */

// Inline puzzle data
const easyPuzzles = [
  {
    id: 'easy-001',
    size: 7,
    regions: [
      [0, 0, 1, 1, 2, 2, 2],
      [0, 0, 1, 1, 1, 2, 2],
      [0, 3, 3, 3, 1, 1, 2],
      [4, 4, 3, 3, 3, 5, 5],
      [4, 4, 4, 6, 6, 5, 5],
      [4, 4, 6, 6, 6, 6, 5],
      [4, 4, 4, 6, 6, 5, 5],
    ],
    solution: [
      [0, 1], [1, 3], [2, 5], [3, 0], [4, 2], [5, 4], [6, 6],
    ],
  },
  {
    id: 'easy-002',
    size: 7,
    regions: [
      [0, 0, 0, 1, 1, 1, 1],
      [0, 0, 2, 2, 2, 1, 1],
      [3, 3, 3, 2, 2, 2, 4],
      [3, 3, 3, 5, 5, 4, 4],
      [3, 5, 5, 5, 5, 4, 4],
      [6, 6, 5, 5, 4, 4, 4],
      [6, 6, 6, 6, 6, 4, 4],
    ],
    solution: [
      [0, 2], [1, 5], [2, 0], [3, 3], [4, 6], [5, 1], [6, 4],
    ],
  },
];

const mediumPuzzles = [
  {
    id: 'medium-001',
    size: 9,
    regions: [
      [0, 0, 0, 1, 1, 2, 2, 2, 2],
      [0, 0, 1, 1, 1, 1, 2, 2, 2],
      [0, 3, 3, 3, 1, 1, 1, 2, 2],
      [4, 4, 3, 3, 3, 3, 5, 5, 5],
      [4, 4, 4, 3, 3, 6, 6, 5, 5],
      [4, 4, 4, 7, 7, 6, 6, 6, 5],
      [4, 4, 7, 7, 7, 6, 6, 8, 8],
      [4, 7, 7, 7, 7, 8, 8, 8, 8],
      [4, 4, 7, 7, 8, 8, 8, 8, 8],
    ],
    solution: [
      [0, 2], [1, 5], [2, 8], [3, 1], [4, 4], [5, 7], [6, 0], [7, 3], [8, 6],
    ],
  },
];

const hardPuzzles = [
  {
    id: 'hard-001',
    size: 11,
    regions: [
      [0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2],
      [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2],
      [0, 0, 3, 3, 1, 1, 1, 1, 2, 2, 2],
      [4, 4, 4, 3, 3, 3, 5, 5, 5, 2, 2],
      [4, 4, 4, 3, 3, 3, 5, 5, 5, 5, 6],
      [4, 4, 4, 3, 3, 7, 7, 5, 5, 6, 6],
      [4, 4, 8, 8, 7, 7, 7, 7, 6, 6, 6],
      [9, 9, 9, 8, 8, 8, 7, 7, 7, 6, 6],
      [9, 9, 9, 8, 8, 8, 10, 10, 10, 10, 6],
      [9, 9, 9, 9, 8, 8, 10, 10, 10, 10, 10],
      [9, 9, 9, 9, 9, 8, 8, 10, 10, 10, 10],
    ],
    solution: [
      [0, 3], [1, 6], [2, 9], [3, 1], [4, 4], [5, 7], [6, 10], [7, 2], [8, 5], [9, 8], [10, 0],
    ],
  },
];

// Validation logic
function isValidPlacement(existingQueens, row, col, regions) {
  const region = regions[row][col];

  for (const [qRow, qCol] of existingQueens) {
    if (qRow === row || qCol === col) return false;
    if (regions[qRow][qCol] === region) return false;

    const rowDiff = Math.abs(row - qRow);
    const colDiff = Math.abs(col - qCol);
    if (rowDiff <= 1 && colDiff <= 1) return false;
  }

  return true;
}

function countSolutions(puzzle, maxCount = 2) {
  const { size, regions } = puzzle;
  let solutionCount = 0;

  function backtrack(row, placedQueens, usedCols, usedRegions) {
    if (solutionCount >= maxCount) return;

    if (row === size) {
      solutionCount++;
      return;
    }

    for (let col = 0; col < size; col++) {
      const region = regions[row][col];

      if (!usedCols.has(col) &&
          !usedRegions.has(region) &&
          isValidPlacement(placedQueens, row, col, regions)) {

        placedQueens.push([row, col]);
        usedCols.add(col);
        usedRegions.add(region);

        backtrack(row + 1, placedQueens, usedCols, usedRegions);

        placedQueens.pop();
        usedCols.delete(col);
        usedRegions.delete(region);

        if (solutionCount >= maxCount) return;
      }
    }
  }

  backtrack(0, [], new Set(), new Set());
  return solutionCount;
}

// Run validation
console.log('🔍 Validating Queens Puzzle Library...\n');

const allPuzzles = [...easyPuzzles, ...mediumPuzzles, ...hardPuzzles];
let validCount = 0;
let invalidCount = 0;

for (const puzzle of allPuzzles) {
  console.log(`Checking ${puzzle.id} (${puzzle.size}x${puzzle.size})...`);

  const solutionCount = countSolutions(puzzle, 5);

  if (solutionCount === 0) {
    console.log(`  ❌ NO SOLUTIONS FOUND! This puzzle is impossible to solve.`);
    invalidCount++;
  } else if (solutionCount === 1) {
    console.log(`  ✅ Valid! Has exactly 1 unique solution.`);
    validCount++;
  } else {
    console.log(`  ⚠️  MULTIPLE SOLUTIONS! Found ${solutionCount >= 5 ? '5+' : solutionCount} solutions.`);
    console.log(`     This puzzle needs to be replaced or fixed.`);
    invalidCount++;
  }
  console.log('');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Summary: ${validCount} valid, ${invalidCount} invalid`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (invalidCount > 0) {
  console.log('⚠️  Some puzzles need to be fixed or replaced!');
} else {
  console.log('✅ All puzzles are valid!');
}
