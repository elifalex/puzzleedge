import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

/**
 * GDPR Cookie Consent Banner
 * Required for Google AdSense approval and EU compliance
 *
 * Shows banner on first visit
 * Saves consent to AsyncStorage
 * Must appear BEFORE ads load
 */
export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = async () => {
    try {
      const consent = await AsyncStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Failed to check cookie consent:', error);
    }
  };

  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem(COOKIE_CONSENT_KEY, 'true');
      setShowBanner(false);
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    }
  };

  // Only show on web
  if (Platform.OS !== 'web' || !showBanner) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>🍪 We use cookies</Text>
          <Text style={styles.description}>
            We use cookies and similar technologies to provide personalized ads and analyze traffic. By clicking "Accept", you consent to our use of cookies.
          </Text>
        </View>

        <View style={styles.buttons}>
          <Pressable style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'fixed' as any,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C27',
    borderTopWidth: 1,
    borderTopColor: '#4F6EF7',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  textContainer: {
    flex: 1,
    minWidth: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#8888AA',
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#4F6EF7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '700',
  },
});
