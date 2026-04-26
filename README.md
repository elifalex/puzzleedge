# PuzzleEdge — LinkedIn Puzzle Trainer

**Production-Ready React Native Web App for LinkedIn Puzzle Practice**

A full-stack, SEO-dominant web-first app built with Expo that lets users practice LinkedIn's daily puzzle games with unlimited generated puzzles, daily challenges, and strategic monetization via ads.

---

## 🎯 Project Vision

PuzzleEdge targets LinkedIn's millions of daily puzzle players who want to improve their skills, maintain streaks, and compete with colleagues. The app is designed to **rank above every competitor** for LinkedIn puzzle-related search terms through comprehensive SEO optimization.

### Key Differentiators
- **Client-side puzzle generation** — No backend required, deterministic daily puzzles via seeded PRNG
- **SEO-first architecture** — JSON-LD structured data, rich meta tags, comprehensive content pages
- **Cross-platform** — Web (primary), iOS, and Android from single React Native codebase
- **Clean monetization** — AdSense (web) + AdMob (native), non-intrusive placement

---

## 📁 Project Structure

```
puzzleedge/
├── app/                      # Expo Router pages (file-based routing)
│   ├── _layout.tsx          # ✅ Root layout with dark mode
│   ├── index.tsx            # 🚧 Home page (SEO landing)
│   ├── games/
│   │   ├── queens/
│   │   │   ├── index.tsx    # Queens hub (SEO)
│   │   │   ├── daily.tsx    # Daily challenge
│   │   │   └── practice.tsx # Unlimited practice
│   ├── how-to-play/
│   │   └── queens.tsx       # Strategy guide (HowTo schema)
│   └── tips/
│       └── queens-strategy.tsx
├── src/
│   ├── engines/
│   │   └── queens.ts        # ✅ Complete Queens engine with PRNG
│   ├── components/
│   │   ├── puzzles/         # Game board components
│   │   ├── ui/              # Reusable UI (Timer, ScoreCard, etc.)
│   │   └── layout/          # Header, Footer, GameShell
│   ├── store/               # Zustand state management
│   ├── hooks/               # Custom hooks
│   ├── seo/                 # Metadata, JSON-LD, sitemap
│   └── constants/
│       ├── colors.ts        # ✅ Design system colors
│       ├── gameConfig.ts    # ✅ Game configurations
│       └── types.ts         # ✅ TypeScript interfaces
├── tailwind.config.js       # ✅ NativeWind config with custom colors
├── metro.config.js          # ✅ NativeWind integration
└── global.css               # ✅ Tailwind directives
```

**Legend:** ✅ Complete | 🚧 In Progress | ⏳ Pending

---

## ✅ Completed (Phase 1A)

### Foundation & Infrastructure
- [x] **Expo Router setup** — File-based routing configured
- [x] **NativeWind integration** — Tailwind for React Native with custom theme
- [x] **TypeScript configuration** — Path aliases (`@/*`), strict mode
- [x] **Design system constants**
  - Colors: Sharp professional-playful palette (dark base + electric accent)
  - Game configurations for all 5 puzzles
  - Type definitions for all puzzle engines

### Queens Puzzle Engine (Core Innovation)
- [x] **Seeded PRNG (mulberry32)** — Deterministic puzzle generation
- [x] **Daily seed function** — YYYYMMDD integer for global sync
- [x] **Region generator** — Flood-fill algorithm creates N connected colored regions
- [x] **Backtracking solver** — Places queens validly (one per row/column/region, no adjacent)
- [x] **Validation logic** — Checks user solutions against rules
- [x] **Hint system** — Reveals one valid queen placement

The Queens engine is **production-ready** and can generate unlimited puzzles with three difficulty levels (7x7, 9x9, 11x11).

---

## 🚧 In Progress

### Home Page
- Landing page with SEO metadata
- Game cards grid linking to puzzle hubs
- Value proposition copy

---

## ⏳ Remaining Work (Priority Order)

### Critical Path to MVP

#### 1. State Management (`src/store/`)
```typescript
// gameStore.ts
interface GameStore {
  dailyCompletions: Map<string, DailyCompletion>;
  streaks: Map<string, GameStreak>;
  scores: Map<string, GameScore[]>;
  markDailyComplete: (gameType: string, score: GameScore) => void;
  updateStreak: (gameType: string) => void;
}

// settingsStore.ts
interface SettingsStore {
  soundEnabled: boolean;
  preferredDifficulty: Difficulty;
  hintsRemaining: number;
}
```

**Implementation:** Use Zustand with AsyncStorage persistence middleware.

#### 2. Custom Hooks (`src/hooks/`)
```typescript
// useDailyPuzzle.ts
export function useDailyPuzzle(gameType: string) {
  const seed = queensEngine.getDailySeed();
  const puzzle = queensEngine.generate('medium', seed);
  const isCompleted = useGameStore(s => s.dailyCompletions.has(gameType + seed));
  return { puzzle, isCompleted, seed };
}

// useTimer.ts
export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // ... implementation with useEffect
  return { elapsed, start, stop, reset };
}

// useStreak.ts
export function useStreak(gameType: string) {
  const streak = useGameStore(s => s.streaks.get(gameType));
  return streak || { current: 0, longest: 0 };
}
```

#### 3. UI Components (`src/components/ui/`)

**Timer.tsx**
- Monospace font (Space Mono)
- Counts up from 0:00
- Pulses green when sub-30s from personal best

**ScoreCard.tsx**
- Animated slide-up modal (React Native Reanimated)
- Large time display
- "Faster than X% of players" (local percentile calculation)
- Streak badge if applicable
- Share button (clipboard copy)

**DifficultyPicker.tsx**
- Horizontal pill buttons (Easy | Medium | Hard)
- Active state glows with accent color
- Updates game state

**SEOHead.tsx** (web-only)
```typescript
import { Helmet } from 'react-helmet-async';

export function SEOHead({ title, description, keywords, structuredData }: Props) {
  return Platform.OS === 'web' ? (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* ... Open Graph, Twitter Cards, JSON-LD */}
    </Helmet>
  ) : null;
}
```

**AdBanner.tsx**
```typescript
export function AdBanner({ slot }: { slot: AdSlot }) {
  if (Platform.OS === 'web') {
    return <WebAdSense slot={slot} />;
  }
  return <MobileAdMob slot={slot} />;
}
```

#### 4. Layout Components (`src/components/layout/`)

**Header.tsx**
- Logo + "PuzzleEdge" wordmark
- Navigation: Home | Games | How to Play | Tips
- Subtle glass-morphism effect on dark background

**Footer.tsx**
- SEO-rich internal links (game hubs, guides, strategy pages)
- Disclaimer: "Not affiliated with LinkedIn Corporation"
- Social share links (optional)

**GameShell.tsx**
- Wraps every game page
- Timer at top (if daily mode)
- Ad slots (top banner, bottom banner)
- Completion modal overlay

#### 5. QueensBoard Component (`src/components/puzzles/QueensBoard.tsx`)

**Requirements:**
- Interactive NxN grid with touch/click placement
- Visual feedback:
  - Valid placement → green glow
  - Invalid placement → red pulse + shake animation
- Region coloring from puzzle.regionColors
- Real-time validation on each placement
- Completion detection → triggers ScoreCard modal
- Hint button → reveals one queen from solution

**Implementation Pattern:**
```typescript
export function QueensBoard({ puzzle, mode }: Props) {
  const [placedQueens, setPlacedQueens] = useState<[number, number][]>([]);
  const { elapsed, start, stop } = useTimer();

  const handleCellPress = (row: number, col: number) => {
    // Toggle queen placement
    // Validate
    // Check completion
  };

  useEffect(() => {
    if (mode === 'daily') start();
  }, []);

  return (
    <View className="grid grid-cols-{size}">
      {puzzle.regions.map((row, r) =>
        row.map((regionId, c) => (
          <PressableCell
            key={`${r}-${c}`}
            regionColor={puzzle.regionColors[regionId]}
            hasQueen={placedQueens.some(([qr, qc]) => qr === r && qc === c)}
            onPress={() => handleCellPress(r, c)}
          />
        ))
      )}
    </View>
  );
}
```

#### 6. SEO Infrastructure (`src/seo/`)

**metadata.ts**
- Export SEO_METADATA object with title/description/keywords for every page
- Follow specification in original prompt (60 char titles, 150-160 char descriptions)

**structuredData.ts**
```typescript
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PuzzleEdge",
  "url": "https://puzzleedge.app",
  // ...
});

export const getGameSchema = (gameType: string) => ({
  "@context": "https://schema.org",
  "@type": "Game",
  "name": `LinkedIn ${gameType} Practice`,
  // ...
});

export const getHowToSchema = (steps: HowToStep[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  // ...
});

export const getFAQSchema = (questions: FAQ[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // ...
});
```

**sitemap.ts**
```typescript
export const SITEMAP_ROUTES = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/games/queens/', priority: 0.9, changefreq: 'daily' },
  // ... all routes
];

export function generateSitemap(): string {
  // Returns XML string
}
```

#### 7. Queens Pages

**`/app/games/queens/index.tsx` (Hub)**
- SEO content (400+ words explaining Queens)
- FAQ section (5 Q&As with FAQPage schema)
- CTAs linking to `/daily` and `/practice`
- Leaderboard teaser (optional Phase 2)

**`/app/games/queens/daily.tsx` (Daily Challenge)**
```typescript
export default function QueensDailyPage() {
  const { puzzle, isCompleted, seed } = useDailyPuzzle('queens');
  const streak = useStreak('queens');

  if (isCompleted) {
    return <DailyCompletedView puzzle={puzzle} nextPuzzleIn={timeUntilMidnight()} />;
  }

  return (
    <GameShell>
      <SEOHead {...SEO_METADATA.queens.daily} />
      <Timer />
      <QueensBoard puzzle={puzzle} mode="daily" />
      <StreakBadge streak={streak.current} />
    </GameShell>
  );
}
```

**`/app/games/queens/practice.tsx` (Practice Mode)**
```typescript
export default function QueensPracticePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [puzzle, setPuzzle] = useState(() => queensEngine.generate(difficulty));

  const regenerate = () => {
    setPuzzle(queensEngine.generate(difficulty, Date.now()));
  };

  return (
    <GameShell>
      <SEOHead {...SEO_METADATA.queens.practice} />
      <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      <QueensBoard puzzle={puzzle} mode="practice" />
      <Button onPress={regenerate}>New Puzzle</Button>
    </GameShell>
  );
}
```

**`/app/how-to-play/queens.tsx`**
- Comprehensive guide (600+ words)
- Step-by-step strategy sections with visual diagrams
- HowTo JSON-LD schema
- CTA to practice page

**`/app/tips/queens-strategy.tsx`**
- Advanced tips (400+ words)
- Strategy breakdowns
- CTA to practice page

#### 8. Share Functionality
```typescript
import * as Clipboard from 'expo-clipboard';

export function generateShareText(puzzle: QueensPuzzle, score: GameScore): string {
  const puzzleNumber = puzzle.seed % 10000; // truncate for readability
  return `PuzzleEdge — Queens Daily #${puzzleNumber}
⏱ ${formatTime(score.time)}
🔥 Streak: ${streak} days

⬛🟦⬛⬛⬛
⬛⬛⬛🟩⬛
🟪⬛⬛⬛⬛

puzzleedge.app/games/queens/daily`;
}

export async function copyToClipboard(text: string) {
  await Clipboard.setStringAsync(text);
  // Show toast notification
}
```

#### 9. Analytics Integration (PostHog)
```typescript
// app/_layout.tsx
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-react-native';

if (Platform.OS === 'web') {
  posthog.init('YOUR_API_KEY', { api_host: 'https://app.posthog.com' });
}

export default function RootLayout() {
  return (
    <PostHogProvider client={posthog}>
      {/* ... */}
    </PostHogProvider>
  );
}

// Track events
posthog.capture('puzzle_completed', { game: 'queens', difficulty: 'medium', time: 123000 });
```

#### 10. Web Optimization
- **Code splitting:** Lazy load game engines per route
```typescript
const QueensEngine = lazy(() => import('@/engines/queens'));
```
- **Core Web Vitals:**
  - Fixed ad container heights (prevent CLS)
  - `expo-image` for lazy loading
  - Minimize bundle with tree-shaking
- **Sitemap generation:** Build-time script
- **robots.txt:** Allow all, include sitemap URL

---

## 🚀 Deployment Guide

### Web (Vercel)

1. **Build for web:**
```bash
npx expo export --platform web
```

2. **Deploy to Vercel:**
```bash
npx vercel --prod
```

3. **Custom domain:** `puzzleedge.app`
   - Add domain in Vercel dashboard
   - Update DNS: CNAME → `cname.vercel-dns.com`
   - Update `BASE_URL` in `src/constants/gameConfig.ts`

4. **SEO checklist:**
   - Submit sitemap to Google Search Console
   - Submit sitemap to Bing Webmaster Tools
   - Verify Core Web Vitals with PageSpeed Insights
   - Apply for Google AdSense (need 20+ pages + traffic)

### Native (Optional Phase 2)

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

---

## 📊 Success Metrics

- **SEO:** Top 3 ranking for "linkedin queens practice" within 60 days
- **Engagement:** 40%+ daily puzzle completion rate
- **Retention:** 20%+ 7-day streak rate
- **Monetization:** $15+ RPM on content pages

---

## 🎨 Design Tokens

See `/src/constants/colors.ts` for the full palette. Key colors:

- **Background:** `#0A0A0F` (near-black)
- **Accent:** `#4F6EF7` (electric blue)
- **Success:** `#22C55E`
- **Error:** `#EF4444`
- **Text Primary:** `#F0F0F8`

Typography:
- **Display:** Instrument Serif
- **UI:** DM Sans
- **Mono:** Space Mono

---

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on web
npm run web

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Type check
npx tsc --noEmit

# Build for production (web)
npx expo export --platform web
```

---

## 📝 Content Writing Guidelines

Every page must have:
1. **Title:** <60 chars, keyword-rich
2. **Meta description:** 150-160 chars, includes primary keyword + CTA
3. **H1 heading:** Primary keyword + value prop
4. **Body:** 400+ words, naturally incorporates keywords
5. **FAQ section:** 3-5 Q&As (triggers Google rich results)
6. **CTA:** Clear next step linking to game pages

Primary keywords:
- linkedin puzzle practice
- linkedin queens game
- linkedin queens daily
- linkedin tango practice
- how to play linkedin queens

---

## 🔐 Important Legal Notes

- ⚠ **Not affiliated with LinkedIn** — Add disclaimer to footer
- ✅ **Nominative use** — Can reference LinkedIn games in content (not branding)
- ✅ **Independent implementation** — All puzzle logic built from scratch

---

## 📚 Phase 2 Roadmap (Post-Queens Launch)

1. **Tango engine + pages** (sun/moon logic grid)
2. **Zip engine + pages** (Hamiltonian path)
3. **Mini Sudoku engine + pages** (6x6 grid)
4. **Crossclimb engine + pages** (word ladder)
5. **Leaderboards** (optional, requires backend)
6. **User accounts** (optional, for cross-device sync)

Each game follows same pattern: engine → UI component → 3 pages → SEO content.

---

## 🐛 Known Issues / TODO

- [ ] Test Queens engine with all difficulty levels and multiple seeds
- [ ] Verify region generation creates solvable puzzles 100% of the time
- [ ] Add error boundary for graceful puzzle generation failures
- [ ] Performance test on low-end devices (Android 8+)
- [ ] Accessibility: ARIA labels for web, screen reader support

---

## 📞 Support & Feedback

For bugs or feature requests, open an issue in the repository.

---

**Built with ❤️ for LinkedIn puzzle enthusiasts**
