/**
 * Tango Puzzle Validator
 * Validates Tango puzzle states and provides real-time feedback
 */

import { TangoPuzzle, TangoConstraint } from '../constants/types';

export interface TangoValidation {
  isValid: boolean;
  errors: string[];
  conflicts: Set<string>; // Cell keys with conflicts
}

export interface CellConflict {
  cell: [number, number];
  type: 'balance' | 'three-in-row' | 'constraint';
  message: string;
}

/**
 * Validate the current grid state
 */
export function validateTangoGrid(
  puzzle: TangoPuzzle,
  currentGrid: (0 | 1 | null)[][]
): TangoValidation {
  const errors: string[] = [];
  const conflicts = new Set<string>();

  // Check row balance
  for (let row = 0; row < puzzle.size; row++) {
    let sunCount = 0;
    let moonCount = 0;
    let filledCount = 0;

    for (let col = 0; col < puzzle.size; col++) {
      const value = currentGrid[row][col];
      if (value !== null) {
        filledCount++;
        if (value === 0) sunCount++;
        if (value === 1) moonCount++;
      }
    }

    // If row is complete, check balance
    if (filledCount === puzzle.size) {
      if (sunCount !== puzzle.size / 2 || moonCount !== puzzle.size / 2) {
        errors.push(`Row ${row + 1} must have ${puzzle.size / 2} suns and ${puzzle.size / 2} moons`);
        // Mark all cells in this row as conflicting
        for (let col = 0; col < puzzle.size; col++) {
          conflicts.add(`${row}-${col}`);
        }
      }
    }
    // If row isn't complete, check if we've exceeded the limit
    else {
      if (sunCount > puzzle.size / 2) {
        errors.push(`Row ${row + 1} has too many suns`);
        for (let col = 0; col < puzzle.size; col++) {
          if (currentGrid[row][col] === 0) {
            conflicts.add(`${row}-${col}`);
          }
        }
      }
      if (moonCount > puzzle.size / 2) {
        errors.push(`Row ${row + 1} has too many moons`);
        for (let col = 0; col < puzzle.size; col++) {
          if (currentGrid[row][col] === 1) {
            conflicts.add(`${row}-${col}`);
          }
        }
      }
    }
  }

  // Check column balance
  for (let col = 0; col < puzzle.size; col++) {
    let sunCount = 0;
    let moonCount = 0;
    let filledCount = 0;

    for (let row = 0; row < puzzle.size; row++) {
      const value = currentGrid[row][col];
      if (value !== null) {
        filledCount++;
        if (value === 0) sunCount++;
        if (value === 1) moonCount++;
      }
    }

    if (filledCount === puzzle.size) {
      if (sunCount !== puzzle.size / 2 || moonCount !== puzzle.size / 2) {
        errors.push(`Column ${col + 1} must have ${puzzle.size / 2} suns and ${puzzle.size / 2} moons`);
        for (let row = 0; row < puzzle.size; row++) {
          conflicts.add(`${row}-${col}`);
        }
      }
    } else {
      if (sunCount > puzzle.size / 2) {
        errors.push(`Column ${col + 1} has too many suns`);
        for (let row = 0; row < puzzle.size; row++) {
          if (currentGrid[row][col] === 0) {
            conflicts.add(`${row}-${col}`);
          }
        }
      }
      if (moonCount > puzzle.size / 2) {
        errors.push(`Column ${col + 1} has too many moons`);
        for (let row = 0; row < puzzle.size; row++) {
          if (currentGrid[row][col] === 1) {
            conflicts.add(`${row}-${col}`);
          }
        }
      }
    }
  }

  // Check no-three-in-a-row (horizontal)
  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size - 2; col++) {
      const val1 = currentGrid[row][col];
      const val2 = currentGrid[row][col + 1];
      const val3 = currentGrid[row][col + 2];

      if (val1 !== null && val1 === val2 && val2 === val3) {
        errors.push(`Row ${row + 1} has three ${val1 === 0 ? 'suns' : 'moons'} in a row`);
        conflicts.add(`${row}-${col}`);
        conflicts.add(`${row}-${col + 1}`);
        conflicts.add(`${row}-${col + 2}`);
      }
    }
  }

  // Check no-three-in-a-row (vertical)
  for (let col = 0; col < puzzle.size; col++) {
    for (let row = 0; row < puzzle.size - 2; row++) {
      const val1 = currentGrid[row][col];
      const val2 = currentGrid[row + 1][col];
      const val3 = currentGrid[row + 2][col];

      if (val1 !== null && val1 === val2 && val2 === val3) {
        errors.push(`Column ${col + 1} has three ${val1 === 0 ? 'suns' : 'moons'} in a row`);
        conflicts.add(`${row}-${col}`);
        conflicts.add(`${row + 1}-${col}`);
        conflicts.add(`${row + 2}-${col}`);
      }
    }
  }

  // Check constraints
  for (const constraint of puzzle.constraints) {
    const [r1, c1] = constraint.cell1;
    const [r2, c2] = constraint.cell2;

    const val1 = currentGrid[r1][c1];
    const val2 = currentGrid[r2][c2];

    // Only validate if both cells are filled
    if (val1 !== null && val2 !== null) {
      if (constraint.type === 'equal' && val1 !== val2) {
        errors.push(`Cells (${r1 + 1},${c1 + 1}) and (${r2 + 1},${c2 + 1}) must be equal`);
        conflicts.add(`${r1}-${c1}`);
        conflicts.add(`${r2}-${c2}`);
      } else if (constraint.type === 'opposite' && val1 === val2) {
        errors.push(`Cells (${r1 + 1},${c1 + 1}) and (${r2 + 1},${c2 + 1}) must be different`);
        conflicts.add(`${r1}-${c1}`);
        conflicts.add(`${r2}-${c2}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    conflicts,
  };
}

/**
 * Check if puzzle is complete and valid
 */
export function isPuzzleComplete(
  puzzle: TangoPuzzle,
  currentGrid: (0 | 1 | null)[][]
): boolean {
  // Check all cells are filled
  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size; col++) {
      if (currentGrid[row][col] === null) {
        return false;
      }
    }
  }

  // Validate the completed grid
  const validation = validateTangoGrid(puzzle, currentGrid);
  return validation.isValid;
}

/**
 * Get specific conflicts for a cell placement
 */
export function getCellConflicts(
  puzzle: TangoPuzzle,
  currentGrid: (0 | 1 | null)[][],
  row: number,
  col: number,
  value: 0 | 1
): CellConflict[] {
  const conflicts: CellConflict[] = [];

  // Create temporary grid with the new value
  const tempGrid = currentGrid.map(r => [...r]);
  tempGrid[row][col] = value;

  // Check row balance
  let rowSuns = 0;
  let rowMoons = 0;
  for (let c = 0; c < puzzle.size; c++) {
    if (tempGrid[row][c] === 0) rowSuns++;
    if (tempGrid[row][c] === 1) rowMoons++;
  }

  if (rowSuns > puzzle.size / 2) {
    conflicts.push({
      cell: [row, col],
      type: 'balance',
      message: `This row would have too many suns`,
    });
  }
  if (rowMoons > puzzle.size / 2) {
    conflicts.push({
      cell: [row, col],
      type: 'balance',
      message: `This row would have too many moons`,
    });
  }

  // Check column balance
  let colSuns = 0;
  let colMoons = 0;
  for (let r = 0; r < puzzle.size; r++) {
    if (tempGrid[r][col] === 0) colSuns++;
    if (tempGrid[r][col] === 1) colMoons++;
  }

  if (colSuns > puzzle.size / 2) {
    conflicts.push({
      cell: [row, col],
      type: 'balance',
      message: `This column would have too many suns`,
    });
  }
  if (colMoons > puzzle.size / 2) {
    conflicts.push({
      cell: [row, col],
      type: 'balance',
      message: `This column would have too many moons`,
    });
  }

  // Check three-in-a-row horizontal
  if (col >= 2 && tempGrid[row][col - 1] === value && tempGrid[row][col - 2] === value) {
    conflicts.push({
      cell: [row, col],
      type: 'three-in-row',
      message: `This would create three ${value === 0 ? 'suns' : 'moons'} in a row`,
    });
  }
  if (col >= 1 && col < puzzle.size - 1 && tempGrid[row][col - 1] === value && tempGrid[row][col + 1] === value) {
    conflicts.push({
      cell: [row, col],
      type: 'three-in-row',
      message: `This would create three ${value === 0 ? 'suns' : 'moons'} in a row`,
    });
  }
  if (col < puzzle.size - 2 && tempGrid[row][col + 1] === value && tempGrid[row][col + 2] === value) {
    conflicts.push({
      cell: [row, col],
      type: 'three-in-row',
      message: `This would create three ${value === 0 ? 'suns' : 'moons'} in a row`,
    });
  }

  // Check three-in-a-row vertical
  if (row >= 2 && tempGrid[row - 1][col] === value && tempGrid[row - 2][col] === value) {
    conflicts.push({
      cell: [row, col],
      type: 'three-in-row',
      message: `This would create three ${value === 0 ? 'suns' : 'moons'} in a column`,
    });
  }
  if (row >= 1 && row < puzzle.size - 1 && tempGrid[row - 1][col] === value && tempGrid[row + 1][col] === value) {
    conflicts.push({
      cell: [row, col],
      type: 'three-in-row',
      message: `This would create three ${value === 0 ? 'suns' : 'moons'} in a column`,
    });
  }
  if (row < puzzle.size - 2 && tempGrid[row + 1][col] === value && tempGrid[row + 2][col] === value) {
    conflicts.push({
      cell: [row, col],
      type: 'three-in-row',
      message: `This would create three ${value === 0 ? 'suns' : 'moons'} in a column`,
    });
  }

  // Check constraints
  for (const constraint of puzzle.constraints) {
    const [r1, c1] = constraint.cell1;
    const [r2, c2] = constraint.cell2;

    // If this cell is part of a constraint
    if ((r1 === row && c1 === col) || (r2 === row && c2 === col)) {
      const otherCell: [number, number] = r1 === row && c1 === col ? [r2, c2] : [r1, c1];
      const otherValue = tempGrid[otherCell[0]][otherCell[1]];

      if (otherValue !== null) {
        if (constraint.type === 'equal' && value !== otherValue) {
          conflicts.push({
            cell: [row, col],
            type: 'constraint',
            message: `This cell must match the connected cell (=)`,
          });
        } else if (constraint.type === 'opposite' && value === otherValue) {
          conflicts.push({
            cell: [row, col],
            type: 'constraint',
            message: `This cell must differ from the connected cell (×)`,
          });
        }
      }
    }
  }

  return conflicts;
}
