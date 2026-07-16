import { View, Text, Pressable, StyleSheet, Animated, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react-native';

interface CategoryInfo {
  label: string;
  color: string;
}

interface CategoryCardProps {
  boardSize: number;
  totalPuzzles: number;
  completedCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectPuzzle: (index: number) => void;
  completedPuzzleIds: string[];
  categoryInfo: CategoryInfo;
}

export function CategoryCard({
  boardSize,
  totalPuzzles,
  completedCount,
  isExpanded,
  onToggle,
  onSelectPuzzle,
  completedPuzzleIds,
  categoryInfo,
}: CategoryCardProps) {
  const animationHeight = useRef(new Animated.Value(0)).current;
  const info = categoryInfo;
  const progressPercent = Math.round((completedCount / totalPuzzles) * 100);

  useEffect(() => {
    Animated.timing(animationHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  // Calculate dynamic height based on total puzzles
  // Puzzle button: 48px height + 8px gap = 56px per row
  // Puzzles per row: ~7 (assuming ~400px width, 48px + 8px = 56px per puzzle)
  // Also add: progress bar (~60px) + border (1px) + padding (32px)
  const puzzlesPerRow = 7;
  const rowCount = Math.ceil(totalPuzzles / puzzlesPerRow);
  const puzzleGridHeight = rowCount * 56; // 48px + 8px gap
  const dynamicMaxHeight = puzzleGridHeight + 100; // +100 for progress bar and padding

  const maxHeight = animationHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dynamicMaxHeight],
  });

  return (
    <View style={[styles.card, { borderColor: info.color }]}>
      <Pressable onPress={onToggle} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{boardSize}×{boardSize} Puzzles</Text>
          <Text style={[styles.label, { color: info.color }]}>{info.label} Level</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.completionCount}>
            {completedCount}/{totalPuzzles}
          </Text>
          {isExpanded ? (
            <ChevronUp size={20} color="#8888AA" />
          ) : (
            <ChevronDown size={20} color="#8888AA" />
          )}
        </View>
      </Pressable>

      {isExpanded && (
        <Animated.View style={[styles.expandedContent, { maxHeight }]}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            style={styles.scrollContainer}
          >
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%`, backgroundColor: info.color },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{progressPercent}% Complete</Text>
            </View>

            {/* Puzzle Grid */}
            <View style={styles.puzzleGrid}>
              {Array.from({ length: totalPuzzles }, (_, i) => {
                const puzzleId = `${boardSize}x${boardSize}-${String(i + 1).padStart(4, '0')}`;
                const isCompleted = completedPuzzleIds.includes(puzzleId);

                return (
                  <Pressable
                    key={i}
                    onPress={() => onSelectPuzzle(i)}
                    style={[
                      styles.puzzleButton,
                      isCompleted && styles.puzzleButtonCompleted,
                    ]}
                  >
                    <Text style={[
                      styles.puzzleNumber,
                      isCompleted && styles.puzzleNumberCompleted,
                    ]}>
                      {i + 1}
                    </Text>
                    {isCompleted && (
                      <View style={styles.checkmark}>
                        <Check size={12} color={info.color} strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#13131A',
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8888AA',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2A2A3D',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#8888AA',
    textAlign: 'center',
  },
  puzzleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3D',
  },
  puzzleButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    backgroundColor: '#1C1C27',
    position: 'relative',
  },
  puzzleButtonCompleted: {
    borderColor: '#22C55E',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  puzzleNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8888AA',
  },
  puzzleNumberCompleted: {
    color: '#F0F0F8',
  },
  checkmark: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
});
