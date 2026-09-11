/**
 * Generate Mini Sudoku Puzzles
 * Creates 1,200 puzzles: 400 easy, 400 medium, 400 hard
 */

import * as fs from 'fs';
import * as path from 'path';
import { miniSudokuEngine } from '../engines/miniSudoku';
import { Difficulty } from '../constants/gameConfig';

// Configuration
const PUZZLES_PER_DIFFICULTY = 400;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data', 'mini-sudoku');

/**
 * Generate puzzles for a specific difficulty
 */
function generatePuzzlesForDifficulty(difficulty: Difficulty, count: number) {
  console.log(`\nGenerating ${count} ${difficulty} puzzles...`);
  const puzzles = [];

  for (let i = 0; i < count; i++) {
    // Use sequential seeds for reproducibility
    const seed = Date.now() + i + (difficulty === 'easy' ? 0 : difficulty === 'medium' ? 1000000 : 2000000);

    try {
      const puzzle = miniSudokuEngine.generate(difficulty, seed);

      // Store in simplified format (remove difficulty field, will be inferred from file)
      puzzles.push({
        grid: puzzle.grid,
        solution: puzzle.solution,
        seed: puzzle.seed,
      });

      // Progress indicator
      if ((i + 1) % 50 === 0) {
        console.log(`  Generated ${i + 1}/${count} ${difficulty} puzzles`);
      }
    } catch (error) {
      console.error(`Error generating puzzle ${i + 1}:`, error);
      // Retry with different seed
      i--;
    }
  }

  console.log(`✓ Completed ${count} ${difficulty} puzzles`);
  return puzzles;
}

/**
 * Main generation function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Mini Sudoku Puzzle Generation');
  console.log('='.repeat(60));
  console.log(`Target: ${PUZZLES_PER_DIFFICULTY} puzzles per difficulty`);
  console.log(`Total: ${PUZZLES_PER_DIFFICULTY * 3} puzzles\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}\n`);
  }

  // Generate puzzles for each difficulty
  const startTime = Date.now();

  const easyPuzzles = generatePuzzlesForDifficulty('easy', PUZZLES_PER_DIFFICULTY);
  const mediumPuzzles = generatePuzzlesForDifficulty('medium', PUZZLES_PER_DIFFICULTY);
  const hardPuzzles = generatePuzzlesForDifficulty('hard', PUZZLES_PER_DIFFICULTY);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n' + '='.repeat(60));
  console.log('Writing puzzle files...');
  console.log('='.repeat(60));

  // Write to JSON files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'puzzles-easy.json'),
    JSON.stringify(easyPuzzles, null, 2)
  );
  console.log(`✓ Written: puzzles-easy.json (${easyPuzzles.length} puzzles)`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'puzzles-medium.json'),
    JSON.stringify(mediumPuzzles, null, 2)
  );
  console.log(`✓ Written: puzzles-medium.json (${mediumPuzzles.length} puzzles)`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'puzzles-hard.json'),
    JSON.stringify(hardPuzzles, null, 2)
  );
  console.log(`✓ Written: puzzles-hard.json (${hardPuzzles.length} puzzles)`);

  console.log('\n' + '='.repeat(60));
  console.log('Generation Complete!');
  console.log('='.repeat(60));
  console.log(`Total puzzles: ${easyPuzzles.length + mediumPuzzles.length + hardPuzzles.length}`);
  console.log(`Time elapsed: ${elapsed}s`);
  console.log('='.repeat(60));
}

// Run the script
main().catch(console.error);
