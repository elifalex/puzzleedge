import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';

export default function HowToPlayZip() {
  return (
    <>
      <SEO
        title="How to Play Zip Puzzle - Complete Guide & Rules"
        description="Learn how to play Zip puzzle game. Complete guide covering rules, strategies, and tips for solving path drawing puzzles with numbered checkpoints."
        keywords={[
          'how to play Zip',
          'Zip puzzle rules',
          'Zip game guide',
          'Zip puzzle strategy',
          'Zip tutorial',
          'path puzzle rules',
          'Hamiltonian path game'
        ]}
        canonicalUrl="https://puzzleedge.app/how-to-play/zip"
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.backLink}>
              <Link href="/games/zip">
                <Text style={styles.backText}>← Back to Zip</Text>
              </Link>
            </View>

            <Text style={styles.title}>How to Play Zip</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Objective</Text>
              <Text style={styles.text}>
                Draw a continuous path through the entire grid, visiting every cell exactly once.
                Your path must pass through numbered checkpoints in sequential order (1 → 2 → 3...).
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Rules</Text>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>1.</Text>
                <Text style={styles.ruleText}>
                  <Text style={styles.bold}>Visit Every Cell:</Text> Your path must pass through every cell on the grid exactly once.
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>2.</Text>
                <Text style={styles.ruleText}>
                  <Text style={styles.bold}>Sequential Checkpoints:</Text> Pass through numbered checkpoints in order (1, 2, 3, etc.).
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>3.</Text>
                <Text style={styles.ruleText}>
                  <Text style={styles.bold}>No Crossing:</Text> Your path cannot cross itself.
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>4.</Text>
                <Text style={styles.ruleText}>
                  <Text style={styles.bold}>Horizontal/Vertical Only:</Text> Move one cell at a time, horizontally or vertically. No diagonal moves.
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>5.</Text>
                <Text style={styles.ruleText}>
                  <Text style={styles.bold}>Respect Walls:</Text> Thick black lines are walls - your path cannot pass through them.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How to Play</Text>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>Step 1</Text>
                <Text style={styles.stepText}>
                  Start by tapping checkpoint 1. This will begin your path.
                </Text>
              </View>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>Step 2</Text>
                <Text style={styles.stepText}>
                  Tap adjacent cells to extend your path. You can only move to cells directly above, below, left, or right.
                </Text>
              </View>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>Step 3</Text>
                <Text style={styles.stepText}>
                  Make sure to pass through checkpoints 2, 3, 4... in order as you draw your path.
                </Text>
              </View>
              <View style={styles.stepItem}>
                <Text style={styles.stepNumber}>Step 4</Text>
                <Text style={styles.stepText}>
                  Continue until you've filled every cell. If you make a mistake, tap a cell in your path to truncate back to that point.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Strategy Tips</Text>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.bold}>Look for forced moves:</Text> Cells with walls on three sides must be entered and exited through the only open side.
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.bold}>Plan checkpoint routes:</Text> Before drawing, visualize how to connect checkpoints in order while covering all cells.
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.bold}>Avoid dead ends:</Text> Be careful not to trap yourself in a corner with unvisited cells remaining.
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.bold}>Use the hint system:</Text> If stuck, the hint button will show you the next few cells in the correct path.
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.bold}>Start with corners:</Text> Corner cells and edges often have fewer movement options - plan around them first.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Difficulty Levels</Text>
              <View style={styles.difficultyItem}>
                <Text style={styles.difficultyName}>Easy (5×5)</Text>
                <Text style={styles.difficultyDesc}>
                  Smaller grid with 3-4 checkpoints and no walls. Perfect for learning the basics.
                </Text>
              </View>
              <View style={styles.difficultyItem}>
                <Text style={styles.difficultyName}>Medium (6×6)</Text>
                <Text style={styles.difficultyDesc}>
                  Balanced challenge with 4-6 checkpoints and some walls to navigate around.
                </Text>
              </View>
              <View style={styles.difficultyItem}>
                <Text style={styles.difficultyName}>Hard (7×7)</Text>
                <Text style={styles.difficultyDesc}>
                  Larger grid with 6-8 checkpoints and many walls. Requires careful planning.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visual Elements</Text>
              <View style={styles.legendGrid}>
                <View style={styles.legendItem}>
                  <View style={styles.legendCheckpoint}>
                    <Text style={styles.legendCheckpointText}>1</Text>
                  </View>
                  <Text style={styles.legendLabel}>Numbered Checkpoint</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendPath} />
                  <Text style={styles.legendLabel}>Cells in Path</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendWall} />
                  <Text style={styles.legendLabel}>Wall (Cannot Cross)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendCurrent} />
                  <Text style={styles.legendLabel}>Current Position</Text>
                </View>
              </View>
            </View>

            <View style={[styles.section, styles.finalSection]}>
              <Text style={styles.readyText}>Ready to play?</Text>
              <Link href="/games/zip/practice" asChild>
                <Pressable style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Practicing →</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 32,
    paddingBottom: 32,
    maxWidth: 800,
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
    fontSize: 36,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#C0C0D8',
    lineHeight: 24,
  },
  bold: {
    fontWeight: '700',
    color: '#F0F0F8',
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F6EF7',
    marginRight: 12,
    minWidth: 24,
  },
  ruleText: {
    flex: 1,
    fontSize: 16,
    color: '#C0C0D8',
    lineHeight: 24,
  },
  stepItem: {
    marginBottom: 20,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F6EF7',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 16,
    color: '#C0C0D8',
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tipBullet: {
    fontSize: 20,
    color: '#4F6EF7',
    marginRight: 12,
    minWidth: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#C0C0D8',
    lineHeight: 24,
  },
  difficultyItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#13131A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  difficultyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 8,
  },
  difficultyDesc: {
    fontSize: 14,
    color: '#8888AA',
    lineHeight: 20,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    alignItems: 'center',
    minWidth: 140,
    marginRight: 24,
    marginBottom: 16,
  },
  legendCheckpoint: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  legendCheckpointText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A0A0F',
  },
  legendPath: {
    width: 40,
    height: 40,
    backgroundColor: '#4F6EF7',
    borderRadius: 4,
    marginBottom: 8,
  },
  legendWall: {
    width: 6,
    height: 40,
    backgroundColor: '#0A0A0F',
    borderRadius: 2,
    marginBottom: 8,
  },
  legendCurrent: {
    width: 40,
    height: 40,
    backgroundColor: '#6B8EF9',
    borderRadius: 4,
    borderWidth: 3,
    borderColor: '#FCD34D',
    marginBottom: 8,
  },
  legendLabel: {
    fontSize: 13,
    color: '#8888AA',
    textAlign: 'center',
  },
  finalSection: {
    alignItems: 'center',
    marginTop: 48,
  },
  readyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F0F0F8',
    marginBottom: 24,
  },
  startButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#4F6EF7',
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F0F8',
  },
});
