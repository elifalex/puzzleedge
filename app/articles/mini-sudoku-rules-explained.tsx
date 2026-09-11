import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';

export default function MiniSudokuRulesExplainedArticle() {
  return (
    <>
      <SEO
        title="Mini Sudoku Rules Explained with Visual Examples | Complete 6×6 Sudoku Guide"
        description="Master all 3 essential rules of Mini Sudoku puzzles with clear explanations and visual examples. Complete guide to understanding 6×6 Sudoku mechanics with 2×3 boxes."
        keywords={[
          'Mini Sudoku rules',
          '6x6 Sudoku rules explained',
          'how Mini Sudoku works',
          'Mini Sudoku mechanics',
          'Mini Sudoku rule breakdown',
          'understand Mini Sudoku',
          'Mini Sudoku tutorial',
          '2x3 box Sudoku rules'
        ]}
        canonicalUrl="https://puzzleedge.app/articles/mini-sudoku-rules-explained"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Link href="/articles" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Articles</Text>
          </Link>

          <Text style={styles.title}>Mini Sudoku Rules Explained with Visual Examples</Text>
          <Text style={styles.meta}>8 min read • Complete Rule Reference</Text>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Mini Sudoku (also called 6×6 Sudoku) is the perfect introduction to logical number placement puzzles. Simpler than standard 9×9 Sudoku but equally satisfying, it teaches the core principles while being solvable in just a few minutes.
            </Text>
            <Text style={styles.paragraph}>
              This comprehensive guide breaks down all 3 essential Mini Sudoku rules with clear explanations, practical examples, and common violations to avoid. By the end, you'll understand not just what the rules are, but why they create the puzzle's elegant logical framework.
            </Text>
          </View>

          {/* Rule #1 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #1: Each Row Must Contain 1-6 Exactly Once</Text>
            <Text style={styles.paragraph}>
              The foundational rule: every horizontal row across the grid must contain each number from 1 to 6 exactly once. No number can appear twice in the same row.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleBoxTitle}>What This Means</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• Each row has exactly 6 cells and must contain the numbers 1, 2, 3, 4, 5, and 6</Text>
                <Text style={styles.bullet}>• If a row already has a 3, you cannot place another 3 in that row</Text>
                <Text style={styles.bullet}>• Every row must be complete—no empty cells and no duplicates</Text>
                <Text style={styles.bullet}>• This constraint applies to all 6 horizontal rows in the grid</Text>
              </View>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Why This Rule Exists</Text>
              <Text style={styles.exampleText}>
                Row uniqueness creates logical deduction opportunities. When a row has five numbers placed, the sixth cell must contain the only missing number—a guaranteed solve. This simple constraint generates surprisingly complex puzzles.
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Common Violations</Text>
              <Text style={styles.violationText}>
                ✗ Placing a 4 in a row that already contains a 4
              </Text>
              <Text style={styles.violationText}>
                ✗ Leaving a row with only five numbers filled (incomplete)
              </Text>
              <Text style={styles.violationText}>
                ✗ Using numbers outside 1-6 range (like 0, 7, or 8)
              </Text>
            </View>
          </View>

          {/* Rule #2 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #2: Each Column Must Contain 1-6 Exactly Once</Text>
            <Text style={styles.paragraph}>
              Identical to the row rule but applied vertically: every column running from top to bottom must contain each number from 1 to 6 exactly once.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleBoxTitle}>What This Means</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• Each column has exactly 6 cells and must contain the numbers 1, 2, 3, 4, 5, and 6</Text>
                <Text style={styles.bullet}>• If a column already has a 2, you cannot place another 2 in that column</Text>
                <Text style={styles.bullet}>• Columns work independently from rows—same number can appear in same position if different column</Text>
                <Text style={styles.bullet}>• This constraint applies to all 6 vertical columns in the grid</Text>
              </View>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Practical Implication</Text>
              <Text style={styles.exampleText}>
                When placing a number, you must check both its row AND its column. A cell might be valid for its row but invalid for its column, or vice versa. Both constraints must be satisfied simultaneously.
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Common Violations</Text>
              <Text style={styles.violationText}>
                ✗ Placing a 5 in a column that already contains a 5
              </Text>
              <Text style={styles.violationText}>
                ✗ Focusing only on row constraints and ignoring column duplicates
              </Text>
              <Text style={styles.violationText}>
                ✗ Assuming vertical and horizontal rules are different (they're identical)
              </Text>
            </View>
          </View>

          {/* Rule #3 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #3: Each 2×3 Box Must Contain 1-6 Exactly Once</Text>
            <Text style={styles.paragraph}>
              The Mini Sudoku grid is divided into six 2×3 boxes (2 rows by 3 columns). Each of these boxes must contain the numbers 1-6 exactly once, independent of row and column placements.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleBoxTitle}>What This Means</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• The grid contains six distinct 2×3 rectangular boxes</Text>
                <Text style={styles.bullet}>• Each box has exactly 6 cells (2 rows × 3 columns)</Text>
                <Text style={styles.bullet}>• Every box must contain 1, 2, 3, 4, 5, and 6 with no duplicates</Text>
                <Text style={styles.bullet}>• A number can appear in the same position across different boxes</Text>
              </View>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Box Structure Explanation</Text>
              <Text style={styles.exampleText}>
                In a 6×6 Mini Sudoku grid, there are 3 boxes across the top (each 2 rows high, 3 columns wide) and 3 boxes across the bottom. When placing a number, it must not conflict with any other number in its 2×3 box region.
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Common Violations</Text>
              <Text style={styles.violationText}>
                ✗ Placing a 6 in a 2×3 box that already contains a 6
              </Text>
              <Text style={styles.violationText}>
                ✗ Confusing 2×3 box boundaries with 3×2 arrangement
              </Text>
              <Text style={styles.violationText}>
                ✗ Ignoring box constraints while focusing only on rows and columns
              </Text>
            </View>
          </View>

          {/* How Rules Interact */}
          <View style={styles.section}>
            <Text style={styles.h2}>How These Rules Interact to Create the Puzzle</Text>
            <Text style={styles.paragraph}>
              The beauty of Mini Sudoku lies in how these 3 rules combine to create logical constraints:
            </Text>

            <View style={styles.interaction}>
              <Text style={styles.interactionTitle}>Triple Constraint System</Text>
              <Text style={styles.paragraph}>
                Every cell must satisfy three simultaneous requirements: its row, its column, AND its 2×3 box. This triple constraint creates logical solving paths where you can deduce values through elimination.
              </Text>
            </View>

            <View style={styles.interaction}>
              <Text style={styles.interactionTitle}>Elimination Technique</Text>
              <Text style={styles.paragraph}>
                When a cell's row already has numbers 1, 3, 4, 5, its column has 2, 4, 6, and its box has 1, 2, 3, 5, 6—the cell MUST be 4 (the only number satisfying all three constraints). This is the core solving principle.
              </Text>
            </View>

            <View style={styles.interaction}>
              <Text style={styles.interactionTitle}>Cascading Deductions</Text>
              <Text style={styles.paragraph}>
                Solving one cell creates new constraints for connected rows, columns, and boxes. This triggers a cascade of deductions, where each placement makes subsequent placements easier to determine.
              </Text>
            </View>
          </View>

          {/* Grid Structure */}
          <View style={styles.section}>
            <Text style={styles.h2}>Understanding the 6×6 Grid Structure</Text>
            <Text style={styles.paragraph}>
              Mini Sudoku uses a compact 6×6 grid that's easier to visualize than standard 9×9 Sudoku:
            </Text>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Grid Dimensions</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• 6 rows (horizontal) × 6 columns (vertical) = 36 total cells</Text>
                <Text style={styles.bullet}>• 6 distinct 2×3 boxes arranged in a 2×3 pattern</Text>
                <Text style={styles.bullet}>• Uses numbers 1-6 (easier to track than 1-9)</Text>
                <Text style={styles.bullet}>• Typical puzzles provide 12-18 starting numbers (givens)</Text>
              </View>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Why 2×3 Boxes?</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• Creates 6 cells per box, matching the 6 numbers used</Text>
                <Text style={styles.bullet}>• Rectangular boxes add visual variety compared to square boxes</Text>
                <Text style={styles.bullet}>• 2 rows × 3 columns divides evenly into the 6×6 grid</Text>
                <Text style={styles.bullet}>• Provides logical constraints without overwhelming complexity</Text>
              </View>
            </View>
          </View>

          {/* Difficulty Levels */}
          <View style={styles.section}>
            <Text style={styles.h2}>Difficulty Levels in Mini Sudoku</Text>
            <Text style={styles.paragraph}>
              Mini Sudoku puzzles range from beginner-friendly to genuinely challenging:
            </Text>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Easy Level</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• 16-18 given numbers at start</Text>
                <Text style={styles.bullet}>• Solvable using only "naked singles" (cells with one possible value)</Text>
                <Text style={styles.bullet}>• No advanced techniques required</Text>
                <Text style={styles.bullet}>• Typical solve time: 2-4 minutes for beginners</Text>
              </View>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Medium Level</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• 14-16 given numbers at start</Text>
                <Text style={styles.bullet}>• Requires "hidden singles" (numbers with one possible position in a region)</Text>
                <Text style={styles.bullet}>• Some cells need elimination across multiple constraints</Text>
                <Text style={styles.bullet}>• Typical solve time: 4-7 minutes for intermediate solvers</Text>
              </View>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Hard Level</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• 12-14 given numbers at start</Text>
                <Text style={styles.bullet}>• Requires strategic pencil marking and candidate tracking</Text>
                <Text style={styles.bullet}>• May need advanced techniques like box-line reduction</Text>
                <Text style={styles.bullet}>• Typical solve time: 7-12 minutes for advanced solvers</Text>
              </View>
            </View>
          </View>

          {/* Rule Summary */}
          <View style={styles.section}>
            <Text style={styles.h2}>Quick Reference: The 3 Essential Rules</Text>
            <View style={styles.summary}>
              <Text style={styles.summaryItem}>1️⃣ Each row must contain 1-6 exactly once</Text>
              <Text style={styles.summaryItem}>2️⃣ Each column must contain 1-6 exactly once</Text>
              <Text style={styles.summaryItem}>3️⃣ Each 2×3 box must contain 1-6 exactly once</Text>
            </View>
            <Text style={styles.paragraph} style={{ marginTop: 16 }}>
              Remember: Every cell must simultaneously satisfy all three rules. That's what makes Mini Sudoku a logic puzzle, not a guessing game.
            </Text>
          </View>

          {/* CTA Section */}
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>Ready to Apply These Rules?</Text>
            <Text style={styles.ctaText}>
              Practice unlimited Mini Sudoku puzzles with guided hints that reinforce these 3 essential rules
            </Text>
            <Link href="/games/mini-sudoku/practice" asChild>
              <Pressable style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Start Practicing Now</Text>
              </Pressable>
            </Link>
          </View>

          {/* Related Articles */}
          <View style={styles.related}>
            <Text style={styles.relatedTitle}>Continue Learning</Text>
            <Link href="/articles/mini-sudoku-advanced-strategies" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Advanced Mini Sudoku Strategies: Naked Singles & Hidden Singles</Text>
            </Link>
            <Link href="/articles/mini-sudoku-common-mistakes" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Common Mini Sudoku Mistakes and How to Fix Them</Text>
            </Link>
            <Link href="/articles/mini-sudoku-daily-practice-tips" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Master Mini Sudoku: Daily Practice Tips</Text>
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
    padding: 32,
    paddingBottom: 64,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  backLink: {
    marginBottom: 24,
  },
  backText: {
    color: '#4F6EF7',
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 12,
    lineHeight: 44,
  },
  meta: {
    fontSize: 14,
    color: '#555570',
    marginBottom: 32,
  },
  section: {
    marginBottom: 40,
  },
  h2: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 16,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#8888AA',
    lineHeight: 26,
    marginBottom: 16,
  },
  ruleBox: {
    backgroundColor: '#13131A',
    borderLeftWidth: 4,
    borderLeftColor: '#4F6EF7',
    padding: 20,
    marginBottom: 16,
    borderRadius: 6,
  },
  ruleBoxTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F6EF7',
    marginBottom: 12,
  },
  example: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
    padding: 18,
    marginBottom: 16,
    borderRadius: 6,
  },
  exampleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 24,
  },
  violation: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    marginBottom: 16,
  },
  violationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 12,
  },
  violationText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 24,
    marginBottom: 6,
  },
  interaction: {
    backgroundColor: '#1C1C27',
    padding: 20,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  interactionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 12,
  },
  difficulty: {
    backgroundColor: '#13131A',
    padding: 18,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4F6EF7',
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F6EF7',
    marginBottom: 12,
  },
  summary: {
    backgroundColor: '#1C1C27',
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4F6EF7',
  },
  summaryItem: {
    fontSize: 17,
    color: '#F0F0F8',
    lineHeight: 32,
    marginBottom: 8,
  },
  bulletList: {
    marginBottom: 8,
    marginLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#8888AA',
    lineHeight: 26,
    marginBottom: 8,
  },
  cta: {
    backgroundColor: '#1C1C27',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 48,
    borderWidth: 1,
    borderColor: '#4F6EF7',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 16,
    color: '#8888AA',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#4F6EF7',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#F0F0F8',
    fontSize: 16,
    fontWeight: '600',
  },
  related: {
    borderTopWidth: 1,
    borderTopColor: '#2A2A3D',
    paddingTop: 32,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 16,
  },
  relatedLink: {
    marginBottom: 12,
  },
  relatedLinkText: {
    fontSize: 16,
    color: '#4F6EF7',
    lineHeight: 24,
  },
});
