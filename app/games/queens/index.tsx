import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../../src/components/SEO';

export default function QueensHubPage() {
  return (
    <>
      <SEO
        title="Queens Puzzle - LinkedIn Queens Game | Daily Challenge & Practice"
        description="Play the LinkedIn Queens puzzle game for free! Daily challenges and unlimited practice puzzles. Master queen placement strategy with our logic puzzle trainer. Perfect for LinkedIn puzzle fans."
        keywords={[
          'LinkedIn Queens',
          'Queens puzzle game',
          'LinkedIn puzzle Queens',
          'daily Queens challenge',
          'Queens puzzle practice',
          'logic puzzle Queens',
          'LinkedIn daily puzzle',
          'Queens strategy game'
        ]}
        canonicalUrl="https://dist-three-lilac.vercel.app/games/queens"
      />
      <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          {/* Header */}
          <Link href="/" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Home</Text>
          </Link>

          <Text style={styles.title}>
            LinkedIn Queens Puzzle
          </Text>

          <Text style={styles.subtitle}>
            Master the art of strategic queen placement in this challenging logic puzzle
          </Text>

          {/* Mode Cards */}
          <View style={styles.modeCards}>
            <Link href="/games/queens/daily" asChild>
              <Pressable style={styles.modeCard}>
                <Text style={styles.modeCardTitle}>
                  Daily Queens Challenge
                </Text>
                <Text style={styles.modeCardDescription}>
                  One Queens puzzle per day, compete with others, track your streak
                </Text>
              </Pressable>
            </Link>

            <Link href="/games/queens/practice" asChild>
              <Pressable style={styles.modeCard}>
                <Text style={styles.modeCardTitle}>
                  Unlimited Queens Practice
                </Text>
                <Text style={styles.modeCardDescription}>
                  1,600+ Queens puzzles across all difficulty levels - practice unlimited
                </Text>
              </Pressable>
            </Link>
          </View>

          {/* Game Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>
              How to Play Queens Puzzle
            </Text>
            <Text style={styles.descriptionText}>
              The Queens puzzle is a logic puzzle where you must place exactly one queen in each row, each column,
              and each colored region of the grid.
            </Text>
            <Text style={styles.descriptionText}>
              The challenge: No two queens can touch each other, not even diagonally. This means you
              must carefully consider each queen placement, using logic and deduction to find the unique solution.
            </Text>
            <Text style={styles.descriptionText}>
              Perfect for sharpening your critical thinking skills and strategic planning abilities with this addictive puzzle game.
            </Text>
          </View>

          {/* Strategy Link */}
          <Link href="/how-to-play/queens" asChild>
            <Pressable style={styles.strategyButton}>
              <Text style={styles.strategyButtonText}>
                Learn Queens Puzzle Strategy & Tips
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
