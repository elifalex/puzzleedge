/**
 * Queens Puzzle Recoloring Script
 * Updates colors on existing puzzles without regenerating puzzle structures
 * Much faster than full regeneration (~5s vs ~90s)
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

// Recolor a single puzzle
function recolorPuzzle(puzzle) {
  const { size, regions } = puzzle;
  const regionColors = assignContrastingColors(regions, size, REGION_COLORS);

  return {
    ...puzzle,
    regionColors
  };
}

// Main recoloring function
async function recolorAllPuzzles() {
  console.log('🎨 Queens Puzzle Recoloring Script');
  console.log('==================================\n');

  const startTime = Date.now();
  const dataDir = path.join(__dirname, '../data/queens');
  const sizes = [6, 7, 8, 9];

  let totalRecolored = 0;

  for (const size of sizes) {
    const filePath = path.join(dataDir, `puzzles-${size}x${size}.json`);

    console.log(`🎨 Recoloring ${size}×${size} puzzles...`);

    // Load existing puzzles
    const puzzles = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`  Loaded ${puzzles.length} puzzles`);

    // Recolor each puzzle
    const recoloredPuzzles = puzzles.map((puzzle, index) => {
      if ((index + 1) % 100 === 0) {
        console.log(`  ✅ ${index + 1}/${puzzles.length} puzzles recolored`);
      }
      return recolorPuzzle(puzzle);
    });

    // Save recolored puzzles
    fs.writeFileSync(filePath, JSON.stringify(recoloredPuzzles, null, 2));
    console.log(`  ✅ Saved ${recoloredPuzzles.length} recolored puzzles\n`);

    totalRecolored += recoloredPuzzles.length;
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('✅ Recoloring complete!\n');
  console.log(`Total puzzles recolored: ${totalRecolored}`);
  console.log(`Time: ${elapsed}s\n`);
  console.log('📝 Saved to src/data/queens/*.json\n');
  console.log('💡 Next step: cp src/data/queens/*.json public/data/queens/\n');
}

// Run recoloring
recolorAllPuzzles().catch(console.error);
