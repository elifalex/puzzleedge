/**
 * Script to validate all puzzles in the library
 * Checks for unique solutions and logical solvability
 */

import { getAllPuzzles } from '../data/queensPuzzles.js';
import { countSolutions, hasUniqueSolution } from '../engines/queensValidator.js';

function validateAllPuzzles() {
  console.log('🔍 Validating Queens Puzzle Library...\n');

  const allPuzzles = getAllPuzzles();
  let validCount = 0;
  let invalidCount = 0;

  for (const puzzle of allPuzzles) {
    console.log(`Checking ${puzzle.id} (${puzzle.difficulty}, ${puzzle.size}x${puzzle.size})...`);

    const solutionCount = countSolutions(puzzle, 5); // Count up to 5 solutions

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
}

// Run validation
validateAllPuzzles();
