/**
 * Generate Zip puzzles for all board sizes
 * Run with: npx ts-node src/scripts/generateZipPuzzles.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import the engine
import { zipEngine } from '../engines/zip';
import { ZipPuzzle } from '../constants/types';
import { Difficulty } from '../constants/gameConfig';

interface ZipPuzzleEntry extends ZipPuzzle {
  id: string;
}

const PUZZLES_PER_SIZE = {
  5: 400,  // 5x5 puzzles
  6: 400,  // 6x6 puzzles
  7: 100,  // 7x7 puzzles
};

async function generatePuzzlesForSize(
  size: 5 | 6 | 7,
  difficulty: Difficulty,
  count: number
): Promise<ZipPuzzleEntry[]> {
  const puzzles: ZipPuzzleEntry[] = [];
  let successCount = 0;
  let attempts = 0;
  const maxAttempts = count * 3; // Allow some failures

  console.log(`Generating ${count} ${size}x${size} puzzles (${difficulty})...`);

  while (successCount < count && attempts < maxAttempts) {
    attempts++;
    try {
      const seed = Date.now() + attempts;
      const puzzle = zipEngine.generate(difficulty, seed);

      // Validate puzzle has correct size
      if (puzzle.size !== size) {
        console.log(`  ⚠️  Skipping puzzle with wrong size: ${puzzle.size} (expected ${size})`);
        continue;
      }

      // Validate solution path
      if (puzzle.solution.length !== size * size) {
        console.log(`  ⚠️  Skipping puzzle with incomplete path: ${puzzle.solution.length}/${size * size}`);
        continue;
      }

      // Create puzzle entry with ID
      const puzzleEntry: ZipPuzzleEntry = {
        ...puzzle,
        id: `${size}x${size}-${successCount.toString().padStart(4, '0')}`,
      };

      puzzles.push(puzzleEntry);
      successCount++;

      if (successCount % 50 === 0) {
        console.log(`  ✓ Generated ${successCount}/${count} puzzles`);
      }
    } catch (error) {
      console.log(`  ⚠️  Failed to generate puzzle (attempt ${attempts}):`, error);
    }
  }

  console.log(`✓ Generated ${successCount} ${size}x${size} puzzles\n`);
  return puzzles;
}

async function generateAllPuzzles() {
  console.log('Starting Zip puzzle generation...\n');

  try {
    // Generate 5x5 puzzles (Easy)
    const puzzles5x5 = await generatePuzzlesForSize(5, 'easy', PUZZLES_PER_SIZE[5]);
    const output5x5 = path.join(__dirname, '../../public/data/zip/puzzles-5x5.json');
    fs.writeFileSync(output5x5, JSON.stringify(puzzles5x5, null, 2));
    console.log(`✓ Saved ${puzzles5x5.length} puzzles to ${output5x5}\n`);

    // Generate 6x6 puzzles (Medium)
    const puzzles6x6 = await generatePuzzlesForSize(6, 'medium', PUZZLES_PER_SIZE[6]);
    const output6x6 = path.join(__dirname, '../../public/data/zip/puzzles-6x6.json');
    fs.writeFileSync(output6x6, JSON.stringify(puzzles6x6, null, 2));
    console.log(`✓ Saved ${puzzles6x6.length} puzzles to ${output6x6}\n`);

    // Generate 7x7 puzzles (Hard)
    const puzzles7x7 = await generatePuzzlesForSize(7, 'hard', PUZZLES_PER_SIZE[7]);
    const output7x7 = path.join(__dirname, '../../public/data/zip/puzzles-7x7.json');
    fs.writeFileSync(output7x7, JSON.stringify(puzzles7x7, null, 2));
    console.log(`✓ Saved ${puzzles7x7.length} puzzles to ${output7x7}\n`);

    console.log('✅ All Zip puzzles generated successfully!');
    console.log(`\nTotal puzzles: ${puzzles5x5.length + puzzles6x6.length + puzzles7x7.length}`);
  } catch (error) {
    console.error('❌ Error generating puzzles:', error);
    process.exit(1);
  }
}

// Run the generator
generateAllPuzzles();
