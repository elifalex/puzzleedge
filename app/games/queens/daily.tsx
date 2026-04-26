import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useDailyPuzzle } from '../../../src/hooks/useDailyPuzzle';
import { useStreak } from '../../../src/hooks/useStreak';
import { QueensBoard } from '../../../src/components/puzzles/QueensBoard';
import { StreakBadge } from '../../../src/components/ui/StreakBadge';
import { ScoreCard } from '../../../src/components/ui/ScoreCard';
import { useGameStore } from '../../../src/store/gameStore';
import { SEO } from '../../../src/components/SEO';

export default function QueensDailyPage() {
  const { puzzle, loading, isCompleted } = useDailyPuzzle('queens');
  const streak = useStreak('queens');
  const markDailyComplete = useGameStore((s) => s.markDailyComplete);
  const getDailyCompletion = useGameStore((s) => s.getDailyCompletion);
  const [showScore, setShowScore] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);

  // If already completed, get the stored completion time
  const today = new Date().toISOString().split('T')[0];
  const dailyCompletion = getDailyCompletion('queens', today);

  const handleComplete = (time: number) => {
    const today = new Date().toISOString().split('T')[0];
    markDailyComplete('queens', today, {
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
      title="Daily Queens Puzzle Challenge - LinkedIn Queens Puzzle Today"
      description="Play today's LinkedIn Queens puzzle challenge! Compete daily, track your streak, and sharpen your logic skills with our free daily Queens puzzle game."
      keywords={[
        'daily Queens puzzle',
        'LinkedIn daily puzzle',
        'today Queens puzzle',
        'Queens daily challenge',
        'LinkedIn puzzle today',
        'daily brain teaser',
        'Queens puzzle streak',
        'daily logic puzzle'
      ]}
      canonicalUrl="https://puzzleedge.app/games/queens/daily"
    />
  );

  if (loading) {
    return (
      <>
        {seoComponent}
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.loadingText}>Loading Queens puzzle...</Text>
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
          <Link href="/games/queens" style={styles.backLink}>
            <Text style={styles.backText}>← Back</Text>
          </Link>

          <Text style={styles.title}>Today's Queens Puzzle</Text>

          <View style={styles.streakContainer}>
            <StreakBadge current={streak.current} />
          </View>

          <View style={styles.completedContainer}>
            <Text style={styles.completedTitle}>Queens Puzzle Completed! ✅</Text>
            <Text style={styles.completedText}>
              Come back tomorrow for a new daily Queens puzzle
            </Text>

            <Pressable
              style={styles.viewScoreButton}
              onPress={() => setShowScore(true)}
            >
              <Text style={styles.viewScoreText}>View Your Score</Text>
            </Pressable>

            <Link href="/games/queens/practice" style={styles.practiceLink}>
              <Text style={styles.practiceLinkText}>Try Unlimited Queens Practice →</Text>
            </Link>
          </View>

          <ScoreCard
            visible={showScore}
            time={dailyCompletion.score.time}
            streak={streak.current}
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
      <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Link href="/games/queens" style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </Link>

        <Text style={styles.title}>Today's Queens Puzzle</Text>

        <View style={styles.streakContainer}>
          <StreakBadge current={streak.current} />
        </View>

        <QueensBoard puzzle={puzzle} mode="daily" onComplete={handleComplete} />

        <ScoreCard
          visible={showScore}
          time={completionTime}
          streak={streak.current}
          onClose={() => setShowScore(false)}
        />
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    padding: 32,
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
