/**
 * Google AdSense Configuration
 *
 * IMPORTANT: Update these ad slot IDs after AdSense approval
 *
 * Steps to get your ad slot IDs:
 * 1. Log into Google AdSense dashboard
 * 2. Go to Ads → By ad unit
 * 3. Click "+ New ad unit"
 * 4. Create display ads for each placement below
 * 5. Copy the data-ad-slot values here
 */

export const AD_CONFIG = {
  // Your AdSense publisher ID
  publisherId: 'ca-pub-6082551497006632',

  // Ad slot IDs - update these after creating ad units in AdSense
  adSlots: {
    // Homepage banner ad
    homeBanner: '0000000000', // TODO: Replace with real ad slot ID

    // Daily puzzle page banner (sticky bottom)
    dailyPuzzleBanner: '1111111111', // TODO: Replace with real ad slot ID

    // Practice puzzle page banner (sticky bottom)
    practicePuzzleBanner: '2222222222', // TODO: Replace with real ad slot ID

    // How to play page banner
    howToPlayBanner: '3333333333', // TODO: Replace with real ad slot ID
  },

  // Ad settings
  settings: {
    // Enable/disable ads globally (useful for testing)
    enabled: true,

    // Show test ads (will show placeholder/test ads before approval)
    testMode: true, // Set to false after AdSense approval
  }
} as const;

/**
 * Helper to get ad slot ID by placement
 */
export function getAdSlot(placement: keyof typeof AD_CONFIG.adSlots): string {
  return AD_CONFIG.adSlots[placement];
}

/**
 * Check if ads are enabled
 */
export function areAdsEnabled(): boolean {
  return AD_CONFIG.settings.enabled;
}
