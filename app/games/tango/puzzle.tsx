import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Grid3x3 } from 'lucide-react-native';
import { TangoBoard } from '../../../src/components/puzzles/TangoBoard';
import { PuzzleNavigator } from '../../../src/components/ui/PuzzleNavigator';
import { ScoreCard } from '../../../src/components/ui/ScoreCard';
import { getPuzzleByIndex, getPuzzleCount } from '../../../src/data/tangoPuzzleLoader';
import { TangoPuzzle } from '../../../src/constants/types';
import { Difficulty } from '../../../src/constants/gameConfig';
import { useGameStore } from '../../../src/store/gameStore';

export default function TangoPracticePage() {
  const params = useLocalSearchParams();
  const difficulty = (params.difficulty as Difficulty) || 'medium';
  const initialIndex = parseInt(params.index as string) || 0;

  const scrollViewRef = useRef<ScrollView>(null);
  const boardContainerRef = useRef<View>(null);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [puzzle, setPuzzle] = useState<TangoPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPuzzles, setTotalPuzzles] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);

  const markPuzzleComplete = useGameStore((s) => s.markPuzzleComplete);
  const isPuzzleCompleted = useGameStore((s) => s.isPuzzleCompleted);

  // Load puzzle count and initial puzzle
  useEffect(() => {
    loadPuzzleData(difficulty, initialIndex);
  }, [difficulty, initialIndex]);

  // Auto-scroll to board on mobile immediately
  useEffect(() => {
    const isMobile = Dimensions.get('window').width < 768;

    if (isMobile && !loading && puzzle && boardContainerRef.current) {
      // Small delay to allow layout to render
      const scrollTimer = setTimeout(() => {
        boardContainerRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: y - 20, // Scroll to board with 20px top padding
              animated: true,
            });
          },
          () => {} // error callback
        );
      }, 100);

      return () => clearTimeout(scrollTimer);
    }
  }, [loading, puzzle]);

  const loadPuzzleData = async (diff: Difficulty, index: number) => {
    setLoading(true);
    try {
      const [count, puzzleData] = await Promise.all([
        getPuzzleCount(diff),
        getPuzzleByIndex(diff, index),
      ]);

      setTotalPuzzles(count);

      if (puzzleData) {
        setPuzzle(puzzleData);
        setCurrentIndex(index);
      }
    } catch (error) {
      console.error('Failed to load puzzle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPuzzle = () => {
    if (currentIndex > 0) {
      loadPuzzleData(difficulty, currentIndex - 1);
      setShowScore(false);
    }
  };

  const handleNextPuzzle = () => {
    if (currentIndex < totalPuzzles - 1) {
      loadPuzzleData(difficulty, currentIndex + 1);
      setShowScore(false);
    }
  };

  const handleComplete = (time: number) => {
    if (puzzle) {
      markPuzzleComplete(difficulty, puzzle.id, {
        time,
        hintsUsed: 0,
        completed: true,
        date: new Date().toISOString().split('T')[0],
      });
    }

    setCompletionTime(time);
    setShowScore(true);
  };

  const handleScoreNext = () => {
    setShowScore(false);
    handleNextPuzzle();
  };

  if (loading || !puzzle) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Link href="/games/tango/practice" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Categories</Text>
          </Link>
          <Text style={styles.loadingText}>Loading puzzle...</Text>
        </View>
      </View>
    );
  }

  const isCompleted = isPuzzleCompleted(difficulty, puzzle.id);

  return (
    <View style={styles.wrapper}>
      <ScrollView ref={scrollViewRef} style={styles.container}>
        <View style={styles.content}>
          <Link href="/games/tango/practice" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Categories</Text>
          </Link>

          <Text style={styles.title}>Tango Practice</Text>
          <Text style={styles.difficultyBadge}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Text>

          <View style={styles.infoBar}>
            <PuzzleNavigator
              currentIndex={currentIndex}
              totalPuzzles={totalPuzzles}
              onPrevious={handlePreviousPuzzle}
              onNext={handleNextPuzzle}
            />
          </View>

          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}

          <View ref={boardContainerRef}>
            <TangoBoard key={puzzle.id} puzzle={puzzle} mode="practice" onComplete={handleComplete} />
          </View>

          <ScoreCard
            visible={showScore}
            time={completionTime}
            onNext={currentIndex < totalPuzzles - 1 ? handleScoreNext : undefined}
            onClose={() => setShowScore(false)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 32,
    paddingBottom: 32, // Extra padding for sticky ad
  },
  stickyAd: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backLink: {
    marginBottom: 32,
  },
  backText: {
    color: '#4F6EF7',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F0F0F8',
    textAlign: 'center',
    marginBottom: 8,
  },
  difficultyBadge: {
    fontSize: 16,
    color: '#4F6EF7',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  infoBar: {
    marginBottom: 16,
  },
  completedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'center',
  },
  completedText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    color: '#8888AA',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 64,
  },
});
