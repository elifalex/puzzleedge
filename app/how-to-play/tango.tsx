import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';

export default function HowToPlayTangoPage() {
  return (
    <>
      <SEO
        title="How to Play Tango Puzzle - LinkedIn Tango Strategy Guide & Tips"
        description="Learn how to solve LinkedIn Tango puzzles with our complete strategy guide. Master the 5 rules, advanced solving techniques, and tips to beat every Tango puzzle challenge."
        keywords={[
          'how to play Tango puzzle',
          'LinkedIn Tango strategy',
          'Tango puzzle guide',
          'Tango puzzle tips',
          'learn Tango puzzle',
          'Tango solving techniques',
          'LinkedIn puzzle how to play',
          'Tango puzzle tutorial',
          'sun moon puzzle guide',
          'binary puzzle strategy'
        ]}
        canonicalUrl="https://puzzleedge.app/how-to-play/tango"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Link href="/games/tango" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Tango</Text>
          </Link>

          <Text style={styles.title}>How to Play LinkedIn Tango</Text>
          <Text style={styles.subtitle}>
            Complete strategy guide for mastering Tango puzzles
          </Text>

          {/* Game Rules Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The Five Rules</Text>
            <Text style={styles.intro}>
              LinkedIn Tango is a binary logic puzzle where you fill a 6×6 grid with suns (☀️) and moons (🌑). The puzzle is also known as "Binary" or "Binero" in other puzzle collections.
            </Text>
            <Text style={styles.intro}>
              To solve the puzzle, you must fill all 36 cells while following these five essential rules:
            </Text>

            <View style={styles.rule}>
              <Text style={styles.ruleTitle}>1. The Balance Rule</Text>
              <Text style={styles.ruleText}>
                Each row and each column must contain exactly 3 suns (☀️) and 3 moons (🌑). This equal distribution is the foundation of every Tango puzzle.
              </Text>
              <Text style={styles.ruleNote}>
                Tip: If a row already has 3 suns, all remaining empty cells must be moons.
              </Text>
            </View>

            <View style={styles.rule}>
              <Text style={styles.ruleTitle}>2. The No-Three-in-a-Row Rule</Text>
              <Text style={styles.ruleText}>
                No three identical symbols can be adjacent horizontally or vertically. You can have ☀️☀️🌑 or 🌑☀️☀️, but never ☀️☀️☀️ or 🌑🌑🌑.
              </Text>
              <Text style={styles.ruleNote}>
                Tip: If you see ☀️☀️_, the blank must be a moon. This is one of the most powerful deduction patterns.
              </Text>
            </View>

            <View style={styles.rule}>
              <Text style={styles.ruleTitle}>3. The Equals Constraint (=)</Text>
              <Text style={styles.ruleText}>
                When two adjacent cells are connected by an equals sign (=), they must contain the same symbol. If one is a sun, the other must also be a sun.
              </Text>
              <Text style={styles.ruleNote}>
                Note: These constraint clues are only shown between certain cells to help you start solving.
              </Text>
            </View>

            <View style={styles.rule}>
              <Text style={styles.ruleTitle}>4. The Cross Constraint (×)</Text>
              <Text style={styles.ruleText}>
                When two adjacent cells are connected by a cross sign (×), they must contain different symbols. If one is a sun, the other must be a moon.
              </Text>
              <Text style={styles.ruleNote}>
                Note: Use these constraints early - they often unlock chains of deductions.
              </Text>
            </View>

            <View style={styles.rule}>
              <Text style={styles.ruleTitle}>5. The Unique Solution</Text>
              <Text style={styles.ruleText}>
                Every Tango puzzle has exactly one valid solution that can be reached through pure logic. If you find yourself guessing, you're likely missing a logical deduction.
              </Text>
            </View>
          </View>

          {/* Click Mechanics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            <Text style={styles.intro}>
              The game uses a simple three-click cycle for each cell:
            </Text>

            <View style={styles.clickCycle}>
              <Text style={styles.clickText}>Empty → ☀️ Sun → 🌑 Moon → Empty</Text>
            </View>

            <Text style={styles.intro}>
              Click any empty cell once to place a sun, twice to place a moon, or a third time to clear it. Pre-filled cells (shown in darker backgrounds) cannot be changed.
            </Text>
          </View>

          {/* Strategies Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Logic & Solving Strategies</Text>
            <Text style={styles.intro}>
              Master these logical patterns to solve Tango puzzles efficiently:
            </Text>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Start with Constraints</Text>
              <Text style={styles.strategyText}>
                Look for = and × symbols first. If one cell in a constraint is filled, you immediately know what the connected cell must be. These often create chains of forced moves.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Two-in-a-Row Forcing</Text>
              <Text style={styles.strategyText}>
                When you see two identical symbols next to each other (☀️☀️ or 🌑🌑), the cells immediately before and after must be the opposite symbol. This prevents three-in-a-row violations.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>One-Apart Forcing</Text>
              <Text style={styles.strategyText}>
                If you have ☀️_☀️ (same symbols with one empty cell between), that middle cell must be a moon. Otherwise you'd create three suns in a row.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Row/Column Completion</Text>
              <Text style={styles.strategyText}>
                Count the symbols in each row and column. If a row has 3 suns already, all remaining empty cells must be moons (and vice versa). This often unlocks multiple cells at once.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Elimination by Balance</Text>
              <Text style={styles.strategyText}>
                If a row has 2 suns and 2 moons with 2 empty cells left, look at intersecting columns. If one of those columns already has 3 suns, that cell must be a moon, which forces the other cell to be a sun.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Pattern Recognition</Text>
              <Text style={styles.strategyText}>
                With practice, you'll recognize common patterns like ☀️_🌑_☀️ (the blanks must be ☀️🌑) or _☀️☀️_ (the blanks must be 🌑🌑). These patterns speed up solving significantly.
              </Text>
            </View>
          </View>

          {/* Advanced Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Tips</Text>

            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Always check constraints (= and ×) first - they're your strongest clues
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Look for rows/columns with 2 of one symbol - you know there's only 1 more
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Scan for two-in-a-row patterns (☀️☀️ or 🌑🌑) to force adjacent cells
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Work on multiple rows/columns simultaneously - solving one often unlocks others
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Use the hint button when stuck - it will guide you to the next logical move
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Every puzzle is solvable through logic alone - never guess!
              </Text>
            </View>
          </View>

          {/* Difficulty Levels */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty Progression</Text>
            <Text style={styles.intro}>
              Tango puzzles come in three difficulty levels throughout the week:
            </Text>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Easy (Sunday, Monday)</Text>
              <Text style={styles.difficultyText}>
                More pre-filled cells and constraints. Great for learning the rules and basic patterns.
              </Text>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Medium (Tuesday, Wednesday, Thursday)</Text>
              <Text style={styles.difficultyText}>
                Moderate number of clues. Requires applying multiple strategies and pattern recognition.
              </Text>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Hard (Friday, Saturday)</Text>
              <Text style={styles.difficultyText}>
                Fewer starting clues and constraints. Demands advanced techniques and careful logical reasoning.
              </Text>
            </View>
          </View>

          {/* Common Mistakes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Mistakes to Avoid</Text>

            <View style={styles.mistake}>
              <Text style={styles.mistakeTitle}>❌ Forgetting to Count</Text>
              <Text style={styles.mistakeText}>
                Always keep track of how many suns and moons are in each row/column. Placing a 4th sun in a row is a common error.
              </Text>
            </View>

            <View style={styles.mistake}>
              <Text style={styles.mistakeTitle}>❌ Ignoring Two-in-a-Row</Text>
              <Text style={styles.mistakeText}>
                When you place a symbol next to an identical one, immediately mark the adjacent cells as the opposite symbol.
              </Text>
            </View>

            <View style={styles.mistake}>
              <Text style={styles.mistakeTitle}>❌ Guessing Too Early</Text>
              <Text style={styles.mistakeText}>
                If you can't find a move, use the hint button rather than guessing. Guessing often leads to contradictions later.
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
  clickCycle: {
    backgroundColor: '#1C1C27',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  clickText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22C55E',
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
  difficulty: {
    backgroundColor: '#1C1C27',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F6EF7',
    marginBottom: 6,
  },
  difficultyText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
  },
  mistake: {
    backgroundColor: '#13131A',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  mistakeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FCA5A5',
    marginBottom: 6,
  },
  mistakeText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
  },
});
