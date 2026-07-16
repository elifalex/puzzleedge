import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../src/components/SEO';

export default function HomePage() {
  return (
    <>
      <SEO
        title="PuzzleEdge - LinkedIn Puzzles & Brain Games | Queens, Tango & Zip Puzzles"
        description="Play LinkedIn Puzzles for free! Master Queens, Tango, and Zip puzzle games with daily challenges and unlimited practice. Train your brain with logic puzzles similar to LinkedIn's daily puzzle games."
        keywords={[
          'LinkedIn Queens puzzle',
          'LinkedIn Tango puzzle',
          'LinkedIn Zip puzzle',
          'free LinkedIn puzzles',
          'LinkedIn puzzle game online',
          'Queens puzzle solver',
          'Tango puzzle solver',
          'Zip puzzle solver',
          'daily puzzle challenge',
          'LinkedIn games free',
          'practice LinkedIn puzzles',
          'puzzle games like LinkedIn'
        ]}
        canonicalUrl="https://puzzleedge.app"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
            {/* Hero Section */}
            <View style={styles.hero}>
              <Image
                source={require('../assets/puzzleedge_logo3.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.subtitle}>
                Master LinkedIn's Daily Puzzles with Unlimited Practice
              </Text>

              {/* Value Props */}
              <Text style={styles.description}>
                Train for LinkedIn's daily puzzle games with unlimited practice puzzles.
                Perfect your Queens, Tango, and Zip puzzle strategy, beat your colleagues, and never miss a streak.
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

              {/* Tango Card */}
              <Link href="/games/tango" asChild>
                <Pressable style={styles.card}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>☀️🌑 Tango Puzzle</Text>
                      <Text style={styles.cardDescription}>
                        The LinkedIn Tango puzzle: Fill the grid with suns and moons. Equal balance in rows/columns, no three-in-a-row. Daily challenges + 1,200 practice puzzles.
                      </Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                  </View>
                </Pressable>
              </Link>

              {/* Zip Card */}
              <Link href="/games/zip" asChild>
                <Pressable style={styles.card}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>🔗 Zip Puzzle</Text>
                      <Text style={styles.cardDescription}>
                        The LinkedIn Zip puzzle: Draw a continuous path through all cells, passing through numbered checkpoints in order. Daily challenges + unlimited practice puzzles.
                      </Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                  </View>
                </Pressable>
              </Link>

              <View style={[styles.card, styles.cardDisabled]}>
                <Text style={styles.cardTitleDisabled}>Mini Sudoku</Text>
                <Text style={styles.cardDescriptionDisabled}>Coming Soon</Text>
              </View>

              <View style={[styles.card, styles.cardDisabled]}>
                <Text style={styles.cardTitleDisabled}>Crossclimb</Text>
                <Text style={styles.cardDescriptionDisabled}>Coming Soon</Text>
              </View>
            </View>

            {/* Articles Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learn & Improve</Text>
              <Text style={styles.sectionSubtitle}>
                Expert guides and strategies to master LinkedIn Queens puzzles
              </Text>

              <Link href="/articles/beginners-guide" asChild>
                <Pressable style={styles.articleCard}>
                  <Text style={styles.articleTitle}>Ultimate Beginner's Guide to Queens Puzzle</Text>
                  <Text style={styles.articleDescription}>
                    Learn everything you need to start solving Queens puzzles like a pro
                  </Text>
                  <Text style={styles.readMore}>Read Article →</Text>
                </Pressable>
              </Link>

              <Link href="/articles/advanced-strategies" asChild>
                <Pressable style={styles.articleCard}>
                  <Text style={styles.articleTitle}>10 Advanced Queens Puzzle Strategies</Text>
                  <Text style={styles.articleDescription}>
                    Expert techniques to solve puzzles faster and more efficiently
                  </Text>
                  <Text style={styles.readMore}>Read Article →</Text>
                </Pressable>
              </Link>

              <Link href="/articles" asChild>
                <Pressable style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All Articles →</Text>
                </Pressable>
              </Link>
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
    paddingBottom: 32,
  },
  hero: {
    maxWidth: 896,
    width: '100%',
    marginBottom: 48,
  },
  logo: {
    width: '100%',
    maxWidth: 400,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
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
  sectionSubtitle: {
    fontSize: 16,
    color: '#8888AA',
    marginBottom: 20,
  },
  articleCard: {
    backgroundColor: '#1C1C27',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F0F8',
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    color: '#8888AA',
    marginBottom: 12,
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    color: '#4F6EF7',
    fontWeight: '600',
  },
  viewAllButton: {
    backgroundColor: '#13131A',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F6EF7',
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    color: '#4F6EF7',
    fontSize: 15,
    fontWeight: '600',
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
