import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { ZipPuzzle } from '../../constants/types';
import { validateZipPath, isZipPuzzleComplete, canMoveBetweenCells } from '../../engines/zipValidator';
import { getZipHint, findDivergencePoint } from '../../engines/zipHints';
import { useTimer } from '../../hooks/useTimer';
import { Timer } from '../ui/Timer';

interface ZipBoardProps {
  puzzle: ZipPuzzle;
  mode: 'daily' | 'practice';
  onComplete?: (time: number) => void;
}

export function ZipBoard({ puzzle, mode, onComplete }: ZipBoardProps) {
  const boardRef = useRef<View>(null);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState<number | null>(3);
  const [hintPathSegment, setHintPathSegment] = useState<[number, number][]>([]);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  // Validate path whenever it changes
  useEffect(() => {
    const validation = validateZipPath(puzzle, currentPath);
    setConflicts(validation.conflicts);

    // Check if puzzle is complete
    if (validation.isComplete) {
      stop();
      onComplete?.(elapsed);
    }
  }, [currentPath]);

  const handleCellPressIn = (row: number, col: number) => {
    // Clear hints when user interacts
    setHintPathSegment([]);
    setHintMessage(null);

    const cellKey = `${row},${col}`;

    // If path is empty, must start from checkpoint 1
    if (currentPath.length === 0) {
      const checkpoint1 = puzzle.checkpoints.find(cp => cp.order === 1);
      if (checkpoint1 && checkpoint1.position[0] === row && checkpoint1.position[1] === col) {
        setCurrentPath([[row, col]]);
        setIsDragging(true);
      }
      return;
    }

    // If already dragging, add cell to path (for mobile touch-and-drag)
    if (isDragging) {
      handleCellEnter(row, col);
      return;
    }

    // Check if pressing a cell already in the path (truncate backward)
    const existingIndex = currentPath.findIndex(([r, c]) => r === row && c === col);
    if (existingIndex !== -1) {
      setCurrentPath(currentPath.slice(0, existingIndex + 1));
      setIsDragging(true);
      return;
    }

    // Start dragging from current position
    setIsDragging(true);
  };

  const handleCellEnter = (row: number, col: number) => {
    if (currentPath.length === 0) return;

    const cellKey = `${row},${col}`;
    const lastCell = currentPath[currentPath.length - 1];
    const lastCellKey = `${lastCell[0]},${lastCell[1]}`;

    // Skip if already the last cell
    if (cellKey === lastCellKey) return;

    // Check if dragging backward (cell is in path)
    const existingIndex = currentPath.findIndex(([r, c]) => r === row && c === col);
    if (existingIndex !== -1) {
      // Truncate path to this point (erase backward)
      setCurrentPath(currentPath.slice(0, existingIndex + 1));
      return;
    }

    // Find the final checkpoint (highest order number)
    const finalCheckpoint = puzzle.checkpoints.reduce((max, cp) =>
      cp.order > max.order ? cp : max
    );

    // Check if final checkpoint is already in the path
    const finalCheckpointInPath = currentPath.some(
      ([r, c]) => r === finalCheckpoint.position[0] && c === finalCheckpoint.position[1]
    );

    // If final checkpoint reached, don't allow adding more cells
    if (finalCheckpointInPath) {
      return;
    }

    // Check if we can move to this cell from the last cell (adjacent)
    if (canMoveBetweenCells(lastCell, [row, col], puzzle)) {
      setCurrentPath([...currentPath, [row, col]]);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleBoardTouchMove = (event: any) => {
    if (!isDragging || !boardRef.current) return;

    const touch = event.nativeEvent.touches[0];
    if (!touch) return;

    // For React Native Web (mobile browsers), use getBoundingClientRect
    const boardElement = boardRef.current as any;
    if (boardElement.getBoundingClientRect) {
      // Web/mobile browser path - more precise coordinate mapping
      const rect = boardElement.getBoundingClientRect();
      const boardPadding = 16; // From styles.board.padding

      // Calculate relative position within the board (excluding padding)
      const relativeX = touch.clientX - rect.left - boardPadding;
      const relativeY = touch.clientY - rect.top - boardPadding;

      // Calculate which cell is being touched
      const col = Math.floor(relativeX / cellSize);
      const row = Math.floor(relativeY / cellSize);

      // Strict boundary check
      if (row >= 0 && row < puzzle.size && col >= 0 && col < puzzle.size) {
        handleCellEnter(row, col);
      }
    } else if (touch.locationX !== undefined && touch.locationY !== undefined) {
      // Native mobile path (fallback)
      const boardPadding = 16;
      const relativeX = touch.locationX - boardPadding;
      const relativeY = touch.locationY - boardPadding;

      const col = Math.floor(relativeX / cellSize);
      const row = Math.floor(relativeY / cellSize);

      // Strict boundary check
      if (row >= 0 && row < puzzle.size && col >= 0 && col < puzzle.size) {
        handleCellEnter(row, col);
      }
    }
  };

  const handleHint = () => {
    // LinkedIn behavior: Delete path up to first error and fill in next correct segment

    // If path is empty, show where to start
    if (currentPath.length === 0) {
      const checkpoint1 = puzzle.checkpoints.find(cp => cp.order === 1);
      if (checkpoint1) {
        setHintMessage('Start by clicking/dragging from checkpoint 1');
        setHintPathSegment([checkpoint1.position]);
        setTimeout(() => {
          setHintPathSegment([]);
          setHintMessage(null);
        }, 5000);
      }
      return;
    }

    // Check if puzzle is already complete
    const validation = validateZipPath(puzzle, currentPath);
    if (validation.isComplete) {
      setHintMessage('Puzzle is already complete!');
      return;
    }

    // Find where the user diverged from the solution
    const divergencePoint = findDivergencePoint(puzzle, currentPath);

    if (divergencePoint !== null) {
      // User has diverged - truncate to divergence point
      const truncatedPath = currentPath.slice(0, divergencePoint);

      // Add next 3-5 cells from solution
      const nextCellsCount = Math.min(5, puzzle.solution.length - divergencePoint);
      const newPath = [...truncatedPath];
      const highlightCells: [number, number][] = [];

      for (let i = divergencePoint; i < divergencePoint + nextCellsCount && i < puzzle.solution.length; i++) {
        newPath.push(puzzle.solution[i]);
        highlightCells.push(puzzle.solution[i]);
      }

      setCurrentPath(newPath);
      setHintPathSegment(highlightCells);
      setHintMessage(`Corrected path! ${nextCellsCount} cells added`);

      // Auto-dismiss hint visual after 3 seconds
      setTimeout(() => {
        setHintPathSegment([]);
        setHintMessage(null);
      }, 3000);
    } else {
      // Path is correct so far - just add next segment
      const currentIndex = currentPath.length;
      const nextCellsCount = Math.min(5, puzzle.solution.length - currentIndex);
      const newPath = [...currentPath];
      const highlightCells: [number, number][] = [];

      for (let i = currentIndex; i < currentIndex + nextCellsCount && i < puzzle.solution.length; i++) {
        newPath.push(puzzle.solution[i]);
        highlightCells.push(puzzle.solution[i]);
      }

      setCurrentPath(newPath);
      setHintPathSegment(highlightCells);
      setHintMessage(`Added ${nextCellsCount} cells to your path`);

      // Auto-dismiss hint visual after 3 seconds
      setTimeout(() => {
        setHintPathSegment([]);
        setHintMessage(null);
      }, 3000);
    }
  };

  const handleClear = () => {
    // Clear board but keep timer running
    setCurrentPath([]);
    setConflicts(new Set());
    setHintPathSegment([]);
    setHintMessage(null);
    setIsDragging(false);
  };

  const handleReset = () => {
    // Clear board AND reset timer
    setCurrentPath([]);
    setConflicts(new Set());
    setHintPathSegment([]);
    setHintMessage(null);
    setIsDragging(false);
    reset();
    setCountdown(3);
  };

  const cellSize = Math.max(
    50,
    Math.min(
      70,
      Math.floor((Dimensions.get('window').width - 64) / puzzle.size)
    )
  );

  // Helper to check if cell is in path
  const getCellIndexInPath = (row: number, col: number): number => {
    return currentPath.findIndex(([r, c]) => r === row && c === col);
  };

  // Helper to check if there's a wall on the right of a cell
  const hasRightWall = (row: number, col: number): boolean => {
    return puzzle.walls.some(w => w.cell[0] === row && w.cell[1] === col && w.direction === 'right');
  };

  // Helper to check if there's a wall on the bottom of a cell
  const hasBottomWall = (row: number, col: number): boolean => {
    return puzzle.walls.some(w => w.cell[0] === row && w.cell[1] === col && w.direction === 'down');
  };

  return (
    <View style={styles.container}>
      <Timer elapsed={elapsed} />

      {countdown !== null && countdown > 0 && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      <View style={styles.boardContainer}>
        <View
          ref={boardRef}
          style={styles.board}
          onTouchMove={handleBoardTouchMove}
        >
          {Array.from({ length: puzzle.size }).map((_, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: puzzle.size }).map((_, col) => {
                const cellKey = `${row},${col}`;
                const pathIndex = getCellIndexInPath(row, col);
                const isInPath = pathIndex !== -1;
                const hasConflict = conflicts.has(cellKey);
                const isHintCell = hintPathSegment.some(([hr, hc]) => hr === row && hc === col);

                const checkpoint = puzzle.checkpoints.find(
                  cp => cp.position[0] === row && cp.position[1] === col
                );

                const isLastCell = currentPath.length > 0 &&
                  currentPath[currentPath.length - 1][0] === row &&
                  currentPath[currentPath.length - 1][1] === col;

                return (
                  <Pressable
                    key={cellKey}
                    onPressIn={() => handleCellPressIn(row, col)}
                    onPressOut={handleDragEnd}
                    onHoverIn={() => handleCellEnter(row, col)}
                    disabled={countdown !== null}
                    style={[
                      styles.cell,
                      {
                        width: cellSize,
                        height: cellSize,
                      },
                      isInPath && styles.cellInPath,
                      hasConflict && styles.cellWithConflict,
                      isHintCell && styles.cellHint,
                      isLastCell && styles.cellCurrent,
                      hasRightWall(row, col) && styles.rightWall,
                      hasBottomWall(row, col) && styles.bottomWall,
                    ]}
                  >
                    {checkpoint && (
                      <View style={styles.checkpoint}>
                        <Text style={styles.checkpointText}>{checkpoint.order}</Text>
                      </View>
                    )}
                    {isInPath && !checkpoint && (
                      <View style={styles.pathDot} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
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
        <Pressable onPress={handleClear} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🗑️ Clear</Text>
        </Pressable>
        <Pressable onPress={handleReset} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔄 Reset</Text>
        </Pressable>
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {currentPath.length} / {puzzle.size * puzzle.size} cells filled
        </Text>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendCheckpoint}>
            <Text style={styles.legendCheckpointText}>1</Text>
          </View>
          <Text style={styles.legendText}>Checkpoints</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendWall} />
          <Text style={styles.legendText}>Walls</Text>
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
    borderWidth: 0.5,
    borderColor: '#2A2A3D',
    backgroundColor: '#1C1C27',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    touchAction: 'none',
    position: 'relative',
  },
  cellInPath: {
    backgroundColor: '#4F6EF7',
  },
  cellCurrent: {
    backgroundColor: '#6B8EF9',
    borderWidth: 3,
    borderColor: '#FCD34D',
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
  rightWall: {
    borderRightWidth: 5,
    borderRightColor: '#9333EA',
  },
  bottomWall: {
    borderBottomWidth: 5,
    borderBottomColor: '#9333EA',
  },
  checkpoint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkpointText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0A0F',
  },
  pathDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F0F0F8',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    maxWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#2A2A3D',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F6EF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: '#F0F0F8',
    fontSize: 13,
    fontWeight: '600',
    whiteSpace: 'nowrap',
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
    marginRight: 16,
  },
  legendText: {
    color: '#8888AA',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  legendCheckpoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendCheckpointText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0F',
  },
  legendWall: {
    width: 4,
    height: 20,
    backgroundColor: '#9333EA',
    borderRadius: 2,
  },
});
