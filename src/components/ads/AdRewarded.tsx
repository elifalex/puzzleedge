import { View, Text, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { X, Play } from 'lucide-react-native';

interface AdRewardedProps {
  visible: boolean;
  onClose: () => void;
  onReward: () => void; // Called when user earns the reward (watched ad)
  adSlot: string;
  rewardText?: string; // e.g., "1 Hint"
}

/**
 * Rewarded Ad Component
 * User watches ad to earn reward (hint, skip ad, etc.)
 *
 * Highest CPM (~$20-30 per 1000 views)
 * Best monetization: 30-40% of users voluntarily watch
 *
 * Usage:
 * - Offer hint in exchange for watching ad
 * - User opts in (not forced)
 * - Only grant reward after ad completes
 */
export function AdRewarded({ visible, onClose, onReward, adSlot, rewardText = '1 Hint' }: AdRewardedProps) {
  const [adWatched, setAdWatched] = useState(false);
  const [watching, setWatching] = useState(false);
  const [watchCountdown, setWatchCountdown] = useState(30); // Typical video ad duration

  useEffect(() => {
    if (visible) {
      setAdWatched(false);
      setWatching(false);
      setWatchCountdown(30);
    }
  }, [visible]);

  const handleStartWatching = () => {
    setWatching(true);

    // Simulate video ad countdown (in production, this would be real ad duration)
    const countdownInterval = setInterval(() => {
      setWatchCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Ad completed - grant reward
          setAdWatched(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Load rewarded ad
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense rewarded error:', e);
      }
    }
  };

  const handleClaim = () => {
    onReward();
    onClose();
  };

  if (Platform.OS !== 'web' || !visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close button */}
          {!watching && (
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#F0F0F8" />
            </Pressable>
          )}

          {!watching && !adWatched ? (
            // Initial prompt
            <>
              <Text style={styles.title}>Watch Ad to Earn Reward</Text>
              <Text style={styles.subtitle}>
                Watch a short ad to unlock {rewardText}
              </Text>

              <View style={styles.rewardBadge}>
                <Text style={styles.rewardText}>🎁 {rewardText}</Text>
              </View>

              <Pressable style={styles.watchButton} onPress={handleStartWatching}>
                <Play size={20} color="#0A0A0F" />
                <Text style={styles.watchButtonText}>Watch Ad (30s)</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </>
          ) : watching && !adWatched ? (
            // Watching ad
            <>
              <View style={styles.watchingContainer}>
                <Text style={styles.watchingText}>
                  Ad playing... {watchCountdown}s remaining
                </Text>

                {/* Ad content */}
                <View style={styles.adContent}>
                  <ins
                    className="adsbygoogle"
                    style={{
                      display: 'block',
                      minWidth: 300,
                      maxWidth: 600,
                      width: '100%',
                      height: 400,
                    }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
                    data-ad-slot={adSlot}
                    data-ad-format="auto"
                  />
                </View>
              </View>
            </>
          ) : (
            // Ad completed - claim reward
            <>
              <Text style={styles.title}>🎉 Reward Earned!</Text>
              <Text style={styles.subtitle}>
                Thank you for watching! Claim your reward:
              </Text>

              <View style={styles.rewardBadge}>
                <Text style={styles.rewardText}>🎁 {rewardText}</Text>
              </View>

              <Pressable style={styles.claimButton} onPress={handleClaim}>
                <Text style={styles.claimButtonText}>Claim {rewardText}</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: '#13131A',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8888AA',
    marginBottom: 24,
    textAlign: 'center',
  },
  rewardBadge: {
    backgroundColor: 'rgba(79, 110, 247, 0.2)',
    borderWidth: 2,
    borderColor: '#4F6EF7',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  rewardText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0F0F8',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F6EF7',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  watchButtonText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#8888AA',
    fontSize: 14,
  },
  watchingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  watchingText: {
    fontSize: 16,
    color: '#F0F0F8',
    marginBottom: 16,
    fontWeight: '600',
  },
  adContent: {
    minHeight: 400,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  claimButtonText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '700',
  },
});
