import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { TangoCategoryCard } from '../../../src/components/ui/TangoCategoryCard';
import { getPuzzleCount } from '../../../src/data/tangoPuzzleLoader';
import { Difficulty } from '../../../src/constants/gameConfig';
import { useGameStore } from '../../../src/store/gameStore';
import { SEO } from '../../../src/components/SEO';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export default function TangoPracticePage() {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<Difficulty | null>(null);
  const [puzzleCounts, setPuzzleCounts] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const getCompletedPuzzleIds = useGameStore((s) => s.getCompletedPuzzleIds);

  // Load puzzle counts for all difficulties
  useEffect(() => {
    const loadCounts = async () => {
      const counts = await Promise.all(
        DIFFICULTIES.map(async (difficulty) => {
          const count = await getPuzzleCount(difficulty);
          return { difficulty, count };
        })
      );

      const countsMap: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
      counts.forEach(({ difficulty, count }) => {
        countsMap[difficulty] = count;
      });

      setPuzzleCounts(countsMap);
    };

    loadCounts();
  }, []);

  const handleToggle = (difficulty: Difficulty) => {
    setExpandedCategory(expandedCategory === difficulty ? null : difficulty);
  };

  const handleSelectPuzzle = (difficulty: Difficulty, index: number) => {
    router.push(`/games/tango/puzzle?difficulty=${difficulty}&index=${index}`);
  };

  return (
    <>
      <SEO
        title="Tango Puzzle Practice - Unlimited LinkedIn Puzzles Training"
        description="Practice Tango puzzles with 1,200+ puzzles across 3 difficulty levels! Unlimited free practice to master LinkedIn Tango puzzle strategy. Track your progress and improve your skills."
        keywords={[
          'Tango puzzle practice',
          'unlimited Tango puzzles',
          'LinkedIn puzzle practice',
          'Tango puzzle training',
          'practice puzzle games',
          'Tango puzzle solver',
          'learn Tango strategy',
          'puzzle practice mode',
          'sun moon puzzle practice'
        ]}
        canonicalUrl="https://puzzleedge.app/games/tango/practice"
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.content}>
            <Link href="/games/tango" style={styles.backLink}>
              <Text style={styles.backText}>← Back</Text>
            </Link>

            <Text style={styles.title}>Unlimited Tango Practice</Text>
            <Text style={styles.subtitle}>
              Select a difficulty and choose any Tango puzzle to practice
            </Text>

            <View style={styles.categories}>
              {DIFFICULTIES.map((difficulty) => {
                const completedIds = getCompletedPuzzleIds(difficulty);
                const totalPuzzles = puzzleCounts[difficulty];

                return (
                  <TangoCategoryCard
                    key={difficulty}
                    difficulty={difficulty}
                    totalPuzzles={totalPuzzles}
                    completedCount={completedIds.length}
                    isExpanded={expandedCategory === difficulty}
                    onToggle={() => handleToggle(difficulty)}
                    onSelectPuzzle={(index) => handleSelectPuzzle(difficulty, index)}
                    completedPuzzleIds={completedIds}
                  />
                );
              })}
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
    paddingBottom: 32, // Extra padding for sticky ad
  },
  stickyAd: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backLink: {
    marginBottom: 32,
  },
  backText: {
    color: '#4F6EF7',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F0F0F8',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8888AA',
    textAlign: 'center',
    marginBottom: 32,
  },
  categories: {
    gap: 16,
  },
});
