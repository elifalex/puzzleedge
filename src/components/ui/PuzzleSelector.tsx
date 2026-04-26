import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { BoardSize } from '../../data/queensPuzzleLoader';

interface PuzzleSelectorProps {
  boardSize: BoardSize;
  totalPuzzles: number;
  currentIndex: number;
  completedPuzzleIds: string[];
  onSelectPuzzle: (index: number) => void;
  onClose: () => void;
}

export function PuzzleSelector({
  boardSize,
  totalPuzzles,
  currentIndex,
  completedPuzzleIds,
  onSelectPuzzle,
  onClose,
}: PuzzleSelectorProps) {
  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{boardSize}×{boardSize} Puzzles</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.grid}>
          {Array.from({ length: totalPuzzles }, (_, i) => {
            const puzzleId = `${boardSize}x${boardSize}-${String(i + 1).padStart(4, '0')}`;
            const isCompleted = completedPuzzleIds.includes(puzzleId);
            const isCurrent = i === currentIndex;

            return (
              <Pressable
                key={i}
                onPress={() => {
                  onSelectPuzzle(i);
                  onClose();
                }}
                style={[
                  styles.puzzleButton,
                  isCurrent && styles.puzzleButtonCurrent,
                  isCompleted && !isCurrent && styles.puzzleButtonCompleted,
                ]}
              >
                <Text style={[
                  styles.puzzleNumber,
                  isCurrent && styles.puzzleNumberCurrent,
                  isCompleted && !isCurrent && styles.puzzleNumberCompleted,
                ]}>
                  {i + 1}
                </Text>
                {isCompleted && !isCurrent && (
                  <View style={styles.checkmark}>
                    <Check size={14} color="#22C55E" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
    backgroundColor: '#13131A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    zIndex: 1001,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3D',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0F0F8',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#8888AA',
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  puzzleButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    backgroundColor: '#1C1C27',
    position: 'relative',
  },
  puzzleButtonCurrent: {
    borderColor: '#4F6EF7',
    backgroundColor: '#4F6EF7',
  },
  puzzleButtonCompleted: {
    borderColor: '#22C55E',
    backgroundColor: '#1C1C27',
  },
  puzzleNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8888AA',
  },
  puzzleNumberCurrent: {
    color: '#0A0A0F',
  },
  puzzleNumberCompleted: {
    color: '#F0F0F8',
  },
  checkmark: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
});
