import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface PuzzleNavigatorProps {
  currentIndex: number;
  totalPuzzles: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PuzzleNavigator({
  currentIndex,
  totalPuzzles,
  onPrevious,
  onNext,
}: PuzzleNavigatorProps) {
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalPuzzles - 1;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrevious}
        disabled={!canGoPrevious}
        style={[styles.button, !canGoPrevious && styles.buttonDisabled]}
      >
        <ChevronLeft size={20} color={canGoPrevious ? '#4F6EF7' : '#555570'} />
        <Text style={[styles.buttonText, !canGoPrevious && styles.buttonTextDisabled]}>
          Previous
        </Text>
      </Pressable>

      <Text style={styles.counter}>
        Puzzle {currentIndex + 1} of {totalPuzzles}
      </Text>

      <Pressable
        onPress={onNext}
        disabled={!canGoNext}
        style={[styles.button, !canGoNext && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, !canGoNext && styles.buttonTextDisabled]}>
          Next
        </Text>
        <ChevronRight size={20} color={canGoNext ? '#4F6EF7' : '#555570'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F6EF7',
    backgroundColor: '#13131A',
  },
  buttonDisabled: {
    borderColor: '#2A2A3D',
    backgroundColor: '#0A0A0F',
  },
  buttonText: {
    color: '#4F6EF7',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#555570',
  },
  counter: {
    color: '#F0F0F8',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
