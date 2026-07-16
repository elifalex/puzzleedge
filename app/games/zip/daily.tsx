import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { ZipBoard } from '../../../src/components/puzzles/ZipBoard';
import { ZipPuzzleEntry, getDailyZipPuzzle } from '../../../src/data/zipPuzzleLoader';
import { zipEngine } from '../../../src/engines/zip';
import { ScoreCard } from '../../../src/components/ui/ScoreCard';
import { SEO } from '../../../src/components/SEO';

export default function ZipDailyPage() {
  const [puzzle, setPuzzle] = useState<ZipPuzzleEntry | null>(null);
  const [showScore, setShowScore] = useState(false);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  useEffect(() => {
    const loadDailyPuzzle = async () => {
      const seed = zipEngine.getDailySeed();
      // Use medium difficulty (6x6) for daily puzzles
      const dailyPuzzle = await getDailyZipPuzzle(6, seed);

      if (dailyPuzzle) {
        setPuzzle(dailyPuzzle);
      }
    };

    loadDailyPuzzle();
  }, []);

  const handleComplete = (time: number) => {
    setCompletionTime(time);
    setShowScore(true);
  };

  if (!puzzle) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading puzzle...</Text>
      </View>
    );
  }

  return (
    <>
      <SEO
        title="Daily Zip Puzzle Challenge - Test Your Path Drawing Skills"
        description="Play today's Zip puzzle challenge! Draw a path through all cells, connecting numbered checkpoints in order. New puzzle daily."
        keywords={[
          'daily Zip puzzle',
          'Zip challenge today',
          'LinkedIn Zip daily',
          'path puzzle daily challenge',
          'Zip game today'
        ]}
        canonicalUrl="https://puzzleedge.app/games/zip/daily"
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.content}>
            <Link href="/games/zip" style={styles.backLink}>
              <Text style={styles.backText}>← Back</Text>
            </Link>

            <Text style={styles.title}>Daily Zip Challenge</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            <ZipBoard key={puzzle.id} puzzle={puzzle} mode="daily" onComplete={handleComplete} />

            <ScoreCard
              visible={showScore}
              time={completionTime || 0}
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
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#8888AA',
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingText: {
    color: '#8888AA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
});
