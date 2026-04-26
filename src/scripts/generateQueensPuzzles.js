/**
 * LinkedIn Queens Puzzle Generator
 * Generates thousands of puzzles following LinkedIn Queens logic:
 * - N×N board must have exactly N regions
 * - Each region contains exactly 1 queen
 * - Unique solution guaranteed by region placement
 */

const fs = require('fs');
const path = require('path');

// Vibrant color palette - ONE color per PERCEPTUAL family for maximum accessibility
// Optimized for colorblind users, high contrast with black queens/X marks
// All colors have luminance > 0.15 for visibility
// Maximum board size is 9×9, so 9 unique colors is sufficient
const REGION_COLORS = [
  '#FF6B6B', // Vibrant Red
  '#FFA500', // Vibrant Orange
  '#FFD700', // Vibrant Yellow (Gold)
  '#4ECB71', // Vibrant Green
  '#5DADE2', // Vibrant Blue
  '#9B59B6', // Vibrant Purple
  '#FF69B4', // Vibrant Pink (Hot Pink)
  '#C0C0C0', // Silver Gray
  '#CD853F', // Vibrant Brown (Peru)
];

// PERCEPTUAL color family definitions - prevents visually similar colors
// CRITICAL: All blue/cyan/teal variants MUST map to 'blue' family
// CRITICAL: All pink/coral variants MUST map to their respective families
// This ensures colors that look similar to humans are never on the same puzzle
const COLOR_FAMILIES = {
  '#FF6B6B': 'red',
  '#FFA500': 'orange',
  '#FFD700': 'yellow',
  '#4ECB71': 'green',
  '#5DADE2': 'blue',      // ONLY ONE blue family
  '#9B59B6': 'purple',
  '#FF69B4': 'pink',
  '#C0C0C0': 'gray',
  '#CD853F': 'brown',
};

// Mulberry32 PRNG
function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray(array, random) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function isValidPlacement(existingQueens, row, col, regions) {
  const region = regions[row][col];

  for (const [qRow, qCol] of existingQueens) {
    // Same row or column
    if (qRow === row || qCol === col) return false;

    // Same region
    if (regions[qRow][qCol] === region) return false;

    // Adjacent (including diagonals) - LinkedIn's "no-touch" rule
    const rowDiff = Math.abs(row - qRow);
    const colDiff = Math.abs(col - qCol);
    if (rowDiff <= 1 && colDiff <= 1) return false;
  }

  return true;
}

function countSolutions(regions, size, maxCount = 2) {
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

function findSolution(regions, size, random) {
  const columnOrders = [];
  for (let i = 0; i < size; i++) {
    columnOrders.push(
      shuffleArray(Array.from({ length: size }, (_, j) => j), random)
    );
  }

  const solution = [];
  const usedColumns = new Set();
  const usedRegions = new Set();

  function backtrack(row) {
    if (row === size) return true;

    for (const col of columnOrders[row]) {
      const region = regions[row][col];

      if (!usedColumns.has(col) &&
          !usedRegions.has(region) &&
          isValidPlacement(solution, row, col, regions)) {

        solution.push([row, col]);
        usedColumns.add(col);
        usedRegions.add(region);

        if (backtrack(row + 1)) return true;

        solution.pop();
        usedColumns.delete(col);
        usedRegions.delete(region);
      }
    }

    return false;
  }

  if (backtrack(0)) return solution;
  return null;
}

// Generate exactly N contiguous regions for N×N board
function generateRegions(size, random) {
  const regions = Array(size).fill(null).map(() => Array(size).fill(-1));

  // Start with N random seed cells (one per region)
  const allCells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      allCells.push([r, c]);
    }
  }

  const shuffledCells = shuffleArray(allCells, random);
  const seedCells = shuffledCells.slice(0, size);

  // Place seed cells
  seedCells.forEach(([r, c], regionId) => {
    regions[r][c] = regionId;
  });

  // Grow regions using flood fill until all cells assigned
  const queue = seedCells.map(([r, c], id) => ({ r, c, regionId: id }));

  while (queue.length > 0) {
    // Shuffle queue for randomness
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    const { r, c, regionId } = queue.shift();

    // Try to expand to neighbors
    const neighbors = [
      [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
    ];

    shuffleArray(neighbors, random);

    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && regions[nr][nc] === -1) {
        regions[nr][nc] = regionId;
        queue.push({ r: nr, c: nc, regionId });
      }
    }
  }

  return regions;
}

// Validate regions are exactly N and contiguous
function validateRegions(regions, size) {
  const regionCells = new Map();

  // Count cells per region
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const regionId = regions[r][c];
      if (!regionCells.has(regionId)) {
        regionCells.set(regionId, []);
      }
      regionCells.get(regionId).push([r, c]);
    }
  }

  // Must have exactly N regions
  if (regionCells.size !== size) return false;

  // Each region must be contiguous (check with BFS)
  for (const [regionId, cells] of regionCells) {
    if (!isRegionContiguous(cells, size)) return false;
  }

  return true;
}

function isRegionContiguous(cells, size) {
  if (cells.length === 0) return false;

  const cellSet = new Set(cells.map(([r, c]) => `${r}-${c}`));
  const visited = new Set();
  const queue = [cells[0]];
  visited.add(`${cells[0][0]}-${cells[0][1]}`);

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    const neighbors = [[r-1,c], [r+1,c], [r,c-1], [r,c+1]];

    for (const [nr, nc] of neighbors) {
      const key = `${nr}-${nc}`;
      if (cellSet.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push([nr, nc]);
      }
    }
  }

  return visited.size === cells.length;
}

// Generate a single puzzle with unique solution
function generatePuzzle(size, seed, maxAttempts = 100) {
  const random = mulberry32(seed);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const regions = generateRegions(size, random);

    // Validate exactly N contiguous regions
    if (!validateRegions(regions, size)) continue;

    const solutionCount = countSolutions(regions, size, 2);

    if (solutionCount === 1) {
      const solution = findSolution(regions, size, random);

      if (solution) {
        return {
          regions,
          solution,
          seed,
          attempt
        };
      }
    }
  }

  return null;
}

// Convert hex color to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate color distance (Euclidean distance in RGB space)
function colorDistance(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// Build adjacency graph of regions
function buildRegionAdjacencyGraph(regions, size) {
  const adjacency = new Map();

  // Initialize adjacency map for each region
  for (let regionId = 0; regionId < size; regionId++) {
    adjacency.set(regionId, new Set());
  }

  // Check all cells for adjacent regions
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const currentRegion = regions[r][c];

      // Check all 4 neighbors
      const neighbors = [
        [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
      ];

      for (const [nr, nc] of neighbors) {
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          const neighborRegion = regions[nr][nc];
          if (neighborRegion !== currentRegion) {
            adjacency.get(currentRegion).add(neighborRegion);
            adjacency.get(neighborRegion).add(currentRegion);
          }
        }
      }
    }
  }

  return adjacency;
}

// Assign colors using graph coloring with family-aware contrast optimization
// CRITICAL: Each region must have a UNIQUE color (no duplicates on the board)
// CRITICAL: No two adjacent regions can have colors from the same color family
function assignContrastingColors(regions, size, availableColors) {
  const adjacency = buildRegionAdjacencyGraph(regions, size);
  const regionColors = new Array(size);
  const usedColorsGlobal = new Set(); // Track ALL used colors on the board

  // Sort regions by number of neighbors (descending) for better coloring
  const regionsByNeighborCount = Array.from({ length: size }, (_, i) => i)
    .sort((a, b) => adjacency.get(b).size - adjacency.get(a).size);

  // Assign colors to each region
  for (const regionId of regionsByNeighborCount) {
    const neighborColors = Array.from(adjacency.get(regionId))
      .map(neighbor => regionColors[neighbor])
      .filter(color => color !== undefined);

    // Get color families used by neighbors
    const neighborFamilies = new Set(
      neighborColors.map(color => COLOR_FAMILIES[color])
    );

    // Find available colors NOT used anywhere on the board
    // AND not from the same family as any neighbor
    let candidateColors = availableColors.filter(color =>
      !usedColorsGlobal.has(color) &&
      !neighborFamilies.has(COLOR_FAMILIES[color])
    );

    // If no colors available due to family constraints, relax family constraint
    // (but still enforce unique colors globally)
    if (candidateColors.length === 0) {
      candidateColors = availableColors.filter(color => !usedColorsGlobal.has(color));
    }

    if (candidateColors.length === 0) {
      console.error(`ERROR: Not enough colors! Need ${size} unique colors but only have ${availableColors.length}`);
      // Last resort fallback
      candidateColors.push(availableColors[0]);
    }

    // Choose color with maximum average distance to neighbor colors
    // AND prefer colors from different families
    let bestColor = candidateColors[0];
    let maxScore = -Infinity;

    for (const color of candidateColors) {
      if (neighborColors.length === 0) {
        // No neighbors yet, any candidate color is fine
        bestColor = color;
        break;
      }

      // Calculate average RGB distance to neighbors
      const avgDistance = neighborColors.reduce((sum, neighborColor) =>
        sum + colorDistance(color, neighborColor), 0) / neighborColors.length;

      // Bonus for being from a different family than all neighbors
      const familyBonus = !neighborFamilies.has(COLOR_FAMILIES[color]) ? 100 : 0;

      // Combined score: RGB distance + family diversity bonus
      const score = avgDistance + familyBonus;

      if (score > maxScore) {
        maxScore = score;
        bestColor = color;
      }
    }

    regionColors[regionId] = bestColor;
    usedColorsGlobal.add(bestColor); // Mark this color as used globally
  }

  return regionColors;
}

// Load existing puzzles from file
function loadExistingPuzzles(size) {
  try {
    const dataDir = path.join(__dirname, '../data/queens');
    const filePath = path.join(dataDir, `puzzles-${size}x${size}.json`);

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.log(`  No existing puzzles found for ${size}x${size}`);
  }
  return [];
}

// Extract used seeds from puzzles
function extractUsedSeeds(puzzles) {
  return new Set(puzzles.map(p => p.seed));
}

// Generate batch of puzzles
async function generateBatch(size, count, startSeed, usedSeeds = new Set()) {
  console.log(`\n🎲 Generating ${count} puzzles for ${size}×${size} board...`);

  const puzzles = [];
  let seed = startSeed;
  let totalAttempts = 0;
  const maxTotalAttempts = count * 500;

  while (puzzles.length < count && totalAttempts < maxTotalAttempts) {
    totalAttempts++;

    // Skip if seed already used
    if (usedSeeds.has(seed)) {
      seed++;
      continue;
    }

    const puzzle = generatePuzzle(size, seed++, 50);

    if (puzzle) {
      puzzles.push(puzzle);

      if (puzzles.length % 10 === 0 || puzzles.length === count) {
        console.log(`  ✅ ${puzzles.length}/${count} puzzles generated`);
      }
    }

    if (totalAttempts % 100 === 0 && puzzles.length < count) {
      console.log(`  ... ${totalAttempts} attempts, ${puzzles.length}/${count} found`);
    }
  }

  if (puzzles.length < count) {
    console.log(`  ⚠️  Only generated ${puzzles.length}/${count} puzzles after ${totalAttempts} attempts`);
  }

  return puzzles.map((p, i) => {
    // Use graph coloring algorithm to assign contrasting colors to adjacent regions
    const regionColors = assignContrastingColors(p.regions, size, REGION_COLORS);

    return {
      id: `${size}x${size}-${String(i + 1).padStart(4, '0')}`,
      size,
      seed: p.seed,
      regions: p.regions,
      regionColors,
      solution: p.solution,
    };
  });
}

// Main generation function
async function generateAllPuzzles() {
  console.log('🔧 LinkedIn Queens Puzzle Generator');
  console.log('===================================\n');

  const startTime = Date.now();
  let startSeed = Date.now();

  // Load existing puzzles and extract used seeds to prevent duplicates
  console.log('📖 Loading existing puzzles to prevent duplicates...\n');
  const existing6x6 = loadExistingPuzzles(6);
  const existing7x7 = loadExistingPuzzles(7);
  const existing8x8 = loadExistingPuzzles(8);
  const existing9x9 = loadExistingPuzzles(9);

  const usedSeeds6x6 = extractUsedSeeds(existing6x6);
  const usedSeeds7x7 = extractUsedSeeds(existing7x7);
  const usedSeeds8x8 = extractUsedSeeds(existing8x8);
  const usedSeeds9x9 = extractUsedSeeds(existing9x9);

  console.log(`  Found ${existing6x6.length} existing 6×6 puzzles (${usedSeeds6x6.size} unique seeds)`);
  console.log(`  Found ${existing7x7.length} existing 7×7 puzzles (${usedSeeds7x7.size} unique seeds)`);
  console.log(`  Found ${existing8x8.length} existing 8×8 puzzles (${usedSeeds8x8.size} unique seeds)`);
  console.log(`  Found ${existing9x9.length} existing 9×9 puzzles (${usedSeeds9x9.size} unique seeds)`);

  // Generate puzzles for each board size (400 each with duplicate prevention)
  const puzzles6x6 = await generateBatch(6, 400, startSeed, usedSeeds6x6);
  startSeed += 100000;

  const puzzles7x7 = await generateBatch(7, 400, startSeed, usedSeeds7x7);
  startSeed += 100000;

  const puzzles8x8 = await generateBatch(8, 400, startSeed, usedSeeds8x8);
  startSeed += 100000;

  const puzzles9x9 = await generateBatch(9, 400, startSeed, usedSeeds9x9);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n✅ Generation complete!\n');
  console.log(`6×6: ${puzzles6x6.length} puzzles`);
  console.log(`7×7: ${puzzles7x7.length} puzzles`);
  console.log(`8×8: ${puzzles8x8.length} puzzles`);
  console.log(`9×9: ${puzzles9x9.length} puzzles`);
  console.log(`\nTotal: ${puzzles6x6.length + puzzles7x7.length + puzzles8x8.length + puzzles9x9.length} puzzles`);
  console.log(`Time: ${elapsed}s\n`);

  // Save to separate JSON files
  const dataDir = path.join(__dirname, '../data/queens');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, 'puzzles-6x6.json'),
    JSON.stringify(puzzles6x6, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'puzzles-7x7.json'),
    JSON.stringify(puzzles7x7, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'puzzles-8x8.json'),
    JSON.stringify(puzzles8x8, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'puzzles-9x9.json'),
    JSON.stringify(puzzles9x9, null, 2)
  );

  console.log('📝 Saved to src/data/queens/*.json\n');
}

// Run generator
generateAllPuzzles().catch(console.error);
