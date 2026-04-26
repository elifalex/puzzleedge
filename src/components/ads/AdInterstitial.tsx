import { View, Text, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react-native';

interface AdInterstitialProps {
  visible: boolean;
  onClose: () => void;
  adSlot: string; // Your AdSense ad slot ID for interstitials
}

/**
 * Fullscreen Interstitial Ad Component
 * Shows between puzzle completions (every 5 puzzles)
 *
 * Best Practices:
 * - Show AFTER user sees completion feedback (1-2s delay)
 * - Respect minimum time between ads (7 minutes)
 * - Allow easy close after 5 seconds
 */
export function AdInterstitial({ visible, onClose, adSlot }: AdInterstitialProps) {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (visible) {
      setCanClose(false);
      setCountdown(5);

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Load ad if on web
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense interstitial error:', e);
          // If ad fails to load, allow immediate close
          setCanClose(true);
          setCountdown(0);
        }
      }

      return () => clearInterval(countdownInterval);
    }
  }, [visible]);

  // Only show ads on web
  if (Platform.OS !== 'web' || !visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={canClose ? onClose : undefined}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close button (only after countdown) */}
          {canClose ? (
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#F0F0F8" />
            </Pressable>
          ) : (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>Ad closes in {countdown}s</Text>
            </View>
          )}

          {/* Ad Content */}
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
              data-ad-client="ca-pub-6082551497006632"
              data-ad-slot={adSlot}
              data-ad-format="auto"
            />
          </View>
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
    padding: 16,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  countdownContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(79, 110, 247, 0.3)',
    borderRadius: 20,
  },
  countdownText: {
    color: '#F0F0F8',
    fontSize: 14,
    fontWeight: '600',
  },
  adContent: {
    minHeight: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
