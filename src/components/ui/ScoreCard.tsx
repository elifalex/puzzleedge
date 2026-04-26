import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { formatTime } from '../../hooks/useTimer';

interface ScoreCardProps {
  visible: boolean;
  time: number;
  streak?: number;
  onClose: () => void;
  onNext?: () => void;
  onShare?: () => void;
}

export function ScoreCard({ visible, time, streak, onClose, onNext, onShare }: ScoreCardProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Puzzle Complete! ✅</Text>

          <View style={styles.timeContainer}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.time}>{formatTime(time)}</Text>
          </View>

          {streak !== undefined && streak > 0 && (
            <View style={styles.streakContainer}>
              <Text style={styles.emoji}>🔥</Text>
              <Text style={styles.streakText}>{streak} day streak!</Text>
            </View>
          )}

          <View style={styles.buttons}>
            {onNext && (
              <Pressable style={styles.nextButton} onPress={onNext}>
                <Text style={styles.nextButtonText}>Next Puzzle</Text>
              </Pressable>
            )}

            {onShare && (
              <Pressable style={styles.shareButton} onPress={onShare}>
                <Text style={styles.shareButtonText}>Share Result</Text>
              </Pressable>
            )}

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: '#13131A',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F0F0F8',
    textAlign: 'center',
    marginBottom: 24,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#8888AA',
    marginBottom: 8,
  },
  time: {
    fontSize: 48,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#4F6EF7',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 9999,
    marginBottom: 24,
  },
  emoji: {
    fontSize: 24,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F59E0B',
  },
  buttons: {
    gap: 12,
  },
  nextButton: {
    backgroundColor: '#4F6EF7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#1C1C27',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  closeButtonText: {
    color: '#F0F0F8',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
