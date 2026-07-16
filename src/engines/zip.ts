/**
 * Zip Puzzle Engine
 * Generates Hamiltonian path puzzles with numbered checkpoints and walls
 * Rules: Draw a continuous path through all cells, passing through numbered checkpoints in order
 */

import { Difficulty } from '../constants/gameConfig';
import { ZipPuzzle, ZipWall, PuzzleEngine, ValidationResult } from '../constants/types';

// Mulberry32 PRNG - Fast and deterministic seeded random number generator
function mulberry32(seed: number) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffle array using seeded random
function shuffleArray<T>(array: T[], random: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

class ZipEngine implements PuzzleEngine<ZipPuzzle> {
  /**
   * Generate a deterministic daily seed from current date
   */
  getDailySeed(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return year * 10000 + month * 100 + day;
  }

  /**
   * Map difficulty to puzzle parameters
   * Checkpoint counts based on LinkedIn Zip puzzle standards
   */
  private getDifficultyParams(difficulty: Difficulty, random: () => number): {
    size: number;
    checkpointCount: number;
    wallCount: number;
  } {
    switch (difficulty) {
      case 'easy':
        // 5x5: 5-7 checkpoints (fewer for more maneuvering room)
        return {
          size: 5,
          checkpointCount: 5 + Math.floor(random() * 3), // 5-7
          wallCount: 0
        };
      case 'medium':
        // 6x6: 7-9 checkpoints (LinkedIn uses ~8 for 6x6)
        return {
          size: 6,
          checkpointCount: 7 + Math.floor(random() * 3), // 7-9
          wallCount: 6
        };
      case 'hard':
        // 7x7: 8-10 checkpoints (LinkedIn uses ~9 for 7x7)
        return {
          size: 7,
          checkpointCount: 8 + Math.floor(random() * 3), // 8-10
          wallCount: 12
        };
      default:
        return { size: 5, checkpointCount: 5, wallCount: 0 };
    }
  }

  /**
   * Generate a Zip puzzle
   */
  generate(difficulty: Difficulty, seed?: number): ZipPuzzle {
    const actualSeed = seed || Math.floor(Math.random() * 1000000);
    const random = mulberry32(actualSeed);
    const params = this.getDifficultyParams(difficulty, random);

    // Generate a valid Hamiltonian path
    const solution = this.generateHamiltonianPath(params.size, random);

    // Select checkpoint positions from the solution path
    const checkpoints = this.selectCheckpoints(solution, params.checkpointCount, random);

    // Add walls if needed (for medium/hard difficulties)
    const walls = this.generateWalls(params.size, solution, params.wallCount, random);

    return {
      size: params.size,
      checkpoints,
      walls,
      solution,
      seed: actualSeed,
      difficulty,
    };
  }

  /**
   * Generate a Hamiltonian path through the grid
   * Uses randomized DFS to create varied paths
   */
  private generateHamiltonianPath(size: number, random: () => number): [number, number][] {
    // For 7x7 grids, use Warnsdorff's algorithm for fast, varied, valid paths
    // (DFS is exponentially slow for 49 cells, Backbite had low diversity after adjacency fixes)
    // Warnsdorff with random tie-breaking provides good variety while maintaining validity
    if (size === 7) {
      return this.generateWarnsdorffPath(size, random);
    }

    const totalCells = size * size;
    const visited = new Set<string>();
    const path: [number, number][] = [];

    // Start from a random cell
    const startRow = Math.floor(random() * size);
    const startCol = Math.floor(random() * size);

    const dfs = (row: number, col: number): boolean => {
      const key = `${row},${col}`;

      // Out of bounds or already visited
      if (row < 0 || row >= size || col < 0 || col >= size || visited.has(key)) {
        return false;
      }

      // Add to path
      visited.add(key);
      path.push([row, col]);

      // Found complete path
      if (path.length === totalCells) {
        return true;
      }

      // Try all four directions in random order
      const directions: [number, number][] = [
        [0, 1],  // right
        [1, 0],  // down
        [0, -1], // left
        [-1, 0], // up
      ];
      const shuffledDirections = shuffleArray(directions, random);

      for (const [dr, dc] of shuffledDirections) {
        if (dfs(row + dr, col + dc)) {
          return true;
        }
      }

      // Backtrack
      visited.delete(key);
      path.pop();
      return false;
    };

    // Try to generate path, retry with different start if needed
    let attempts = 0;
    while (attempts < 100 && !dfs(startRow, startCol)) {
      visited.clear();
      path.length = 0;
      attempts++;
      const newStartRow = Math.floor(random() * size);
      const newStartCol = Math.floor(random() * size);
      if (!dfs(newStartRow, newStartCol)) {
        // Continue trying
      }
    }

    if (path.length !== totalCells) {
      // Fallback: generate a simple snake path
      return this.generateSnakePath(size);
    }

    return path;
  }

  /**
   * Fallback: Generate a simple snake path (always works)
   */
  private generateSnakePath(size: number): [number, number][] {
    const path: [number, number][] = [];
    for (let row = 0; row < size; row++) {
      if (row % 2 === 0) {
        // Left to right
        for (let col = 0; col < size; col++) {
          path.push([row, col]);
        }
      } else {
        // Right to left
        for (let col = size - 1; col >= 0; col--) {
          path.push([row, col]);
        }
      }
    }
    return path;
  }

  /**
   * Generate varied snake paths with randomization
   * Creates different path patterns to ensure puzzle variety
   */
  private generateVariedSnakePath(size: number, random: () => number): [number, number][] {
    const patternChoice = Math.floor(random() * 4);

    switch (patternChoice) {
      case 0: // Normal horizontal snake (left-right alternating)
        return this.generateHorizontalSnake(size, false);

      case 1: // Reverse horizontal snake (right-left alternating)
        return this.generateHorizontalSnake(size, true);

      case 2: // Vertical snake (top-bottom alternating)
        return this.generateVerticalSnake(size, false);

      case 3: // Reverse vertical snake (bottom-top alternating)
        return this.generateVerticalSnake(size, true);

      default:
        return this.generateHorizontalSnake(size, false);
    }
  }

  /**
   * Generate horizontal snake path
   */
  private generateHorizontalSnake(size: number, reverse: boolean): [number, number][] {
    const path: [number, number][] = [];
    for (let row = 0; row < size; row++) {
      const shouldReverse = reverse ? (row % 2 === 1) : (row % 2 === 0);
      if (shouldReverse) {
        // Right to left
        for (let col = size - 1; col >= 0; col--) {
          path.push([row, col]);
        }
      } else {
        // Left to right
        for (let col = 0; col < size; col++) {
          path.push([row, col]);
        }
      }
    }
    return path;
  }

  /**
   * Generate vertical snake path
   */
  private generateVerticalSnake(size: number, reverse: boolean): [number, number][] {
    const path: [number, number][] = [];
    for (let col = 0; col < size; col++) {
      const shouldReverse = reverse ? (col % 2 === 1) : (col % 2 === 0);
      if (shouldReverse) {
        // Bottom to top
        for (let row = size - 1; row >= 0; row--) {
          path.push([row, col]);
        }
      } else {
        // Top to bottom
        for (let row = 0; row < size; row++) {
          path.push([row, col]);
        }
      }
    }
    return path;
  }

  /**
   * Generate Hamiltonian path using Warnsdorff's algorithm
   * Fast heuristic that creates varied, interesting paths
   */
  private generateWarnsdorffPath(size: number, random: () => number): [number, number][] {
    const totalCells = size * size;
    const visited = new Set<string>();
    const path: [number, number][] = [];

    // Start from a random position
    let row = Math.floor(random() * size);
    let col = Math.floor(random() * size);

    // Add starting cell
    visited.add(`${row},${col}`);
    path.push([row, col]);

    // Directions: up, down, left, right
    const directions: [number, number][] = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    // Helper: count unvisited neighbors of a cell
    const countUnvisitedNeighbors = (r: number, c: number): number => {
      let count = 0;
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited.has(`${nr},${nc}`)) {
          count++;
        }
      }
      return count;
    };

    // Build path using Warnsdorff's rule
    while (path.length < totalCells) {
      // Get all valid unvisited neighbors
      const neighbors: Array<{row: number, col: number, degree: number}> = [];

      for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        const key = `${nr},${nc}`;

        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited.has(key)) {
          const degree = countUnvisitedNeighbors(nr, nc);
          neighbors.push({ row: nr, col: nc, degree });
        }
      }

      // If no neighbors, we got stuck - fall back to snake path
      if (neighbors.length === 0) {
        return this.generateSnakePath(size);
      }

      // Find minimum degree
      const minDegree = Math.min(...neighbors.map(n => n.degree));

      // Get all neighbors with minimum degree
      const minNeighbors = neighbors.filter(n => n.degree === minDegree);

      // Randomly select one of the minimum degree neighbors
      const chosen = minNeighbors[Math.floor(random() * minNeighbors.length)];

      // Move to chosen cell
      row = chosen.row;
      col = chosen.col;
      visited.add(`${row},${col}`);
      path.push([row, col]);
    }

    return path;
  }

  /**
   * Generate Hamiltonian path using Backbite algorithm
   * Based on "Secondary structures in long compact polymers" (Oberdorf et al., 2006)
   *
   * This creates highly varied paths by starting with a simple path and applying
   * random transformations (backbite moves) to morph it into a different path.
   *
   * @param size Grid size
   * @param random Seeded random function
   * @param qualityFactor Controls randomness (1.0 = good default, 0.5-0.1 for more variety)
   */
  private generateBackbitePath(
    size: number,
    random: () => number,
    qualityFactor: number = 1.0
  ): [number, number][] {
    // Start with a varied base path
    const basePath = this.generateVariedSnakePath(size, random);

    // Create a mutable copy
    let path = [...basePath];

    // Calculate number of backbite iterations
    // Formula from research: QF × 20 × n² × log₂(n)
    const n = size * size;
    const iterations = Math.floor(qualityFactor * 20 * n * Math.log2(n));

    // Helper: Get cell at index in path
    const getCellKey = (cell: [number, number]) => `${cell[0]},${cell[1]}`;

    // Helper: Check if two cells are adjacent
    const areAdjacent = (cell1: [number, number], cell2: [number, number]): boolean => {
      const [r1, c1] = cell1;
      const [r2, c2] = cell2;
      return (Math.abs(r1 - r2) === 1 && c1 === c2) ||
             (Math.abs(c1 - c2) === 1 && r1 === r2);
    };

    // Helper: Get valid adjacent cells
    const getAdjacentCells = (cell: [number, number]): [number, number][] => {
      const [row, col] = cell;
      const adjacent: [number, number][] = [];

      if (row > 0) adjacent.push([row - 1, col]); // up
      if (row < size - 1) adjacent.push([row + 1, col]); // down
      if (col > 0) adjacent.push([row, col - 1]); // left
      if (col < size - 1) adjacent.push([row, col + 1]); // right

      return adjacent;
    };

    // Apply backbite moves
    for (let iter = 0; iter < iterations; iter++) {
      // Build position index for O(1) lookup
      const positionIndex = new Map<string, number>();
      path.forEach((cell, idx) => {
        positionIndex.set(getCellKey(cell), idx);
      });

      // Randomly choose which endpoint to move (start or end)
      const moveStart = random() < 0.5;
      const endpointIdx = moveStart ? 0 : path.length - 1;
      const endpoint = path[endpointIdx];

      // Get all adjacent cells to the endpoint
      const adjacentCells = getAdjacentCells(endpoint);

      // Filter out the current neighbor in the path (we don't want to backbite to it)
      const currentNeighborIdx = moveStart ? 1 : path.length - 2;
      const currentNeighbor = path[currentNeighborIdx];
      const currentNeighborKey = getCellKey(currentNeighbor);

      const validTargets = adjacentCells.filter(cell =>
        getCellKey(cell) !== currentNeighborKey
      );

      if (validTargets.length === 0) {
        continue; // No valid backbite move, try again
      }

      // Filter targets to only those that result in valid connections after backbite
      const validBackbiteTargets = validTargets.filter(target => {
        const targetIdx = positionIndex.get(getCellKey(target));
        if (targetIdx === undefined) return false;

        // Check if the backbite will maintain adjacency
        if (moveStart) {
          // After reversing [0...targetIdx], endpoint will be at old path[0]
          // It needs to connect to path[targetIdx + 1]
          if (targetIdx + 1 >= path.length) return true; // No connection needed (target is at end)
          return areAdjacent(path[0], path[targetIdx + 1]);
        } else {
          // After reversing [targetIdx...end], endpoint will be at old path[length-1]
          // It needs to connect to path[targetIdx - 1]
          if (targetIdx === 0) return true; // No connection needed (target is at start)
          return areAdjacent(path[path.length - 1], path[targetIdx - 1]);
        }
      });

      if (validBackbiteTargets.length === 0) {
        continue; // No valid backbite moves that preserve adjacency
      }

      // Randomly select a valid backbite target
      const target = validBackbiteTargets[Math.floor(random() * validBackbiteTargets.length)];
      const targetIdx = positionIndex.get(getCellKey(target));

      if (targetIdx === undefined) {
        continue; // Shouldn't happen after filtering, but safety check
      }

      // Perform backbite move:
      // If moving start: reverse section from start to target
      // If moving end: reverse section from target to end

      if (moveStart) {
        // Extract and reverse the section from start to target
        const section = path.slice(0, targetIdx + 1).reverse();
        // Reconstruct path: reversed section + rest
        path = [...section, ...path.slice(targetIdx + 1)];
      } else {
        // Extract and reverse the section from target to end
        const section = path.slice(targetIdx).reverse();
        // Reconstruct path: start + reversed section
        path = [...path.slice(0, targetIdx), ...section];
      }
    }

    return path;
  }

  /**
   * Select checkpoint positions from the solution path
   * Places checkpoints at segment BOUNDARIES to ensure spatial accessibility
   * Based on FlowFree algorithm: "path is partitioned into k contiguous segments,
   * with endpoints becoming checkpoint dots"
   */
  private selectCheckpoints(
    solution: [number, number][],
    count: number,
    random: () => number
  ): { position: [number, number]; order: number }[] {
    const checkpoints: { position: [number, number]; order: number }[] = [];

    // Calculate evenly-spaced segment boundaries
    const segmentSize = Math.floor(solution.length / count);

    // Place checkpoints at segment boundaries
    for (let i = 0; i < count; i++) {
      let index: number;

      if (i === 0) {
        // First checkpoint is always at the start
        index = 0;
      } else if (i === count - 1) {
        // Last checkpoint is always at the end
        index = solution.length - 1;
      } else {
        // Middle checkpoints at segment boundaries
        // Add small random offset (±10% of segment size) for variety
        const baseIndex = i * segmentSize;
        const maxOffset = Math.floor(segmentSize * 0.1);
        const offset = Math.floor(random() * (maxOffset * 2 + 1)) - maxOffset;
        index = Math.max(1, Math.min(solution.length - 2, baseIndex + offset));
      }

      checkpoints.push({ position: solution[index], order: i + 1 });
    }

    return checkpoints;
  }

  /**
   * Generate walls that don't block the solution path
   */
  private generateWalls(
    size: number,
    solution: [number, number][],
    wallCount: number,
    random: () => number
  ): ZipWall[] {
    const walls: ZipWall[] = [];

    // Build solution path adjacency for quick lookup
    const solutionEdges = new Set<string>();
    for (let i = 0; i < solution.length - 1; i++) {
      const [r1, c1] = solution[i];
      const [r2, c2] = solution[i + 1];

      // Store both directions
      solutionEdges.add(`${r1},${c1}-${r2},${c2}`);
      solutionEdges.add(`${r2},${c2}-${r1},${c1}`);
    }

    // Generate possible wall positions
    const possibleWalls: ZipWall[] = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Right wall
        if (col < size - 1) {
          const edge1 = `${row},${col}-${row},${col + 1}`;
          const edge2 = `${row},${col + 1}-${row},${col}`;
          if (!solutionEdges.has(edge1) && !solutionEdges.has(edge2)) {
            possibleWalls.push({ cell: [row, col], direction: 'right' });
          }
        }

        // Down wall
        if (row < size - 1) {
          const edge1 = `${row},${col}-${row + 1},${col}`;
          const edge2 = `${row + 1},${col}-${row},${col}`;
          if (!solutionEdges.has(edge1) && !solutionEdges.has(edge2)) {
            possibleWalls.push({ cell: [row, col], direction: 'down' });
          }
        }
      }
    }

    // Randomly select walls from possible positions
    const shuffledWalls = shuffleArray(possibleWalls, random);
    for (let i = 0; i < Math.min(wallCount, shuffledWalls.length); i++) {
      walls.push(shuffledWalls[i]);
    }

    return walls;
  }

  /**
   * Validate a user's solution
   */
  validate(puzzle: ZipPuzzle, userSolution: ZipPuzzle): ValidationResult {
    const errors: string[] = [];
    const userPath = userSolution.solution;

    // Check if path visits all cells
    if (userPath.length !== puzzle.size * puzzle.size) {
      errors.push(`Path must visit all ${puzzle.size * puzzle.size} cells`);
      return { isValid: false, errors };
    }

    // Check if path visits each cell exactly once
    const visitedCells = new Set<string>();
    for (const [row, col] of userPath) {
      const key = `${row},${col}`;
      if (visitedCells.has(key)) {
        errors.push(`Cell (${row}, ${col}) visited more than once`);
      }
      visitedCells.add(key);
    }

    // Check if path passes through checkpoints in order
    let checkpointIndex = 0;
    for (let i = 0; i < userPath.length; i++) {
      const [row, col] = userPath[i];
      const checkpoint = puzzle.checkpoints.find(
        cp => cp.position[0] === row && cp.position[1] === col
      );

      if (checkpoint) {
        if (checkpoint.order !== checkpointIndex + 1) {
          errors.push(`Checkpoint ${checkpoint.order} visited out of order`);
        }
        checkpointIndex++;
      }
    }

    // Check if all checkpoints were visited
    if (checkpointIndex !== puzzle.checkpoints.length) {
      errors.push('Not all checkpoints visited');
    }

    // Check if path crosses any walls
    for (let i = 0; i < userPath.length - 1; i++) {
      const [r1, c1] = userPath[i];
      const [r2, c2] = userPath[i + 1];

      // Check if this movement crosses a wall
      for (const wall of puzzle.walls) {
        const [wr, wc] = wall.cell;

        if (wall.direction === 'right') {
          // Wall between (wr, wc) and (wr, wc+1)
          if ((r1 === wr && c1 === wc && r2 === wr && c2 === wc + 1) ||
              (r1 === wr && c1 === wc + 1 && r2 === wr && c2 === wc)) {
            errors.push(`Path crosses wall at (${wr}, ${wc})`);
          }
        } else if (wall.direction === 'down') {
          // Wall between (wr, wc) and (wr+1, wc)
          if ((r1 === wr && c1 === wc && r2 === wr + 1 && c2 === wc) ||
              (r1 === wr + 1 && c1 === wc && r2 === wr && c2 === wc)) {
            errors.push(`Path crosses wall at (${wr}, ${wc})`);
          }
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Solve a puzzle (returns the solution)
   */
  solve(puzzle: ZipPuzzle): ZipPuzzle {
    return puzzle; // Solution is already embedded
  }
}

// Export singleton instance
export const zipEngine = new ZipEngine();
