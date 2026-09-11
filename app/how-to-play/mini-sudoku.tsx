import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';

export default function HowToPlayMiniSudokuPage() {
  return (
    <>
      <SEO
        title="How to Play Mini Sudoku - LinkedIn Mini Sudoku Strategy Guide & Tips"
        description="Learn how to solve LinkedIn Mini Sudoku puzzles with our complete strategy guide. Master the 6×6 grid rules, advanced solving techniques, and tips to beat every Mini Sudoku challenge."
        keywords={[
          'how to play Mini Sudoku',
          'LinkedIn Mini Sudoku strategy',
          'Mini Sudoku guide',
          'Mini Sudoku tips',
          'learn Mini Sudoku',
          'Mini Sudoku solving techniques',
          'LinkedIn puzzle how to play',
          'Mini Sudoku tutorial',
          '6x6 Sudoku guide',
          'Sudoku strategy'
        ]}
        canonicalUrl="https://puzzleedge.app/how-to-play/mini-sudoku"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Link href="/games/mini-sudoku" style={styles.backLink}>
            <Text style={styles.backText}>← Back to Mini Sudoku</Text>
          </Link>

          <Text style={styles.title}>How to Play LinkedIn Mini Sudoku</Text>
          <Text style={styles.subtitle}>
            Complete strategy guide for mastering Mini Sudoku puzzles
          </Text>

          {/* Game Rules Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The Three Core Rules</Text>
            <Text style={styles.intro}>
              LinkedIn Mini Sudoku is a 6×6 variant of the classic Sudoku puzzle. Unlike traditional 9×9 Sudoku with 3×3 boxes, Mini Sudoku uses a 6×6 grid divided into six 2×3 boxes.
            </Text>
            <Text style={styles.intro}>
              To solve the puzzle, you must fill all 36 cells with the numbers 1-6 while following these three essential rules:
            </Text>

            <View style={styles.rule}>
              <Text style={styles.ruleTitle}>1. The Row Rule</Text>
              <Text style={styles.ruleText}>
                Each of the 6 rows must contain the numbers 1, 2, 3, 4, 5, and 6 exactly once. No number can repeat within the same row.
              </Text>
              <Text style={styles.ruleNote}>
                Tip: If a row already has five numbers filled, the missing number is immediately known.
              </Text>
            </View>

            <View style={styles.rule}>
              <Text style={styles.ruleTitle}>2. The Column Rule</Text>
              <Text style={styles.ruleText}>
                Each of the 6 columns must contain the numbers 1, 2, 3, 4, 5, and 6 exactly once. No number can repeat within the same column.
              </Text>
              <Text style={styles.ruleNote}>
                Tip: Always check both the row AND column before placing a number.
              </Text>
            </View>

            <View style={styles.rule}>
              <Text style={styles.ruleTitle}>3. The Box Rule (2×3 Boxes)</Text>
              <Text style={styles.ruleText}>
                The 6×6 grid is divided into six rectangular boxes, each containing 2 rows and 3 columns (6 cells total). Each box must contain the numbers 1-6 exactly once.
              </Text>
              <Text style={styles.ruleNote}>
                Note: The boxes are arranged in a 3×2 pattern - three boxes across and two boxes down.
              </Text>
            </View>
          </View>

          {/* How to Play */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            <Text style={styles.intro}>
              Mini Sudoku uses a persistent number pad interface:
            </Text>

            <View style={styles.gameplayStep}>
              <Text style={styles.stepNumber}>1.</Text>
              <Text style={styles.stepText}>
                Click any empty cell to select it (pre-filled clue cells cannot be modified)
              </Text>
            </View>

            <View style={styles.gameplayStep}>
              <Text style={styles.stepNumber}>2.</Text>
              <Text style={styles.stepText}>
                Use the number pad below the grid to place a number (1-6) in the selected cell
              </Text>
            </View>

            <View style={styles.gameplayStep}>
              <Text style={styles.stepNumber}>3.</Text>
              <Text style={styles.stepText}>
                Click "Erase" to clear the selected cell if you made a mistake
              </Text>
            </View>

            <View style={styles.gameplayStep}>
              <Text style={styles.stepNumber}>4.</Text>
              <Text style={styles.stepText}>
                The game automatically detects conflicts (rule violations) and highlights them in red
              </Text>
            </View>

            <Text style={styles.intro}>
              Pre-filled clue cells are shown with a darker background and cannot be changed. Your entered numbers appear in blue.
            </Text>
          </View>

          {/* Strategies Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Logic & Solving Strategies</Text>
            <Text style={styles.intro}>
              Master these logical techniques to solve Mini Sudoku puzzles efficiently:
            </Text>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Naked Singles</Text>
              <Text style={styles.strategyText}>
                When a cell can only contain one possible number (because all other numbers 1-6 are already present in that cell's row, column, or box), that cell must be filled with that number. This is the most fundamental Sudoku technique.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Hidden Singles</Text>
              <Text style={styles.strategyText}>
                When a number can only go in one cell within a row, column, or box (even if that cell could technically hold other numbers), it must go there. Look for numbers that have very limited placement options.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Elimination Method</Text>
              <Text style={styles.strategyText}>
                For each empty cell, mentally eliminate numbers that are already in its row, column, or box. The remaining candidates are the only possible values. This helps you spot naked singles.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Box-Line Reduction</Text>
              <Text style={styles.strategyText}>
                If a number in a box can only appear in cells that all belong to the same row or column, that number cannot appear elsewhere in that row or column. This advanced technique eliminates candidates in other boxes.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Scanning Technique</Text>
              <Text style={styles.strategyText}>
                Pick one number (e.g., 1) and scan the entire grid to find where it can be placed. Look at which rows, columns, and boxes already have that number, then find cells where it's the only option.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Row/Column Completion</Text>
              <Text style={styles.strategyText}>
                When a row or column has only 1-2 empty cells left, you can quickly determine what numbers are missing by checking which of 1-6 are already present. Fill in the missing values.
              </Text>
            </View>
          </View>

          {/* Advanced Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Tips</Text>

            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Start by filling cells with the fewest possibilities (naked singles)
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Focus on rows, columns, or boxes that are nearly complete
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Scan for numbers that appear 4-5 times already - they're easier to place
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Work systematically - check one number at a time across the entire grid
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Use the hint button when stuck - it will suggest the next logical move
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Every puzzle has exactly one solution - never guess randomly!
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • The 2×3 box constraint is unique to Mini Sudoku - don't forget to check boxes!
              </Text>
            </View>
          </View>

          {/* Difficulty Levels */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty Progression</Text>
            <Text style={styles.intro}>
              Mini Sudoku puzzles come in three difficulty levels:
            </Text>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Easy (28 clues)</Text>
              <Text style={styles.difficultyText}>
                More pre-filled numbers (28 out of 36 cells). Great for learning the rules and basic techniques. Usually solvable with naked singles and simple elimination.
              </Text>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Medium (22 clues)</Text>
              <Text style={styles.difficultyText}>
                Moderate number of starting clues (22 cells filled). Requires hidden singles, scanning, and more careful candidate tracking.
              </Text>
            </View>

            <View style={styles.difficulty}>
              <Text style={styles.difficultyTitle}>Hard (16 clues)</Text>
              <Text style={styles.difficultyText}>
                Fewer starting clues (only 16 cells pre-filled). Demands advanced techniques like box-line reduction and systematic elimination. Requires patience and careful logic.
              </Text>
            </View>
          </View>

          {/* Common Mistakes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Mistakes to Avoid</Text>

            <View style={styles.mistake}>
              <Text style={styles.mistakeTitle}>❌ Forgetting the Box Constraint</Text>
              <Text style={styles.mistakeText}>
                The 2×3 box rule is easy to forget! Always check that your number doesn't already appear in the same 2×3 box, not just the row and column.
              </Text>
            </View>

            <View style={styles.mistake}>
              <Text style={styles.mistakeTitle}>❌ Rushing and Making Careless Errors</Text>
              <Text style={styles.mistakeText}>
                Double-check before placing a number. A single wrong entry can cascade into multiple conflicts and waste time.
              </Text>
            </View>

            <View style={styles.mistake}>
              <Text style={styles.mistakeTitle}>❌ Guessing Instead of Using Logic</Text>
              <Text style={styles.mistakeText}>
                Every cell can be solved through pure logic. If you can't find the next move, use the hint button rather than guessing randomly.
              </Text>
            </View>

            <View style={styles.mistake}>
              <Text style={styles.mistakeTitle}>❌ Not Tracking Candidates Mentally</Text>
              <Text style={styles.mistakeText}>
                For harder puzzles, you need to track which numbers are possible in each cell. Mentally note candidates to spot patterns.
              </Text>
            </View>

            <View style={styles.mistake}>
              <Text style={styles.mistakeTitle}>❌ Ignoring Conflicts</Text>
              <Text style={styles.mistakeText}>
                Red highlighting indicates a rule violation. Fix conflicts immediately - they won't resolve themselves!
              </Text>
            </View>
          </View>

          {/* Practice Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practice Makes Perfect</Text>
            <Text style={styles.intro}>
              Start with easy puzzles to build confidence, then gradually increase difficulty. The daily Mini Sudoku tracks your streak, while practice mode offers 1,200 puzzles across all difficulty levels for unlimited training.
            </Text>
            <Text style={styles.intro}>
              With regular practice, you'll develop pattern recognition and solve puzzles faster. Happy solving!
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
  gameplayStep: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F6EF7',
    marginRight: 12,
    minWidth: 24,
  },
  stepText: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
    flex: 1,
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
