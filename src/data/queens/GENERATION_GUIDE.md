# LinkedIn Queens Puzzle Generation Guide

## Overview

This document explains how the LinkedIn Queens puzzle generator works, including all game rules, algorithms, and how to generate additional puzzles in the future.

**Current Puzzle Count**: 1,600 total puzzles (400 each of 6×6, 7×7, 8×8, 9×9)

**Generation Script**: `src/scripts/generateQueensPuzzles.js`

---

## Game Rules

The LinkedIn Queens puzzle is a logic puzzle that combines the classic "N-Queens" chess problem with region-based constraints similar to Sudoku. Every puzzle must satisfy these **four non-negotiable rules**:

### 1. The Row and Column Constraint
Each horizontal row and each vertical column must contain **exactly one queen**. Once you place a queen, you can "X" out the rest of that row and column.

### 2. The Color Constraint (Region Constraint)
The board is divided into distinct colored regions (shapes). Each colored region must contain **exactly one queen**. This is usually the most important rule for making deductions in the middle of a game.

### 3. The Adjacency Constraint (The "No-Touch" Rule)
Queens cannot touch each other, **even diagonally**. This means a queen creates a 3×3 "dead zone" around itself. If a queen is placed at cell (5,5), no other queen can exist in any of the eight cells immediately surrounding it.

**Note**: This is stricter than standard chess, where queens can't be on the same long diagonal but can be "near" each other.

### 4. The Unique Solution
Every puzzle is **mathematically designed to have only one valid arrangement** of queens. If you find yourself guessing, you are likely missing a logical deduction.

---

## Generator Architecture

### Core Algorithms

#### 1. Region Generation (`generateRegions`)
- Creates exactly N contiguous regions for an N×N board
- Uses flood-fill algorithm starting from N random seed cells
- Ensures all regions are connected (validated via BFS)

#### 2. Solution Validation (`countSolutions`)
- Uses backtracking to verify puzzle has exactly 1 solution
- Checks all four constraints during placement:
  - Row uniqueness
  - Column uniqueness
  - Region uniqueness
  - Adjacency (no-touch) rule

#### 3. Graph Coloring Algorithm (`assignContrastingColors`)
**Purpose**: Ensure adjacent regions have highly contrasting colors for visual clarity.

**Algorithm**:
1. Build adjacency graph of regions (which regions touch each other)
2. Sort regions by neighbor count (most constrained first)
3. For each region:
   - Find all colors used by neighboring regions
   - Filter out those colors from candidates
   - Calculate RGB distance to all neighbor colors
   - Select color with **maximum average distance**

**Color Distance Formula**:
```javascript
distance = √((r1-r2)² + (g1-g2)² + (b1-b2)²)
```

This ensures colors like Navy Blue and Sky Blue, or Red and Pink, are never placed adjacent to each other.

#### 4. Duplicate Prevention (`loadExistingPuzzles`, `extractUsedSeeds`)
- Loads existing puzzle files before generation
- Extracts Set of all used seeds
- During generation, skips any seed that was previously used
- Allows safe regeneration and extension of puzzle libraries

---

## Color Palette

The generator uses **20 highly contrasting colors** from **diverse color families** to ensure every region on the board has a unique color:

```javascript
const REGION_COLORS = [
  '#E63946', // Bold Red
  '#5DADE2', // Bright Blue
  '#FFD60A', // Vivid Yellow
  '#2ECC71', // Emerald Green
  '#9D4EDD', // Violet Purple
  '#FF6F00', // Bright Orange
  '#FF69B4', // Hot Pink
  '#A7C957', // Lime Green
  '#FB8B24', // Coral
  '#F4A460', // Sandy Brown
  '#FF1493', // Deep Magenta
  '#FFB6C1', // Light Pink
  '#9B59B6', // Amethyst Purple
  '#32CD32', // Bright Lime
  '#FF4500', // Orange Red
  '#DC143C', // Crimson
  '#00D9FF', // Cyan
  '#FFE135', // Golden Yellow
  '#C71585', // Medium Violet Red
  '#7FFF00', // Chartreuse
];
```

### Critical Color Selection Rules

These rules were learned through user feedback and must be followed when updating the palette:

#### 1. **NO Dark Colors**
- **Rule**: All colors must have luminance > 0.15
- **Why**: Black queens are placed on colored regions. Dark colors (navy blue, dark brown, indigo) make the queens invisible.
- **Test**: Calculate luminance using WCAG formula. If luminance < 0.15, reject the color.

#### 2. **NO Similar Colors from Same Family**
- **Rule**: Only ONE color per color family (one blue, one cyan, one teal, etc.)
- **Why**: Having multiple blues/cyans/teals means they can be placed adjacent to each other, making them indistinguishable.
- **Previous Mistake**: We had 5 blue/cyan colors (#5DADE2, #4CC9F0, #00CED1, #1E90FF, #06D6A0) which created confusion when placed next to each other.
- **Solution**: Reduced to ONE cyan (#00D9FF) and removed all other blue/teal variants.

#### 3. **Diverse Color Families Required**
- **Rule**: Colors must span multiple distinct color families:
  - Reds (Bold Red, Crimson, Orange Red)
  - Oranges (Bright Orange, Coral)
  - Yellows (Vivid Yellow, Golden Yellow)
  - Greens (Emerald Green, Lime Green, Bright Lime, Chartreuse)
  - Blues/Cyans (Bright Blue, Cyan)
  - Purples/Violets (Violet Purple, Amethyst Purple, Medium Violet Red)
  - Pinks (Hot Pink, Deep Magenta, Light Pink)
  - Browns (Sandy Brown)
- **Why**: Ensures adjacent colors are from different families, maximizing visual distinction.

#### 4. **Minimum RGB Distance**
- **Rule**: Any two colors in the palette should have RGB distance > 100 (calculated using Euclidean distance)
- **Why**: Colors with distance < 100 look too similar, especially when not adjacent.
- **Formula**: `√((r1-r2)² + (g1-g2)² + (b1-b2)²)`

#### 5. **Unique Colors Per Board (Critical)**
- **Rule**: The algorithm MUST ensure all N regions on an N×N board get N unique colors
- **Why**: Duplicate colors on the same board confuse players about which region a queen belongs to
- **Implementation**: Use `usedColorsGlobal` Set to track ALL colors used on the board

#### 6. **Maximum Contrast for Adjacent Regions**
- **Rule**: When assigning colors, choose the color with maximum average RGB distance to ALL neighbor colors
- **Why**: Ensures neighboring regions are as visually distinct as possible
- **Implementation**: Graph coloring algorithm with contrast optimization

### Color Selection Process

When adding or changing colors:

1. **Check Luminance**: Ensure luminance > 0.15
2. **Check Color Family**: Ensure no duplicates from same family
3. **Check RGB Distance**: Calculate distance to all existing colors (must be > 100)
4. **Visual Test**: Generate sample puzzles and verify queens are clearly visible
5. **Adjacency Test**: Manually check that no two similar colors appear adjacent in generated puzzles

### Why This Matters

- **User Experience**: Players need to quickly identify which colored region each queen belongs to
- **Accessibility**: Queens must be visible for all users, including those with visual impairments
- **Game Logic**: Color confusion leads to gameplay mistakes and frustration
- **Professional Polish**: LinkedIn Queens uses carefully selected colors - we must match that quality

---

## Validation Criteria

Every generated puzzle must pass these checks:

### Region Validation
- ✅ Exactly N regions on N×N board
- ✅ All regions are contiguous (no disconnected cells)
- ✅ All cells assigned to a region

### Solution Validation
- ✅ Exactly 1 valid solution (not 0, not 2+)
- ✅ Solution satisfies all 4 game rules
- ✅ Solution can be found via backtracking

### Color Validation
- ✅ **ALL regions on the board have unique colors** (no duplicates)
- ✅ Adjacent regions have maximum color contrast
- ✅ RGB distance optimization ensures visually distinct neighboring colors

---

## How to Generate More Puzzles

### To Add 100 More Puzzles to Each Category

1. **Open the generator script**:
   ```
   src/scripts/generateQueensPuzzles.js
   ```

2. **Locate the `generateAllPuzzles()` function** (around line 452)

3. **Update the puzzle count** from 400 to 500:
   ```javascript
   const puzzles6x6 = await generateBatch(6, 500, startSeed, usedSeeds6x6);
   const puzzles7x7 = await generateBatch(7, 500, startSeed, usedSeeds7x7);
   const puzzles8x8 = await generateBatch(8, 500, startSeed, usedSeeds8x8);
   const puzzles9x9 = await generateBatch(9, 500, startSeed, usedSeeds9x9);
   ```

4. **Run the generator**:
   ```bash
   node src/scripts/generateQueensPuzzles.js
   ```

5. **Copy to public directory**:
   ```bash
   cp src/data/queens/puzzles-*.json public/data/queens/
   ```

### Generation Performance

Expected generation time (on modern hardware):

- **6×6**: ~100 puzzles/minute
- **7×7**: ~70 puzzles/minute
- **8×8**: ~40 puzzles/minute
- **9×9**: ~20 puzzles/minute

The 1,600 puzzle generation (400 each) took **96.3 seconds** total.

---

## File Structure

```
src/
  data/queens/
    GENERATION_GUIDE.md         ← This file
    puzzles-6x6.json            ← 400 puzzles (6×6 board)
    puzzles-7x7.json            ← 400 puzzles (7×7 board)
    puzzles-8x8.json            ← 400 puzzles (8×8 board)
    puzzles-9x9.json            ← 400 puzzles (9×9 board)
  scripts/
    generateQueensPuzzles.js    ← Generator script

public/
  data/queens/
    puzzles-*.json              ← Copy of puzzles for deployment
```

---

## Puzzle JSON Format

Each puzzle file contains an array of puzzle objects:

```json
{
  "id": "7x7-0001",
  "size": 7,
  "seed": 1745678912345,
  "regions": [
    [0, 0, 1, 1, 2, 3, 3],
    [0, 1, 1, 2, 2, 3, 3],
    ...
  ],
  "regionColors": [
    "#E63946",  // Color for region 0
    "#FFD60A",  // Color for region 1
    ...
  ],
  "solution": [
    [0, 4],    // Queen at row 0, col 4
    [1, 1],    // Queen at row 1, col 1
    ...
  ]
}
```

### Field Descriptions

- **id**: Unique identifier (format: `{size}x{size}-{number}`)
- **size**: Board dimensions (6, 7, 8, or 9)
- **seed**: Random seed used for generation (for reproducibility)
- **regions**: 2D array where each cell contains its region ID (0 to N-1)
- **regionColors**: Array of hex colors, one per region
- **solution**: Array of [row, col] coordinates for queen placements

---

## Algorithm Parameters

### Tunable Parameters in `generatePuzzle()`

```javascript
function generatePuzzle(size, seed, maxAttempts = 100)
```

- **size**: Board dimensions (6-9 supported)
- **seed**: Starting seed for PRNG
- **maxAttempts**: Max tries per seed before giving up (default: 100)

### Tunable Parameters in `generateBatch()`

```javascript
const maxTotalAttempts = count * 500;
```

- **count * 500**: Maximum total attempts before stopping generation
- Increase multiplier if generation frequently times out

---

## Debugging & Troubleshooting

### Low Success Rate for Larger Boards

If 9×9 generation is taking too long:
1. Increase `maxTotalAttempts` multiplier (e.g., count * 1000)
2. Reduce `maxAttempts` per puzzle (e.g., 50 instead of 100)
3. Consider parallelizing generation across multiple processes

### Duplicate Puzzles

The duplicate prevention system tracks seeds, not puzzle configurations. If you need to:
- **Prevent seed duplicates**: Current system handles this
- **Prevent configuration duplicates**: Would need to add hash comparison of region layouts

### Color Adjacency Issues

If similar colors appear adjacent to each other in puzzles:

**Problem**: Two colors that look similar (e.g., sky blue and cyan) are placed next to each other
**Root Cause**: Multiple colors from the same color family exist in the palette

**Solution Steps**:
1. **Identify Similar Colors**: Use the luminance/distance checker script to find colors with distance < 100
2. **Review Color Families**: Check if multiple colors belong to the same family (blues, greens, etc.)
3. **Remove Duplicates**: Keep only ONE color per family, remove the rest
4. **Replace with Diverse Colors**: Add colors from underrepresented families
5. **Test RGB Distance**: Verify all color pairs have distance > 100
6. **Regenerate Puzzles**: Run the generator to create new puzzles with updated palette
7. **Visual Verification**: Manually check several random puzzles for adjacency issues

**Prevention**:
- Before adding ANY new color, calculate its distance to ALL existing colors
- Ensure the new color is from a different family than existing colors
- Test on sample puzzles before committing changes

**Example Fix**:
```javascript
// ❌ BAD: Multiple blues create adjacency problems
const COLORS = [
  '#5DADE2', // Bright Blue
  '#4CC9F0', // Sky Blue
  '#00CED1', // Dark Turquoise
  '#1E90FF', // Dodger Blue
];

// ✅ GOOD: One blue, rest from other families
const COLORS = [
  '#5DADE2', // Bright Blue (only blue)
  '#2ECC71', // Emerald Green
  '#FFE135', // Golden Yellow
  '#C71585', // Medium Violet Red
];
```

---

## Future Enhancements

### Potential Improvements

1. **Difficulty Rating**: Analyze puzzle complexity and assign difficulty levels
2. **Hint Generation**: Pre-compute strategic hints for stuck players
3. **Parallel Generation**: Use worker threads for faster bulk generation
4. **Progressive Difficulty**: Sort puzzles by estimated difficulty
5. **Alternative Constraints**: Generate puzzles with diagonal constraints

---

## Technical Notes

### PRNG (Mulberry32)
The generator uses Mulberry32 pseudo-random number generator for:
- Deterministic generation (same seed = same puzzle)
- Fast performance
- Good statistical properties

### Backtracking Algorithm
Both solution finding and validation use optimized backtracking:
- Early termination when solution count exceeds threshold
- Column order randomization for faster solution discovery
- Efficient constraint checking using Sets

---

## Maintenance

### When to Regenerate All Puzzles

Regenerate when:
- Algorithm improvements are made
- Color palette is updated
- Bug fixes to validation logic

### When to Extend Puzzles

Add more puzzles when:
- User engagement metrics show need for more content
- New difficulty tiers are added
- A/B testing requires puzzle variants

---

**Last Updated**: April 2026
**Generator Version**: 2.0 (with graph coloring and duplicate prevention)
**Total Puzzles**: 1,600 (400 per size)
