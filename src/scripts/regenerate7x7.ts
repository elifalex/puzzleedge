/**
 * Regenerate only 7x7 Zip puzzles with new Backbite algorithm
 */

import * as fs from 'fs';
import * as path from 'path';
import { zipEngine } from '../engines/zip';
import { ZipPuzzle } from '../constants/types';

interface ZipPuzzleEntry extends ZipPuzzle {
  id: string;
}

async function regenerate7x7Puzzles() {
  console.log('Regenerating 100 7x7 puzzles with Backbite algorithm...\n');

  const puzzles: ZipPuzzleEntry[] = [];
  let successCount = 0;
  let attempts = 0;
  const count = 100;
  const maxAttempts = count * 2;

  const startTime = Date.now();

  while (successCount < count && attempts < maxAttempts) {
    attempts++;
    try {
      const seed = 1000000 + attempts; // Use consistent seed base
      const puzzle = zipEngine.generate('hard', seed);

      // Validate puzzle
      if (puzzle.size !== 7) {
        console.log(`  ⚠️  Wrong size: ${puzzle.size}`);
        continue;
      }

      if (puzzle.solution.length !== 49) {
        console.log(`  ⚠️  Incomplete path: ${puzzle.solution.length}/49`);
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
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`  ✓ Generated ${successCount}/${count} puzzles (${elapsed}s)`);
      }
    } catch (error) {
      console.log(`  ⚠️  Error on attempt ${attempts}:`, error);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✓ Generated ${successCount} 7x7 puzzles in ${totalTime}s`);
  console.log(`  Average: ${(parseFloat(totalTime) / successCount * 1000).toFixed(0)}ms per puzzle\n`);

  // Save to file
  const outputPath = path.join(__dirname, '../../public/data/zip/puzzles-7x7.json');
  fs.writeFileSync(outputPath, JSON.stringify(puzzles, null, 2));
  console.log(`✅ Saved to ${outputPath}`);

  // Calculate and display uniqueness stats
  console.log('\nAnalyzing path diversity...');
  const pathHashes = new Set<string>();
  const firstNCells = 20;

  puzzles.forEach((p, idx) => {
    const beginning = p.solution.slice(0, firstNCells).map(c => c.join(',')).join('|');
    pathHashes.add(beginning);
  });

  console.log(`Unique path beginnings (first ${firstNCells} cells): ${pathHashes.size}/${puzzles.length}`);
  const diversityPercent = ((pathHashes.size / puzzles.length) * 100).toFixed(1);
  console.log(`Diversity: ${diversityPercent}%`);
}

regenerate7x7Puzzles();
