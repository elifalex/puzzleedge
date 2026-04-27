import { View, StyleSheet, Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  adSlot: string; // Your AdSense ad slot ID
  style?: any;
}

/**
 * Sticky Bottom Banner Ad Component
 * Uses Google AdSense for web monetization
 */
export function AdBanner({ adSlot, style }: AdBannerProps) {
  const containerRef = useRef<any>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        // Create and inject the ad element directly into the DOM
        const adContainer = containerRef.current;
        if (adContainer && adContainer instanceof HTMLElement) {
          // Create the ins element
          const ins = document.createElement('ins');
          ins.className = 'adsbygoogle';
          ins.style.display = 'block';
          ins.setAttribute('data-ad-client', 'ca-pub-6082551497006632');
          ins.setAttribute('data-ad-slot', adSlot);
          ins.setAttribute('data-ad-format', 'auto');
          ins.setAttribute('data-full-width-responsive', 'true');

          // Clear any existing content and append the ins element
          adContainer.innerHTML = '';
          adContainer.appendChild(ins);

          // Push to AdSense
          setTimeout(() => {
            try {
              // @ts-ignore
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              console.log('[AdSense] Ad unit initialized:', adSlot);

              // Check if ad loaded successfully after a delay
              setTimeout(() => {
                if (ins.getAttribute('data-ad-status') === 'filled' || ins.offsetHeight > 0) {
                  setIsAdLoaded(true);
                  console.log('[AdSense] Ad loaded successfully');
                } else {
                  console.log('[AdSense] No ad served (pending approval or no fill)');
                }
              }, 1000);
            } catch (e) {
              console.error('[AdSense] Error initializing ad:', e);
            }
          }, 100);
        }
      } catch (e) {
        console.error('[AdSense] Error setting up ad container:', e);
      }
    }
  }, [adSlot]);

  // Only show ads on web
  if (Platform.OS !== 'web') {
    return null;
  }

  // Don't render container if no ad loaded (prevents empty space)
  if (!isAdLoaded && Platform.OS === 'web') {
    return (
      <View style={[styles.hiddenContainer, style]}>
        <div ref={containerRef} style={{ width: '100%', minHeight: '0px' }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <div ref={containerRef} style={{ width: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  hiddenContainer: {
    width: '100%',
    height: 0,
    overflow: 'hidden',
    opacity: 0,
  },
});
