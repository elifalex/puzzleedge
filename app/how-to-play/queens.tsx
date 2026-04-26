import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';

export default function HowToPlayQueensPage() {
  return (
    <>
      <SEO
        title="How to Play Queens Puzzle - LinkedIn Queens Strategy Guide & Tips"
        description="Learn how to solve LinkedIn Queens puzzles with our complete strategy guide. Master the 4 rules, advanced solving techniques, and tips to beat every Queens puzzle challenge."
        keywords={[
          'how to play Queens puzzle',
          'LinkedIn Queens strategy',
          'Queens puzzle guide',
          'Queens puzzle tips',
          'learn Queens puzzle',
          'Queens solving techniques',
          'LinkedIn puzzle how to play',
          'Queens puzzle tutorial'
        ]}
        canonicalUrl="https://puzzleedge.app/how-to-play/queens"
      />
      <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Link href="/games/queens" style={styles.backLink}>
          <Text style={styles.backText}>← Back to Queens</Text>
        </Link>

        <Text style={styles.title}>How to Play LinkedIn Queens</Text>
        <Text style={styles.subtitle}>
          Complete strategy guide for mastering Queens puzzles
        </Text>

        {/* Game Rules Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The Four Rules</Text>
          <Text style={styles.intro}>
            The LinkedIn Queens game is a logic puzzle that blends the classic "N-Queens" chess problem with region-based constraints similar to Sudoku.
          </Text>
          <Text style={styles.intro}>
            To solve a 9×9 puzzle, you must place 9 queens on the board following these four non-negotiable rules:
          </Text>

          <View style={styles.rule}>
            <Text style={styles.ruleTitle}>1. The Row and Column Constraint</Text>
            <Text style={styles.ruleText}>
              Each horizontal row and each vertical column must contain exactly one queen. Once you place a queen, you can "X" out the rest of that row and column.
            </Text>
          </View>

          <View style={styles.rule}>
            <Text style={styles.ruleTitle}>2. The Color Constraint</Text>
            <Text style={styles.ruleText}>
              The board is divided into distinct colored regions (shapes). Each colored region must contain exactly one queen. This is usually the most important rule for making deductions in the middle of a game.
            </Text>
          </View>

          <View style={styles.rule}>
            <Text style={styles.ruleTitle}>3. The Adjacency Constraint (The "No-Touch" Rule)</Text>
            <Text style={styles.ruleText}>
              Queens cannot touch each other, even diagonally. This means a queen creates a 3×3 "dead zone" around itself. If a queen is placed at cell (5,5), no other queen can exist in any of the eight cells immediately surrounding it.
            </Text>
            <Text style={styles.ruleNote}>
              Note: This is stricter than standard chess, where queens can't be on the same long diagonal but can be "near" each other.
            </Text>
          </View>

          <View style={styles.rule}>
            <Text style={styles.ruleTitle}>4. The Unique Solution</Text>
            <Text style={styles.ruleText}>
              Every puzzle is mathematically designed to have only one valid arrangement of queens. If you find yourself guessing, you are likely missing a logical deduction.
            </Text>
          </View>
        </View>

        {/* Strategies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logic & Solving Strategies</Text>
          <Text style={styles.intro}>
            Advanced players use these specific logical patterns to solve puzzles without guessing:
          </Text>

          <View style={styles.strategy}>
            <Text style={styles.strategyTitle}>Region-Row/Column Exclusion</Text>
            <Text style={styles.strategyText}>
              If a specific colored region is entirely contained within two rows, then those two rows must get their queens from that color (or vice versa). You can often eliminate that color's cells in all other rows.
            </Text>
          </View>

          <View style={styles.strategy}>
            <Text style={styles.strategyTitle}>The "Loner" Cell</Text>
            <Text style={styles.strategyText}>
              If a colored region consists of only a single cell, that cell must be a queen. Look for these first!
            </Text>
          </View>

          <View style={styles.strategy}>
            <Text style={styles.strategyTitle}>Scanning Narrow Regions</Text>
            <Text style={styles.strategyText}>
              Look for regions that only occupy one or two cells in a specific row. If a region only has one cell in Row 3, and that's the only place a queen can go for that color, you've found a queen.
            </Text>
          </View>

          <View style={styles.strategy}>
            <Text style={styles.strategyTitle}>Corner Crowding</Text>
            <Text style={styles.strategyText}>
              Because of the adjacency rule, placing a queen in a small "L-shaped" color region often automatically eliminates almost every other cell in that region. Use this to force queen placements.
            </Text>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Success</Text>

          <View style={styles.tip}>
            <Text style={styles.tipText}>
              • Start by marking X's on cells you know can't have queens
            </Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              • Look for regions with only 1-2 possible cells first
            </Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              • Use the hint button when stuck - it will guide you without solving
            </Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              • Every puzzle is solvable through logic alone - no guessing needed!
            </Text>
          </View>
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
    padding: 32,
    paddingBottom: 64,
  },
  backLink: {
    marginBottom: 32,
  },
  backText: {
    color: '#4F6EF7',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8888AA',
    marginBottom: 32,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4F6EF7',
    marginBottom: 16,
  },
  intro: {
    fontSize: 16,
    color: '#8888AA',
    lineHeight: 24,
    marginBottom: 16,
  },
  rule: {
    backgroundColor: '#13131A',
    borderLeftWidth: 4,
    borderLeftColor: '#4F6EF7',
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
  },
  ruleNote: {
    fontSize: 14,
    color: '#F59E0B',
    fontStyle: 'italic',
    marginTop: 8,
  },
  strategy: {
    backgroundColor: '#1C1C27',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 6,
  },
  strategyText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
  },
});
