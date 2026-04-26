# Ad Monetization Setup Guide

This guide will help you set up Google AdSense for your PuzzleEdge game.

## Overview

**Implemented Ad Strategy:**
- **Bottom Banner Ad**: Static sticky banner (always visible)
- **Interstitial Ads**: Fullscreen ads every 5 puzzles (with 7-minute minimum)
- **Rewarded Ads**: Users watch ad to earn hints (highest revenue)
- **GDPR Cookie Consent**: Required for AdSense approval

**Expected Revenue (per 100 daily active users):**
- Daily: $15-50
- Monthly: $450-1,500

## Step 1: Get Google AdSense Approval

### Prerequisites:
1. **Domain Requirements:**
   - Custom domain (not .vercel.app)
   - Domain must be 6+ months old for faster approval
   - HTTPS enabled (Vercel provides this free)

2. **Content Requirements:**
   - Original content (✅ you have 1,600 unique puzzles)
   - Privacy Policy page
   - About page
   - Contact page
   - At least 30 pages of content

3. **Traffic Requirements:**
   - No minimum, but 500+ daily visits helps
   - Quality traffic (not bots)

### Apply for AdSense:
1. Go to https://www.google.com/adsense
2. Sign up with your Google account
3. Add your website URL
4. Add AdSense code to your site (see Step 2)
5. Wait for approval (1-7 days typically)

**IMPORTANT:** Don't click your own ads! This will get you banned.

## Step 2: Add AdSense Script to Your Site

### Option A: Add to `app/_layout.tsx` (Recommended)

Add this to the `<Head>` section in `app/_layout.tsx`:

```tsx
import { Head } from 'expo-router';

<Head>
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
    crossOrigin="anonymous"
  />
</Head>
```

Replace `ca-pub-XXXXXXXXXXXXXXXX` with your AdSense publisher ID.

### Option B: Add to `index.html`

If using custom `index.html`, add the script to `<head>`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

## Step 3: Create Ad Units in AdSense

Once approved, create 3 ad units:

### 1. Banner Ad Unit (320x50 or responsive)
- Name: "PuzzleEdge Bottom Banner"
- Type: Display Ad
- Size: Responsive (recommended) or 320x50
- Copy the **ad slot ID** (e.g., "1234567890")

### 2. Interstitial Ad Unit
- Name: "PuzzleEdge Interstitial"
- Type: Display Ad
- Size: Responsive full-width
- Copy the **ad slot ID**

### 3. Rewarded Ad Unit
- Name: "PuzzleEdge Rewarded Video"
- Type: Display Ad
- Size: Responsive
- Copy the **ad slot ID**

## Step 4: Update Ad Component Configurations

### Update Ad Banner (`src/components/ads/AdBanner.tsx`):

Line 46:
```tsx
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with YOUR publisher ID
```

Line 47:
```tsx
data-ad-slot={adSlot} // You'll pass this as prop
```

### Update Ad Interstitial (`src/components/ads/AdInterstitial.tsx`):

Line 64:
```tsx
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with YOUR publisher ID
```

### Update Ad Rewarded (`src/components/ads/AdRewarded.tsx`):

Line 88:
```tsx
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with YOUR publisher ID
```

## Step 5: Integrate Ads into Your App

### A. Add Cookie Consent Banner

In `app/_layout.tsx`, import and add:

```tsx
import { CookieConsent } from '../src/components/ads';

export default function RootLayout() {
  return (
    <>
      {/* Your existing layout */}
      <Stack>...</Stack>

      {/* Cookie consent banner */}
      <CookieConsent />
    </>
  );
}
```

### B. Add Bottom Banner to Puzzle Pages

In `app/games/queens/puzzle.tsx`:

```tsx
import { AdBanner } from '../../../src/components/ads';

// At the bottom of your return statement, inside ScrollView:
<AdBanner adSlot="YOUR_BANNER_AD_SLOT_ID" style={styles.bottomAd} />

// Add to styles:
bottomAd: {
  marginTop: 32,
  marginBottom: 16,
}
```

### C. Add Interstitial Ads (every 5 puzzles)

See Step 6 for full implementation with frequency tracking.

### D. Replace Hint Button with Rewarded Ad

In `src/components/puzzles/QueensBoard.tsx`:

```tsx
import { AdRewarded } from '../ads';

// Add state:
const [showRewardedAd, setShowRewardedAd] = useState(false);

// Replace the hint button onClick:
const handleHintClick = () => {
  setShowRewardedAd(true);
};

// Handle reward (grant hint after watching ad):
const handleRewardGranted = () => {
  // Call existing hint logic
  handleHint();
};

// In JSX, add the rewarded ad component:
<AdRewarded
  visible={showRewardedAd}
  onClose={() => setShowRewardedAd(false)}
  onReward={handleRewardGranted}
  adSlot="YOUR_REWARDED_AD_SLOT_ID"
  rewardText="1 Hint"
/>
```

## Step 6: Implement Ad Frequency Tracking

To show interstitial ads every 5 puzzles (with 7-minute minimum):

### A. Update Game Store

Add to `src/store/gameStore.ts`:

```typescript
interface GameState {
  // ... existing state
  lastAdTimestamp: number;
  puzzlesSinceLastAd: number;
}

// Add actions:
shouldShowInterstitialAd: () => boolean;
recordAdShown: () => void;
recordPuzzleCompletion: () => void;

// Implement:
shouldShowInterstitialAd: () => {
  const state = get();
  const now = Date.now();
  const sevenMinutes = 7 * 60 * 1000;

  const timeSinceLastAd = now - state.lastAdTimestamp;
  const enoughTimePassed = timeSinceLastAd >= sevenMinutes;
  const enoughPuzzlesCompleted = state.puzzlesSinceLastAd >= 5;

  return enoughTimePassed && enoughPuzzlesCompleted;
},

recordAdShown: () => {
  set({
    lastAdTimestamp: Date.now(),
    puzzlesSinceLastAd: 0,
  });
},

recordPuzzleCompletion: () => {
  set((state) => ({
    puzzlesSinceLastAd: state.puzzlesSinceLastAd + 1,
  }));
},
```

### B. Use in Puzzle Completion

In `app/games/queens/puzzle.tsx`:

```tsx
import { AdInterstitial } from '../../../src/components/ads';
import { useGameStore } from '../../../src/store/gameStore';

const [showInterstitial, setShowInterstitial] = useState(false);
const shouldShowAd = useGameStore((s) => s.shouldShowInterstitialAd);
const recordAdShown = useGameStore((s) => s.recordAdShown);
const recordPuzzleCompletion = useGameStore((s) => s.recordPuzzleCompletion);

const handleComplete = (time: number) => {
  // ... existing completion logic

  // Track puzzle completion
  recordPuzzleCompletion();

  // Check if we should show interstitial ad
  if (shouldShowAd()) {
    // Delay ad by 1.5s to let user see score first
    setTimeout(() => {
      setShowInterstitial(true);
      recordAdShown();
    }, 1500);
  }
};

// In JSX:
<AdInterstitial
  visible={showInterstitial}
  onClose={() => setShowInterstitial(false)}
  adSlot="YOUR_INTERSTITIAL_AD_SLOT_ID"
/>
```

## Step 7: Testing

### Before Going Live:
1. **Test with test ads first** - Use AdSense test mode
2. **Never click your own ads** - Instant ban
3. **Test on different devices** - Mobile, tablet, desktop
4. **Check ad placement** - Ads shouldn't block gameplay
5. **Verify GDPR banner** - Shows on first visit

### AdSense Test Mode:
Add to ad components during testing:
```tsx
data-adtest="on"
```

Remove before going live!

## Step 8: Privacy Policy (Required)

Create `/app/privacy.tsx`:

Must include:
- What data you collect (cookies, analytics)
- How you use it (personalized ads)
- Third-party partners (Google AdSense)
- User rights (opt-out, data deletion)
- Contact information

Template: https://www.termsfeed.com/privacy-policy-generator/

## Step 9: Monitor Performance

### AdSense Dashboard:
- Daily earnings
- CPC/CPM rates
- Click-through rates
- Best-performing ad units

### Optimize:
- If banner CTR < 0.5%: try different sizes/positions
- If interstitial CTR < 3%: adjust frequency
- If rewarded ads underperforming: make reward more valuable

## Best Practices

✅ **DO:**
- Wait for full approval before going live
- Place ads where they don't interrupt gameplay
- Make rewarded ads opt-in (user choice)
- Show interstitial AFTER puzzle completion
- Test thoroughly
- Monitor performance weekly

❌ **DON'T:**
- Click your own ads (instant ban)
- Ask users to click ads
- Place too many ads (annoys users)
- Hide close buttons
- Force users to watch ads
- Use misleading ad placements

## Expected Timeline

- **Day 1**: Apply for AdSense
- **Days 2-7**: Wait for approval
- **Day 8**: Get approved, create ad units
- **Day 9**: Integrate ads, test
- **Day 10**: Deploy to production
- **Day 11**: Start earning!

## Revenue Expectations

### Conservative (100 DAU):
- Banner: $1-2/day
- Interstitial: $3-8/day
- Rewarded: $5-15/day
- **Total: $9-25/day = $270-750/month**

### Optimistic (100 DAU):
- Banner: $2-3/day
- Interstitial: $8-15/day
- Rewarded: $15-30/day
- **Total: $25-48/day = $750-1,440/month**

With 500 DAU: **$1,250-7,200/month**
With 1,000 DAU: **$2,500-14,400/month**

## Support

If you have issues:
1. Check AdSense Policy Center for violations
2. Verify ads load correctly (check browser console)
3. Ensure GDPR consent is working
4. Contact AdSense support (slow but helpful)

Good luck! 🚀
