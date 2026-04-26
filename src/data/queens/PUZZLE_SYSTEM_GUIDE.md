# Queens Puzzle System - Comprehensive Guide

**Version**: 2.1 (Recoloring System Added)
**Last Updated**: April 25, 2026
**Author**: PuzzleEdge Development Team

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Color Theory & Perceptual Families](#color-theory--perceptual-families)
3. [Puzzle Generation Algorithm](#puzzle-generation-algorithm)
4. [File Structure & Architecture](#file-structure--architecture)
5. [Adding New Puzzles](#adding-new-puzzles)
6. [Recoloring vs. Regenerating Puzzles](#recoloring-vs-regenerating-puzzles)
7. [Changing Colors](#changing-colors)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Troubleshooting](#troubleshooting)
10. [Historical Context & Lessons Learned](#historical-context--lessons-learned)

---

## System Overview

### What is Queens Puzzle?

The Queens puzzle (inspired by LinkedIn's daily puzzle game) is a logic puzzle where:
- Players place N queens on an N×N grid
- Each queen must be in a different row, column, and colored region
- No two queens can touch (including diagonally)
- Each puzzle has exactly one solution

### Current System Stats

- **Total Puzzles**: 1,600 (400 per size: 6×6, 7×7, 8×8, 9×9)
- **Total Colors**: 9 (pastel palette)
- **Generation Time**: ~94 seconds
- **Storage**: ~2MB (JSON files)
- **Algorithm**: Backtracking with flood-fill region generation

---

## Color Theory & Perceptual Families

### The Critical Insight: Perceptual vs RGB Families

**Problem**: RGB color distance doesn't match human perception.

Colors like:
- `#00CED1` (Dark Turquoise)
- `#00D9FF` (Cyan)
- `#5DADE2` (Sky Blue)
- `#4169E1` (Royal Blue)
- `#87CEEB` (Light Sky Blue)
- `#20B2AA` (Light Sea Green)

All have RGB distances > 100 (considered "distinct" by algorithm), but **ALL LOOK BLUE** to human eyes, especially colorblind users.

### The Solution: Perceptual Family Mapping

Map ALL blue-like colors to a single "blue" family. Then:
1. Use ONLY ONE blue color in the entire palette
2. Family-aware algorithm ensures no two colors from the same family are ever on the same puzzle
3. Family-aware algorithm ensures no two colors from the same family are adjacent

### Current Pastel Palette

```javascript
const REGION_COLORS = [
  '#FFB3BA', // Pastel Red (light coral pink-red)
  '#FFDFBA', // Pastel Orange (light peach)
  '#FFFFBA', // Pastel Yellow (baby yellow)
  '#BAFFC9', // Pastel Green (mint green)
  '#BAE1FF', // Pastel Blue (baby blue)
  '#D4BBFF', // Pastel Purple (lilac)
  '#FFBAF3', // Pastel Pink (light pink)
  '#E0E0E0', // Pastel Gray (light gray)
  '#D7C9AA', // Pastel Brown (tan/beige)
];

const COLOR_FAMILIES = {
  '#FFB3BA': 'red',
  '#FFDFBA': 'orange',
  '#FFFFBA': 'yellow',
  '#BAFFC9': 'green',
  '#BAE1FF': 'blue',    // ONLY ONE blue family
  '#D4BBFF': 'purple',
  '#FFBAF3': 'pink',
  '#E0E0E0': 'gray',
  '#D7C9AA': 'brown',
};
```

### Why Pastel Colors?

1. **High Luminance**: All > 0.15, ensuring black queens and X marks are clearly visible
2. **Soft Contrast**: Gentle on eyes during extended play
3. **Accessibility**: Better for colorblind users than saturated colors
4. **Professional Aesthetic**: Matches LinkedIn's professional tone

### Color Requirements Checklist

Before adding any color:
- [ ] Luminance > 0.15 (use `getLuminance()` function)
- [ ] Not in a family that already has a color in the palette
- [ ] RGB distance > 100 from all existing colors (use `colorDistance()` function)
- [ ] Test with colorblind simulators
- [ ] Verify queens and X marks are visible on the color

---

## Puzzle Generation Algorithm

### High-Level Flow

```
1. Generate Regions (Flood Fill)
   ↓
2. Validate Regions (N contiguous regions)
   ↓
3. Check Solution Count (must be exactly 1)
   ↓
4. Find Solution (backtracking)
   ↓
5. Assign Colors (family-aware graph coloring)
   ↓
6. Save to JSON
```

### Region Generation

**Algorithm**: Flood fill with randomized growth

```javascript
1. Place N random seed cells (one per region)
2. Add seeds to a queue
3. While queue not empty:
   a. Pop a cell from queue (randomized)
   b. Try to expand to 4 neighbors (up, down, left, right)
   c. Assign neighbors to same region
   d. Add neighbors to queue
4. Repeat until all cells assigned
```

**Why this works**: Creates natural, contiguous regions with varied shapes

### Solution Validation

**Algorithm**: Backtracking with pruning

```javascript
function countSolutions(regions, size, maxCount = 2) {
  // Try placing queens row by row
  // For each row, try all columns
  // Check: queen doesn't conflict with existing queens
  // Check: queen's column not used
  // Check: queen's region not used
  // Check: queen doesn't touch any existing queens
  // If N queens placed: found a solution
  // Stop early if > 1 solution found
}
```

**Critical**: Puzzles with 0 or 2+ solutions are discarded. Only 1-solution puzzles saved.

### Color Assignment

**Algorithm**: Family-aware graph coloring with maximum contrast

```javascript
function assignContrastingColors(regions, size, availableColors) {
  // 1. Build adjacency graph
  const adjacency = buildRegionAdjacencyGraph(regions, size);

  // 2. Sort regions by neighbor count (descending)
  // More constrained regions get colored first

  // 3. For each region:
  for (const regionId of regionsByNeighborCount) {
    // Get neighbor colors and families
    const neighborColors = getNeighborColors(regionId);
    const neighborFamilies = getNeighborFamilies(neighborColors);

    // Filter candidates: not used globally AND different family from neighbors
    let candidates = availableColors.filter(color =>
      !usedColorsGlobal.has(color) &&
      !neighborFamilies.has(COLOR_FAMILIES[color])
    );

    // Choose color with max average RGB distance to neighbors
    // PLUS bonus for being from different family (100 points)
    bestColor = findMaxContrastColor(candidates, neighborColors);

    // Assign and mark as used
    regionColors[regionId] = bestColor;
    usedColorsGlobal.add(bestColor);
  }
}
```

**Key Features**:
- **Global uniqueness**: Each color used at most once per puzzle
- **Family diversity**: No adjacent regions share a color family
- **Maximum contrast**: Chooses color with highest average RGB distance to neighbors
- **Family bonus**: 100-point bonus for different family ensures perceptual distinctness

---

## File Structure & Architecture

### Directory Layout

```
puzzleedge/
├── src/
│   ├── data/
│   │   └── queens/
│   │       ├── puzzles-6x6.json       # 400 puzzles
│   │       ├── puzzles-7x7.json       # 400 puzzles
│   │       ├── puzzles-8x8.json       # 400 puzzles
│   │       ├── puzzles-9x9.json       # 400 puzzles
│   │       ├── COLOR_RULES.md         # Quick reference for colors
│   │       └── PUZZLE_SYSTEM_GUIDE.md # This file
│   ├── scripts/
│   │   ├── generateQueensPuzzles.js   # Full puzzle generation (~90s)
│   │   └── recolorQueensPuzzles.js    # Fast recoloring only (~0.2s)
│   └── constants/
│       └── colors.ts                  # Frontend color constants
└── public/
    └── data/
        └── queens/
            ├── puzzles-6x6.json       # Copied for web access
            ├── puzzles-7x7.json
            ├── puzzles-8x8.json
            └── puzzles-9x9.json
```

### Puzzle JSON Format

```json
{
  "id": "9x9-0001",
  "size": 9,
  "seed": 1729878123,
  "regions": [
    [0, 0, 1, 1, 2, 3, 3, 3, 4],
    [0, 0, 1, 2, 2, 2, 3, 4, 4],
    ...
  ],
  "regionColors": [
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9",
    "#BAE1FF", "#D4BBFF", "#FFBAF3", "#E0E0E0", "#D7C9AA"
  ],
  "solution": [
    [0, 5], [1, 2], [2, 8], [3, 1], [4, 4],
    [5, 0], [6, 6], [7, 3], [8, 7]
  ]
}
```

**Fields**:
- `id`: Unique identifier (format: `{size}x{size}-{index}`)
- `size`: Board dimension (6, 7, 8, or 9)
- `seed`: Random seed for reproducibility
- `regions`: 2D array mapping each cell to a region ID (0 to N-1)
- `regionColors`: Array of N colors (index = region ID)
- `solution`: Array of [row, col] positions for queens

---

## Adding New Puzzles

### Method 1: Increase Batch Size

**When to use**: Need more puzzles for existing sizes

```javascript
// In generateQueensPuzzles.js, line ~537
const puzzles6x6 = await generateBatch(6, 600, startSeed, usedSeeds6x6); // Was 400
const puzzles7x7 = await generateBatch(7, 600, startSeed, usedSeeds7x7); // Was 400
const puzzles8x8 = await generateBatch(8, 600, startSeed, usedSeeds8x8); // Was 400
const puzzles9x9 = await generateBatch(9, 600, startSeed, usedSeeds9x9); // Was 400
```

Then run:
```bash
node src/scripts/generateQueensPuzzles.js
cp src/data/queens/*.json public/data/queens/
```

**Note**: Script automatically prevents duplicates by checking existing seeds

### Method 2: Add New Size

**When to use**: Need a new board size (e.g., 10×10)

**WARNING**: Requires 10 colors! Current palette only has 9.

Steps:
1. Add a 10th color to `REGION_COLORS` and `COLOR_FAMILIES`
2. Verify color meets all requirements (see Color Requirements Checklist)
3. Add generation batch:
   ```javascript
   const puzzles10x10 = await generateBatch(10, 400, startSeed, new Set());
   ```
4. Add save logic:
   ```javascript
   fs.writeFileSync(
     path.join(dataDir, 'puzzles-10x10.json'),
     JSON.stringify(puzzles10x10, null, 2)
   );
   ```
5. Update frontend constants in `src/constants/colors.ts`

---

## Recoloring vs. Regenerating Puzzles

### The Critical Distinction

**Recoloring** (fast, ~0.2 seconds):
- Updates ONLY the `regionColors` field in existing puzzles
- Keeps puzzle structures (`regions`, `solution`, `seed`) unchanged
- Use when: Changing color palette, tweaking colors, experimenting

**Regenerating** (slow, ~90 seconds):
- Creates entirely new puzzles from scratch
- New regions, new solutions, new seeds, new colors
- Use when: Adding more puzzles, changing board sizes

### Quick Decision Tree

```
Do you want to change colors?
├─ YES → Use recoloring script (0.2s)
└─ NO → Do you want more/different puzzles?
   ├─ YES → Use generation script (90s)
   └─ NO → You're all set!
```

### Recoloring Script Usage

**When to use**:
- Changing color hex values
- Switching entire color palette
- Adjusting color families
- Experimenting with different colors

**How to use**:
```bash
# 1. Update colors in src/scripts/recolorQueensPuzzles.js
# Edit REGION_COLORS and COLOR_FAMILIES constants

# 2. Run recoloring script
node src/scripts/recolorQueensPuzzles.js

# 3. Copy to public directory
cp src/data/queens/*.json public/data/queens/

# 4. Update frontend colors
# Edit src/constants/colors.ts to match new palette
```

**Performance**: Recolors all 1,600 puzzles in ~0.2 seconds (450x faster than regeneration!)

**Note**: The recoloring script (`recolorQueensPuzzles.js`) and generation script (`generateQueensPuzzles.js`) share the same color assignment algorithm, so results are identical.

---

## Changing Colors

### To Change a Single Color (Fast Method - 0.2s)

**Scenario**: Want to replace Pastel Brown with a different color

1. **Choose new color** following Color Requirements Checklist

2. **Update `src/scripts/recolorQueensPuzzles.js`**:
   ```javascript
   const REGION_COLORS = [
     '#FF9999', '#FFB366', '#FFFF99', '#90EE90',
     '#87CEEB', '#B19CD9', '#FFB3D9', '#D3D3D3',
     '#F5DEB3', // NEW: Wheat (replacing tan)
   ];

   const COLOR_FAMILIES = {
     // ... other families
     '#F5DEB3': 'brown', // Keep family name
   };
   ```

3. **Run recoloring script** (0.2 seconds):
   ```bash
   node src/scripts/recolorQueensPuzzles.js
   ```

4. **Update frontend**:
   ```typescript
   // src/constants/colors.ts
   export const queenRegionColors = [
     '#FF9999', '#FFB366', '#FFFF99', '#90EE90',
     '#87CEEB', '#B19CD9', '#FFB3D9', '#D3D3D3',
     '#F5DEB3', // NEW
   ] as const;
   ```

5. **Copy to public**:
   ```bash
   cp src/data/queens/*.json public/data/queens/
   ```

**Important**: Also update the same colors in `generateQueensPuzzles.js` to keep both scripts in sync for future puzzle generation.

### To Change the Entire Palette (Fast Method - 0.2s)

**Scenario**: Want to switch from pastel to vibrant colors

1. **Define new palette** with 9 colors following Color Requirements Checklist

2. **Update both color scripts**:
   - `src/scripts/recolorQueensPuzzles.js` (for recoloring existing puzzles)
   - `src/scripts/generateQueensPuzzles.js` (for future puzzle generation)

3. **Update `COLOR_FAMILIES`** with perceptual mappings in both scripts

4. **Test color distances** (optional but recommended):
   ```javascript
   // All pairs should have distance > 100
   for (let i = 0; i < REGION_COLORS.length; i++) {
     for (let j = i + 1; j < REGION_COLORS.length; j++) {
       const dist = colorDistance(REGION_COLORS[i], REGION_COLORS[j]);
       console.log(`${i} ↔ ${j}: ${dist.toFixed(1)}`);
     }
   }
   ```

5. **Run recoloring script** (0.2 seconds):
   ```bash
   node src/scripts/recolorQueensPuzzles.js
   cp src/data/queens/*.json public/data/queens/
   ```

6. **Update frontend** in `src/constants/colors.ts`

7. **Update `COLOR_RULES.md`** documentation

---

## Accessibility Guidelines

### Colorblind Testing

Test with:
- **Protanopia** (red-blind): ~1% of males
- **Deuteranopia** (green-blind): ~1% of males
- **Tritanopia** (blue-blind): ~0.001% of population

Tools:
- [Coblis - Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- Chrome DevTools: Rendering > Emulate vision deficiencies

### Luminance Requirements

**Formula**:
```javascript
const getLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val /= 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
```

**Requirements**:
- All colors must have luminance > 0.15
- Black queens (#000000, luminance ≈ 0) must be clearly visible
- Black X marks (#000000) must be clearly visible

### Contrast Guidelines

- **Minimum RGB distance**: 100 (between any two colors)
- **Recommended RGB distance**: 150+ (for excellent accessibility)
- **Perceptual family**: NEVER two colors from same family in one puzzle

---

## Troubleshooting

### "Not enough colors!" Error

**Cause**: Board size exceeds number of available colors

**Fix**: Add more colors to `REGION_COLORS` (ensure each from different perceptual family)

### Similar Colors Appearing Adjacent

**Cause**: Multiple colors in palette from same perceptual family

**Diagnosis**:
```javascript
// Check if multiple colors map to same family
const familyCounts = {};
for (const [color, family] of Object.entries(COLOR_FAMILIES)) {
  familyCounts[family] = (familyCounts[family] || 0) + 1;
}
console.log(familyCounts);
// All counts should be 1
```

**Fix**: Reduce palette to one color per perceptual family

### Puzzles Taking Too Long to Generate

**Cause**: 8×8 and 9×9 puzzles are harder to generate (more constraints)

**Expected times**:
- 6×6: ~1-2 seconds per 100 puzzles
- 7×7: ~3-5 seconds per 100 puzzles
- 8×8: ~10-15 seconds per 100 puzzles
- 9×9: ~30-50 seconds per 100 puzzles

**Optimization**: Increase `maxAttempts` parameter if too many failures

### Duplicate Puzzles

**Cause**: Rare, but can happen if same seed generates same puzzle

**Prevention**: Script automatically tracks used seeds and skips duplicates

---

## Historical Context & Lessons Learned

### Version 1.0 (Initial Release)
- 20 colors, multiple per family
- RGB distance-based family definitions
- Result: Similar colors appeared adjacent (teal + blue, pink + red)

### Version 1.5 (Family-Aware Update)
- Added `COLOR_FAMILIES` mapping
- Added family-aware algorithm with 100-point bonus
- Problem: Still had 6 blue variants (teal, cyan, sky blue, royal blue, light sky blue, sea green)
- Result: Teal and blue still appeared adjacent

### Version 2.0 (Pastel Perceptual Family Update) ← CURRENT
- **Key Breakthrough**: Perceptual family mapping
- Reduced to 9 colors (one per perceptual family)
- Switched to pastel palette for better contrast with black queens
- Result: No more similar-color adjacency issues ✅

### Key Lessons

1. **RGB distance ≠ perceptual distance**: Colors can be far apart in RGB space but look identical to humans
2. **Think perceptually, not mathematically**: Group colors by how humans perceive them, not RGB values
3. **Less is more**: 9 distinct colors better than 20 similar ones
4. **Accessibility first**: Design for colorblind users from the start
5. **Document everything**: Future you will thank present you

---

## Quick Reference Commands

```bash
# Recolor existing puzzles (FAST - 0.2s)
node src/scripts/recolorQueensPuzzles.js
cp src/data/queens/*.json public/data/queens/

# Generate new puzzles (SLOW - 90s)
node src/scripts/generateQueensPuzzles.js
cp src/data/queens/*.json public/data/queens/

# Check puzzle file sizes
ls -lh src/data/queens/

# Validate JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('src/data/queens/puzzles-9x9.json')))"

# Count puzzles
node -e "console.log(JSON.parse(require('fs').readFileSync('src/data/queens/puzzles-9x9.json')).length)"
```

---

## Support & Contributions

For questions or issues:
1. Check this guide first
2. Review `COLOR_RULES.md` for color-specific questions
3. Check the code comments in `generateQueensPuzzles.js`
4. Open an issue on GitHub

**Remember**: When in doubt, prioritize accessibility over aesthetics. Puzzles should be solvable by everyone.

---

**Document Version**: 2.1
**Last Reviewed**: April 25, 2026
**Next Review**: When adding new features or changing colors

**Key Update in v2.1**: Added recoloring system for fast color changes (0.2s vs 90s regeneration)
