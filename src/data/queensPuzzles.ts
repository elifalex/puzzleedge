/**
 * Pre-validated Queens Puzzle Library
 * Each puzzle has exactly one solution and is solvable through logical deduction
 * Generated with verified unique solution algorithm
 */

import { QueensPuzzle, Difficulty } from '../constants/types';

export interface PuzzleLibraryEntry extends QueensPuzzle {
  id: string;
  isLogicallySolvable: boolean;
  hints?: string[];
}

/**
 * Easy Puzzles (7x7 grids)
 */
export const easyPuzzles: PuzzleLibraryEntry[] = [
  {
    "id": "easy-001",
    "difficulty": "easy",
    "size": 7,
    "seed": 1776761213033,
    "isLogicallySolvable": true,
    "regions": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        4
      ],
      [
        6,
        6,
        1,
        1,
        1,
        4,
        4
      ],
      [
        3,
        3,
        1,
        1,
        5,
        0,
        0
      ],
      [
        3,
        3,
        3,
        5,
        5,
        0,
        0
      ],
      [
        3,
        3,
        2,
        2,
        0,
        0,
        0
      ],
      [
        3,
        3,
        2,
        2,
        2,
        0,
        0
      ],
      [
        3,
        2,
        2,
        2,
        2,
        2,
        0
      ]
    ],
    "regionColors": [
      "#FFB6C1",
      "#87CEEB",
      "#98FB98",
      "#FFD700",
      "#DDA0DD",
      "#FFA07A",
      "#87CEFA"
    ],
    "solution": [
      [
        0,
        6
      ],
      [
        1,
        0
      ],
      [
        2,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        1
      ],
      [
        5,
        5
      ],
      [
        6,
        3
      ]
    ]
  },
  {
    "id": "easy-002",
    "difficulty": "easy",
    "size": 7,
    "seed": 1776761213034,
    "isLogicallySolvable": true,
    "regions": [
      [
        0,
        0,
        0,
        0,
        1,
        1,
        1
      ],
      [
        0,
        0,
        0,
        0,
        0,
        1,
        1
      ],
      [
        4,
        4,
        0,
        6,
        6,
        6,
        1
      ],
      [
        3,
        3,
        3,
        6,
        1,
        1,
        1
      ],
      [
        3,
        3,
        3,
        6,
        2,
        2,
        1
      ],
      [
        3,
        3,
        3,
        2,
        2,
        2,
        2
      ],
      [
        5,
        3,
        3,
        2,
        2,
        2,
        2
      ]
    ],
    "regionColors": [
      "#FFB6C1",
      "#87CEEB",
      "#98FB98",
      "#FFD700",
      "#DDA0DD",
      "#FFA07A",
      "#87CEFA"
    ],
    "solution": [
      [
        0,
        6
      ],
      [
        1,
        4
      ],
      [
        2,
        1
      ],
      [
        3,
        3
      ],
      [
        4,
        5
      ],
      [
        5,
        2
      ],
      [
        6,
        0
      ]
    ]
  },
  {
    "id": "easy-003",
    "difficulty": "easy",
    "size": 7,
    "seed": 1776761213035,
    "isLogicallySolvable": true,
    "regions": [
      [
        5,
        2,
        2,
        2,
        0,
        0,
        0
      ],
      [
        5,
        2,
        2,
        2,
        0,
        0,
        0
      ],
      [
        5,
        5,
        2,
        2,
        2,
        0,
        0
      ],
      [
        5,
        5,
        2,
        4,
        1,
        0,
        0
      ],
      [
        3,
        3,
        3,
        1,
        1,
        1,
        0
      ],
      [
        6,
        3,
        3,
        1,
        1,
        1,
        1
      ],
      [
        3,
        3,
        3,
        3,
        3,
        1,
        1
      ]
    ],
    "regionColors": [
      "#FFB6C1",
      "#87CEEB",
      "#98FB98",
      "#FFD700",
      "#DDA0DD",
      "#FFA07A",
      "#87CEFA"
    ],
    "solution": [
      [
        0,
        2
      ],
      [
        1,
        6
      ],
      [
        2,
        1
      ],
      [
        3,
        3
      ],
      [
        4,
        5
      ],
      [
        5,
        0
      ],
      [
        6,
        4
      ]
    ]
  },
  {
    "id": "easy-004",
    "difficulty": "easy",
    "size": 7,
    "seed": 1776761213036,
    "isLogicallySolvable": true,
    "regions": [
      [
        3,
        3,
        3,
        3,
        2,
        2,
        2
      ],
      [
        3,
        3,
        3,
        3,
        2,
        2,
        2
      ],
      [
        4,
        3,
        3,
        3,
        2,
        2,
        2
      ],
      [
        4,
        4,
        6,
        3,
        0,
        0,
        2
      ],
      [
        4,
        4,
        4,
        0,
        0,
        0,
        0
      ],
      [
        4,
        4,
        4,
        5,
        0,
        0,
        0
      ],
      [
        4,
        5,
        5,
        5,
        5,
        0,
        1
      ]
    ],
    "regionColors": [
      "#FFB6C1",
      "#87CEEB",
      "#98FB98",
      "#FFD700",
      "#DDA0DD",
      "#FFA07A",
      "#87CEFA"
    ],
    "solution": [
      [
        0,
        1
      ],
      [
        1,
        4
      ],
      [
        2,
        0
      ],
      [
        3,
        2
      ],
      [
        4,
        5
      ],
      [
        5,
        3
      ],
      [
        6,
        6
      ]
    ]
  },
  {
    "id": "easy-005",
    "difficulty": "easy",
    "size": 7,
    "seed": 1776761213037,
    "isLogicallySolvable": true,
    "regions": [
      [
        4,
        4,
        4,
        0,
        0,
        0,
        0
      ],
      [
        4,
        4,
        0,
        0,
        0,
        0,
        6
      ],
      [
        1,
        1,
        3,
        3,
        0,
        0,
        3
      ],
      [
        1,
        1,
        3,
        3,
        3,
        3,
        3
      ],
      [
        1,
        1,
        2,
        2,
        2,
        3,
        3
      ],
      [
        1,
        1,
        2,
        2,
        2,
        2,
        5
      ],
      [
        1,
        1,
        2,
        2,
        2,
        5,
        5
      ]
    ],
    "regionColors": [
      "#FFB6C1",
      "#87CEEB",
      "#98FB98",
      "#FFD700",
      "#DDA0DD",
      "#FFA07A",
      "#87CEFA"
    ],
    "solution": [
      [
        0,
        1
      ],
      [
        1,
        6
      ],
      [
        2,
        4
      ],
      [
        3,
        2
      ],
      [
        4,
        0
      ],
      [
        5,
        3
      ],
      [
        6,
        5
      ]
    ]
  }
];

/**
 * Medium Puzzles (9x9 grids)
 */
export const mediumPuzzles: PuzzleLibraryEntry[] = [
  {
    "id": "medium-001",
    "difficulty": "medium",
    "size": 9,
    "seed": 1776761213464,
    "isLogicallySolvable": true,
    "regions": [
      [
        5,
        5,
        0,
        0,
        0,
        7,
        7,
        7,
        2
      ],
      [
        5,
        0,
        0,
        0,
        0,
        0,
        7,
        2,
        2
      ],
      [
        5,
        5,
        0,
        0,
        0,
        0,
        2,
        2,
        2
      ],
      [
        5,
        5,
        6,
        0,
        3,
        2,
        2,
        2,
        2
      ],
      [
        5,
        5,
        5,
        3,
        3,
        3,
        2,
        1,
        2
      ],
      [
        4,
        4,
        3,
        3,
        3,
        3,
        1,
        1,
        1
      ],
      [
        4,
        4,
        4,
        3,
        3,
        1,
        1,
        1,
        1
      ],
      [
        4,
        4,
        4,
        4,
        3,
        3,
        1,
        1,
        1
      ],
      [
        8,
        4,
        4,
        4,
        3,
        3,
        1,
        1,
        1
      ]
    ],
    "regionColors": [
      "#FFB6C1",
      "#87CEEB",
      "#98FB98",
      "#FFD700",
      "#DDA0DD",
      "#FFA07A",
      "#87CEFA",
      "#F0E68C",
      "#E6E6FA"
    ],
    "solution": [
      [
        0,
        1
      ],
      [
        1,
        6
      ],
      [
        2,
        4
      ],
      [
        3,
        2
      ],
      [
        4,
        8
      ],
      [
        5,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        3
      ],
      [
        8,
        0
      ]
    ]
  },
  {
    "id": "medium-002",
    "difficulty": "medium",
    "size": 9,
    "seed": 1776761213469,
    "isLogicallySolvable": true,
    "regions": [
      [
        4,
        4,
        0,
        0,
        0,
        5,
        5,
        5,
        5
      ],
      [
        4,
        0,
        0,
        0,
        0,
        5,
        5,
        5,
        5
      ],
      [
        0,
        0,
        0,
        0,
        0,
        2,
        5,
        5,
        5
      ],
      [
        6,
        0,
        0,
        0,
        2,
        2,
        2,
        5,
        5
      ],
      [
        6,
        6,
        6,
        2,
        2,
        2,
        2,
        8,
        1
      ],
      [
        6,
        6,
        6,
        2,
        2,
        2,
        2,
        1,
        1
      ],
      [
        6,
        6,
        3,
        3,
        2,
        2,
        2,
        1,
        1
      ],
      [
        3,
        3,
        3,
        3,
        3,
        1,
        1,
        1,
        1
      ],
      [
        7,
        3,
        3,
        3,
        3,
        3,
        1,
        1,
        1
      ]
    ],
    "regionColors": [
      "#FFB6C1",
      "#87CEEB",
      "#98FB98",
      "#FFD700",
      "#DDA0DD",
      "#FFA07A",
      "#87CEFA",
      "#F0E68C",
      "#E6E6FA"
    ],
    "solution": [
      [
        0,
        1
      ],
      [
        1,
        6
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ],
      [
        4,
        7
      ],
      [
        5,
        2
      ],
      [
        6,
        8
      ],
      [
        7,
        4
      ],
      [
        8,
        0
      ]
    ]
  },
  {
    "id": "medium-003",
    "difficulty": "medium",
    "size": 9,
    "seed": 1776761213471,
    "isLogicallySolvable": true,
    "regions": [
      [
        0,
        0,
        0,
        0,
        0,
        1,
        3,
        3,
        3
      ],
      [
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        3,
        3
      ],
      [
        2,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        3
      ],
      [
        2,
        2,
        0,
        1,
        1,
        1,
        1,
        3,
        3
      ],
      [
        2,
        2,
        2,
        2,
        7,
        1,
        5,
        5,
        3
      ],
      [
        2,
        2,
        2,
        2,
        7,
        7,
        4,
        5,
        5
      ],
      [
        6,
        2,
        6,
        6,
        7,
        4,
        4,
        4,
        5
      ],
      [
        6,
        6,
        6,
        6,
        4,
        4,
        4,
        4,
        4
      ],
      [
        6,
        6,
        6,
        6,
        6,
        4,
        4,
        4,
        8
      ]
    ],
    "regionColors": [
      "#FFB6C1",
      "#87CEEB",
      "#98FB98",
      "#FFD700",
      "#DDA0DD",
      "#FFA07A",
      "#87CEFA",
      "#F0E68C",
      "#E6E6FA"
    ],
    "solution": [
      [
        0,
        1
      ],
      [
        1,
        7
      ],
      [
        2,
        0
      ],
      [
        3,
        3
      ],
      [
        4,
        6
      ],
      [
        5,
        4
      ],
      [
        6,
        2
      ],
      [
        7,
        5
      ],
      [
        8,
        8
      ]
    ]
  }
];

/**
 * Hard Puzzles (11x11 grids)
 */
export const hardPuzzles: PuzzleLibraryEntry[] = [];

/**
 * Get all puzzles by difficulty
 */
export function getPuzzlesByDifficulty(difficulty: Difficulty): PuzzleLibraryEntry[] {
  switch (difficulty) {
    case 'easy':
      return easyPuzzles;
    case 'medium':
      return mediumPuzzles;
    case 'hard':
      return hardPuzzles;
    default:
      return easyPuzzles;
  }
}

/**
 * Get a random puzzle for practice mode
 */
export function getRandomPuzzle(difficulty: Difficulty): PuzzleLibraryEntry {
  const puzzles = getPuzzlesByDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

/**
 * Get daily puzzle using deterministic seed
 */
export function getDailyPuzzle(difficulty: Difficulty, seed: number): PuzzleLibraryEntry {
  const puzzles = getPuzzlesByDifficulty(difficulty);
  const index = seed % puzzles.length;
  return puzzles[index];
}

/**
 * Get all puzzles (for validation/testing)
 */
export function getAllPuzzles(): PuzzleLibraryEntry[] {
  return [...easyPuzzles, ...mediumPuzzles, ...hardPuzzles];
}
