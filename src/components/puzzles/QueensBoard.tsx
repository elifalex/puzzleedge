import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Crown } from 'lucide-react-native';
import { QueensPuzzle } from '../../constants/types';
import { queensEngine } from '../../engines/queens';
import { queensHintEngine } from '../../engines/queensHints';
import { validateQueenPlacement } from '../../engines/queensValidator';
import { useTimer } from '../../hooks/useTimer';
import { Timer } from '../ui/Timer';

interface QueensBoardProps {
  puzzle: QueensPuzzle;
  mode: 'daily' | 'practice';
  onComplete?: (time: number) => void;
}

export function QueensBoard({ puzzle, mode, onComplete }: QueensBoardProps) {
  const boardRef = useRef<View>(null);
  const [placedQueens, setPlacedQueens] = useState<[number, number][]>([]);
  const [markedCells, setMarkedCells] = useState<Set<string>>(new Set()); // X markers
  const [conflictingQueens, setConflictingQueens] = useState<Set<string>>(new Set()); // Queens with conflicts
  const [countdown, setCountdown] = useState<number | null>(3); // Both modes start with countdown
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'mark' | 'clear' | null>(null);
  const [pressStartCell, setPressStartCell] = useState<[number, number] | null>(null);
  const [wasRecentlyDragging, setWasRecentlyDragging] = useState(false);
  const [hintCells, setHintCells] = useState<[number, number][]>([]);
  const [hintRegion, setHintRegion] = useState<number | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const { elapsed, start, stop, reset } = useTimer();

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

  const findConflicts = (queens: [number, number][]): Set<string> => {
    const conflicts = new Set<string>();

    for (let i = 0; i < queens.length; i++) {
      const [r1, c1] = queens[i];
      const region1 = puzzle.regions[r1][c1];

      for (let j = i + 1; j < queens.length; j++) {
        const [r2, c2] = queens[j];
        const region2 = puzzle.regions[r2][c2];

        // Check if they conflict
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
  };

  const handlePressStart = (row: number, col: number) => {
    setPressStartCell([row, col]);
  };

  const handleDragOver = (row: number, col: number) => {
    if (!pressStartCell) return;

    const [startRow, startCol] = pressStartCell;
    const cellKey = `${row}-${col}`;
    const hasQueen = placedQueens.some(([r, c]) => r === row && c === col);

    // Don't affect cells with queens
    if (hasQueen) return;

    // If we haven't started dragging yet but moved to a different cell, start dragging
    if (!isDragging && (startRow !== row || startCol !== col)) {
      const startCellKey = `${startRow}-${startCol}`;
      const startHasQueen = placedQueens.some(([r, c]) => r === startRow && c === startCol);

      // Don't allow dragging from queens
      if (startHasQueen) return;

      const startHasMarker = markedCells.has(startCellKey);

      setIsDragging(true);

      // Determine drag mode based on start cell
      if (startHasMarker) {
        setDragMode('clear');
      } else {
        setDragMode('mark');
        // Mark the starting cell when beginning a drag to place markers
        setMarkedCells((prev) => new Set(prev).add(startCellKey));
      }
    }

    // Apply drag to current cell (including start cell when dragging starts)
    if (isDragging || (pressStartCell && (startRow !== row || startCol !== col))) {
      const mode = dragMode || (markedCells.has(`${startRow}-${startCol}`) ? 'clear' : 'mark');
      const hasMarker = markedCells.has(cellKey);

      // Apply drag mode to this cell
      if (mode === 'mark' && !hasMarker) {
        setMarkedCells((prev) => new Set(prev).add(cellKey));
      } else if (mode === 'clear' && hasMarker) {
        setMarkedCells((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cellKey);
          return newSet;
        });
      }
    }
  };

  const handlePressEnd = () => {
    // If we were dragging, set flag to prevent handleCellPress from placing a queen
    if (isDragging) {
      setWasRecentlyDragging(true);
      // Clear flag after a short delay to allow normal clicks again
      setTimeout(() => {
        setWasRecentlyDragging(false);
      }, 50);
    }

    setPressStartCell(null);
    setIsDragging(false);
    setDragMode(null);
  };

  const handleBoardTouchMove = (event: any) => {
    if (!pressStartCell || !boardRef.current) return;

    const touch = event.nativeEvent.touches[0];
    if (!touch) return;

    // For React Native Web (mobile browsers), use getBoundingClientRect
    const boardElement = boardRef.current as any;
    if (boardElement.getBoundingClientRect) {
      // Web/mobile browser path
      const rect = boardElement.getBoundingClientRect();
      const relativeX = touch.clientX - rect.left - 16; // 16 is board padding
      const relativeY = touch.clientY - rect.top - 16;

      const col = Math.floor(relativeX / cellSize);
      const row = Math.floor(relativeY / cellSize);

      if (row >= 0 && row < puzzle.size && col >= 0 && col < puzzle.size) {
        handleDragOver(row, col);
      }
    } else if (touch.locationX !== undefined && touch.locationY !== undefined) {
      // Native mobile path (fallback)
      const relativeX = touch.locationX - 16;
      const relativeY = touch.locationY - 16;

      const col = Math.floor(relativeX / cellSize);
      const row = Math.floor(relativeY / cellSize);

      if (row >= 0 && row < puzzle.size && col >= 0 && col < puzzle.size) {
        handleDragOver(row, col);
      }
    }
  };

  const handleCellPress = (row: number, col: number) => {
    // Only process press if it wasn't a drag
    if (isDragging || wasRecentlyDragging) return;

    // Clear hint when user interacts
    setHintCells([]);
    setHintRegion(null);
    setHintMessage(null);
    setWarningMessage(null);

    const cellKey = `${row}-${col}`;
    const queenIndex = placedQueens.findIndex(([r, c]) => r === row && c === col);
    const hasMarker = markedCells.has(cellKey);

    // State cycle: Empty → X → Queen → Empty
    if (queenIndex !== -1) {
      // Currently has queen - remove it (go to empty)
      const newQueens = placedQueens.filter((_, i) => i !== queenIndex);
      setPlacedQueens(newQueens);
      setConflictingQueens(findConflicts(newQueens));
    } else if (hasMarker) {
      // Currently has X - place queen
      // First, validate the placement
      const validation = validateQueenPlacement(puzzle, placedQueens, [row, col]);

      if (!validation.isValid) {
        // Show warning but allow placement (for learning)
        setWarningMessage(validation.reason || 'This placement may not be correct.');

        // Auto-dismiss warning after 5 seconds
        setTimeout(() => {
          setWarningMessage(null);
        }, 5000);
      }

      setMarkedCells((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });

      const newQueens = [...placedQueens, [row, col] as [number, number]];
      setPlacedQueens(newQueens);

      // Find and highlight conflicts
      const conflicts = findConflicts(newQueens);
      setConflictingQueens(conflicts);

      // Check if puzzle is complete (all queens placed with no conflicts and valid)
      if (newQueens.length === puzzle.size && conflicts.size === 0 && validation.isValid) {
        stop();
        onComplete?.(elapsed);
      }
    } else {
      // Currently empty - place X marker
      setMarkedCells((prev) => new Set(prev).add(cellKey));
    }
  };

  const handleHint = () => {
    // Use intelligent hint engine
    const hint = queensHintEngine.getIntelligentHint(puzzle, placedQueens, markedCells);

    if (!hint) {
      setHintMessage('Puzzle is already complete!');
      return;
    }

    // Set hint state
    setHintMessage(hint.message);
    setHintCells(hint.highlightCells || []);
    setHintRegion(hint.highlightRegion !== undefined ? hint.highlightRegion : null);

    // Auto-dismiss hint after 8 seconds
    setTimeout(() => {
      setHintCells([]);
      setHintRegion(null);
      setHintMessage(null);
    }, 8000);
  };

  const handleReset = () => {
    setPlacedQueens([]);
    setMarkedCells(new Set());
    setConflictingQueens(new Set());
    setHintCells([]);
    setHintRegion(null);
    setHintMessage(null);
    setWarningMessage(null);
    reset(); // Reset timer
    setCountdown(3); // Restart countdown
  };

  // Improved cell size calculation for better touch targets
  const cellSize = Math.max(
    40, // Minimum size for touch accuracy
    Math.min(
      60, // Maximum size
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

      <View
        ref={boardRef}
        style={styles.board}
        onTouchMove={handleBoardTouchMove}
      >
        {puzzle.regions.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((regionId, c) => {
              const cellKey = `${r}-${c}`;
              const hasQueen = placedQueens.some(([qr, qc]) => qr === r && qc === c);
              const hasMarker = markedCells.has(cellKey);
              const hasConflict = conflictingQueens.has(cellKey);
              const isHintCell = hintCells.some(([hr, hc]) => hr === r && hc === c);
              const isHintRegion = hintRegion !== null && regionId === hintRegion;

              return (
                <Pressable
                  key={cellKey}
                  onPress={() => handleCellPress(r, c)}
                  onPressIn={() => handlePressStart(r, c)}
                  onPressOut={handlePressEnd}
                  onHoverIn={() => handleDragOver(r, c)}
                  disabled={countdown !== null}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: puzzle.regionColors[regionId],
                    },
                    hasConflict && styles.cellWithConflict,
                    isHintCell && styles.cellHint,
                    isHintRegion && !isHintCell && styles.cellHintRegion,
                  ]}
                >
                  {hasQueen && <Crown size={cellSize * 0.5} color={hasConflict ? "#DC2626" : "#1A1A1A"} strokeWidth={2.5} />}
                  {hasMarker && <Text style={styles.marker}>✕</Text>}
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

      {/* Warning Message */}
      {warningMessage && (
        <View style={styles.warningMessageContainer}>
          <Text style={styles.warningMessageText}>⚠️ {warningMessage}</Text>
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

      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {placedQueens.length} / {puzzle.size} queens placed
        </Text>
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
    padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1.5,
    borderColor: 'rgba(10, 10, 15, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    touchAction: 'none', // Prevent default touch behaviors
  },
  cellWithQueen: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  cellWithConflict: {
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  queen: {
    fontSize: 24,
    userSelect: 'none',
  },
  marker: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A1A1A',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
    userSelect: 'none',
  },
  cellHint: {
    backgroundColor: 'rgba(79, 110, 247, 0.4)',
    borderWidth: 3,
    borderColor: '#4F6EF7',
  },
  cellHintRegion: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#4F6EF7',
  },
  hintMessageContainer: {
    marginTop: 16,
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
  warningMessageContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
    maxWidth: 400,
  },
  warningMessageText: {
    color: '#FCA5A5',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
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
});
