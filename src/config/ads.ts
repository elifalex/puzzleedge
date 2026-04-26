/**
 * Google AdSense Configuration
 *
 * AdSense Status: APPROVED ✅
 * Publisher ID: ca-pub-6082551497006632
 *
 * Ad Units:
 * - PuzzleEdge - Homepage Bottom Banner (3083377809)
 * - PuzzleEdge - Daily Queens Bottom Banner (6145174937)
 * - PuzzleEdge - Practice Queens Bottom Banner (4532190841)
 */

export const AD_CONFIG = {
  // Your AdSense publisher ID
  publisherId: 'ca-pub-6082551497006632',

  // Ad slot IDs from AdSense dashboard
  adSlots: {
    // Homepage banner ad - PuzzleEdge - Homepage Bottom Banner
    homeBanner: '3083377809',

    // Daily puzzle page banner - PuzzleEdge - Daily Queens Bottom Banner
    dailyPuzzleBanner: '6145174937',

    // Practice puzzle page banner - PuzzleEdge - Practice Queens Bottom Banner
    practicePuzzleBanner: '4532190841',

    // How to play page banner (not yet created)
    howToPlayBanner: '0000000000', // TODO: Create ad unit in AdSense
  },

  // Ad settings
  settings: {
    // Enable/disable ads globally (useful for testing)
    enabled: true,

    // Test mode disabled - showing real ads
    testMode: false,
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
