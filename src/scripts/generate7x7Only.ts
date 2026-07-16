/**
 * Generate only 7x7 Zip puzzles (100 puzzles)
 */

import * as fs from 'fs';
import * as path from 'path';

// Import the engine
import { zipEngine } from '../engines/zip';
import { ZipPuzzle } from '../constants/types';

interface ZipPuzzleEntry extends ZipPuzzle {
  id: string;
}

const PUZZLE_COUNT = 100;

async function generate7x7Puzzles() {
  console.log('Starting 7x7 Zip puzzle generation...\n');

  const puzzles: ZipPuzzleEntry[] = [];
  let successCount = 0;
  let attempts = 0;
  const maxAttempts = PUZZLE_COUNT * 3;

  console.log(`Generating ${PUZZLE_COUNT} 7x7 puzzles (hard)...`);

  while (successCount < PUZZLE_COUNT && attempts < maxAttempts) {
    attempts++;
    try {
      const seed = Date.now() + attempts;
      const puzzle = zipEngine.generate('hard', seed);

      // Validate puzzle has correct size
      if (puzzle.size !== 7) {
        console.log(`  ⚠️  Skipping puzzle with wrong size: ${puzzle.size}`);
        continue;
      }

      // Validate solution path
      if (puzzle.solution.length !== 49) {
        console.log(`  ⚠️  Skipping puzzle with incomplete path: ${puzzle.solution.length}/49`);
        continue;
      }

      // Create puzzle entry with ID
      const puzzleEntry: ZipPuzzleEntry = {
        ...puzzle,
        id: `7x7-${successCount.toString().padStart(4, '0')}`,
      };

      puzzles.push(puzzleEntry);
      successCount++;

      if (successCount % 10 === 0) {
        console.log(`  ✓ Generated ${successCount}/${PUZZLE_COUNT} puzzles`);
      }
    } catch (error) {
      console.log(`  ⚠️  Failed to generate puzzle (attempt ${attempts}):`, error);
    }
  }

  console.log(`✓ Generated ${successCount} 7x7 puzzles\n`);

  // Save to file
  const output = path.join(__dirname, '../../public/data/zip/puzzles-7x7.json');
  fs.writeFileSync(output, JSON.stringify(puzzles, null, 2));
  console.log(`✓ Saved ${puzzles.length} puzzles to ${output}\n`);

  console.log('✅ 7x7 Zip puzzles generated successfully!');
}

// Run the generator
generate7x7Puzzles();
