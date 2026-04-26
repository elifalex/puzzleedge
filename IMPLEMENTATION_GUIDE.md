# PuzzleEdge Implementation Guide

## Current Status: Foundation Complete ✅

The project foundation is fully set up with:
- Expo Router + TypeScript + NativeWind
- Complete Queens puzzle engine with deterministic generation
- Design system constants and color palette
- Basic navigation structure and placeholder pages

**Next:** Implement the interactive game experience.

---

## Phase 1B: Complete Queens MVP (Estimated: 2-3 days)

### Step 1: State Management (2-3 hours)

#### File: `src/store/gameStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameScore, GameStreak, DailyCompletion } from '../constants/types';

interface GameStore {
  dailyCompletions: Record<string, DailyCompletion>;
  streaks: Record<string, GameStreak>;
  scores: Record<string, GameScore[]>;

  // Actions
  markDailyComplete: (gameType: string, date: string, score: GameScore) => void;
  updateStreak: (gameType: string) => void;
  addScore: (gameType: string, score: GameScore) => void;
  getDailyCompletion: (gameType: string, date: string) => DailyCompletion | null;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      dailyCompletions: {},
      streaks: {},
      scores: {},

      markDailyComplete: (gameType, date, score) => {
        set((state) => ({
          dailyCompletions: {
            ...state.dailyCompletions,
            [`${gameType}-${date}`]: {
              gameType,
              date,
              completed: true,
              score,
            },
          },
        }));
        get().updateStreak(gameType);
      },

      updateStreak: (gameType) => {
        const currentStreak = get().streaks[gameType] || { current: 0, longest: 0, lastPlayed: '' };
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let newCurrent = 1;
        if (currentStreak.lastPlayed === yesterday) {
          newCurrent = currentStreak.current + 1;
        } else if (currentStreak.lastPlayed === today) {
          newCurrent = currentStreak.current;
        }

        set((state) => ({
          streaks: {
            ...state.streaks,
            [gameType]: {
              current: newCurrent,
              longest: Math.max(newCurrent, currentStreak.longest),
              lastPlayed: today,
            },
          },
        }));
      },

      addScore: (gameType, score) => {
        set((state) => ({
          scores: {
            ...state.scores,
            [gameType]: [...(state.scores[gameType] || []), score],
          },
        }));
      },

      getDailyCompletion: (gameType, date) => {
        return get().dailyCompletions[`${gameType}-${date}`] || null;
      },
    }),
    {
      name: 'puzzleedge-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

#### File: `src/store/settingsStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from '../constants/gameConfig';

interface SettingsStore {
  soundEnabled: boolean;
  preferredDifficulty: Difficulty;
  hintsRemaining: Record<string, number>;

  setSoundEnabled: (enabled: boolean) => void;
  setPreferredDifficulty: (difficulty: Difficulty) => void;
  useHint: (gameType: string) => void;
  resetHints: (gameType: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      preferredDifficulty: 'medium',
      hintsRemaining: {},

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setPreferredDifficulty: (difficulty) => set({ preferredDifficulty: difficulty }),

      useHint: (gameType) => {
        set((state) => ({
          hintsRemaining: {
            ...state.hintsRemaining,
            [gameType]: Math.max(0, (state.hintsRemaining[gameType] || 3) - 1),
          },
        }));
      },

      resetHints: (gameType) => {
        set((state) => ({
          hintsRemaining: {
            ...state.hintsRemaining,
            [gameType]: 3,
          },
        }));
      },
    }),
    {
      name: 'puzzleedge-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Step 2: Custom Hooks (1-2 hours)

#### File: `src/hooks/useDailyPuzzle.ts`

```typescript
import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { queensEngine } from '../engines/queens';

export function useDailyPuzzle(gameType: 'queens') {
  const getDailyCompletion = useGameStore((s) => s.getDailyCompletion);

  const puzzle = useMemo(() => {
    const seed = queensEngine.getDailySeed();
    return queensEngine.generate('medium', seed);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const completion = getDailyCompletion(gameType, today);

  return {
    puzzle,
    isCompleted: !!completion,
    completion,
    seed: puzzle.seed,
  };
}
```

#### File: `src/hooks/useTimer.ts`

```typescript
import { useState, useEffect, useRef } from 'react';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setElapsed(0);
    setIsRunning(false);
  };

  return { elapsed, isRunning, start, stop, reset };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const deciseconds = Math.floor((ms % 1000) / 100);

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${deciseconds}`;
}
```

#### File: `src/hooks/useStreak.ts`

```typescript
import { useGameStore } from '../store/gameStore';

export function useStreak(gameType: string) {
  const streak = useGameStore((s) => s.streaks[gameType]);

  return {
    current: streak?.current || 0,
    longest: streak?.longest || 0,
    lastPlayed: streak?.lastPlayed,
  };
}
```

### Step 3: UI Components (3-4 hours)

#### File: `src/components/ui/Timer.tsx`

```typescript
import { Text, View } from 'react-native';
import { formatTime } from '../../hooks/useTimer';

interface TimerProps {
  elapsed: number;
  isPersonalBest?: boolean;
}

export function Timer({ elapsed, isPersonalBest }: TimerProps) {
  return (
    <View className={`py-2 ${isPersonalBest ? 'animate-pulse' : ''}`}>
      <Text className={`text-3xl font-mono text-center ${isPersonalBest ? 'text-success' : 'text-textPrimary'}`}>
        {formatTime(elapsed)}
      </Text>
    </View>
  );
}
```

#### File: `src/components/ui/DifficultyPicker.tsx`

```typescript
import { View, Text, Pressable } from 'react-native';
import { Difficulty } from '../../constants/gameConfig';

interface DifficultyPickerProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <View className="flex-row gap-2 justify-center mb-4">
      {DIFFICULTIES.map((diff) => (
        <Pressable
          key={diff}
          onPress={() => onChange(diff)}
          className={`px-6 py-3 rounded-full border ${
            value === diff
              ? 'bg-accent border-accent'
              : 'bg-surface border-border'
          }`}
        >
          <Text
            className={`font-ui font-semibold capitalize ${
              value === diff ? 'text-background' : 'text-textSecondary'
            }`}
          >
            {diff}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
```

#### File: `src/components/ui/StreakBadge.tsx`

```typescript
import { View, Text } from 'react-native';

interface StreakBadgeProps {
  current: number;
}

export function StreakBadge({ current }: StreakBadgeProps) {
  if (current === 0) return null;

  return (
    <View className="flex-row items-center gap-2 bg-warning/20 px-4 py-2 rounded-full">
      <Text className="text-2xl">🔥</Text>
      <Text className="text-lg font-ui font-semibold text-warning">
        {current} day streak
      </Text>
    </View>
  );
}
```

### Step 4: QueensBoard Component (4-6 hours) — CRITICAL

This is the most complex UI component. Take your time with this.

#### File: `src/components/puzzles/QueensBoard.tsx`

```typescript
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { QueensPuzzle } from '../../constants/types';
import { queensEngine } from '../../engines/queens';
import { useTimer, formatTime } from '../../hooks/useTimer';
import { Timer } from '../ui/Timer';

interface QueensBoardProps {
  puzzle: QueensPuzzle;
  mode: 'daily' | 'practice';
  onComplete?: (time: number) => void;
}

export function QueensBoard({ puzzle, mode, onComplete }: QueensBoardProps) {
  const [placedQueens, setPlacedQueens] = useState<[number, number][]>([]);
  const [invalidCell, setInvalidCell] = useState<[number, number] | null>(null);
  const { elapsed, start, stop } = useTimer();

  useEffect(() => {
    if (mode === 'daily') {
      start();
    }
  }, [mode]);

  const handleCellPress = (row: number, col: number) => {
    // Check if queen already placed here
    const existingIndex = placedQueens.findIndex(([r, c]) => r === row && c === col);

    if (existingIndex !== -1) {
      // Remove queen
      setPlacedQueens((prev) => prev.filter((_, i) => i !== existingIndex));
      setInvalidCell(null);
      return;
    }

    // Check if placement is valid
    const newQueens = [...placedQueens, [row, col] as [number, number]];
    const tempPuzzle = { ...puzzle, solution: newQueens };
    const validation = queensEngine.validate(puzzle, tempPuzzle);

    if (!validation.isValid) {
      // Show error feedback
      setInvalidCell([row, col]);
      setTimeout(() => setInvalidCell(null), 500);
      return;
    }

    setPlacedQueens(newQueens);

    // Check if puzzle is complete
    if (newQueens.length === puzzle.size) {
      stop();
      onComplete?.(elapsed);
    }
  };

  const cellSize = Math.floor((Dimensions.get('window').width - 64) / puzzle.size);

  return (
    <View className="items-center">
      {mode === 'daily' && <Timer elapsed={elapsed} />}

      <View className="p-4">
        {puzzle.regions.map((row, r) => (
          <View key={r} className="flex-row">
            {row.map((regionId, c) => {
              const hasQueen = placedQueens.some(([qr, qc]) => qr === r && qc === c);
              const isInvalid = invalidCell?.[0] === r && invalidCell?.[1] === c;

              return (
                <Pressable
                  key={`${r}-${c}`}
                  onPress={() => handleCellPress(r, c)}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: puzzle.regionColors[regionId],
                  }}
                  className={`border border-border/30 items-center justify-center ${
                    isInvalid ? 'animate-pulse bg-error' : ''
                  } ${hasQueen ? 'bg-success/30' : ''}`}
                >
                  {hasQueen && (
                    <Text className="text-2xl">👑</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View className="mt-4">
        <Text className="text-center font-ui text-textSecondary">
          {placedQueens.length} / {puzzle.size} queens placed
        </Text>
      </View>
    </View>
  );
}
```

### Step 5: Complete Daily & Practice Pages (2-3 hours)

Replace placeholders with fully functional pages:

#### File: `app/games/queens/practice.tsx` (REPLACE)

```typescript
import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { queensEngine } from '../../../src/engines/queens';
import { QueensBoard } from '../../../src/components/puzzles/QueensBoard';
import { DifficultyPicker } from '../../../src/components/ui/DifficultyPicker';
import { Difficulty } from '../../../src/constants/gameConfig';

export default function QueensPracticePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [puzzle, setPuzzle] = useState(() => queensEngine.generate(difficulty));

  const regenerate = () => {
    setPuzzle(queensEngine.generate(difficulty, Date.now()));
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setPuzzle(queensEngine.generate(newDifficulty, Date.now()));
  };

  return (
    <View className="flex-1 bg-background">
      <View className="p-8">
        <Link href="/games/queens">
          <Text className="text-accent mb-8">← Back</Text>
        </Link>

        <Text className="text-3xl font-display text-textPrimary text-center mb-8">
          Queens Practice
        </Text>

        <DifficultyPicker value={difficulty} onChange={handleDifficultyChange} />

        <QueensBoard puzzle={puzzle} mode="practice" />

        <Pressable
          onPress={regenerate}
          className="mt-8 bg-accent px-6 py-3 rounded-lg active:bg-accentHover"
        >
          <Text className="text-center text-background font-ui font-semibold">
            New Puzzle
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
```

#### File: `app/games/queens/daily.tsx` (REPLACE)

```typescript
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useDailyPuzzle } from '../../../src/hooks/useDailyPuzzle';
import { useStreak } from '../../../src/hooks/useStreak';
import { QueensBoard } from '../../../src/components/puzzles/QueensBoard';
import { StreakBadge } from '../../../src/components/ui/StreakBadge';
import { useGameStore } from '../../../src/store/gameStore';

export default function QueensDailyPage() {
  const { puzzle, isCompleted } = useDailyPuzzle('queens');
  const streak = useStreak('queens');
  const markDailyComplete = useGameStore((s) => s.markDailyComplete);

  const handleComplete = (time: number) => {
    const today = new Date().toISOString().split('T')[0];
    markDailyComplete('queens', today, {
      time,
      hintsUsed: 0,
      completed: true,
      date: today,
    });
  };

  if (isCompleted) {
    return (
      <View className="flex-1 bg-background p-8 items-center justify-center">
        <Text className="text-3xl font-display text-textPrimary mb-4">
          Completed! ✅
        </Text>
        <Text className="text-lg font-ui text-textSecondary text-center">
          Come back tomorrow for a new daily puzzle
        </Text>
        <Link href="/games/queens/practice" className="mt-8">
          <Text className="text-accent font-ui">
            Try Practice Mode →
          </Text>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="p-8">
        <Link href="/games/queens">
          <Text className="text-accent mb-8">← Back</Text>
        </Link>

        <Text className="text-3xl font-display text-textPrimary text-center mb-4">
          Today's Queens Puzzle
        </Text>

        <View className="items-center mb-4">
          <StreakBadge current={streak.current} />
        </View>

        <QueensBoard puzzle={puzzle} mode="daily" onComplete={handleComplete} />
      </View>
    </View>
  );
}
```

### Step 6: Test & Debug (1-2 hours)

1. Run `npm run web`
2. Test all flows:
   - Navigate from home → queens hub → daily/practice
   - Place queens on grid
   - Complete puzzle
   - Check streak persists across refreshes
3. Fix any bugs

---

## Phase 2: SEO & Content (Estimated: 1-2 days)

### Step 1: SEO Infrastructure

#### File: `src/seo/metadata.ts` — See original spec for complete object

#### File: `src/seo/structuredData.ts` — See README for schema examples

#### File: `src/components/ui/SEOHead.tsx`

### Step 2: Content Pages

Write ~400-600 words of SEO-optimized content for:
- Queens hub page
- How-to-play page
- Strategy tips page

### Step 3: Sitemap & robots.txt

Generate at build time, submit to Google Search Console.

---

## Phase 3: Polish & Launch (Estimated: 1 day)

1. Add AdBanner stubs
2. Integrate PostHog
3. Implement share functionality
4. Optimize bundle size
5. Deploy to Vercel
6. Launch! 🚀

---

## Troubleshooting

### "Cannot find module" errors
- Ensure path aliases in `tsconfig.json` match imports
- Restart Metro bundler: `npm start -- --reset-cache`

### NativeWind not working
- Check `metro.config.js` includes `withNativeWind`
- Verify `global.css` is imported in `app/_layout.tsx`
- Clear Metro cache

### Queens engine errors
- Check seed value is valid integer
- Verify region generation doesn't fail (add try-catch with regeneration)
- Test with different difficulty levels

---

## Quick Reference: File Checklist

**Core Files (Completed)**
- [x] Queens engine
- [x] Design constants
- [x] Type definitions
- [x] Navigation structure

**Next Up**
- [ ] `src/store/gameStore.ts`
- [ ] `src/store/settingsStore.ts`
- [ ] `src/hooks/useDailyPuzzle.ts`
- [ ] `src/hooks/useTimer.ts`
- [ ] `src/hooks/useStreak.ts`
- [ ] `src/components/ui/Timer.tsx`
- [ ] `src/components/ui/DifficultyPicker.tsx`
- [ ] `src/components/ui/StreakBadge.tsx`
- [ ] `src/components/puzzles/QueensBoard.tsx` ⚠️ MOST COMPLEX
- [ ] `app/games/queens/practice.tsx` (full version)
- [ ] `app/games/queens/daily.tsx` (full version)

**Phase 2**
- [ ] SEO metadata
- [ ] Content writing
- [ ] JSON-LD schemas

**Phase 3**
- [ ] Ads integration
- [ ] Analytics
- [ ] Share function
- [ ] Deployment

---

Good luck! You've got a solid foundation. Focus on getting the QueensBoard working first — that's 80% of the user experience.
