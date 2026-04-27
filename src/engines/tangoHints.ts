/**
 * Tango Hint Engine
 * Provides intelligent hints for Tango puzzles
 */

import { TangoPuzzle } from '../constants/types';
import { getCellConflicts } from './tangoValidator';

export interface TangoHint {
  message: string;
  highlightCells?: [number, number][];
  suggestedValue?: 0 | 1;
  cell?: [number, number];
}

/**
 * Find the next logical move for the user
 */
export function getIntelligentHint(
  puzzle: TangoPuzzle,
  currentGrid: (0 | 1 | null)[][]
): TangoHint | null {
  // Strategy 1: Check for cells that can only be one value
  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size; col++) {
      if (currentGrid[row][col] !== null) continue;

      // Try sun (0)
      const sunConflicts = getCellConflicts(puzzle, currentGrid, row, col, 0);
      // Try moon (1)
      const moonConflicts = getCellConflicts(puzzle, currentGrid, row, col, 1);

      // If only one value is valid
      if (sunConflicts.length === 0 && moonConflicts.length > 0) {
        return {
          message: `Cell (${row + 1}, ${col + 1}) must be a sun ☀️`,
          highlightCells: [[row, col]],
          suggestedValue: 0,
          cell: [row, col],
        };
      } else if (moonConflicts.length === 0 && sunConflicts.length > 0) {
        return {
          message: `Cell (${row + 1}, ${col + 1}) must be a moon 🌑`,
          highlightCells: [[row, col]],
          suggestedValue: 1,
          cell: [row, col],
        };
      }
    }
  }

  // Strategy 2: Look for constraint-based deductions
  for (const constraint of puzzle.constraints) {
    const [r1, c1] = constraint.cell1;
    const [r2, c2] = constraint.cell2;

    const val1 = currentGrid[r1][c1];
    const val2 = currentGrid[r2][c2];

    // If one cell is filled, deduce the other
    if (val1 !== null && val2 === null) {
      if (constraint.type === 'equal') {
        return {
          message: `These cells must match (=). Since (${r1 + 1}, ${c1 + 1}) is ${val1 === 0 ? 'sun ☀️' : 'moon 🌑'}, (${r2 + 1}, ${c2 + 1}) must also be ${val1 === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[r1, c1], [r2, c2]],
          suggestedValue: val1 as 0 | 1,
          cell: [r2, c2],
        };
      } else {
        const oppositeValue = val1 === 0 ? 1 : 0;
        return {
          message: `These cells must differ (×). Since (${r1 + 1}, ${c1 + 1}) is ${val1 === 0 ? 'sun ☀️' : 'moon 🌑'}, (${r2 + 1}, ${c2 + 1}) must be ${oppositeValue === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[r1, c1], [r2, c2]],
          suggestedValue: oppositeValue as 0 | 1,
          cell: [r2, c2],
        };
      }
    } else if (val2 !== null && val1 === null) {
      if (constraint.type === 'equal') {
        return {
          message: `These cells must match (=). Since (${r2 + 1}, ${c2 + 1}) is ${val2 === 0 ? 'sun ☀️' : 'moon 🌑'}, (${r1 + 1}, ${c1 + 1}) must also be ${val2 === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[r1, c1], [r2, c2]],
          suggestedValue: val2 as 0 | 1,
          cell: [r1, c1],
        };
      } else {
        const oppositeValue = val2 === 0 ? 1 : 0;
        return {
          message: `These cells must differ (×). Since (${r2 + 1}, ${c2 + 1}) is ${val2 === 0 ? 'sun ☀️' : 'moon 🌑'}, (${r1 + 1}, ${c1 + 1}) must be ${oppositeValue === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[r1, c1], [r2, c2]],
          suggestedValue: oppositeValue as 0 | 1,
          cell: [r1, c1],
        };
      }
    }
  }

  // Strategy 3: Look for rows/columns that are almost complete
  for (let row = 0; row < puzzle.size; row++) {
    let sunCount = 0;
    let moonCount = 0;
    let emptyCount = 0;
    let emptyCols: number[] = [];

    for (let col = 0; col < puzzle.size; col++) {
      const val = currentGrid[row][col];
      if (val === null) {
        emptyCount++;
        emptyCols.push(col);
      } else if (val === 0) {
        sunCount++;
      } else {
        moonCount++;
      }
    }

    // If row needs only suns
    if (moonCount === puzzle.size / 2 && emptyCount > 0) {
      return {
        message: `Row ${row + 1} already has ${puzzle.size / 2} moons, so remaining cells must be suns ☀️`,
        highlightCells: emptyCols.map(col => [row, col] as [number, number]),
        suggestedValue: 0,
        cell: [row, emptyCols[0]],
      };
    }

    // If row needs only moons
    if (sunCount === puzzle.size / 2 && emptyCount > 0) {
      return {
        message: `Row ${row + 1} already has ${puzzle.size / 2} suns, so remaining cells must be moons 🌑`,
        highlightCells: emptyCols.map(col => [row, col] as [number, number]),
        suggestedValue: 1,
        cell: [row, emptyCols[0]],
      };
    }
  }

  // Strategy 4: Same for columns
  for (let col = 0; col < puzzle.size; col++) {
    let sunCount = 0;
    let moonCount = 0;
    let emptyCount = 0;
    let emptyRows: number[] = [];

    for (let row = 0; row < puzzle.size; row++) {
      const val = currentGrid[row][col];
      if (val === null) {
        emptyCount++;
        emptyRows.push(row);
      } else if (val === 0) {
        sunCount++;
      } else {
        moonCount++;
      }
    }

    if (moonCount === puzzle.size / 2 && emptyCount > 0) {
      return {
        message: `Column ${col + 1} already has ${puzzle.size / 2} moons, so remaining cells must be suns ☀️`,
        highlightCells: emptyRows.map(row => [row, col] as [number, number]),
        suggestedValue: 0,
        cell: [emptyRows[0], col],
      };
    }

    if (sunCount === puzzle.size / 2 && emptyCount > 0) {
      return {
        message: `Column ${col + 1} already has ${puzzle.size / 2} suns, so remaining cells must be moons 🌑`,
        highlightCells: emptyRows.map(row => [row, col] as [number, number]),
        suggestedValue: 1,
        cell: [emptyRows[0], col],
      };
    }
  }

  // Strategy 5: Check for two-in-a-row situations that force the third
  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size - 2; col++) {
      const val1 = currentGrid[row][col];
      const val2 = currentGrid[row][col + 1];
      const val3 = currentGrid[row][col + 2];

      // Pattern: XX_ → must be opposite
      if (val1 !== null && val1 === val2 && val3 === null) {
        const opposite = val1 === 0 ? 1 : 0;
        return {
          message: `Cells (${row + 1}, ${col + 1}) and (${row + 1}, ${col + 2}) are both ${val1 === 0 ? 'suns' : 'moons'}, so (${row + 1}, ${col + 3}) must be ${opposite === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[row, col], [row, col + 1], [row, col + 2]],
          suggestedValue: opposite,
          cell: [row, col + 2],
        };
      }

      // Pattern: _XX → must be opposite
      if (val2 !== null && val2 === val3 && val1 === null) {
        const opposite = val2 === 0 ? 1 : 0;
        return {
          message: `Cells (${row + 1}, ${col + 2}) and (${row + 1}, ${col + 3}) are both ${val2 === 0 ? 'suns' : 'moons'}, so (${row + 1}, ${col + 1}) must be ${opposite === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[row, col], [row, col + 1], [row, col + 2]],
          suggestedValue: opposite,
          cell: [row, col],
        };
      }

      // Pattern: X_X → middle must be opposite
      if (val1 !== null && val1 === val3 && val2 === null) {
        const opposite = val1 === 0 ? 1 : 0;
        return {
          message: `Cells (${row + 1}, ${col + 1}) and (${row + 1}, ${col + 3}) are both ${val1 === 0 ? 'suns' : 'moons'}, so (${row + 1}, ${col + 2}) must be ${opposite === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[row, col], [row, col + 1], [row, col + 2]],
          suggestedValue: opposite,
          cell: [row, col + 1],
        };
      }
    }
  }

  // Strategy 6: Same for columns
  for (let col = 0; col < puzzle.size; col++) {
    for (let row = 0; row < puzzle.size - 2; row++) {
      const val1 = currentGrid[row][col];
      const val2 = currentGrid[row + 1][col];
      const val3 = currentGrid[row + 2][col];

      if (val1 !== null && val1 === val2 && val3 === null) {
        const opposite = val1 === 0 ? 1 : 0;
        return {
          message: `Cells (${row + 1}, ${col + 1}) and (${row + 2}, ${col + 1}) are both ${val1 === 0 ? 'suns' : 'moons'}, so (${row + 3}, ${col + 1}) must be ${opposite === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[row, col], [row + 1, col], [row + 2, col]],
          suggestedValue: opposite,
          cell: [row + 2, col],
        };
      }

      if (val2 !== null && val2 === val3 && val1 === null) {
        const opposite = val2 === 0 ? 1 : 0;
        return {
          message: `Cells (${row + 2}, ${col + 1}) and (${row + 3}, ${col + 1}) are both ${val2 === 0 ? 'suns' : 'moons'}, so (${row + 1}, ${col + 1}) must be ${opposite === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[row, col], [row + 1, col], [row + 2, col]],
          suggestedValue: opposite,
          cell: [row, col],
        };
      }

      if (val1 !== null && val1 === val3 && val2 === null) {
        const opposite = val1 === 0 ? 1 : 0;
        return {
          message: `Cells (${row + 1}, ${col + 1}) and (${row + 3}, ${col + 1}) are both ${val1 === 0 ? 'suns' : 'moons'}, so (${row + 2}, ${col + 1}) must be ${opposite === 0 ? 'sun ☀️' : 'moon 🌑'}`,
          highlightCells: [[row, col], [row + 1, col], [row + 2, col]],
          suggestedValue: opposite,
          cell: [row + 1, col],
        };
      }
    }
  }

  // If no obvious hint found, return a general suggestion
  return {
    message: 'Try looking at constraints (= and ×) or rows/columns that are almost complete',
    highlightCells: [],
  };
}
