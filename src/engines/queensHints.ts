/**
 * Queens Puzzle Intelligent Hint System
 * Focuses on teaching elimination logic instead of revealing solutions
 */

import { QueensPuzzle } from '../constants/types';
import { getValidCellsInRegion } from './queensValidator';

export interface HintResult {
  message: string;
  highlightCells?: [number, number][]; // Cells to highlight
  highlightRegion?: number; // Region ID to highlight
  type: 'elimination' | 'logical_deduction' | 'conflict'; // Type of hint
}

/**
 * Intelligent hint engine that teaches elimination logic
 */
export class QueensHintEngine {
  /**
   * Get color name from hex code
   */
  private getColorName(hexColor: string): string {
    const colorMap: Record<string, string> = {
      '#FFB6C1': 'pink',
      '#FFE4E1': 'light pink',
      '#87CEEB': 'blue',
      '#E0BBE4': 'purple',
      '#98FB98': 'green',
      '#FFDAB9': 'peach',
      '#FFD700': 'yellow',
      '#DDA0DD': 'plum',
      '#FFA07A': 'coral',
      '#87CEFA': 'light blue',
      '#F0E68C': 'khaki',
      '#E6E6FA': 'lavender',
      '#B0E0E6': 'powder blue',
    };

    return colorMap[hexColor] || 'colored';
  }

  /**
   * Get the next logical hint based on current board state
   * NEW: Solution-aware system (like Tango hints)
   * Priority: Wrong Queens → Correct Queen Placement → Eliminations → Logical Deductions
   */
  getIntelligentHint(
    puzzle: QueensPuzzle,
    placedQueens: [number, number][],
    markedCells: Set<string>
  ): HintResult | null {
    // Check if puzzle is complete
    if (placedQueens.length === puzzle.size) {
      return null;
    }

    // Priority 1: Detect incorrectly placed queens (compare with solution)
    const wrongQueenHint = this.findWrongQueenPlacement(puzzle, placedQueens);
    if (wrongQueenHint) return wrongQueenHint;

    // Priority 2: Fix rule-violating conflicts
    const conflictHint = this.checkConflicts(puzzle, placedQueens);
    if (conflictHint) return conflictHint;

    // Priority 3: Suggest correct queen placement with reasoning (solution-aware)
    const correctQueenHint = this.suggestCorrectQueenPlacement(puzzle, placedQueens, markedCells);
    if (correctQueenHint) return correctQueenHint;

    // Priority 4: Eliminate cells adjacent to placed queens
    const adjacentHint = this.findAdjacentEliminations(puzzle, placedQueens, markedCells);
    if (adjacentHint) return adjacentHint;

    // Priority 5: Eliminate entire row/column of placed queens
    const rowColHint = this.findRowColumnEliminations(puzzle, placedQueens, markedCells);
    if (rowColHint) return rowColHint;

    // Priority 6: Region elimination logic (limited span analysis)
    const regionHint = this.findRegionConstraintEliminations(puzzle, placedQueens, markedCells);
    if (regionHint) return regionHint;

    // Priority 7: Pairing/group elimination
    const pairingHint = this.findPairingEliminations(puzzle, placedQueens, markedCells);
    if (pairingHint) return pairingHint;

    // Priority 8: Naked Single (only ONE valid cell left) - last resort
    const nakedSingleHint = this.findNakedSingle(puzzle, placedQueens, markedCells);
    if (nakedSingleHint) return nakedSingleHint;

    // No hints available
    return {
      message: 'Continue eliminating impossible cells. Look at regions with limited options and queens already placed.',
      type: 'logical_deduction',
    };
  }

  /**
   * NEW: Detect incorrectly placed queens by comparing with solution
   */
  private findWrongQueenPlacement(
    puzzle: QueensPuzzle,
    placedQueens: [number, number][]
  ): HintResult | null {
    if (placedQueens.length === 0) return null;

    // Check each placed queen against the solution
    for (const [row, col] of placedQueens) {
      const isCorrect = puzzle.solution.some(([sr, sc]) => sr === row && sc === col);

      if (!isCorrect) {
        // This queen is in the wrong position
        const regionId = puzzle.regions[row][col];
        const colorName = this.getColorName(puzzle.regionColors[regionId]);

        // Find where this region's queen SHOULD be
        const correctQueen = puzzle.solution.find(([sr, sc]) => puzzle.regions[sr][sc] === regionId);

        if (correctQueen) {
          const [correctRow, correctCol] = correctQueen;

          return {
            message: `The queen in the ${colorName} region at row ${row + 1}, column ${col + 1} is incorrectly placed. This region's queen should be at row ${correctRow + 1}, column ${correctCol + 1}. Try removing it and reconsidering.`,
            highlightCells: [[row, col]],
            highlightRegion: regionId,
            type: 'conflict',
          };
        } else {
          return {
            message: `The queen at row ${row + 1}, column ${col + 1} is incorrectly placed. Consider removing it and analyzing the constraints.`,
            highlightCells: [[row, col]],
            type: 'conflict',
          };
        }
      }
    }

    return null;
  }

  /**
   * NEW: Suggest correct queen placement with logical reasoning
   */
  private suggestCorrectQueenPlacement(
    puzzle: QueensPuzzle,
    placedQueens: [number, number][],
    markedCells: Set<string>
  ): HintResult | null {
    const usedRegions = new Set(placedQueens.map(([r, c]) => puzzle.regions[r][c]));
    const usedRows = new Set(placedQueens.map(([r]) => r));
    const usedCols = new Set(placedQueens.map(([, c]) => c));

    // Find the best region to place a queen next
    // Prioritize regions with fewest valid options
    interface RegionOption {
      regionId: number;
      validCells: [number, number][];
      colorName: string;
    }

    const regionsWithOptions: RegionOption[] = [];

    for (let regionId = 0; regionId < puzzle.size; regionId++) {
      if (usedRegions.has(regionId)) continue;

      const validCells = getValidCellsInRegion(puzzle, regionId, placedQueens, markedCells);

      if (validCells.length > 0 && validCells.length <= 3) {
        // Only consider regions with 1-3 options
        regionsWithOptions.push({
          regionId,
          validCells,
          colorName: this.getColorName(puzzle.regionColors[regionId]),
        });
      }
    }

    // Sort by fewest options first
    regionsWithOptions.sort((a, b) => a.validCells.length - b.validCells.length);

    if (regionsWithOptions.length > 0) {
      const bestRegion = regionsWithOptions[0];

      // Find the correct queen position from the solution for this region
      const correctQueen = puzzle.solution.find(
        ([sr, sc]) => puzzle.regions[sr][sc] === bestRegion.regionId
      );

      if (correctQueen && bestRegion.validCells.some(([r, c]) => r === correctQueen[0] && c === correctQueen[1])) {
        const [correctRow, correctCol] = correctQueen;

        // Build reasoning for why this is the correct position
        let reasoning = '';

        if (bestRegion.validCells.length === 1) {
          reasoning = `The ${bestRegion.colorName} region has only ONE valid cell remaining after eliminations. `;
        } else {
          reasoning = `The ${bestRegion.colorName} region has ${bestRegion.validCells.length} possible cells. `;
        }

        // Check why other cells in valid list are wrong
        const wrongCells = bestRegion.validCells.filter(
          ([r, c]) => r !== correctRow || c !== correctCol
        );

        if (wrongCells.length > 0 && bestRegion.validCells.length <= 2) {
          // Explain why the highlighted cell is better
          const otherRows = new Set(wrongCells.map(([r]) => r));
          const otherCols = new Set(wrongCells.map(([, c]) => c));

          if (otherRows.size === wrongCells.length) {
            reasoning += `Row ${correctRow + 1} is the best choice because it leaves more flexibility for remaining regions.`;
          } else if (otherCols.size === wrongCells.length) {
            reasoning += `Column ${correctCol + 1} is the best choice because it leaves more flexibility for remaining regions.`;
          } else {
            reasoning += `Row ${correctRow + 1}, column ${correctCol + 1} is the optimal position.`;
          }
        } else {
          reasoning += `The queen should go at row ${correctRow + 1}, column ${correctCol + 1}.`;
        }

        return {
          message: reasoning,
          highlightCells: [[correctRow, correctCol]],
          highlightRegion: bestRegion.regionId,
          type: 'logical_deduction',
        };
      }
    }

    return null;
  }

  /**
   * Check if there are conflicts to fix
   */
  private checkConflicts(puzzle: QueensPuzzle, placedQueens: [number, number][]): HintResult | null {
    const conflicts = this.findConflicts(puzzle, placedQueens);

    if (conflicts.size > 0) {
      const conflictCells = Array.from(conflicts).map(key => {
        const [r, c] = key.split('-').map(Number);
        return [r, c] as [number, number];
      });

      return {
        message: 'You have queens that violate the rules! Queens cannot be in the same row, column, region, or touch each other (even diagonally). Remove the highlighted queens.',
        highlightCells: conflictCells,
        type: 'conflict',
      };
    }

    return null;
  }

  /**
   * Find conflicts between placed queens
   */
  private findConflicts(puzzle: QueensPuzzle, queens: [number, number][]): Set<string> {
    const conflicts = new Set<string>();

    for (let i = 0; i < queens.length; i++) {
      const [r1, c1] = queens[i];
      const region1 = puzzle.regions[r1][c1];

      for (let j = i + 1; j < queens.length; j++) {
        const [r2, c2] = queens[j];
        const region2 = puzzle.regions[r2][c2];

        const sameRow = r1 === r2;
        const sameCol = c1 === c2;
        const sameRegion = region1 === region2;
        const rowDiff = Math.abs(r1 - r2);
        const colDiff = Math.abs(c1 - c2);
        const adjacent = rowDiff <= 1 && colDiff <= 1;

        if (sameRow || sameCol || sameRegion || adjacent) {
          conflicts.add(`${r1}-${c1}`);
          conflicts.add(`${r2}-${c2}`);
        }
      }
    }

    return conflicts;
  }

  /**
   * Level 1: Find cells adjacent to placed queens that should be eliminated
   */
  private findAdjacentEliminations(
    puzzle: QueensPuzzle,
    placedQueens: [number, number][],
    markedCells: Set<string>
  ): HintResult | null {
    const cellsToEliminate: [number, number][] = [];
    const { size } = puzzle;

    for (const [qr, qc] of placedQueens) {
      // Check all 8 surrounding cells
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue; // Skip the queen itself

          const nr = qr + dr;
          const nc = qc + dc;
          const cellKey = `${nr}-${nc}`;

          // Check if valid cell, not marked, and not already has a queen
          if (
            nr >= 0 && nr < size &&
            nc >= 0 && nc < size &&
            !markedCells.has(cellKey) &&
            !placedQueens.some(([r, c]) => r === nr && c === nc)
          ) {
            // Avoid duplicates
            if (!cellsToEliminate.some(([r, c]) => r === nr && c === nc)) {
              cellsToEliminate.push([nr, nc]);
            }
          }
        }
      }
    }

    if (cellsToEliminate.length > 0) {
      const plural = cellsToEliminate.length > 1;
      return {
        message: `Queens cannot touch each other, even diagonally. Mark the highlighted cell${plural ? 's' : ''} with X to eliminate ${plural ? 'them' : 'it'}.`,
        highlightCells: cellsToEliminate,
        type: 'elimination',
      };
    }

    return null;
  }

  /**
   * Level 2: Eliminate entire row/column of placed queens
   */
  private findRowColumnEliminations(
    puzzle: QueensPuzzle,
    placedQueens: [number, number][],
    markedCells: Set<string>
  ): HintResult | null {
    const cellsToEliminate: [number, number][] = [];
    const { size } = puzzle;

    for (const [qr, qc] of placedQueens) {
      // All cells in same row
      for (let c = 0; c < size; c++) {
        const cellKey = `${qr}-${c}`;
        if (
          c !== qc &&
          !markedCells.has(cellKey) &&
          !placedQueens.some(([r, col]) => r === qr && col === c)
        ) {
          if (!cellsToEliminate.some(([r, col]) => r === qr && col === c)) {
            cellsToEliminate.push([qr, c]);
          }
        }
      }

      // All cells in same column
      for (let r = 0; r < size; r++) {
        const cellKey = `${r}-${qc}`;
        if (
          r !== qr &&
          !markedCells.has(cellKey) &&
          !placedQueens.some(([row, c]) => row === r && c === qc)
        ) {
          if (!cellsToEliminate.some(([row, c]) => row === r && c === qc)) {
            cellsToEliminate.push([r, qc]);
          }
        }
      }
    }

    if (cellsToEliminate.length > 0) {
      return {
        message: `Each row and column can only have one queen. Mark the highlighted cells with X to eliminate them.`,
        highlightCells: cellsToEliminate,
        type: 'elimination',
      };
    }

    return null;
  }

  /**
   * Level 3: Region constraint eliminations (limited span analysis)
   */
  private findRegionConstraintEliminations(
    puzzle: QueensPuzzle,
    placedQueens: [number, number][],
    markedCells: Set<string>
  ): HintResult | null {
    const usedRegions = new Set(placedQueens.map(([r, c]) => puzzle.regions[r][c]));
    const { size, regions } = puzzle;

    // Find regions with very limited span (only 1-3 rows)
    const regionsWithLimitedSpan: Array<{
      regionId: number;
      rows: Set<number>;
      colorName: string;
    }> = [];

    for (let regionId = 0; regionId < size; regionId++) {
      if (usedRegions.has(regionId)) continue;

      const allRows = new Set<number>();

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (regions[r][c] === regionId) {
            allRows.add(r);
          }
        }
      }

      // Check if region has limited row presence
      if (allRows.size <= 3 && allRows.size < size / 2) {
        const colorName = this.getColorName(puzzle.regionColors[regionId]);
        regionsWithLimitedSpan.push({ regionId, rows: allRows, colorName });
      }
    }

    // If we have N regions that span exactly N rows, those rows are reserved
    if (regionsWithLimitedSpan.length >= 2) {
      // Group by row count
      const spanGroups = new Map<number, typeof regionsWithLimitedSpan>();

      for (const region of regionsWithLimitedSpan) {
        const spanSize = region.rows.size;
        if (!spanGroups.has(spanSize)) {
          spanGroups.set(spanSize, []);
        }
        spanGroups.get(spanSize)!.push(region);
      }

      // Check if we have N regions that span exactly N rows
      for (const [spanSize, regionsInGroup] of spanGroups) {
        if (regionsInGroup.length >= spanSize) {
          // Find the rows these regions occupy
          const allRows = new Set<number>();

          for (const region of regionsInGroup.slice(0, spanSize)) {
            region.rows.forEach(r => allRows.add(r));
          }

          // Perfect match: N regions span exactly N rows
          if (allRows.size === spanSize) {
            const rows = Array.from(allRows).sort((a, b) => a - b);
            const rowList = rows.map(r => r + 1).join(', ');
            const limitedRegions = regionsInGroup.slice(0, spanSize);
            const limitedRegionIds = new Set(limitedRegions.map(r => r.regionId));

            // Find cells to eliminate (other regions on these rows)
            const cellsToEliminate: [number, number][] = [];

            for (const row of rows) {
              for (let c = 0; c < size; c++) {
                const cellRegion = regions[row][c];
                const cellKey = `${row}-${c}`;

                if (
                  !limitedRegionIds.has(cellRegion) &&
                  !usedRegions.has(cellRegion) &&
                  !markedCells.has(cellKey) &&
                  !placedQueens.some(([r, col]) => r === row && col === c)
                ) {
                  cellsToEliminate.push([row, c]);
                }
              }
            }

            if (cellsToEliminate.length > 0) {
              // Format color names nicely
              const colorNames = limitedRegions
                .map(r => r.colorName)
                .join(', ')
                .replace(/, ([^,]*)$/, ' and $1');

              return {
                message: `The ${colorNames} regions only span rows ${rowList}. Their queens must be on these rows, so eliminate the highlighted cells from other regions.`,
                highlightCells: cellsToEliminate,
                type: 'logical_deduction',
              };
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Level 4: Pairing eliminations (two regions locked to two rows/columns)
   */
  private findPairingEliminations(
    puzzle: QueensPuzzle,
    placedQueens: [number, number][],
    markedCells: Set<string>
  ): HintResult | null {
    const usedRegions = new Set(placedQueens.map(([r, c]) => puzzle.regions[r][c]));
    const usedRows = new Set(placedQueens.map(([r]) => r));
    const usedCols = new Set(placedQueens.map(([, c]) => c));
    const { size, regions } = puzzle;

    // Find regions with exactly 2 valid cells
    const twoOptionRegions: Array<{
      regionId: number;
      cells: [number, number][];
      rows: Set<number>;
      cols: Set<number>;
    }> = [];

    for (let regionId = 0; regionId < size; regionId++) {
      if (usedRegions.has(regionId)) continue;

      const validCells: [number, number][] = [];
      const rows = new Set<number>();
      const cols = new Set<number>();

      for (let r = 0; r < size; r++) {
        if (usedRows.has(r)) continue;

        for (let c = 0; c < size; c++) {
          if (usedCols.has(c)) continue;

          if (
            regions[r][c] === regionId &&
            !this.isCellBlocked(r, c, placedQueens)
          ) {
            validCells.push([r, c]);
            rows.add(r);
            cols.add(c);
          }
        }
      }

      if (validCells.length === 2) {
        twoOptionRegions.push({ regionId, cells: validCells, rows, cols });
      }
    }

    // Look for two regions locked to the same two rows
    for (let i = 0; i < twoOptionRegions.length; i++) {
      for (let j = i + 1; j < twoOptionRegions.length; j++) {
        const region1 = twoOptionRegions[i];
        const region2 = twoOptionRegions[j];

        // Same two rows
        if (
          region1.rows.size === 2 &&
          region2.rows.size === 2 &&
          Array.from(region1.rows).every(r => region2.rows.has(r))
        ) {
          const rows = Array.from(region1.rows).sort((a, b) => a - b);
          const cellsToEliminate: [number, number][] = [];

          // Find other regions that have cells in these rows
          for (const row of rows) {
            for (let c = 0; c < size; c++) {
              const cellRegion = regions[row][c];
              const cellKey = `${row}-${c}`;

              if (
                cellRegion !== region1.regionId &&
                cellRegion !== region2.regionId &&
                !usedRegions.has(cellRegion) &&
                !markedCells.has(cellKey) &&
                !placedQueens.some(([r, col]) => r === row && col === c)
              ) {
                cellsToEliminate.push([row, c]);
              }
            }
          }

          if (cellsToEliminate.length > 0) {
            const color1 = this.getColorName(puzzle.regionColors[region1.regionId]);
            const color2 = this.getColorName(puzzle.regionColors[region2.regionId]);

            return {
              message: `The ${color1} and ${color2} regions can only place queens in rows ${rows.map(r => r + 1).join(' and ')}. These rows are locked for them, so eliminate other regions from these rows.`,
              highlightCells: cellsToEliminate,
              type: 'logical_deduction',
            };
          }
        }

        // Same two columns
        if (
          region1.cols.size === 2 &&
          region2.cols.size === 2 &&
          Array.from(region1.cols).every(c => region2.cols.has(c))
        ) {
          const cols = Array.from(region1.cols).sort((a, b) => a - b);
          const cellsToEliminate: [number, number][] = [];

          for (let r = 0; r < size; r++) {
            for (const col of cols) {
              const cellRegion = regions[r][col];
              const cellKey = `${r}-${col}`;

              if (
                cellRegion !== region1.regionId &&
                cellRegion !== region2.regionId &&
                !usedRegions.has(cellRegion) &&
                !markedCells.has(cellKey) &&
                !placedQueens.some(([row, c]) => row === r && c === col)
              ) {
                cellsToEliminate.push([r, col]);
              }
            }
          }

          if (cellsToEliminate.length > 0) {
            const color1 = this.getColorName(puzzle.regionColors[region1.regionId]);
            const color2 = this.getColorName(puzzle.regionColors[region2.regionId]);

            return {
              message: `The ${color1} and ${color2} regions can only place queens in columns ${cols.map(c => c + 1).join(' and ')}. These columns are locked for them, so eliminate other regions from these columns.`,
              highlightCells: cellsToEliminate,
              type: 'logical_deduction',
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Level 5: Naked Single (only ONE valid cell left) - LAST RESORT
   */
  private findNakedSingle(
    puzzle: QueensPuzzle,
    placedQueens: [number, number][],
    markedCells: Set<string>
  ): HintResult | null {
    const usedRegions = new Set(placedQueens.map(([r, c]) => puzzle.regions[r][c]));
    const { size } = puzzle;

    // Check each unused region
    for (let regionId = 0; regionId < size; regionId++) {
      if (usedRegions.has(regionId)) continue;

      const validCells = getValidCellsInRegion(puzzle, regionId, placedQueens, markedCells);

      if (validCells.length === 1) {
        const [r, c] = validCells[0];
        const colorName = this.getColorName(puzzle.regionColors[regionId]);

        return {
          message: `The ${colorName} region has only ONE valid cell remaining after all eliminations (row ${r + 1}, column ${c + 1}). This is where its queen must go.`,
          highlightCells: [[r, c]],
          highlightRegion: regionId,
          type: 'logical_deduction',
        };
      }
    }

    return null;
  }

  /**
   * Check if a cell is blocked by adjacent queens or same row/column
   */
  private isCellBlocked(row: number, col: number, placedQueens: [number, number][]): boolean {
    for (const [qRow, qCol] of placedQueens) {
      // Same row or column
      if (qRow === row || qCol === col) {
        return true;
      }

      // Adjacent (including diagonals)
      const rowDiff = Math.abs(row - qRow);
      const colDiff = Math.abs(col - qCol);
      if (rowDiff <= 1 && colDiff <= 1) {
        return true;
      }
    }

    return false;
  }
}

// Export singleton instance
export const queensHintEngine = new QueensHintEngine();
