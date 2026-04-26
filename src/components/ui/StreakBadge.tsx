import { View, Text, StyleSheet } from 'react-native';

interface StreakBadgeProps {
  current: number;
}

export function StreakBadge({ current }: StreakBadgeProps) {
  if (current === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={styles.text}>{current} day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  emoji: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
});
