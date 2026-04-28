import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react-native';
import { TangoPuzzle } from '../../constants/types';
import { validateTangoGrid, isPuzzleComplete } from '../../engines/tangoValidator';
import { getIntelligentHint } from '../../engines/tangoHints';
import { useTimer } from '../../hooks/useTimer';
import { Timer } from '../ui/Timer';

interface TangoBoardProps {
  puzzle: TangoPuzzle;
  mode: 'daily' | 'practice';
  onComplete?: (time: number) => void;
}

export function TangoBoard({ puzzle, mode, onComplete }: TangoBoardProps) {
  const [currentGrid, setCurrentGrid] = useState<(0 | 1 | null)[][]>(() =>
    puzzle.grid.map(row => [...row])
  );
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState<number | null>(3);
  const [hintCells, setHintCells] = useState<[number, number][]>([]);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [validationTimer, setValidationTimer] = useState<NodeJS.Timeout | null>(null);
  const { elapsed, start, stop, reset } = useTimer();

  // Countdown logic
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      start();
    }
  }, [countdown]);

  // Validate grid with 1-second debounce to allow user to cycle through values
  useEffect(() => {
    // Clear existing validation timer
    if (validationTimer) {
      clearTimeout(validationTimer);
    }

    // Set new timer for validation (1 second delay)
    const timer = setTimeout(() => {
      const validation = validateTangoGrid(puzzle, currentGrid);
      setConflicts(validation.conflicts);
    }, 1000);

    setValidationTimer(timer);

    // Check if puzzle is complete (immediate, no delay)
    if (isPuzzleComplete(puzzle, currentGrid)) {
      if (validationTimer) {
        clearTimeout(validationTimer);
      }
      stop();
      onComplete?.(elapsed);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentGrid]);

  const handleCellPress = (row: number, col: number) => {
    // Clear hints when user interacts
    setHintCells([]);
    setHintMessage(null);

    // Don't modify pre-filled cells
    if (puzzle.grid[row][col] !== null) {
      return;
    }

    const currentValue = currentGrid[row][col];

    // Click cycle: null → 0 (sun) → 1 (moon) → null
    let newValue: 0 | 1 | null;
    if (currentValue === null) {
      newValue = 0; // Place sun
    } else if (currentValue === 0) {
      newValue = 1; // Change to moon
    } else {
      newValue = null; // Clear cell
    }

    const newGrid = currentGrid.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? newValue : c))
    );

    setCurrentGrid(newGrid);
  };

  const handleHint = () => {
    const hint = getIntelligentHint(puzzle, currentGrid);

    if (!hint) {
      setHintMessage('Puzzle is already complete!');
      return;
    }

    setHintMessage(hint.message);
    setHintCells(hint.highlightCells || []);

    // Auto-dismiss hint after 8 seconds
    setTimeout(() => {
      setHintCells([]);
      setHintMessage(null);
    }, 8000);
  };

  const handleReset = () => {
    // Clear validation timer on reset
    if (validationTimer) {
      clearTimeout(validationTimer);
      setValidationTimer(null);
    }
    setCurrentGrid(puzzle.grid.map(row => [...row]));
    setConflicts(new Set());
    setHintCells([]);
    setHintMessage(null);
    reset();
    setCountdown(3);
  };

  const cellSize = Math.max(
    50, // Minimum size for touch accuracy
    Math.min(
      70, // Maximum size
      Math.floor((Dimensions.get('window').width - 64) / puzzle.size)
    )
  );

  return (
    <View style={styles.container}>
      <Timer elapsed={elapsed} />

      {countdown !== null && countdown > 0 && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      <View style={styles.boardContainer}>
        <View style={styles.board}>
          {currentGrid.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((value, c) => {
                const cellKey = `${r}-${c}`;
                const hasConflict = conflicts.has(cellKey);
                const isHintCell = hintCells.some(([hr, hc]) => hr === r && hc === c);
                const isPreFilled = puzzle.grid[r][c] !== null;

                return (
                  <Pressable
                    key={cellKey}
                    onPress={() => handleCellPress(r, c)}
                    disabled={countdown !== null || isPreFilled}
                    style={[
                      styles.cell,
                      {
                        width: cellSize,
                        height: cellSize,
                      },
                      isPreFilled && styles.cellPreFilled,
                      hasConflict && styles.cellWithConflict,
                      isHintCell && styles.cellHint,
                    ]}
                  >
                    {value === 0 && <Sun size={28} color="#FCD34D" strokeWidth={2.5} />}
                    {value === 1 && <Moon size={28} color="#A78BFA" strokeWidth={2.5} />}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Constraints Overlay */}
        <View style={styles.constraintsOverlay}>
          {puzzle.constraints.map((constraint, idx) => {
            const [r1, c1] = constraint.cell1;
            const [r2, c2] = constraint.cell2;

            // Only render horizontal constraints (same row, adjacent columns)
            if (r1 === r2 && c2 === c1 + 1) {
              return (
                <View
                  key={idx}
                  style={[
                    styles.constraint,
                    {
                      position: 'absolute',
                      left: 16 + (c1 + 1) * cellSize - 12,
                      top: 16 + r1 * cellSize + cellSize / 2 - 10,
                    },
                  ]}
                >
                  <Text style={styles.constraintText}>
                    {constraint.type === 'equal' ? '=' : '×'}
                  </Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      </View>

      {/* Hint Message */}
      {hintMessage && (
        <View style={styles.hintMessageContainer}>
          <Text style={styles.hintMessageText}>{hintMessage}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable onPress={handleHint} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>💡 Hint</Text>
        </Pressable>
        <Pressable onPress={handleReset} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔄 Reset</Text>
        </Pressable>
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {currentGrid.flat().filter(v => v !== null).length} / {puzzle.size * puzzle.size} cells filled
        </Text>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Sun size={16} color="#FCD34D" strokeWidth={2.5} />
          <Text style={styles.legendText}>Sun</Text>
        </View>
        <View style={styles.legendItem}>
          <Moon size={16} color="#A78BFA" strokeWidth={2.5} />
          <Text style={styles.legendText}>Moon</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={[styles.legendText, styles.legendSymbol]}>=</Text>
          <Text style={styles.legendText}>Same</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={[styles.legendText, styles.legendSymbol]}>×</Text>
          <Text style={styles.legendText}>Different</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: '700',
    color: '#4F6EF7',
  },
  boardContainer: {
    position: 'relative',
  },
  board: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 2,
    borderColor: '#2A2A3D',
    backgroundColor: '#1C1C27',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  cellPreFilled: {
    backgroundColor: '#13131A',
    borderColor: '#3A3A4D',
  },
  cellWithConflict: {
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  cellHint: {
    backgroundColor: 'rgba(79, 110, 247, 0.4)',
    borderWidth: 3,
    borderColor: '#4F6EF7',
  },
  symbol: {
    fontSize: 32,
    userSelect: 'none',
  },
  constraintsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  constraint: {
    width: 24,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0F',
    borderRadius: 4,
  },
  constraintText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F6EF7',
  },
  hintMessageContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(79, 110, 247, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F6EF7',
    maxWidth: 500,
  },
  hintMessageText: {
    color: '#F0F0F8',
    fontSize: 14,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2A2A3D',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F6EF7',
  },
  actionButtonText: {
    color: '#F0F0F8',
    fontSize: 16,
    fontWeight: '600',
  },
  progress: {
    marginTop: 16,
  },
  progressText: {
    textAlign: 'center',
    color: '#8888AA',
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#13131A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    color: '#8888AA',
    fontSize: 13,
    fontWeight: '600',
  },
  legendSymbol: {
    fontSize: 16,
    color: '#4F6EF7',
    fontWeight: '700',
  },
});
