import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Grid3x3 } from 'lucide-react-native';
import { ZipBoard } from '../../../src/components/puzzles/ZipBoard';
import { PuzzleNavigator } from '../../../src/components/ui/PuzzleNavigator';
import { PuzzleSelector } from '../../../src/components/ui/PuzzleSelector';
import { ScoreCard } from '../../../src/components/ui/ScoreCard';
import { ZipPuzzleEntry, getZipPuzzleByIndex, getZipPuzzleCount, ZipBoardSize } from '../../../src/data/zipPuzzleLoader';
import { useGameStore } from '../../../src/store/gameStore';
import { SEO } from '../../../src/components/SEO';

export default function ZipPuzzlePage() {
  const params = useLocalSearchParams();
  const boardSize = parseInt(params.boardSize as string) as ZipBoardSize;
  const initialIndex = parseInt(params.index as string) || 0;

  const scrollViewRef = useRef<ScrollView>(null);
  const boardContainerRef = useRef<View>(null);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [puzzle, setPuzzle] = useState<ZipPuzzleEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPuzzles, setTotalPuzzles] = useState(0);
  const [showSelector, setShowSelector] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);

  const markPuzzleComplete = useGameStore((s) => s.markPuzzleComplete);
  const isPuzzleCompleted = useGameStore((s) => s.isPuzzleCompleted);
  const getCompletedPuzzleIds = useGameStore((s) => s.getCompletedPuzzleIds);

  // Load puzzle count and initial puzzle
  useEffect(() => {
    loadPuzzleData(boardSize, initialIndex);
  }, [boardSize, initialIndex]);

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

  const loadPuzzleData = async (size: ZipBoardSize, index: number) => {
    setLoading(true);
    try {
      const [count, puzzleData] = await Promise.all([
        getZipPuzzleCount(size),
        getZipPuzzleByIndex(size, index),
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
      loadPuzzleData(boardSize, currentIndex - 1);
      setShowScore(false);
    }
  };

  const handleNextPuzzle = () => {
    if (currentIndex < totalPuzzles - 1) {
      loadPuzzleData(boardSize, currentIndex + 1);
      setShowScore(false);
    }
  };

  const handleSelectPuzzle = (index: number) => {
    loadPuzzleData(boardSize, index);
    setShowScore(false);
  };

  const handleComplete = (time: number) => {
    if (puzzle) {
      markPuzzleComplete(boardSize, puzzle.id, {
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
          <Link href="/games/zip/practice" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Categories</Text>
          </Link>
          <Text style={styles.loadingText}>Loading puzzle...</Text>
        </View>
      </View>
    );
  }

  const completedIds = getCompletedPuzzleIds(boardSize);
  const isCompleted = isPuzzleCompleted(boardSize, puzzle.id);

  return (
    <View style={styles.wrapper}>
      <ScrollView ref={scrollViewRef} style={styles.container}>
        <View style={styles.content}>
          <Link href="/games/zip/practice" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Categories</Text>
          </Link>

          <Text style={styles.title}>Zip Practice</Text>

          <View style={styles.infoBar}>
            <PuzzleNavigator
              currentIndex={currentIndex}
              totalPuzzles={totalPuzzles}
              onPrevious={handlePreviousPuzzle}
              onNext={handleNextPuzzle}
            />

            <Pressable onPress={() => setShowSelector(true)} style={styles.gridButton}>
              <Grid3x3 size={18} color="#4F6EF7" />
              <Text style={styles.gridButtonText}>All Puzzles</Text>
            </Pressable>
          </View>

          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}

          <View ref={boardContainerRef}>
            <ZipBoard key={puzzle.id} puzzle={puzzle} mode="practice" onComplete={handleComplete} />
          </View>

          <ScoreCard
            visible={showScore}
            time={completionTime}
            onNext={currentIndex < totalPuzzles - 1 ? handleScoreNext : undefined}
            onClose={() => setShowScore(false)}
          />

          {showSelector && (
            <PuzzleSelector
              boardSize={boardSize}
              totalPuzzles={totalPuzzles}
              currentIndex={currentIndex}
              completedPuzzleIds={completedIds}
              onSelectPuzzle={handleSelectPuzzle}
              onClose={() => setShowSelector(false)}
            />
          )}
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
    paddingBottom: 32,
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
    marginBottom: 32,
  },
  infoBar: {
    marginBottom: 16,
  },
  gridButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F6EF7',
    backgroundColor: '#13131A',
    marginTop: 12,
  },
  gridButtonText: {
    color: '#4F6EF7',
    fontSize: 14,
    fontWeight: '600',
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
