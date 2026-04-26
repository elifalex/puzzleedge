# Getting Started with PuzzleEdge

## ✅ App is Running!

Your PuzzleEdge development server is now running at:
**http://localhost:8082**

The app has successfully compiled (206 modules bundled in ~14 seconds).

---

## 🎮 What You Can Do Right Now

1. **Open your browser** to http://localhost:8082
2. **Navigate the app:**
   - Home page with PuzzleEdge branding
   - Click "Queens →" to go to Queens hub
   - Click "Daily Challenge" or "Unlimited Practice"
   - Navigate back using the "← Back" links

3. **Verify the foundation:**
   - Dark theme should be applied
   - Navigation should work smoothly
   - All pages load (showing placeholder content)

---

## 🔧 Development Commands

### Start the development server:
```bash
cd /Users/elifnazbozkurt/puzzleedge
npx expo start --web --port 8082
```

### Stop the server:
Press `Ctrl + C` in the terminal

### Clear cache and restart:
```bash
npx expo start --clear --web --port 8082
```

### Type checking:
```bash
npx tsc --noEmit
```

---

## 🐛 Known Warnings (Safe to Ignore)

You'll see these warnings - they're non-blocking:

**Package version warnings:**
- `@react-native-async-storage/async-storage@3.0.2` - We're using a newer version intentionally for better features
- `expo-clipboard@55.0.13` - Same reason

These won't affect functionality. If you want to suppress them:
```bash
npx expo install @react-native-async-storage/async-storage expo-clipboard
```

---

## 📝 Next Steps: Build the Interactive Experience

The foundation is complete! Now follow **IMPLEMENTATION_GUIDE.md** to add:

### Phase 1B: Interactive Game (12-18 hours)

**Priority order:**

1. **State Management** (Start here!)
   - File: `src/store/gameStore.ts`
   - File: `src/store/settingsStore.ts`
   - Copy code from IMPLEMENTATION_GUIDE.md
   - Test: Data should persist in browser localStorage

2. **Custom Hooks**
   - File: `src/hooks/useDailyPuzzle.ts`
   - File: `src/hooks/useTimer.ts`
   - File: `src/hooks/useStreak.ts`

3. **UI Components**
   - File: `src/components/ui/Timer.tsx`
   - File: `src/components/ui/DifficultyPicker.tsx`
   - File: `src/components/ui/StreakBadge.tsx`

4. **QueensBoard Component** ⚠️ **Most Complex**
   - File: `src/components/puzzles/QueensBoard.tsx`
   - This is the heart of the app - interactive grid
   - Takes 4-6 hours
   - Refer to detailed implementation in guide

5. **Complete the Pages**
   - Replace placeholder content in `app/games/queens/daily.tsx`
   - Replace placeholder content in `app/games/queens/practice.tsx`
   - Wire up all hooks and components

---

## 🎯 Quick Test Checklist

After implementing Phase 1B, verify:

- [ ] Can click cells to place/remove queens
- [ ] Invalid placements show visual feedback
- [ ] Timer counts up during daily mode
- [ ] Completing puzzle shows score
- [ ] Refreshing browser persists streak
- [ ] "New Puzzle" generates different puzzle
- [ ] Difficulty selector changes grid size
- [ ] Daily puzzle is same across browser refreshes (same seed)

---

## 🚀 What's Already Working

✅ **Expo Router** - File-based navigation
✅ **NativeWind** - Tailwind CSS styling
✅ **TypeScript** - Type safety and autocomplete
✅ **Dark Theme** - Professional color palette
✅ **Queens Engine** - Puzzle generation (fully functional!)
✅ **Navigation** - All routes defined and working

---

## 📚 Key Files Reference

**Documentation:**
- `README.md` — Project overview
- `IMPLEMENTATION_GUIDE.md` — Step-by-step build instructions
- `PROJECT_STATUS.md` — Feature completeness tracker
- `GETTING_STARTED.md` — This file

**Core Code:**
- `src/engines/queens.ts` — Puzzle generation engine (complete!)
- `src/constants/colors.ts` — Design system colors
- `src/constants/types.ts` — TypeScript interfaces
- `app/_layout.tsx` — Root navigation layout

**Pages (Placeholder - Need Completion):**
- `app/index.tsx` — Home page
- `app/games/queens/index.tsx` — Queens hub
- `app/games/queens/daily.tsx` — Daily challenge
- `app/games/queens/practice.tsx` — Practice mode

---

## 🔍 Troubleshooting

### App won't load in browser
- Check terminal for error messages
- Try clearing cache: `npx expo start --clear`
- Verify port 8082 isn't blocked by firewall

### Styles not applying
- Ensure `global.css` is imported in `app/_layout.tsx`
- Check `metro.config.js` has `withNativeWind`
- Restart Metro bundler

### TypeScript errors
- Run `npx tsc --noEmit` to see all type errors
- Most can be fixed with proper imports
- Check path aliases in `tsconfig.json`

### Queens engine throws errors
- Wrapped in try-catch with regeneration logic
- Check seed is valid integer
- Verify region generation (may need retry on edge cases)

---

## 💡 Pro Tips

1. **Hot Reload:** Save any file and browser auto-refreshes
2. **Console Logging:** Open browser DevTools to see logs
3. **React DevTools:** Install React DevTools extension for debugging
4. **Multiple Devices:** Access via `http://YOUR_LOCAL_IP:8082` on other devices
5. **Test Daily Sync:** Open app in two browser tabs - should show same daily puzzle

---

## 🎨 Design Guidelines

When building components, follow these patterns:

**Colors:**
```tsx
// Use Tailwind classes (defined in tailwind.config.js)
<View className="bg-background">
<Text className="text-textPrimary">
<Pressable className="bg-accent active:bg-accentHover">
```

**Spacing:**
```tsx
// Consistent spacing scale
className="p-4 gap-2"  // Small
className="p-6 gap-4"  // Medium
className="p-8 gap-6"  // Large
```

**Typography:**
```tsx
<Text className="font-display text-4xl">  // Headings
<Text className="font-ui text-base">      // Body text
<Text className="font-mono text-3xl">     // Timer/numbers
```

---

## 📊 Performance Tips

- **Lazy Load:** Import heavy engines only when needed
- **Memo:** Use `React.memo()` for QueensBoard component
- **Debounce:** Debounce rapid cell taps during gameplay
- **AsyncStorage:** Batch writes to reduce I/O

---

**You're ready to build! Start with Step 1 in IMPLEMENTATION_GUIDE.md** 🚀

Happy coding! If you get stuck, refer to the comprehensive examples in the guide.
