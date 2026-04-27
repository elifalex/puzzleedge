import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';

export default function RulesExplainedArticle() {
  return (
    <>
      <SEO
        title="Queens Puzzle Rules Explained with Visual Examples | Complete Rule Guide"
        description="Master every Queens puzzle rule with detailed visual examples and step-by-step explanations. Understand row, column, region, and adjacency constraints for LinkedIn Queens puzzles."
        keywords={[
          'Queens puzzle rules explained',
          'LinkedIn Queens rules',
          'Queens puzzle game rules',
          'how Queens puzzle works',
          'Queens puzzle constraints',
          'Queens puzzle adjacency rule',
          'Queens puzzle region rules',
          'LinkedIn Queens tutorial'
        ]}
        canonicalUrl="https://puzzleedge.app/articles/rules-explained"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Link href="/articles" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Articles</Text>
          </Link>

          <Text style={styles.title}>Queens Puzzle Rules Explained with Visual Examples</Text>
          <Text style={styles.meta}>7 min read • Complete Rules Guide</Text>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Understanding the rules of Queens puzzle isn't just about memorizing four constraints—it's about internalizing how these rules interact to create solvable logic puzzles. This comprehensive guide breaks down every rule with detailed explanations and practical examples, so you'll never second-guess a placement again.
            </Text>
            <Text style={styles.paragraph}>
              Whether you're a complete beginner or someone who's been playing but wants to solidify your understanding, this visual guide will clarify exactly how Queens puzzles work.
            </Text>
          </View>

          {/* Rule 1 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #1: Exactly One Queen Per Row</Text>
            <View style={styles.rule}>
              <Text style={styles.ruleStatement}>
                Every horizontal row must contain exactly one queen. No row can have zero queens, and no row can have two or more queens.
              </Text>
            </View>

            <Text style={styles.h3}>Why This Rule Exists</Text>
            <Text style={styles.paragraph}>
              In a 9×9 Queens puzzle, you need to place exactly 9 queens. With 9 rows available, simple math dictates that each row gets one queen. This constraint immediately eliminates many possible placements and is one of your primary deduction tools.
            </Text>

            <Text style={styles.h3}>Visual Example</Text>
            <View style={styles.example}>
              <Text style={styles.exampleText}>
                Imagine Row 3 in a 9×9 grid. Once you place a queen in position (Row 3, Column 5), all other cells in Row 3 become invalid for queen placement. You would mark cells (3,1), (3,2), (3,3), (3,4), (3,6), (3,7), (3,8), and (3,9) with X's to indicate they cannot contain queens.
              </Text>
            </View>

            <Text style={styles.h3}>Practical Application</Text>
            <Text style={styles.paragraph}>
              When solving, always track which rows still need queens. As you approach completion (say, 7 queens placed in a 9×9 grid), identify the 2 empty rows. Those rows MUST receive the remaining 2 queens, which often forces specific placements.
            </Text>
          </View>

          {/* Rule 2 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #2: Exactly One Queen Per Column</Text>
            <View style={styles.rule}>
              <Text style={styles.ruleStatement}>
                Every vertical column must contain exactly one queen. Just like rows, no column can be empty or contain multiple queens.
              </Text>
            </View>

            <Text style={styles.h3}>Why This Rule Exists</Text>
            <Text style={styles.paragraph}>
              Combined with Rule #1, this creates a grid-based constraint system similar to Sudoku. The intersection of the row and column rules means every queen occupies a unique row AND a unique column—no two queens share a row or column.
            </Text>

            <Text style={styles.h3}>Visual Example</Text>
            <View style={styles.example}>
              <Text style={styles.exampleText}>
                If you place a queen at (Row 3, Column 5), you eliminate two sets of cells: all of Row 3 (Rule #1) AND all of Column 5 (Rule #2). This means cells (1,5), (2,5), (4,5), (5,5), (6,5), (7,5), (8,5), and (9,5) cannot contain queens, in addition to the Row 3 eliminations.
              </Text>
            </View>

            <Text style={styles.h3}>Common Mistake</Text>
            <View style={styles.warning}>
              <Text style={styles.warningText}>
                Beginners often focus heavily on row constraints but forget to check column constraints. Always verify both dimensions before placing a queen!
              </Text>
            </View>
          </View>

          {/* Rule 3 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #3: Exactly One Queen Per Colored Region</Text>
            <View style={styles.rule}>
              <Text style={styles.ruleStatement}>
                The grid is divided into distinct colored regions (also called "cages" or "zones"). Each colored region must contain exactly one queen, regardless of the region's shape, size, or position.
              </Text>
            </View>

            <Text style={styles.h3}>Why This Rule Exists</Text>
            <Text style={styles.paragraph}>
              This is what transforms Queens from a pure chess problem into a unique puzzle game. The colored regions add an extra layer of constraints that, paradoxically, make the puzzle easier to solve logically. Small regions severely limit where queens can go, giving you critical starting points.
            </Text>

            <Text style={styles.h3}>Understanding Region Diversity</Text>
            <Text style={styles.paragraph}>
              Regions come in all shapes and sizes:
            </Text>
            <View style={styles.regionTypes}>
              <View style={styles.regionType}>
                <Text style={styles.regionTypeTitle}>Single-Cell Regions</Text>
                <Text style={styles.regionTypeText}>
                  A region consisting of just one cell automatically contains a queen. These are your easiest placements—always find and solve these first!
                </Text>
              </View>

              <View style={styles.regionType}>
                <Text style={styles.regionTypeTitle}>Small Compact Regions (2-3 cells)</Text>
                <Text style={styles.regionTypeText}>
                  These provide strong constraints. A 2-cell region only has two possible queen locations, so eliminating one cell forces the other.
                </Text>
              </View>

              <View style={styles.regionType}>
                <Text style={styles.regionTypeTitle}>Large Irregular Regions (6-8 cells)</Text>
                <Text style={styles.regionTypeText}>
                  These sprawling regions are hardest to solve directly. Usually, you solve them last after other constraints have eliminated most of their cells.
                </Text>
              </View>

              <View style={styles.regionType}>
                <Text style={styles.regionTypeTitle}>Linear Regions (Snakes)</Text>
                <Text style={styles.regionTypeText}>
                  Long, thin regions spanning multiple rows create interesting constraints, especially where they twist back on themselves.
                </Text>
              </View>
            </View>

            <Text style={styles.h3}>Visual Example</Text>
            <View style={styles.example}>
              <Text style={styles.exampleText}>
                Imagine a blue region consisting of cells (2,2), (2,3), and (3,2). Once you place a queen at (2,2), cells (2,3) and (3,2) cannot contain queens—not only because they share a row/column with (2,2), but also because the blue region now has its required queen.
              </Text>
            </View>

            <Text style={styles.h3}>Advanced Insight</Text>
            <Text style={styles.tip}>
              Region constraints combined with row/column constraints create "forcing chains." If a blue region spans only Rows 2 and 3, and Row 2 already has a queen outside the blue region, then the blue region's queen MUST go in Row 3. This type of deduction is key to expert-level solving.
            </Text>
          </View>

          {/* Rule 4 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #4: Queens Cannot Touch (Adjacency Rule)</Text>
            <View style={styles.rule}>
              <Text style={styles.ruleStatement}>
                No two queens can touch each other, even diagonally. Every queen creates a 3×3 exclusion zone around itself where no other queen can exist.
              </Text>
            </View>

            <Text style={styles.h3}>Why This Rule Exists</Text>
            <Text style={styles.paragraph}>
              This rule is inspired by chess, where queens attack in all eight directions. In Queens puzzle, we simplify this to "queens cannot occupy any of the eight surrounding cells." This is the rule that makes the puzzle genuinely challenging—without it, placement would be trivial.
            </Text>

            <Text style={styles.h3}>The 3×3 Exclusion Zone Explained</Text>
            <Text style={styles.paragraph}>
              When you place a queen at any cell, imagine drawing a 3×3 grid centered on that queen. All eight surrounding cells are now forbidden for other queens:
            </Text>
            <View style={styles.grid}>
              <Text style={styles.gridText}>
                If Queen is at position (5,5):
                {'\n\n'}
                ❌ (4,4)  ❌ (4,5)  ❌ (4,6){'\n'}
                ❌ (5,4)  👑 (5,5)  ❌ (5,6){'\n'}
                ❌ (6,4)  ❌ (6,5)  ❌ (6,6)
              </Text>
            </View>

            <Text style={styles.h3}>Edge and Corner Advantages</Text>
            <Text style={styles.paragraph}>
              Queens placed in corners or along edges have fewer adjacent cells to worry about:
            </Text>
            <View style={styles.comparison}>
              <Text style={styles.comparisonItem}>• Corner queen (e.g., position (1,1)): Only blocks 3 adjacent cells</Text>
              <Text style={styles.comparisonItem}>• Edge queen (e.g., position (1,5)): Only blocks 5 adjacent cells</Text>
              <Text style={styles.comparisonItem}>• Center queen (e.g., position (5,5)): Blocks all 8 surrounding cells</Text>
            </View>
            <Text style={styles.paragraph}>
              This is why advanced solvers prioritize placing queens in corners and edges when possible—it minimizes the "damage" to the remaining puzzle space.
            </Text>

            <Text style={styles.h3}>Visual Example: Valid vs. Invalid Placements</Text>
            <View style={styles.example}>
              <Text style={styles.exampleTitle}>✓ Valid Placement:</Text>
              <Text style={styles.exampleText}>
                Queens at (2,2) and (4,5). These queens are separated by both multiple rows and multiple columns, satisfying all adjacency requirements.
              </Text>
            </View>
            <View style={styles.exampleInvalid}>
              <Text style={styles.exampleTitle}>✗ Invalid Placement:</Text>
              <Text style={styles.exampleText}>
                Queens at (2,2) and (3,3). Even though these queens are in different rows, different columns, and potentially different regions, they touch diagonally—violating Rule #4.
              </Text>
            </View>

            <Text style={styles.h3}>Critical Distinction from Chess</Text>
            <View style={styles.warning}>
              <Text style={styles.warningText}>
                In standard chess N-Queens problems, queens cannot attack each other along long diagonals (even if many squares apart). In LinkedIn's Queens puzzle, diagonal separation doesn't matter—only immediate adjacency matters. Queens can be on the same long diagonal as long as they're not touching.
              </Text>
            </View>
          </View>

          {/* How Rules Interact */}
          <View style={styles.section}>
            <Text style={styles.h2}>How the Four Rules Work Together</Text>
            <Text style={styles.paragraph}>
              The beauty of Queens puzzle lies in how these four rules interact to create logical deductions:
            </Text>

            <View style={styles.interaction}>
              <Text style={styles.interactionTitle}>Example Interaction:</Text>
              <Text style={styles.paragraph}>
                Suppose the blue region consists of cells (3,4), (3,5), and (4,4). You also know Row 3 already has a queen at position (3,1).
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• Rule #1 eliminates (3,4) and (3,5) from the blue region (Row 3 is full)</Text>
                <Text style={styles.bullet}>• This forces the blue region's queen to (4,4)</Text>
                <Text style={styles.bullet}>• Placing a queen at (4,4) then eliminates Column 4 (Rule #2) and all adjacent cells (Rule #4)</Text>
                <Text style={styles.bullet}>• These eliminations cascade to other regions, potentially forcing more placements</Text>
              </View>
              <Text style={styles.paragraph}>
                This cascading effect is why a single placement can unlock 3-4 additional forced placements. Expert solvers learn to anticipate these chains.
              </Text>
            </View>
          </View>

          {/* Putting It Together */}
          <View style={styles.section}>
            <Text style={styles.h2}>Putting It All Together</Text>
            <Text style={styles.paragraph}>
              Now that you understand each rule individually, here's the systematic approach to apply them:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bullet}>1. Before placing a queen, verify it doesn't violate ANY of the four rules</Text>
              <Text style={styles.bullet}>2. After placing a queen, immediately mark all eliminations from all four rules</Text>
              <Text style={styles.bullet}>3. Look for forced placements caused by your eliminations</Text>
              <Text style={styles.bullet}>4. Repeat until the puzzle is solved</Text>
            </View>
            <Text style={styles.paragraph}>
              With practice, these checks become automatic—you'll internalize the rules to the point where valid placements "feel" right and invalid ones "feel" wrong.
            </Text>
          </View>

          {/* CTA Section */}
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>Ready to Apply These Rules?</Text>
            <Text style={styles.ctaText}>
              Practice with 1,600+ Queens puzzles and see these rules in action
            </Text>
            <Link href="/games/queens/practice" asChild>
              <Pressable style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Start Practicing</Text>
              </Pressable>
            </Link>
          </View>

          {/* Related Articles */}
          <View style={styles.related}>
            <Text style={styles.relatedTitle}>Continue Learning</Text>
            <Link href="/articles/beginners-guide" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Ultimate Beginner's Guide to LinkedIn Queens Puzzle</Text>
            </Link>
            <Link href="/articles/common-mistakes" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Common Queens Puzzle Mistakes and How to Fix Them</Text>
            </Link>
            <Link href="/articles/advanced-strategies" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ 10 Advanced Queens Puzzle Strategies from Experts</Text>
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
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4F6EF7',
    marginBottom: 12,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 16,
    color: '#8888AA',
    lineHeight: 26,
    marginBottom: 16,
  },
  rule: {
    backgroundColor: '#13131A',
    borderLeftWidth: 4,
    borderLeftColor: '#4F6EF7',
    padding: 20,
    marginBottom: 20,
    borderRadius: 6,
  },
  ruleStatement: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F0F0F8',
    lineHeight: 26,
  },
  example: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  exampleInvalid: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 24,
  },
  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginTop: 12,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 15,
    color: '#F59E0B',
    lineHeight: 24,
  },
  tip: {
    backgroundColor: 'rgba(79, 110, 247, 0.1)',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4F6EF7',
    marginTop: 12,
    marginBottom: 16,
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 24,
  },
  regionTypes: {
    marginTop: 12,
    marginBottom: 16,
  },
  regionType: {
    backgroundColor: '#1C1C27',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  regionTypeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4F6EF7',
    marginBottom: 8,
  },
  regionTypeText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 24,
  },
  grid: {
    backgroundColor: '#13131A',
    padding: 20,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  gridText: {
    fontSize: 14,
    color: '#F0F0F8',
    fontFamily: 'monospace',
    lineHeight: 24,
  },
  comparison: {
    backgroundColor: '#13131A',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  comparisonItem: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 26,
    marginBottom: 8,
  },
  interaction: {
    backgroundColor: '#1C1C27',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    marginTop: 12,
  },
  interactionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 12,
  },
  bulletList: {
    marginBottom: 16,
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
