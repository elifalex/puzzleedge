import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../../src/components/SEO';

export default function ZipGamePage() {
  return (
    <>
      <SEO
        title="Zip Puzzle - Path Drawing Logic Game | Practice LinkedIn Zip"
        description="Play Zip puzzle game! Draw a continuous path through all cells, passing through numbered checkpoints in order. Daily challenges + unlimited practice puzzles."
        keywords={[
          'Zip puzzle',
          'LinkedIn Zip',
          'path puzzle game',
          'Hamiltonian path puzzle',
          'Zip game online',
          'free Zip puzzles',
          'Zip practice',
          'logic puzzle path',
          'daily Zip challenge'
        ]}
        canonicalUrl="https://puzzleedge.app/games/zip"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.innerContent}>
            <Link href="/" style={styles.backLink}>
              <Text style={styles.backText}>← Back to Home</Text>
            </Link>

            <Text style={styles.title}>
              🔗 Zip Puzzle
            </Text>

            <Text style={styles.subtitle}>
              Draw a continuous path through all cells, visiting numbered checkpoints in order
            </Text>

            <View style={styles.modeCards}>
              <Link href="/games/zip/daily" asChild>
                <Pressable style={styles.modeCard}>
                  <Text style={styles.modeCardTitle}>
                    Daily Zip Challenge
                  </Text>
                  <Text style={styles.modeCardDescription}>
                    One Zip puzzle per day, compete with others, track your streak
                  </Text>
                </Pressable>
              </Link>

              <Link href="/games/zip/practice" asChild>
                <Pressable style={styles.modeCard}>
                  <Text style={styles.modeCardTitle}>
                    Unlimited Zip Practice
                  </Text>
                  <Text style={styles.modeCardDescription}>
                    Practice puzzles across all difficulty levels - unlimited play
                  </Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>
                How to Play Zip Puzzle
              </Text>
              <Text style={styles.descriptionText}>
                The Zip puzzle is a logic puzzle where you must draw a single continuous path through every cell on the grid.
              </Text>
              <Text style={styles.descriptionText}>
                The challenge: Pass through numbered checkpoints in order (1, 2, 3...), avoid walls, and don't cross your own path. Each cell must be visited exactly once.
              </Text>
              <Text style={styles.descriptionText}>
                Perfect for sharpening your spatial reasoning and strategic planning abilities with this addictive puzzle game.
              </Text>
            </View>

            <Link href="/how-to-play/zip" asChild>
              <Pressable style={styles.strategyButton}>
                <Text style={styles.strategyButtonText}>
                  Learn Zip Puzzle Strategy & Tips
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
