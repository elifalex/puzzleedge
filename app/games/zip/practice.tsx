import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { CategoryCard } from '../../../src/components/ui/CategoryCard';
import { ZipBoardSize, getZipPuzzleCount } from '../../../src/data/zipPuzzleLoader';
import { useGameStore } from '../../../src/store/gameStore';
import { SEO } from '../../../src/components/SEO';

const BOARD_SIZES: ZipBoardSize[] = [5, 6, 7];

const CATEGORY_INFO = {
  5: { label: 'Easy', color: '#22C55E' },
  6: { label: 'Medium', color: '#4F6EF7' },
  7: { label: 'Hard', color: '#F59E0B' },
};

export default function ZipPracticePage() {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<ZipBoardSize | null>(null);
  const [puzzleCounts, setPuzzleCounts] = useState<Record<ZipBoardSize, number>>({
    5: 0,
    6: 0,
    7: 0,
  });

  const getCompletedPuzzleIds = useGameStore((s) => s.getCompletedPuzzleIds);

  // Load puzzle counts for all board sizes
  useEffect(() => {
    const loadCounts = async () => {
      const counts = await Promise.all(
        BOARD_SIZES.map(async (size) => {
          const count = await getZipPuzzleCount(size);
          return { size, count };
        })
      );

      const countsMap: Record<ZipBoardSize, number> = { 5: 0, 6: 0, 7: 0 };
      counts.forEach(({ size, count }) => {
        countsMap[size] = count;
      });

      setPuzzleCounts(countsMap);
    };

    loadCounts();
  }, []);

  const handleToggle = (boardSize: ZipBoardSize) => {
    setExpandedCategory(expandedCategory === boardSize ? null : boardSize);
  };

  const handleSelectPuzzle = (boardSize: ZipBoardSize, index: number) => {
    router.push(`/games/zip/puzzle?boardSize=${boardSize}&index=${index}`);
  };

  return (
    <>
      <SEO
        title="Zip Puzzle Practice - Unlimited Path Puzzles Training"
        description="Practice Zip puzzles with unlimited puzzles across 3 difficulty levels! Free practice to master path drawing puzzle strategy."
        keywords={[
          'Zip puzzle practice',
          'unlimited Zip puzzles',
          'Zip puzzle training',
          'practice path puzzles',
          'Zip puzzle solver',
          'learn Zip strategy',
          'puzzle practice mode'
        ]}
        canonicalUrl="https://puzzleedge.app/games/zip/practice"
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.content}>
            <Link href="/games/zip" style={styles.backLink}>
              <Text style={styles.backText}>← Back</Text>
            </Link>

            <Text style={styles.title}>Unlimited Zip Practice</Text>
            <Text style={styles.subtitle}>
              Select a category and choose any Zip puzzle to practice
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
                    categoryInfo={CATEGORY_INFO[size]}
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
    paddingBottom: 32,
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
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  categoryCard: {
    backgroundColor: '#13131A',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F0F0F8',
  },
  difficultyBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F6EF7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(79, 110, 247, 0.2)',
    borderRadius: 12,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#8888AA',
    marginBottom: 16,
    lineHeight: 20,
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F6EF7',
  },
});
