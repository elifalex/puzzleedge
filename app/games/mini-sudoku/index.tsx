import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../../src/components/SEO';

export default function MiniSudokuGamePage() {
  return (
    <>
      <SEO
        title="Mini Sudoku - 6×6 Sudoku Puzzle Game | Practice LinkedIn Mini Sudoku"
        description="Play Mini Sudoku puzzle game! Solve 6×6 Sudoku puzzles with 2×3 boxes. Daily challenges + unlimited practice puzzles across all difficulty levels."
        keywords={[
          'Mini Sudoku puzzle',
          'LinkedIn Mini Sudoku',
          '6x6 Sudoku',
          'Mini Sudoku game online',
          'free Mini Sudoku puzzles',
          'Mini Sudoku practice',
          'logic puzzle Sudoku',
          'daily Mini Sudoku challenge',
          'Sudoku 6x6'
        ]}
        canonicalUrl="https://puzzleedge.app/games/mini-sudoku"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.innerContent}>
            <Link href="/" style={styles.backLink}>
              <Text style={styles.backText}>← Back to Home</Text>
            </Link>

            <Text style={styles.title}>
              🔢 Mini Sudoku
            </Text>

            <Text style={styles.subtitle}>
              Solve 6×6 Sudoku puzzles with 2×3 boxes - each row, column, and box must contain 1-6
            </Text>

            <View style={styles.modeCards}>
              <Link href="/games/mini-sudoku/daily" asChild>
                <Pressable style={styles.modeCard}>
                  <Text style={styles.modeCardTitle}>
                    Daily Mini Sudoku Challenge
                  </Text>
                  <Text style={styles.modeCardDescription}>
                    One Mini Sudoku puzzle per day, compete with others, track your streak
                  </Text>
                </Pressable>
              </Link>

              <Link href="/games/mini-sudoku/practice" asChild>
                <Pressable style={styles.modeCard}>
                  <Text style={styles.modeCardTitle}>
                    Unlimited Mini Sudoku Practice
                  </Text>
                  <Text style={styles.modeCardDescription}>
                    Practice puzzles across all difficulty levels - unlimited play
                  </Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>
                How to Play Mini Sudoku
              </Text>
              <Text style={styles.descriptionText}>
                Mini Sudoku is a 6×6 variant of the classic Sudoku puzzle, featuring six 2×3 boxes instead of nine 3×3 boxes.
              </Text>
              <Text style={styles.descriptionText}>
                The goal: Fill the grid so that every row, every column, and every 2×3 box contains the digits 1 through 6 exactly once.
              </Text>
              <Text style={styles.descriptionText}>
                Perfect for sharpening your logical deduction and pattern recognition skills with this addictive number puzzle.
              </Text>
            </View>

            <Link href="/how-to-play/mini-sudoku" asChild>
              <Pressable style={styles.strategyButton}>
                <Text style={styles.strategyButtonText}>
                  Learn Mini Sudoku Strategy & Tips
                </Text>
              </Pressable>
            </Link>
          </View>
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
    flex: 1,
    padding: 32,
  },
  innerContent: {
    maxWidth: 896,
    width: '100%',
    alignSelf: 'center',
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#8888AA',
    marginBottom: 32,
  },
  modeCards: {
    marginBottom: 48,
  },
  modeCard: {
    backgroundColor: '#13131A',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    marginBottom: 16,
  },
  modeCardTitle: {
    fontSize: 24,
    color: '#F0F0F8',
    marginBottom: 8,
  },
  modeCardDescription: {
    fontSize: 14,
    color: '#8888AA',
  },
  descriptionCard: {
    backgroundColor: '#1C1C27',
    padding: 24,
    borderRadius: 8,
    marginBottom: 32,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#8888AA',
    marginBottom: 16,
  },
  strategyButton: {
    backgroundColor: '#4F6EF7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  strategyButtonText: {
    textAlign: 'center',
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '600',
  },
});
