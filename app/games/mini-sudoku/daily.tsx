import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useDailyPuzzle } from '../../../src/hooks/useDailyPuzzle';
import { useStreak } from '../../../src/hooks/useStreak';
import { MiniSudokuBoard } from '../../../src/components/puzzles/MiniSudokuBoard';
import { StreakBadge } from '../../../src/components/ui/StreakBadge';
import { ScoreCard } from '../../../src/components/ui/ScoreCard';
import { useGameStore } from '../../../src/store/gameStore';
import { SEO } from '../../../src/components/SEO';

export default function MiniSudokuDailyPage() {
  const { puzzle, loading, isCompleted } = useDailyPuzzle('miniSudoku');
  const streak = useStreak('miniSudoku');
  const markDailyComplete = useGameStore((s) => s.markDailyComplete);
  const getDailyCompletion = useGameStore((s) => s.getDailyCompletion);
  const [showScore, setShowScore] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);

  // If already completed, get the stored completion time
  const today = new Date().toISOString().split('T')[0];
  const dailyCompletion = getDailyCompletion('miniSudoku', today);

  const handleComplete = (time: number) => {
    const today = new Date().toISOString().split('T')[0];
    markDailyComplete('miniSudoku', today, {
      time,
      hintsUsed: 0,
      completed: true,
      date: today,
    });
    setCompletionTime(time);
    setShowScore(true);
  };

  const seoComponent = (
    <SEO
      title="Daily Mini Sudoku Puzzle Challenge - LinkedIn Mini Sudoku Today"
      description="Play today's LinkedIn Mini Sudoku puzzle challenge! Compete daily, track your streak, and sharpen your logic skills with our free daily 6×6 Sudoku puzzle game."
      keywords={[
        'daily Mini Sudoku puzzle',
        'LinkedIn daily Mini Sudoku',
        'today Mini Sudoku puzzle',
        'Mini Sudoku daily challenge',
        'LinkedIn puzzle today',
        'daily 6x6 Sudoku',
        'Mini Sudoku puzzle streak',
        'daily logic puzzle'
      ]}
      canonicalUrl="https://puzzleedge.app/games/mini-sudoku/daily"
    />
  );

  if (loading || !puzzle) {
    return (
      <>
        {seoComponent}
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.loadingText}>Loading Mini Sudoku puzzle...</Text>
          </View>
        </View>
      </>
    );
  }

  if (isCompleted && dailyCompletion) {
    return (
      <>
        {seoComponent}
        <View style={styles.container}>
        <View style={styles.content}>
          <Link href="/games/mini-sudoku" style={styles.backLink}>
            <Text style={styles.backText}>← Back</Text>
          </Link>

          <Text style={styles.title}>Today's Mini Sudoku Puzzle</Text>

          <View style={styles.streakContainer}>
            <StreakBadge current={streak.current} />
          </View>

          <View style={styles.completedContainer}>
            <Text style={styles.completedTitle}>Mini Sudoku Completed! ✅</Text>
            <Text style={styles.completedText}>
              Come back tomorrow for a new daily Mini Sudoku puzzle
            </Text>

            <Pressable
              style={styles.viewScoreButton}
              onPress={() => setShowScore(true)}
            >
              <Text style={styles.viewScoreText}>View Your Score</Text>
            </Pressable>

            <Link href="/games/mini-sudoku/practice" style={styles.practiceLink}>
              <Text style={styles.practiceLinkText}>Try Unlimited Mini Sudoku Practice →</Text>
            </Link>
          </View>

          <ScoreCard
            visible={showScore}
            time={dailyCompletion.score.time}
            streak={streak.current}
            showPercentile={true}
            onClose={() => setShowScore(false)}
          />
        </View>
      </View>
      </>
    );
  }

  return (
    <>
      {seoComponent}
      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.content}>
            <Link href="/games/mini-sudoku" style={styles.backLink}>
              <Text style={styles.backText}>← Back</Text>
            </Link>

            <Text style={styles.title}>Today's Mini Sudoku Puzzle</Text>

            <View style={styles.streakContainer}>
              <StreakBadge current={streak.current} />
            </View>

            <MiniSudokuBoard puzzle={puzzle} mode="daily" onComplete={handleComplete} />

            <ScoreCard
              visible={showScore}
              time={completionTime}
              streak={streak.current}
              showPercentile={true}
              onClose={() => setShowScore(false)}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scrollContent: {
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
    marginBottom: 16,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 16,
  },
  completedText: {
    fontSize: 18,
    color: '#8888AA',
    textAlign: 'center',
    marginBottom: 24,
  },
  viewScoreButton: {
    backgroundColor: '#4F6EF7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  viewScoreText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  practiceLink: {
    marginTop: 16,
  },
  practiceLinkText: {
    color: '#4F6EF7',
    fontSize: 16,
  },
  loadingText: {
    color: '#8888AA',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 64,
  },
});
