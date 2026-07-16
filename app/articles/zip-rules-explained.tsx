import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';

export default function ZipRulesExplainedArticle() {
  return (
    <>
      <SEO
        title="Zip Puzzle Rules Explained with Visual Examples | Complete LinkedIn Zip Guide"
        description="Master all 5 essential rules of LinkedIn Zip puzzles with clear explanations and visual examples. Complete guide to understanding Zip path-finding puzzle mechanics."
        keywords={[
          'Zip puzzle rules',
          'LinkedIn Zip rules explained',
          'how Zip puzzle works',
          'Zip puzzle mechanics',
          'Zip puzzle rule breakdown',
          'understand Zip puzzle',
          'Zip puzzle tutorial',
          'Hamiltonian path rules'
        ]}
        canonicalUrl="https://puzzleedge.app/articles/zip-rules-explained"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Link href="/articles" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Articles</Text>
          </Link>

          <Text style={styles.title}>Zip Puzzle Rules Explained with Visual Examples</Text>
          <Text style={styles.meta}>10 min read • Complete Rule Reference</Text>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              LinkedIn's Zip puzzle is deceptively simple in concept but surprisingly challenging in execution. Understanding the rules isn't enough—you need to grasp how they interact and constrain each other to create the puzzle's logical framework.
            </Text>
            <Text style={styles.paragraph}>
              This comprehensive guide breaks down all 5 essential Zip rules with clear explanations, practical examples, and common violations to avoid. By the end, you'll understand not just what the rules are, but why they matter for solving.
            </Text>
          </View>

          {/* Rule #1 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #1: Visit Every Cell Exactly Once</Text>
            <Text style={styles.paragraph}>
              The foundational rule: your path must pass through every single cell on the grid—no more, no less. Each cell gets exactly one visit.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleBoxTitle}>What This Means</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• Every empty cell must be part of your continuous path</Text>
                <Text style={styles.bullet}>• You cannot skip any cells, even if they seem inconvenient to reach</Text>
                <Text style={styles.bullet}>• You cannot visit the same cell twice—no backtracking over previous path</Text>
                <Text style={styles.bullet}>• On a 7×7 grid with no walls, your path must be exactly 49 cells long</Text>
              </View>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Why This Rule Exists</Text>
              <Text style={styles.exampleText}>
                This rule transforms Zip from a simple "connect the checkpoints" puzzle into a Hamiltonian path problem—one of the most interesting challenges in graph theory. It forces you to plan your entire route, not just rush between numbered waypoints.
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Common Violations</Text>
              <Text style={styles.violationText}>
                ✗ Drawing the shortest path between checkpoints, leaving corners or edges unvisited
              </Text>
              <Text style={styles.violationText}>
                ✗ Creating a path that isolates a group of cells, making them unreachable
              </Text>
              <Text style={styles.violationText}>
                ✗ Crossing your previous path, which would visit a cell twice
              </Text>
            </View>
          </View>

          {/* Rule #2 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #2: Draw One Continuous Path</Text>
            <Text style={styles.paragraph}>
              Your solution must be a single, unbroken line from the starting cell to the ending cell. No disconnected segments, no lifting your pen.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleBoxTitle}>What This Means</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• The path starts at one cell and ends at another—every cell in between connects to exactly 2 neighbors (entry and exit)</Text>
                <Text style={styles.bullet}>• Start and end cells connect to exactly 1 neighbor each</Text>
                <Text style={styles.bullet}>• You cannot create separate path fragments and connect them later</Text>
                <Text style={styles.bullet}>• Every move must transition from your current cell to an adjacent cell</Text>
              </View>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Practical Implication</Text>
              <Text style={styles.exampleText}>
                This rule means corner cells (which have only 2 adjacent cells) must either be start/end points, or your path must pass straight through them—entering from one direction and exiting through the other. There's no third option.
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Common Violations</Text>
              <Text style={styles.violationText}>
                ✗ Creating two separate path sections and assuming you can connect them
              </Text>
              <Text style={styles.violationText}>
                ✗ Jumping diagonally between cells (diagonal moves are not allowed)
              </Text>
              <Text style={styles.violationText}>
                ✗ Leaving a corner cell unvisited because it "doesn't fit" the path
              </Text>
            </View>
          </View>

          {/* Rule #3 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #3: Visit Checkpoints in Numerical Order</Text>
            <Text style={styles.paragraph}>
              Numbered checkpoints (1, 2, 3, 4...) must be encountered in ascending order as you trace your path. You cannot visit checkpoint 3 before visiting checkpoint 2.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleBoxTitle}>What This Means</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• Your path must pass through checkpoint 1 before reaching any other checkpoint</Text>
                <Text style={styles.bullet}>• After visiting checkpoint N, the next checkpoint you encounter must be N+1</Text>
                <Text style={styles.bullet}>• You can visit regular (non-checkpoint) cells freely between checkpoints</Text>
                <Text style={styles.bullet}>• Checkpoints divide your path into ordered segments</Text>
              </View>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Practical Implication</Text>
              <Text style={styles.exampleText}>
                Between checkpoint 2 and checkpoint 3, you might visit 15 regular cells. That's fine. But the moment you visit checkpoint 3, you can never return to the area before checkpoint 3—your path must continue forward toward checkpoint 4.
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Common Violations</Text>
              <Text style={styles.violationText}>
                ✗ Accidentally passing through checkpoint 4 while trying to collect cells before reaching checkpoint 3
              </Text>
              <Text style={styles.violationText}>
                ✗ Planning to "loop back" to a checkpoint you already passed
              </Text>
              <Text style={styles.violationText}>
                ✗ Skipping a checkpoint number (visiting 1, 2, 4, missing 3)
              </Text>
            </View>
          </View>

          {/* Rule #4 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #4: Cannot Cross Walls</Text>
            <Text style={styles.paragraph}>
              Some Zip puzzles include walls—thick black lines between cells. Your path cannot cross these walls. They block movement and force alternate routes.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleBoxTitle}>What This Means</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• Walls divide the grid into separate regions or corridors</Text>
                <Text style={styles.bullet}>• To move between walled-off regions, you must find openings</Text>
                <Text style={styles.bullet}>• Walls reduce the number of possible paths, making some segments "forced"</Text>
                <Text style={styles.bullet}>• Not all puzzles have walls—they're added to increase difficulty</Text>
              </View>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Strategic Insight</Text>
              <Text style={styles.exampleText}>
                Walls aren't just obstacles—they're hints! A wall corridor (a path created by walls on both sides) is a forced route with no branching. These corridors simplify path planning by reducing decision points. Expert solvers use wall corridors as "highways" to efficiently traverse the grid.
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Common Violations</Text>
              <Text style={styles.violationText}>
                ✗ Drawing a path that crosses through a wall barrier
              </Text>
              <Text style={styles.violationText}>
                ✗ Assuming you can jump over a wall to reach an adjacent cell
              </Text>
              <Text style={styles.violationText}>
                ✗ Ignoring walls in planning and discovering too late that a route is blocked
              </Text>
            </View>
          </View>

          {/* Rule #5 */}
          <View style={styles.section}>
            <Text style={styles.h2}>Rule #5: Move Horizontally or Vertically (No Diagonals)</Text>
            <Text style={styles.paragraph}>
              Each step of your path must move to an adjacent cell horizontally (left/right) or vertically (up/down). Diagonal movement is not allowed.
            </Text>

            <View style={styles.ruleBox}>
              <Text style={styles.ruleBoxTitle}>What This Means</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• From any cell, you can move to at most 4 adjacent cells (up, down, left, right)</Text>
                <Text style={styles.bullet}>• Corner cells have 2 possible moves, edge cells have 3, center cells have 4</Text>
                <Text style={styles.bullet}>• You cannot shortcut across diagonal cells</Text>
                <Text style={styles.bullet}>• This rule makes the grid a "4-connected" graph</Text>
              </View>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Why This Matters</Text>
              <Text style={styles.exampleText}>
                No diagonal movement means traveling from the top-left corner to the bottom-right corner requires a minimum Manhattan distance of (width-1) + (height-1) steps. On a 7×7 grid, that's at least 12 steps—you can't take diagonal shortcuts.
              </Text>
            </View>

            <View style={styles.violation}>
              <Text style={styles.violationTitle}>Common Violations</Text>
              <Text style={styles.violationText}>
                ✗ Drawing a diagonal line between checkpoints
              </Text>
              <Text style={styles.violationText}>
                ✗ Counting diagonal cells as "adjacent" in path planning
              </Text>
              <Text style={styles.violationText}>
                ✗ Mentally calculating shortest paths using diagonal shortcuts
              </Text>
            </View>
          </View>

          {/* How Rules Interact */}
          <View style={styles.section}>
            <Text style={styles.h2}>How These Rules Interact to Create the Puzzle</Text>
            <Text style={styles.paragraph}>
              The genius of Zip puzzles lies in how these 5 rules combine to create logical constraints:
            </Text>

            <View style={styles.interaction}>
              <Text style={styles.interactionTitle}>Rules 1 + 2 + 5 Together</Text>
              <Text style={styles.paragraph}>
                You must visit every cell exactly once, in a continuous path, moving only horizontally or vertically. This creates a Hamiltonian path problem on a grid graph—a notoriously difficult computational challenge.
              </Text>
            </View>

            <View style={styles.interaction}>
              <Text style={styles.interactionTitle}>Rules 3 + 1</Text>
              <Text style={styles.paragraph}>
                Checkpoints divide your path into segments, but you still must visit all cells. This means between checkpoints, you can't beeline—you must "sweep" through regions to collect all cells before moving to the next checkpoint.
              </Text>
            </View>

            <View style={styles.interaction}>
              <Text style={styles.interactionTitle}>Rules 4 + 2</Text>
              <Text style={styles.paragraph}>
                Walls block your continuous path, forcing you through specific openings. This creates "forced" path segments where only one route is possible—your key to solving complex puzzles.
              </Text>
            </View>
          </View>

          {/* Grid Sizes and Difficulty */}
          <View style={styles.section}>
            <Text style={styles.h2}>Grid Sizes and Difficulty Levels</Text>
            <Text style={styles.paragraph}>
              LinkedIn Zip puzzles come in three standard sizes, each governed by the same 5 rules:
            </Text>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>5×5 Grid (Easy)</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• 25 total cells to visit</Text>
                <Text style={styles.bullet}>• Usually 3-5 checkpoints</Text>
                <Text style={styles.bullet}>• Minimal or no walls</Text>
                <Text style={styles.bullet}>• Perfect for learning the rules and basic strategies</Text>
              </View>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>6×6 Grid (Medium)</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• 36 total cells to visit</Text>
                <Text style={styles.bullet}>• Usually 5-7 checkpoints</Text>
                <Text style={styles.bullet}>• Moderate wall complexity</Text>
                <Text style={styles.bullet}>• Requires planning 2-3 checkpoint segments ahead</Text>
              </View>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>7×7 Grid (Hard)</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bullet}>• 49 total cells to visit</Text>
                <Text style={styles.bullet}>• Usually 7-10 checkpoints</Text>
                <Text style={styles.bullet}>• Complex wall patterns creating corridors and regions</Text>
                <Text style={styles.bullet}>• Demands advanced path-planning and forced-segment analysis</Text>
              </View>
            </View>
          </View>

          {/* Rule Summary */}
          <View style={styles.section}>
            <Text style={styles.h2}>Quick Reference: The 5 Essential Rules</Text>
            <View style={styles.summary}>
              <Text style={styles.summaryItem}>1️⃣ Visit every cell exactly once</Text>
              <Text style={styles.summaryItem}>2️⃣ Draw one continuous path from start to end</Text>
              <Text style={styles.summaryItem}>3️⃣ Visit numbered checkpoints in order (1→2→3...)</Text>
              <Text style={styles.summaryItem}>4️⃣ Cannot cross walls (if present)</Text>
              <Text style={styles.summaryItem}>5️⃣ Move horizontally or vertically (no diagonals)</Text>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>Ready to Apply These Rules?</Text>
            <Text style={styles.ctaText}>
              Practice unlimited Zip puzzles with guided hints that reinforce these 5 essential rules
            </Text>
            <Link href="/games/zip/practice" asChild>
              <Pressable style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Start Practicing Now</Text>
              </Pressable>
            </Link>
          </View>

          {/* Related Articles */}
          <View style={styles.related}>
            <Text style={styles.relatedTitle}>Continue Learning</Text>
            <Link href="/articles/zip-beginners-guide" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Ultimate Beginner's Guide to LinkedIn Zip Puzzle</Text>
            </Link>
            <Link href="/articles/zip-advanced-strategies" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ 10 Advanced Zip Puzzle Strategies from Experts</Text>
            </Link>
            <Link href="/articles/zip-common-mistakes" style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>→ Common Zip Puzzle Mistakes and How to Fix Them</Text>
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
