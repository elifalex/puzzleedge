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
  // Strategy 1: Look for constraint-based deductions (MOST SPECIFIC)
  for (const constraint of puzzle.constraints) {
    const [r1, c1] = constraint.cell1;
    const [r2, c2] = constraint.cell2;

    const val1 = currentGrid[r1][c1];
    const val2 = currentGrid[r2][c2];

    // If one cell is filled, deduce the other
    if (val1 !== null && val2 === null) {
      if (constraint.type === 'equal') {
        return {
          message: `the = connects to (row ${r1 + 1}, col ${c1 + 1}) which is ${val1 === 0 ? 'Sun' : 'Moon'}. = means same, so this must be ${val1 === 0 ? 'Sun' : 'Moon'}`,
          highlightCells: [[r1, c1], [r2, c2]],
          suggestedValue: val1 as 0 | 1,
          cell: [r2, c2],
        };
      } else {
        const oppositeValue = val1 === 0 ? 1 : 0;
        return {
          message: `the × connects to (row ${r1 + 1}, col ${c1 + 1}) which is ${val1 === 0 ? 'Sun' : 'Moon'}. × means opposite, so this must be ${oppositeValue === 0 ? 'Sun' : 'Moon'}`,
          highlightCells: [[r1, c1], [r2, c2]],
          suggestedValue: oppositeValue as 0 | 1,
          cell: [r2, c2],
        };
      }
    } else if (val2 !== null && val1 === null) {
      if (constraint.type === 'equal') {
        return {
          message: `the = connects to (row ${r2 + 1}, col ${c2 + 1}) which is ${val2 === 0 ? 'Sun' : 'Moon'}. = means same, so this must be ${val2 === 0 ? 'Sun' : 'Moon'}`,
          highlightCells: [[r1, c1], [r2, c2]],
          suggestedValue: val2 as 0 | 1,
          cell: [r1, c1],
        };
      } else {
        const oppositeValue = val2 === 0 ? 1 : 0;
        return {
          message: `the × connects to (row ${r2 + 1}, col ${c2 + 1}) which is ${val2 === 0 ? 'Sun' : 'Moon'}. × means opposite, so this must be ${oppositeValue === 0 ? 'Sun' : 'Moon'}`,
          highlightCells: [[r1, c1], [r2, c2]],
          suggestedValue: oppositeValue as 0 | 1,
          cell: [r1, c1],
        };
      }
    }
  }

  // Strategy 2: Check for two-in-a-row situations (PREVENTS RULE VIOLATIONS)
  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size - 2; col++) {
      const val1 = currentGrid[row][col];
      const val2 = currentGrid[row][col + 1];
      const val3 = currentGrid[row][col + 2];

      // Pattern: XX_ → must be opposite (rule: no three in a row)
      if (val1 !== null && val1 === val2 && val3 === null) {
        const opposite = val1 === 0 ? 1 : 0;
        return {
          message: `placing ${val1 === 0 ? 'Sun' : 'Moon'} would create three ${val1 === 0 ? 'Suns' : 'Moons'} in a row (rule: no three in a row)`,
          highlightCells: [[row, col], [row, col + 1], [row, col + 2]],
          suggestedValue: opposite,
          cell: [row, col + 2],
        };
      }

      // Pattern: _XX → must be opposite
      if (val2 !== null && val2 === val3 && val1 === null) {
        const opposite = val2 === 0 ? 1 : 0;
        return {
          message: `placing ${val2 === 0 ? 'Sun' : 'Moon'} would create three ${val2 === 0 ? 'Suns' : 'Moons'} in a row (rule: no three in a row)`,
          highlightCells: [[row, col], [row, col + 1], [row, col + 2]],
          suggestedValue: opposite,
          cell: [row, col],
        };
      }

      // Pattern: X_X → middle must be opposite
      if (val1 !== null && val1 === val3 && val2 === null) {
        const opposite = val1 === 0 ? 1 : 0;
        return {
          message: `placing ${val1 === 0 ? 'Sun' : 'Moon'} would create three ${val1 === 0 ? 'Suns' : 'Moons'} in a row (rule: no three in a row)`,
          highlightCells: [[row, col], [row, col + 1], [row, col + 2]],
          suggestedValue: opposite,
          cell: [row, col + 1],
        };
      }
    }
  }

  // Strategy 3: Check for two-in-a-row vertically
  for (let col = 0; col < puzzle.size; col++) {
    for (let row = 0; row < puzzle.size - 2; row++) {
      const val1 = currentGrid[row][col];
      const val2 = currentGrid[row + 1][col];
      const val3 = currentGrid[row + 2][col];

      if (val1 !== null && val1 === val2 && val3 === null) {
        const opposite = val1 === 0 ? 1 : 0;
        return {
          message: `placing ${val1 === 0 ? 'Sun' : 'Moon'} would create three ${val1 === 0 ? 'Suns' : 'Moons'} vertically (rule: no three in a row)`,
          highlightCells: [[row, col], [row + 1, col], [row + 2, col]],
          suggestedValue: opposite,
          cell: [row + 2, col],
        };
      }

      if (val2 !== null && val2 === val3 && val1 === null) {
        const opposite = val2 === 0 ? 1 : 0;
        return {
          message: `placing ${val2 === 0 ? 'Sun' : 'Moon'} would create three ${val2 === 0 ? 'Suns' : 'Moons'} vertically (rule: no three in a row)`,
          highlightCells: [[row, col], [row + 1, col], [row + 2, col]],
          suggestedValue: opposite,
          cell: [row, col],
        };
      }

      if (val1 !== null && val1 === val3 && val2 === null) {
        const opposite = val1 === 0 ? 1 : 0;
        return {
          message: `placing ${val1 === 0 ? 'Sun' : 'Moon'} would create three ${val1 === 0 ? 'Suns' : 'Moons'} vertically (rule: no three in a row)`,
          highlightCells: [[row, col], [row + 1, col], [row + 2, col]],
          suggestedValue: opposite,
          cell: [row + 1, col],
        };
      }
    }
  }

  // Strategy 4: Look for rows that reached their limit
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

    // If row reached max moons, remaining must be suns
    if (moonCount === puzzle.size / 2 && emptyCount > 0) {
      return {
        message: `row ${row + 1} has ${puzzle.size / 2} Moons (maximum). Remaining cells must be Suns`,
        highlightCells: emptyCols.map(col => [row, col] as [number, number]),
        suggestedValue: 0,
        cell: [row, emptyCols[0]],
      };
    }

    // If row reached max suns, remaining must be moons
    if (sunCount === puzzle.size / 2 && emptyCount > 0) {
      return {
        message: `row ${row + 1} has ${puzzle.size / 2} Suns (maximum). Remaining cells must be Moons`,
        highlightCells: emptyCols.map(col => [row, col] as [number, number]),
        suggestedValue: 1,
        cell: [row, emptyCols[0]],
      };
    }
  }

  // Strategy 5: Look for columns that reached their limit
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
        message: `column ${col + 1} has ${puzzle.size / 2} Moons (maximum). Remaining cells must be Suns`,
        highlightCells: emptyRows.map(row => [row, col] as [number, number]),
        suggestedValue: 0,
        cell: [emptyRows[0], col],
      };
    }

    if (sunCount === puzzle.size / 2 && emptyCount > 0) {
      return {
        message: `column ${col + 1} has ${puzzle.size / 2} Suns (maximum). Remaining cells must be Moons`,
        highlightCells: emptyRows.map(row => [row, col] as [number, number]),
        suggestedValue: 1,
        cell: [emptyRows[0], col],
      };
    }
  }

  // Strategy 6: Check for cells that can only be one value (ANALYZE WHY)
  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size; col++) {
      if (currentGrid[row][col] !== null) continue;

      // Try sun (0)
      const sunConflicts = getCellConflicts(puzzle, currentGrid, row, col, 0);
      // Try moon (1)
      const moonConflicts = getCellConflicts(puzzle, currentGrid, row, col, 1);

      // If only one value is valid, explain WHY the other is blocked
      if (sunConflicts.length === 0 && moonConflicts.length > 0) {
        // Sun works, Moon doesn't - explain why Moon is blocked
        let message = '';

        // Prioritize three-in-row explanation
        if (moonConflicts.some(c => c.type === 'three-in-row')) {
          message = 'placing Moon would create three Moons in a row (rule: no three in a row)';
        }
        // Then balance explanation
        else if (moonConflicts.some(c => c.type === 'balance')) {
          const balanceConflict = moonConflicts.find(c => c.type === 'balance');
          if (balanceConflict?.message.includes('row')) {
            message = `row ${row + 1} has ${puzzle.size / 2} Moons (maximum)`;
          } else {
            message = `column ${col + 1} has ${puzzle.size / 2} Moons (maximum)`;
          }
        }
        // Then constraint explanation
        else if (moonConflicts.some(c => c.type === 'constraint')) {
          // Find the specific constraint and explain it
          for (const constraint of puzzle.constraints) {
            const [r1, c1] = constraint.cell1;
            const [r2, c2] = constraint.cell2;
            if ((r1 === row && c1 === col) || (r2 === row && c2 === col)) {
              const [otherR, otherC] = r1 === row && c1 === col ? [r2, c2] : [r1, c1];
              const otherValue = currentGrid[otherR][otherC];
              if (otherValue !== null) {
                if (constraint.type === 'equal') {
                  message = `the = connects to (row ${otherR + 1}, col ${otherC + 1}) which is ${otherValue === 0 ? 'Sun' : 'Moon'}. = means same, so this must be ${otherValue === 0 ? 'Sun' : 'Moon'}`;
                } else {
                  const required = otherValue === 0 ? 1 : 0;
                  message = `the × connects to (row ${otherR + 1}, col ${otherC + 1}) which is ${otherValue === 0 ? 'Sun' : 'Moon'}. × means opposite, so this must be ${required === 0 ? 'Sun' : 'Moon'}`;
                }
                break;
              }
            }
          }
        }

        if (!message) {
          message = 'placing Moon would violate puzzle rules';
        }

        return {
          message,
          highlightCells: [[row, col]],
          suggestedValue: 0,
          cell: [row, col],
        };
      } else if (moonConflicts.length === 0 && sunConflicts.length > 0) {
        // Moon works, Sun doesn't - explain why Sun is blocked
        let message = '';

        // Prioritize three-in-row explanation
        if (sunConflicts.some(c => c.type === 'three-in-row')) {
          message = 'placing Sun would create three Suns in a row (rule: no three in a row)';
        }
        // Then balance explanation
        else if (sunConflicts.some(c => c.type === 'balance')) {
          const balanceConflict = sunConflicts.find(c => c.type === 'balance');
          if (balanceConflict?.message.includes('row')) {
            message = `row ${row + 1} has ${puzzle.size / 2} Suns (maximum)`;
          } else {
            message = `column ${col + 1} has ${puzzle.size / 2} Suns (maximum)`;
          }
        }
        // Then constraint explanation
        else if (sunConflicts.some(c => c.type === 'constraint')) {
          // Find the specific constraint and explain it
          for (const constraint of puzzle.constraints) {
            const [r1, c1] = constraint.cell1;
            const [r2, c2] = constraint.cell2;
            if ((r1 === row && c1 === col) || (r2 === row && c2 === col)) {
              const [otherR, otherC] = r1 === row && c1 === col ? [r2, c2] : [r1, c1];
              const otherValue = currentGrid[otherR][otherC];
              if (otherValue !== null) {
                if (constraint.type === 'equal') {
                  message = `the = connects to (row ${otherR + 1}, col ${otherC + 1}) which is ${otherValue === 0 ? 'Sun' : 'Moon'}. = means same, so this must be ${otherValue === 0 ? 'Sun' : 'Moon'}`;
                } else {
                  const required = otherValue === 0 ? 1 : 0;
                  message = `the × connects to (row ${otherR + 1}, col ${otherC + 1}) which is ${otherValue === 0 ? 'Sun' : 'Moon'}. × means opposite, so this must be ${required === 0 ? 'Sun' : 'Moon'}`;
                }
                break;
              }
            }
          }
        }

        if (!message) {
          message = 'placing Sun would violate puzzle rules';
        }

        return {
          message,
          highlightCells: [[row, col]],
          suggestedValue: 1,
          cell: [row, col],
        };
      }
    }
  }

  // Strategy 7: Solution-based intelligent hints
  // Use the puzzle's solution to give accurate, educational hints

  // Find the best empty cell to suggest (prioritize cells with constraints)
  interface CellScore {
    row: number;
    col: number;
    score: number; // Higher = more constrained/interesting
  }

  const emptyCellScores: CellScore[] = [];

  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size; col++) {
      if (currentGrid[row][col] !== null) continue;

      // Score this cell based on how constrained it is
      let score = 0;

      // Check if it's part of a constraint
      for (const constraint of puzzle.constraints) {
        const [r1, c1] = constraint.cell1;
        const [r2, c2] = constraint.cell2;
        if ((r1 === row && c1 === col) || (r2 === row && c2 === col)) {
          score += 10; // Prioritize constraint cells
        }
      }

      // Check how many filled neighbors it has (more filled = more constrained)
      const neighbors = [
        [row - 1, col], [row + 1, col],
        [row, col - 1], [row, col + 1]
      ];
      for (const [r, c] of neighbors) {
        if (r >= 0 && r < puzzle.size && c >= 0 && c < puzzle.size && currentGrid[r][c] !== null) {
          score += 2;
        }
      }

      // Check how full the row and column are
      let rowFilled = 0, colFilled = 0;
      for (let c = 0; c < puzzle.size; c++) {
        if (currentGrid[row][c] !== null) rowFilled++;
      }
      for (let r = 0; r < puzzle.size; r++) {
        if (currentGrid[r][col] !== null) colFilled++;
      }
      score += rowFilled + colFilled;

      emptyCellScores.push({ row, col, score });
    }
  }

  // Sort by score (highest first)
  emptyCellScores.sort((a, b) => b.score - a.score);

  // Try to find a good hint from the highest-scoring cells
  for (const { row, col } of emptyCellScores) {
    const correctValue = puzzle.solution[row][col];
    const oppositeValue = correctValue === 0 ? 1 : 0;

    // Get conflicts if we placed the OPPOSITE value (to explain why it's wrong)
    const oppositeConflicts = getCellConflicts(puzzle, currentGrid, row, col, oppositeValue);

    // Build explanation for why this cell should have correctValue
    const reasons: string[] = [];

    // Check for three-in-a-row conflicts
    const threeInRowConflict = oppositeConflicts.find(c => c.type === 'three-in-row');
    if (threeInRowConflict) {
      // Find WHERE the three-in-a-row would be
      // Check horizontal
      if (col >= 2 && currentGrid[row][col - 1] === oppositeValue && currentGrid[row][col - 2] === oppositeValue) {
        reasons.push(`placing ${oppositeValue === 0 ? 'Sun' : 'Moon'} would create three ${oppositeValue === 0 ? 'Suns' : 'Moons'} in a row (rule: no three in a row)`);
      } else if (col >= 1 && col < puzzle.size - 1 && currentGrid[row][col - 1] === oppositeValue && currentGrid[row][col + 1] === oppositeValue) {
        reasons.push(`placing ${oppositeValue === 0 ? 'Sun' : 'Moon'} would create three ${oppositeValue === 0 ? 'Suns' : 'Moons'} in a row (rule: no three in a row)`);
      } else if (col < puzzle.size - 2 && currentGrid[row][col + 1] === oppositeValue && currentGrid[row][col + 2] === oppositeValue) {
        reasons.push(`placing ${oppositeValue === 0 ? 'Sun' : 'Moon'} would create three ${oppositeValue === 0 ? 'Suns' : 'Moons'} in a row (rule: no three in a row)`);
      }
      // Check vertical
      else if (row >= 2 && currentGrid[row - 1][col] === oppositeValue && currentGrid[row - 2][col] === oppositeValue) {
        reasons.push(`placing ${oppositeValue === 0 ? 'Sun' : 'Moon'} would create three ${oppositeValue === 0 ? 'Suns' : 'Moons'} vertically (rule: no three in a row)`);
      } else if (row >= 1 && row < puzzle.size - 1 && currentGrid[row - 1][col] === oppositeValue && currentGrid[row + 1][col] === oppositeValue) {
        reasons.push(`placing ${oppositeValue === 0 ? 'Sun' : 'Moon'} would create three ${oppositeValue === 0 ? 'Suns' : 'Moons'} vertically (rule: no three in a row)`);
      } else if (row < puzzle.size - 2 && currentGrid[row + 1][col] === oppositeValue && currentGrid[row + 2][col] === oppositeValue) {
        reasons.push(`placing ${oppositeValue === 0 ? 'Sun' : 'Moon'} would create three ${oppositeValue === 0 ? 'Suns' : 'Moons'} vertically (rule: no three in a row)`);
      }
    }

    // Check for balance conflicts
    const balanceConflict = oppositeConflicts.find(c => c.type === 'balance');
    if (balanceConflict && reasons.length === 0) { // Only use if we haven't found a better reason
      let rowCount = 0, colCount = 0;
      for (let c = 0; c < puzzle.size; c++) {
        if (currentGrid[row][c] === oppositeValue) rowCount++;
      }
      for (let r = 0; r < puzzle.size; r++) {
        if (currentGrid[r][col] === oppositeValue) colCount++;
      }

      if (rowCount >= puzzle.size / 2) {
        reasons.push(`row ${row + 1} has ${puzzle.size / 2} ${oppositeValue === 0 ? 'Suns' : 'Moons'} (maximum)`);
      } else if (colCount >= puzzle.size / 2) {
        reasons.push(`column ${col + 1} has ${puzzle.size / 2} ${oppositeValue === 0 ? 'Suns' : 'Moons'} (maximum)`);
      }
    }

    // Check for constraint conflicts
    const constraintConflict = oppositeConflicts.find(c => c.type === 'constraint');
    if (constraintConflict && reasons.length === 0) {
      // Find the constraint involving this cell
      for (const constraint of puzzle.constraints) {
        const [r1, c1] = constraint.cell1;
        const [r2, c2] = constraint.cell2;

        if ((r1 === row && c1 === col) || (r2 === row && c2 === col)) {
          const [otherR, otherC] = r1 === row && c1 === col ? [r2, c2] : [r1, c1];
          const otherValue = currentGrid[otherR][otherC];

          if (otherValue !== null) {
            if (constraint.type === 'equal') {
              reasons.push(`the = connects to (row ${otherR + 1}, col ${otherC + 1}) which is ${otherValue === 0 ? 'Sun' : 'Moon'}. = means same, so this must be ${correctValue === 0 ? 'Sun' : 'Moon'}`);
            } else {
              reasons.push(`the × connects to (row ${otherR + 1}, col ${otherC + 1}) which is ${otherValue === 0 ? 'Sun' : 'Moon'}. × means opposite, so this must be ${correctValue === 0 ? 'Sun' : 'Moon'}`);
            }
          }
        }
      }
    }

    // If we found a good reason, return this hint
    if (reasons.length > 0) {
      return {
        message: reasons[0],
        highlightCells: [[row, col]],
        suggestedValue: correctValue,
        cell: [row, col],
      };
    }
  }

  // If no conflicts found, check for near-completion situations
  for (const { row, col } of emptyCellScores) {
    const correctValue = puzzle.solution[row][col];

    let rowSuns = 0, rowMoons = 0, rowEmpty = 0;
    for (let c = 0; c < puzzle.size; c++) {
      if (currentGrid[row][c] === 0) rowSuns++;
      else if (currentGrid[row][c] === 1) rowMoons++;
      else rowEmpty++;
    }

    let colSuns = 0, colMoons = 0, colEmpty = 0;
    for (let r = 0; r < puzzle.size; r++) {
      if (currentGrid[r][col] === 0) colSuns++;
      else if (currentGrid[r][col] === 1) colMoons++;
      else colEmpty++;
    }

    // Check if this move completes a row/column requirement
    const rowNeeds = correctValue === 0 ? (puzzle.size / 2 - rowSuns - 1) : (puzzle.size / 2 - rowMoons - 1);
    const colNeeds = correctValue === 0 ? (puzzle.size / 2 - colSuns - 1) : (puzzle.size / 2 - colMoons - 1);

    if (rowNeeds === 0 && rowEmpty > 1) {
      const opposite = correctValue === 0 ? 'Moons' : 'Suns';
      return {
        message: `row ${row + 1} needs 1 more ${correctValue === 0 ? 'Sun' : 'Moon'}. After placing it, remaining cells must be ${opposite}`,
        highlightCells: [[row, col]],
        suggestedValue: correctValue,
        cell: [row, col],
      };
    }

    if (colNeeds === 0 && colEmpty > 1) {
      const opposite = correctValue === 0 ? 'Moons' : 'Suns';
      return {
        message: `column ${col + 1} needs 1 more ${correctValue === 0 ? 'Sun' : 'Moon'}. After placing it, remaining cells must be ${opposite}`,
        highlightCells: [[row, col]],
        suggestedValue: correctValue,
        cell: [row, col],
      };
    }
  }

  // Last resort: suggest a move from the solution without detailed explanation
  if (emptyCellScores.length > 0) {
    const { row, col } = emptyCellScores[0];
    const correctValue = puzzle.solution[row][col];

    return {
      message: `try placing ${correctValue === 0 ? 'Sun' : 'Moon'} here and observe how it affects nearby cells`,
      highlightCells: [[row, col]],
      suggestedValue: correctValue,
      cell: [row, col],
    };
  }

  // Puzzle complete or no empty cells
  return {
    message: 'Puzzle appears complete! Check if all cells are filled correctly.',
    highlightCells: [],
  };
}
