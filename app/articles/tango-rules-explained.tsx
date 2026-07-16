import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';

export default function TangoRulesExplainedArticle() {
  return (
    <>
      <SEO
        title="Tango Puzzle Rules Explained with Visual Examples | Complete Guide"
        description="A comprehensive breakdown of all LinkedIn Tango puzzle rules with step-by-step visual examples. Master the rules of sun-moon binary puzzles."
        keywords={[
          'Tango puzzle rules',
          'LinkedIn Tango how to play',
          'Tango puzzle guide',
          'Tango puzzle rules explained',
          'sun moon puzzle rules',
          'binary puzzle rules',
          'Tango constraint markers',
          'Tango three in a row rule'
        ]}
        canonicalUrl="https://puzzleedge.app/articles/tango-rules-explained"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Link href="/articles" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Articles</Text>
          </Link>

          <Text style={styles.title}>Tango Puzzle Rules Explained with Visual Examples</Text>
          <Text style={styles.meta}>9 min read • Complete Rules Guide</Text>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Tango is deceptively simple: fill a grid with suns and moons following five rules. Yet understanding these rules deeply—knowing not just WHAT they are but WHY they create such satisfying logical challenges—transforms you from a struggling beginner into a confident solver.
            </Text>
            <Text style={styles.paragraph}>
              This comprehensive guide breaks down every Tango rule with detailed explanations and visual examples, helping you develop true mastery rather than surface-level understanding.
            </Text>
          </View>

          {/* Game Objective */}
          <View style={styles.section}>
            <Text style={styles.h2}>The Objective: Fill Every Cell Logically</Text>
            <Text style={styles.paragraph}>
              Your goal is to fill a 6×6 grid (36 total cells) with two symbols: suns (☀️) and moons (🌑). Some cells are pre-filled as clues, and constraint markers (= and ×) provide additional guidance. Every cell must be filled, and there's exactly one correct solution reachable through pure logic.
            </Text>
            <View style={styles.keyPoint}>
              <Text style={styles.keyPointTitle}>Key Principle:</Text>
              <Text style={styles.keyPointText}>
                Unlike games of chance, Tango puzzles never require guessing. If you're stuck, you're missing a logical deduction, not facing an unsolvable situation.
              </Text>
            </View>
          </View>

          {/* Rule 1 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #1: Perfect Row Balance (3 Suns, 3 Moons)</Text>
            <Text style={styles.paragraph}>
              Every horizontal row must contain exactly 3 suns (☀️) and exactly 3 moons (🌑). Not 4-2, not 2-4—always a perfect 3-3 split.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleTitle}>Why This Matters:</Text>
              <Text style={styles.ruleText}>
                This constraint is your most powerful tool. If a row already has 3 suns, every remaining empty cell MUST be a moon. Count constantly!
              </Text>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Visual Example:</Text>
              <Text style={styles.exampleText}>
                Row with: ☀️ ☀️ 🌑 _ _ _{'\n'}
                Already has: 2 suns, 1 moon{'\n'}
                Must add: 1 more sun, 2 more moons{'\n'}
                Therefore: The three blanks will be ☀️🌑🌑 in some order
              </Text>
            </View>

            <View style={styles.tip}>
              <Text style={styles.tipText}>
                Pro Tip: When a row has 3 of either symbol, mark all remaining blanks with the opposite symbol immediately. This often triggers chain reactions.
              </Text>
            </View>
          </View>

          {/* Rule 2 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #2: Perfect Column Balance (3 Suns, 3 Moons)</Text>
            <Text style={styles.paragraph}>
              Identically to rows, every vertical column must contain exactly 3 suns and 3 moons. The 3-3 balance applies in both directions simultaneously.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleTitle}>The Intersection Challenge:</Text>
              <Text style={styles.ruleText}>
                Every cell must satisfy BOTH its row constraint AND its column constraint. This creates powerful deductions at intersections where both are nearly full.
              </Text>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Intersection Example:</Text>
              <Text style={styles.exampleText}>
                Cell at Row 3, Column 4:{'\n'}
                • Row 3 has 3 suns already → cell must be moon{'\n'}
                • Column 4 has 2 moons → can accommodate one more{'\n'}
                • Both constraints agree → confidently place moon
              </Text>
            </View>
          </View>

          {/* Rule 3 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #3: No Three-in-a-Row (The Pattern Breaker)</Text>
            <Text style={styles.paragraph}>
              No three identical symbols can be adjacent horizontally or vertically. Patterns like ☀️☀️☀️ or 🌑🌑🌑 are forbidden. This is your most frequently used deduction tool.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleTitle}>How to Use This Rule:</Text>
              <Text style={styles.ruleText}>
                Whenever you see two identical symbols next to each other, the cell on either end MUST be the opposite symbol. This creates instant forced placements.
              </Text>
            </View>

            <View style={styles.exampleGrid}>
              <Text style={styles.exampleTitle}>Pattern Examples:</Text>
              <Text style={styles.exampleText}>
                ☀️☀️_ → Blank MUST be 🌑 (prevents ☀️☀️☀️){'\n'}
                _☀️☀️ → Blank MUST be 🌑{'\n'}
                ☀️_☀️ → Middle MUST be 🌑 (☀️☀️☀️ forbidden){'\n'}
                🌑_🌑 → Middle MUST be ☀️
              </Text>
            </View>

            <View style={styles.warning}>
              <Text style={styles.warningText}>
                Important: This rule applies in BOTH directions. Always check both horizontally and vertically after each placement.
              </Text>
            </View>
          </View>

          {/* Rule 4 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #4: Equals Sign Constraint (=)</Text>
            <Text style={styles.paragraph}>
              When you see an equals sign (=) between two adjacent cells, those cells must contain the same symbol. If one is ☀️, the other must be ☀️. If one is 🌑, the other must be 🌑.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleTitle}>Strategic Value:</Text>
              <Text style={styles.ruleText}>
                Equals markers are your starting clues. They often create immediate deductions and chain reactions. Process all = markers before attempting other moves.
              </Text>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Chain Reaction Example:</Text>
              <Text style={styles.exampleText}>
                Cell A = Cell B (constraint marker){'\n'}
                Cell A is filled with ☀️ (given clue){'\n'}
                → Cell B must be ☀️ (from = constraint){'\n'}
                → This creates ☀️☀️ pattern{'\n'}
                → Cell next to B must be 🌑 (no three-in-a-row){'\n'}
                → One constraint triggered three forced placements!
              </Text>
            </View>
          </View>

          {/* Rule 5 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #5: Cross Sign Constraint (×)</Text>
            <Text style={styles.paragraph}>
              When you see a cross or X sign (×) between two cells, those cells must contain different symbols. If one is ☀️, the other must be 🌑, and vice versa.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleTitle}>Using × Markers:</Text>
              <Text style={styles.ruleText}>
                Like equals signs, × markers are powerful starting points. They guarantee opposite symbols, which often resolves two-in-a-row patterns or completes counts.
              </Text>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>× Marker Example:</Text>
              <Text style={styles.exampleText}>
                Cell C × Cell D (constraint marker){'\n'}
                Cell C is filled with ☀️{'\n'}
                → Cell D must be 🌑 (from × constraint){'\n'}
                → Check if this completes any row/column counts{'\n'}
                → Check if this creates any two-in-a-row patterns
              </Text>
            </View>
          </View>

          {/* How Rules Interact */}
          <View style={styles.section}>
            <Text style={styles.h2}>How the Five Rules Work Together</Text>
            <Text style={styles.paragraph}>
              Tango's elegance comes from how these five rules interact. A placement that satisfies one rule often triggers deductions through other rules. Understanding these interactions is the key to expert solving.
            </Text>

            <View style={styles.interaction}>
              <Text style={styles.interactionTitle}>Common Rule Combinations:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• Constraint marker (=) forces placement → Creates two-in-a-row (Rule 3) → Forces adjacent cell → Completes row count (Rule 1) → Forces remaining cells</Text>
                <Text style={styles.bullet}>• Row reaches 3 suns (Rule 1) → Remaining cells are moons → Creates 🌑🌑 pattern → Forces cells before/after to be suns (Rule 3)</Text>
                <Text style={styles.bullet}>• Intersection has row with 3 suns + column with 3 moons → Cell must be moon (Rules 1 & 2) → Validates with Rule 3</Text>
              </View>
            </View>

            <Text style={styles.paragraph}>
              Expert solvers don't think about rules sequentially. They see the grid holistically, recognizing how one deduction cascades through multiple rules simultaneously.
            </Text>
          </View>

          {/* Common Rule Violations */}
          <View style={styles.section}>
            <Text style={styles.h2}>Common Rule Violations to Avoid</Text>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Violation #1: Incorrect Count</Text>
              <Text style={styles.paragraph}>
                Placing a 4th sun or moon in a row/column. Always count before placing!
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Violation #2: Accidental Three-in-a-Row</Text>
              <Text style={styles.paragraph}>
                Creating ☀️☀️☀️ or 🌑🌑🌑 by not checking neighbors. Check both directions!
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Violation #3: Misreading Constraint Markers</Text>
              <Text style={styles.paragraph}>
                Treating = as × or vice versa. Double-check every marker before processing!
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Violation #4: Ignoring Column Constraints</Text>
              <Text style={styles.paragraph}>
                Focusing only on rows and forgetting column balance. Always check both!
              </Text>
            </View>
          </View>

          {/* Conclusion */}
          <View style={styles.section}>
            <Text style={styles.h2}>Mastering the Rules Through Practice</Text>
            <Text style={styles.paragraph}>
              Understanding these five rules intellectually is the first step. True mastery comes from internalizing them through practice until they become automatic. When you can spot rule interactions instantly, solving becomes intuitive rather than analytical.
            </Text>
            <Text style={styles.paragraph}>
              Start with easy puzzles where rules apply obviously. Graduate to medium puzzles where multiple rules interact. Eventually, hard puzzles with complex rule cascades become solvable through pattern recognition rather than conscious rule-checking.
            </Text>
          </View>

          {/* CTA Section */}
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>Practice With These Rules</Text>
            <Text style={styles.ctaText}>
              Apply your rules knowledge on 1,200+ Tango puzzles ranging from beginner to expert
            </Text>
            <Link href="/games/tango/practice" asChild>
              <Pressable style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Start Practicing Now</Text>
              </Pressable>
            </Link>
          </View>

          {/* Related Articles */}
          <View style={styles.related}>
            <Text style={styles.relatedTitle}>Continue Learning</Text>
            <Link href="/articles/tango-beginners-guide" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Ultimate Beginner's Guide to LinkedIn Tango Puzzle</Text>
            </Link>
            <Link href="/articles/tango-advanced-strategies" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ 10 Advanced Tango Puzzle Strategies from Experts</Text>
            </Link>
            <Link href="/articles/tango-common-mistakes" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Common Tango Puzzle Mistakes and How to Fix Them</Text>
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
  keyPoint: {
    backgroundColor: 'rgba(79, 110, 247, 0.1)',
    borderRadius: 8,
    padding: 18,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4F6EF7',
  },
  keyPointTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4F6EF7',
    marginBottom: 8,
  },
  keyPointText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 24,
  },
  ruleBox: {
    backgroundColor: '#13131A',
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
    padding: 18,
    marginBottom: 16,
    borderRadius: 6,
  },
  ruleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 10,
  },
  ruleText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 24,
  },
  example: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 24,
    fontFamily: 'monospace',
  },
  exampleGrid: {
    backgroundColor: '#1C1C27',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  tip: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  tipText: {
    fontSize: 15,
    color: '#F59E0B',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  warning: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  warningText: {
    fontSize: 15,
    color: '#EF4444',
    lineHeight: 24,
    fontWeight: '600',
  },
  interaction: {
    backgroundColor: '#1C1C27',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  interactionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 12,
  },
  violation: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 16,
    marginBottom: 16,
    borderRadius: 6,
  },
  violationTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
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
