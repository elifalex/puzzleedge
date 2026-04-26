import { Text, View, StyleSheet } from 'react-native';
import { formatTime } from '../../hooks/useTimer';

interface TimerProps {
  elapsed: number;
  isPersonalBest?: boolean;
}

export function Timer({ elapsed, isPersonalBest }: TimerProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.time, isPersonalBest && styles.personalBest]}>
        {formatTime(elapsed)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  time: {
    fontSize: 32,
    fontFamily: 'monospace',
    textAlign: 'center',
    color: '#F0F0F8',
  },
  personalBest: {
    color: '#22C55E',
  },
});
