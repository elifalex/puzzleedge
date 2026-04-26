import { View, StyleSheet, Platform } from 'react-native';
import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot: string; // Your AdSense ad slot ID
  style?: any;
}

/**
 * Sticky Bottom Banner Ad Component
 * Uses Google AdSense for web monetization
 *
 * Setup:
 * 1. Get AdSense account approved
 * 2. Create ad unit and get ad slot ID
 * 3. Add AdSense script to app/_layout.tsx or index.html
 */
export function AdBanner({ adSlot, style }: AdBannerProps) {
  const adRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        // @ts-ignore - AdSense global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  // Only show ads on web
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={[styles.container, style]} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-client="ca-pub-6082551497006632"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
    maxHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#13131A',
  },
});
