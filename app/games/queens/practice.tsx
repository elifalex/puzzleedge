import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { CategoryCard } from '../../../src/components/ui/CategoryCard';
import { BoardSize, getPuzzleCount } from '../../../src/data/queensPuzzleLoader';
import { useGameStore } from '../../../src/store/gameStore';
import { SEO } from '../../../src/components/SEO';
import { AdBanner } from '../../../src/components/ads/AdBanner';
import { getAdSlot } from '../../../src/config/ads';

const BOARD_SIZES: BoardSize[] = [6, 7, 8, 9];

export default function QueensPracticePage() {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<BoardSize | null>(null);
  const [puzzleCounts, setPuzzleCounts] = useState<Record<BoardSize, number>>({
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  });

  const getCompletedPuzzleIds = useGameStore((s) => s.getCompletedPuzzleIds);

  // Load puzzle counts for all board sizes
  useEffect(() => {
    const loadCounts = async () => {
      const counts = await Promise.all(
        BOARD_SIZES.map(async (size) => {
          const count = await getPuzzleCount(size);
          return { size, count };
        })
      );

      const countsMap: Record<BoardSize, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
      counts.forEach(({ size, count }) => {
        countsMap[size] = count;
      });

      setPuzzleCounts(countsMap);
    };

    loadCounts();
  }, []);

  const handleToggle = (boardSize: BoardSize) => {
    setExpandedCategory(expandedCategory === boardSize ? null : boardSize);
  };

  const handleSelectPuzzle = (boardSize: BoardSize, index: number) => {
    router.push(`/games/queens/puzzle?boardSize=${boardSize}&index=${index}`);
  };

  return (
    <>
      <SEO
        title="Queens Puzzle Practice - Unlimited LinkedIn Puzzles Training"
        description="Practice Queens puzzles with 1,600+ puzzles across 4 difficulty levels! Unlimited free practice to master LinkedIn Queens puzzle strategy. Track your progress and improve your skills."
        keywords={[
          'Queens puzzle practice',
          'unlimited Queens puzzles',
          'LinkedIn puzzle practice',
          'Queens puzzle training',
          'practice puzzle games',
          'Queens puzzle solver',
          'learn Queens strategy',
          'puzzle practice mode'
        ]}
        canonicalUrl="https://puzzleedge.app/games/queens/practice"
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.content}>
            <Link href="/games/queens" style={styles.backLink}>
              <Text style={styles.backText}>← Back</Text>
            </Link>

            <Text style={styles.title}>Unlimited Queens Practice</Text>
            <Text style={styles.subtitle}>
              Select a category and choose any Queens puzzle to practice
            </Text>

            <View style={styles.categories}>
              {BOARD_SIZES.map((size) => {
                const completedIds = getCompletedPuzzleIds(size);
                const totalPuzzles = puzzleCounts[size];

                return (
                  <CategoryCard
                    key={size}
                    boardSize={size}
                    totalPuzzles={totalPuzzles}
                    completedCount={completedIds.length}
                    isExpanded={expandedCategory === size}
                    onToggle={() => handleToggle(size)}
                    onSelectPuzzle={(index) => handleSelectPuzzle(size, index)}
                    completedPuzzleIds={completedIds}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
        <AdBanner adSlot={getAdSlot('practicePuzzleBanner')} style={styles.stickyAd} />
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
    paddingBottom: 120, // Extra padding for sticky ad
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
