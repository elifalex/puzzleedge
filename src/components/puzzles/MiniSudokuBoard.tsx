import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { MiniSudokuPuzzle } from '../../constants/types';
import { miniSudokuHintEngine } from '../../engines/miniSudokuHints';
import { findAllConflicts, isComplete } from '../../engines/miniSudokuValidator';
import { useTimer } from '../../hooks/useTimer';
import { Timer } from '../ui/Timer';

interface MiniSudokuBoardProps {
  puzzle: MiniSudokuPuzzle;
  mode: 'daily' | 'practice';
  onComplete?: (time: number) => void;
}

export function MiniSudokuBoard({ puzzle, mode, onComplete }: MiniSudokuBoardProps) {
  // Initialize grid with puzzle clues
  const [grid, setGrid] = useState<(number | null)[][]>(() =>
    puzzle.grid.map(row => [...row])
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState<number | null>(3);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState<Map<string, Set<number>>>(new Map());
  const [hintCells, setHintCells] = useState<[number, number][]>([]);
  const [hintNumber, setHintNumber] = useState<number | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [flashingRows, setFlashingRows] = useState<Set<number>>(new Set());
  const [flashingCols, setFlashingCols] = useState<Set<number>>(new Set());
  const [flashingBoxes, setFlashingBoxes] = useState<Set<string>>(new Set());
  const [completedRows, setCompletedRows] = useState<Set<number>>(new Set());
  const [completedCols, setCompletedCols] = useState<Set<number>>(new Set());
  const [completedBoxes, setCompletedBoxes] = useState<Set<string>>(new Set());
  const { elapsed, start, stop, reset } = useTimer();

  // Countdown timer
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
  }, [countdown, start]);

  // Helper function to check if a row is correctly completed
  const isRowComplete = (rowIndex: number): boolean => {
    const row = grid[rowIndex];
    if (row.some(cell => cell === null)) return false;
    const seen = new Set<number>();
    for (const cell of row) {
      if (seen.has(cell!)) return false;
      seen.add(cell!);
    }
    return seen.size === 6;
  };

  // Helper function to check if a column is correctly completed
  const isColComplete = (colIndex: number): boolean => {
    const col = grid.map(row => row[colIndex]);
    if (col.some(cell => cell === null)) return false;
    const seen = new Set<number>();
    for (const cell of col) {
      if (seen.has(cell!)) return false;
      seen.add(cell!);
    }
    return seen.size === 6;
  };

  // Helper function to check if a 2x3 box is correctly completed
  const isBoxComplete = (boxRow: number, boxCol: number): boolean => {
    const cells: (number | null)[] = [];
    const startRow = boxRow * 2;
    const startCol = boxCol * 3;

    for (let r = startRow; r < startRow + 2; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        cells.push(grid[r][c]);
      }
    }

    if (cells.some(cell => cell === null)) return false;
    const seen = new Set<number>();
    for (const cell of cells) {
      if (seen.has(cell!)) return false;
      seen.add(cell!);
    }
    return seen.size === 6;
  };

  // Check for completion whenever grid changes
  useEffect(() => {
    if (countdown === null) {
      const newConflicts = findAllConflicts(grid);
      setConflicts(newConflicts);

      // Check for newly completed rows, columns, and boxes
      const newFlashingRows = new Set<number>();
      const newFlashingCols = new Set<number>();
      const newFlashingBoxes = new Set<string>();

      for (let i = 0; i < 6; i++) {
        if (isRowComplete(i) && !completedRows.has(i)) {
          newFlashingRows.add(i);
        }
        if (isColComplete(i) && !completedCols.has(i)) {
          newFlashingCols.add(i);
        }
      }

      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 2; boxCol++) {
          const boxKey = `${boxRow}-${boxCol}`;
          if (isBoxComplete(boxRow, boxCol) && !completedBoxes.has(boxKey)) {
            newFlashingBoxes.add(boxKey);
          }
        }
      }

      // Trigger flash animation for newly completed sections
      if (newFlashingRows.size > 0 || newFlashingCols.size > 0 || newFlashingBoxes.size > 0) {
        setFlashingRows(new Set([...flashingRows, ...newFlashingRows]));
        setFlashingCols(new Set([...flashingCols, ...newFlashingCols]));
        setFlashingBoxes(new Set([...flashingBoxes, ...newFlashingBoxes]));

        // Mark as completed
        setCompletedRows(new Set([...completedRows, ...newFlashingRows]));
        setCompletedCols(new Set([...completedCols, ...newFlashingCols]));
        setCompletedBoxes(new Set([...completedBoxes, ...newFlashingBoxes]));

        // Remove flash after animation (600ms)
        setTimeout(() => {
          setFlashingRows(prev => {
            const updated = new Set(prev);
            newFlashingRows.forEach(r => updated.delete(r));
            return updated;
          });
          setFlashingCols(prev => {
            const updated = new Set(prev);
            newFlashingCols.forEach(c => updated.delete(c));
            return updated;
          });
          setFlashingBoxes(prev => {
            const updated = new Set(prev);
            newFlashingBoxes.forEach(b => updated.delete(b));
            return updated;
          });
        }, 600);
      }

      if (!hasCompleted && isComplete(grid, puzzle.solution)) {
        stop();
        setHasCompleted(true);
        onComplete?.(elapsed);
      }
    }
  }, [grid, puzzle.solution, countdown, elapsed, stop, hasCompleted, onComplete]);

  /**
   * Handle cell press - select the cell
   */
  const handleCellPress = (row: number, col: number) => {
    // Can't select given clues
    if (puzzle.grid[row][col] !== null) return;

    // Clear hints
    setHintCells([]);
    setHintNumber(null);
    setHintMessage(null);

    // Toggle selection
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      setSelectedCell(null);
    } else {
      setSelectedCell([row, col]);
    }
  };

  /**
   * Handle number pad press - place number in selected cell or toggle note
   */
  const handleNumberPress = (num: number) => {
    if (!selectedCell) {
      // If no cell selected, just select this number
      setSelectedNumber(num);
      return;
    }

    const [row, col] = selectedCell;
    const cellKey = `${row}-${col}`;

    // Can't modify given clues
    if (puzzle.grid[row][col] !== null) return;

    // Clear hints
    setHintCells([]);
    setHintNumber(null);
    setHintMessage(null);

    if (notesMode) {
      // Toggle note in notes mode
      setNotes(prevNotes => {
        const newNotes = new Map(prevNotes);
        const cellNotes = new Set(newNotes.get(cellKey) || new Set());

        if (cellNotes.has(num)) {
          cellNotes.delete(num);
        } else {
          cellNotes.add(num);
        }

        if (cellNotes.size > 0) {
          newNotes.set(cellKey, cellNotes);
        } else {
          newNotes.delete(cellKey);
        }

        return newNotes;
      });
    } else {
      // Place number in normal mode
      const newGrid = grid.map((r, rIdx) =>
        r.map((cell, cIdx) => (rIdx === row && cIdx === col ? num : cell))
      );

      setGrid(newGrid);
      setSelectedNumber(num);

      // Clear notes for this cell when placing a number
      setNotes(prevNotes => {
        const newNotes = new Map(prevNotes);
        newNotes.delete(cellKey);
        return newNotes;
      });
    }
  };

  /**
   * Handle erase - clear selected cell and its notes
   */
  const handleErase = () => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;
    const cellKey = `${row}-${col}`;

    // Can't modify given clues
    if (puzzle.grid[row][col] !== null) return;

    // Clear hints
    setHintCells([]);
    setHintNumber(null);
    setHintMessage(null);

    // Clear cell
    const newGrid = grid.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? null : cell))
    );

    setGrid(newGrid);
    setSelectedNumber(null);

    // Clear notes for this cell
    setNotes(prevNotes => {
      const newNotes = new Map(prevNotes);
      newNotes.delete(cellKey);
      return newNotes;
    });
  };

  /**
   * Handle hint request
   */
  const handleHint = () => {
    const hint = miniSudokuHintEngine.getIntelligentHint(puzzle, grid);

    if (!hint) {
      setHintMessage('Puzzle is already complete!');
      return;
    }

    setHintMessage(hint.message);
    setHintCells(hint.highlightCells || []);
    setHintNumber(hint.highlightNumber || null);

    // Auto-dismiss hint after 8 seconds
    setTimeout(() => {
      setHintCells([]);
      setHintNumber(null);
      setHintMessage(null);
    }, 8000);
  };

  /**
   * Handle reset
   */
  const handleReset = () => {
    setGrid(puzzle.grid.map(row => [...row]));
    setSelectedCell(null);
    setSelectedNumber(null);
    setConflicts(new Set());
    setHintCells([]);
    setHintNumber(null);
    setHintMessage(null);
    setHasCompleted(false);
    setFlashingRows(new Set());
    setFlashingCols(new Set());
    setFlashingBoxes(new Set());
    setCompletedRows(new Set());
    setCompletedCols(new Set());
    setCompletedBoxes(new Set());
    setNotesMode(false);
    setNotes(new Map());
    reset();
    setCountdown(3);
  };

  // Calculate cell size
  const screenWidth = Dimensions.get('window').width;
  const maxBoardWidth = Math.min(screenWidth - 64, 500);
  const cellSize = Math.floor(maxBoardWidth / 6);

  return (
    <View style={styles.container}>
      <Timer elapsed={elapsed} />

      {countdown !== null && countdown > 0 && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      {/* Grid */}
      <View style={styles.board}>
        {grid.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((cell, colIdx) => {
              const cellKey = `${rowIdx}-${colIdx}`;
              const isGivenClue = puzzle.grid[rowIdx][colIdx] !== null;
              const isSelected =
                selectedCell && selectedCell[0] === rowIdx && selectedCell[1] === colIdx;
              const hasConflict = conflicts.has(cellKey);
              const isHintCell = hintCells.some(([r, c]) => r === rowIdx && c === colIdx);
              const isHintNumber = hintNumber !== null && cell === hintNumber;

              // Check if cell is in a flashing row, column, or box
              const boxRow = Math.floor(rowIdx / 2);
              const boxCol = Math.floor(colIdx / 3);
              const boxKey = `${boxRow}-${boxCol}`;
              const isFlashing =
                flashingRows.has(rowIdx) ||
                flashingCols.has(colIdx) ||
                flashingBoxes.has(boxKey);

              // Box borders (thicker borders around 2x3 boxes)
              const isRightBoxBorder = colIdx === 2; // After column 2 (between boxes)
              const isBottomBoxBorder = rowIdx % 2 === 1; // After every 2 rows

              return (
                <Pressable
                  key={cellKey}
                  onPress={() => handleCellPress(rowIdx, colIdx)}
                  disabled={countdown !== null || isGivenClue}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                    },
                    isGivenClue && styles.cellGiven,
                    isSelected && styles.cellSelected,
                    hasConflict && styles.cellConflict,
                    isHintCell && styles.cellHint,
                    isHintNumber && styles.cellHintNumber,
                    isFlashing && styles.cellFlashing,
                    isRightBoxBorder && styles.cellRightBoxBorder,
                    isBottomBoxBorder && styles.cellBottomBoxBorder,
                  ]}
                >
                  {cell !== null ? (
                    <Text
                      style={[
                        styles.cellText,
                        isGivenClue && styles.cellTextGiven,
                        hasConflict && styles.cellTextConflict,
                        { fontSize: cellSize * 0.5 },
                      ]}
                    >
                      {cell}
                    </Text>
                  ) : (
                    notes.get(cellKey) && notes.get(cellKey)!.size > 0 && (
                      <View style={styles.notesContainer}>
                        {[1, 2, 3, 4, 5, 6].map(num => {
                          const hasNote = notes.get(cellKey)?.has(num);
                          return (
                            <Text
                              key={num}
                              style={[
                                styles.noteText,
                                { fontSize: cellSize * 0.18 },
                                !hasNote && styles.noteTextHidden,
                              ]}
                            >
                              {num}
                            </Text>
                          );
                        })}
                      </View>
                    )
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Hint Message */}
      {hintMessage && (
        <View style={styles.hintMessageContainer}>
          <Text style={styles.hintMessageText}>{hintMessage}</Text>
        </View>
      )}

      {/* Persistent Number Pad */}
      <View style={styles.numberPad}>
        <View style={styles.numberRow}>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <Pressable
              key={num}
              onPress={() => handleNumberPress(num)}
              disabled={countdown !== null}
              style={[
                styles.numberButton,
                selectedNumber === num && styles.numberButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.numberButtonText,
                  selectedNumber === num && styles.numberButtonTextSelected,
                ]}
              >
                {num}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.controlRow}>
          <Pressable
            onPress={handleErase}
            disabled={countdown !== null}
            style={styles.eraseButton}
          >
            <Text style={styles.eraseButtonText}>Erase</Text>
          </Pressable>
          <Pressable
            onPress={() => setNotesMode(!notesMode)}
            disabled={countdown !== null}
            style={[styles.notesButton, notesMode && styles.notesButtonActive]}
          >
            <Text style={[styles.notesButtonText, notesMode && styles.notesButtonTextActive]}>
              ✏️ Notes
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable onPress={handleHint} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>💡 Hint</Text>
        </Pressable>
        <Pressable onPress={handleReset} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔄 Reset</Text>
        </Pressable>
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
  board: {
    borderWidth: 2,
    borderColor: '#2A2A3D',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#2A2A3D',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#13131A',
  },
  cellGiven: {
    backgroundColor: '#1C1C27',
  },
  cellSelected: {
    backgroundColor: 'rgba(79, 110, 247, 0.3)',
    borderWidth: 2,
    borderColor: '#4F6EF7',
  },
  cellConflict: {
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  cellHint: {
    backgroundColor: 'rgba(79, 110, 247, 0.4)',
    borderWidth: 2,
    borderColor: '#4F6EF7',
  },
  cellHintNumber: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  cellFlashing: {
    backgroundColor: 'rgba(34, 197, 94, 0.5)',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  cellRightBoxBorder: {
    borderRightWidth: 3,
    borderRightColor: '#4F6EF7',
  },
  cellBottomBoxBorder: {
    borderBottomWidth: 3,
    borderBottomColor: '#4F6EF7',
  },
  cellText: {
    fontWeight: '600',
    color: '#4F6EF7',
  },
  cellTextGiven: {
    fontWeight: '700',
    color: '#F0F0F8',
  },
  cellTextConflict: {
    color: '#DC2626',
  },
  hintMessageContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(79, 110, 247, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F6EF7',
    maxWidth: 400,
  },
  hintMessageText: {
    color: '#F0F0F8',
    fontSize: 14,
    textAlign: 'center',
  },
  notesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  noteText: {
    width: '33.33%',
    textAlign: 'center',
    color: '#8888AA',
    fontWeight: '600',
  },
  noteTextHidden: {
    opacity: 0,
  },
  numberPad: {
    marginBottom: 16,
    alignItems: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  numberButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#2A2A3D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4F6EF7',
  },
  numberButtonSelected: {
    backgroundColor: '#4F6EF7',
    borderWidth: 2,
  },
  numberButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0F0F8',
  },
  numberButtonTextSelected: {
    color: '#0A0A0F',
  },
  eraseButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#EF4444',
    flex: 1,
    minWidth: 100,
    height: 44,
    justifyContent: 'center',
  },
  eraseButtonText: {
    color: '#F0F0F8',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  notesButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2A2A3D',
    borderWidth: 1,
    borderColor: '#4F6EF7',
    flex: 1,
    minWidth: 100,
    height: 44,
    justifyContent: 'center',
  },
  notesButtonActive: {
    backgroundColor: '#4F6EF7',
    borderWidth: 2,
  },
  notesButtonText: {
    color: '#F0F0F8',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  notesButtonTextActive: {
    color: '#0A0A0F',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
});
