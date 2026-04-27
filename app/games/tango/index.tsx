import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../../src/components/SEO';

export default function TangoHubPage() {
  return (
    <>
      <SEO
        title="Tango Puzzle - LinkedIn Tango Game | Daily Challenge & Practice"
        description="Play the LinkedIn Tango puzzle game for free! Daily challenges and unlimited practice puzzles. Master sun and moon placement strategy with our logic puzzle trainer. Perfect for LinkedIn puzzle fans."
        keywords={[
          'LinkedIn Tango',
          'Tango puzzle game',
          'LinkedIn puzzle Tango',
          'daily Tango challenge',
          'Tango puzzle practice',
          'logic puzzle Tango',
          'LinkedIn daily puzzle',
          'Tango strategy game',
          'sun moon puzzle',
          'binary puzzle game'
        ]}
        canonicalUrl="https://puzzleedge.app/games/tango"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.innerContent}>
            {/* Header */}
            <Link href="/" style={styles.backLink}>
              <Text style={styles.backText}>← Back to Home</Text>
            </Link>

            <Text style={styles.title}>
              LinkedIn Tango Puzzle
            </Text>

            <Text style={styles.subtitle}>
              Fill the grid with suns and moons using logic and deduction
            </Text>

            {/* Mode Cards */}
            <View style={styles.modeCards}>
              <Link href="/games/tango/daily" asChild>
                <Pressable style={styles.modeCard}>
                  <Text style={styles.modeCardTitle}>
                    Daily Tango Challenge
                  </Text>
                  <Text style={styles.modeCardDescription}>
                    One Tango puzzle per day, compete with others, track your streak
                  </Text>
                </Pressable>
              </Link>

              <Link href="/games/tango/practice" asChild>
                <Pressable style={styles.modeCard}>
                  <Text style={styles.modeCardTitle}>
                    Unlimited Tango Practice
                  </Text>
                  <Text style={styles.modeCardDescription}>
                    1,200+ Tango puzzles across all difficulty levels - practice unlimited
                  </Text>
                </Pressable>
              </Link>
            </View>

            {/* Game Description */}
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>
                How to Play Tango Puzzle
              </Text>
              <Text style={styles.descriptionText}>
                Tango is a logic puzzle where you fill a 6×6 grid with suns (☀️) and moons (🌑) following simple but challenging rules.
              </Text>
              <Text style={styles.descriptionText}>
                Each row and column must have exactly 3 suns and 3 moons. No three identical symbols can be adjacent horizontally or vertically. Cells connected by = must be the same, while cells connected by × must be different.
              </Text>
              <Text style={styles.descriptionText}>
                Perfect for developing logical thinking and pattern recognition skills with this addictive binary puzzle game.
              </Text>
            </View>

            {/* Strategy Link */}
            <Link href="/how-to-play/tango" asChild>
              <Pressable style={styles.strategyButton}>
                <Text style={styles.strategyButtonText}>
                  Learn Tango Puzzle Strategy & Tips
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
