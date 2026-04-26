import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../src/components/SEO';

export default function HomePage() {
  return (
    <>
      <SEO
        title="PuzzleEdge - LinkedIn Puzzles & Brain Games | Play Queens Puzzle"
        description="Play LinkedIn Puzzles for free! Master the Queens puzzle game with daily challenges and unlimited practice. Train your brain with logic puzzles similar to LinkedIn's daily puzzle games."
        keywords={[
          'LinkedIn Queens puzzle',
          'free LinkedIn puzzles',
          'LinkedIn puzzle game online',
          'Queens puzzle solver',
          'daily puzzle challenge',
          'LinkedIn games free',
          'practice LinkedIn puzzles',
          'puzzle games like LinkedIn'
        ]}
        canonicalUrl="https://dist-three-lilac.vercel.app"
      />
      <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.title}>PuzzleEdge</Text>
          <Text style={styles.subtitle}>
            Master LinkedIn's Daily Queens Puzzle with Unlimited Practice
          </Text>

          {/* Value Props */}
          <Text style={styles.description}>
            Train for LinkedIn's daily Queens puzzle game with 1,600+ practice puzzles.
            Perfect your Queens puzzle strategy, beat your colleagues, and never miss a streak.
          </Text>
        </View>

        {/* Game Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Puzzle Games</Text>

          {/* Queens Card */}
          <Link href="/games/queens" asChild>
            <Pressable style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>👑 Queens Puzzle</Text>
                  <Text style={styles.cardDescription}>
                    The LinkedIn Queens puzzle: Place one queen per row, column, and colored region. No two queens can touch. Daily challenges + 1,600 practice puzzles.
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </View>
            </Pressable>
          </Link>

          {/* Coming Soon Cards */}
          <View style={[styles.card, styles.cardDisabled]}>
            <Text style={styles.cardTitleDisabled}>Tango</Text>
            <Text style={styles.cardDescriptionDisabled}>Coming Soon</Text>
          </View>

          <View style={[styles.card, styles.cardDisabled]}>
            <Text style={styles.cardTitleDisabled}>Zip</Text>
            <Text style={styles.cardDescriptionDisabled}>Coming Soon</Text>
          </View>

          <View style={[styles.card, styles.cardDisabled]}>
            <Text style={styles.cardTitleDisabled}>Mini Sudoku</Text>
            <Text style={styles.cardDescriptionDisabled}>Coming Soon</Text>
          </View>

          <View style={[styles.card, styles.cardDisabled]}>
            <Text style={styles.cardTitleDisabled}>Crossclimb</Text>
            <Text style={styles.cardDescriptionDisabled}>Coming Soon</Text>
          </View>
        </View>

        {/* Footer Disclaimer */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            PuzzleEdge is an independent practice tool and is not affiliated with,
            endorsed by, or connected to LinkedIn Corporation.
          </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  hero: {
    maxWidth: 896,
    width: '100%',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F0F0F8',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: '#8888AA',
    textAlign: 'center',
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: '#F0F0F8',
    textAlign: 'center',
    marginBottom: 16,
  },
  section: {
    width: '100%',
    maxWidth: 896,
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#13131A',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    marginBottom: 16,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    color: '#F0F0F8',
    marginBottom: 8,
  },
  cardTitleDisabled: {
    fontSize: 20,
    color: '#555570',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#8888AA',
  },
  cardDescriptionDisabled: {
    fontSize: 14,
    color: '#555570',
  },
  arrow: {
    fontSize: 24,
    color: '#4F6EF7',
    marginLeft: 16,
  },
  footer: {
    marginTop: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3D',
    width: '100%',
    maxWidth: 896,
  },
  disclaimer: {
    fontSize: 12,
    color: '#555570',
    textAlign: 'center',
  },
});
