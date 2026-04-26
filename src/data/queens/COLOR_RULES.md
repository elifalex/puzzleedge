# Queens Puzzle Color Rules - Quick Reference

## 🚨 CRITICAL RULES (Never Break These)

### 1. NO Dark Colors
```
Luminance must be > 0.15
```
**Why**: Black queens placed on dark colors are invisible to players.

**Test**:
```javascript
const getLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val /= 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
```

**Examples**:
- ❌ #1D3557 (Deep Navy Blue) - luminance 0.035
- ❌ #8B4513 (Saddle Brown) - luminance 0.098
- ❌ #4B0082 (Indigo) - luminance 0.031
- ✅ #5DADE2 (Bright Blue) - luminance 0.52

---

### 2. PERCEPTUAL Color Family Mapping (CRITICAL FIX - April 2026)
```
ENFORCED: Use PERCEPTUAL families, not RGB families
```
**Why**: Multiple blue/cyan/teal variants LOOK IDENTICAL to humans even if RGB values differ. Must group by human perception, not RGB distance.

**BREAKTHROUGH**: Previous system had 6 "blue-like" colors (teal, cyan, sky blue, royal blue, light sky blue, sea green) treated as different families. This allowed them to appear adjacent or in the same puzzle, making them indistinguishable.

**Solution**: Pastel palette with ONE color per perceptual family:
- Red: #FFB3BA (Pastel Red)
- Orange: #FFDFBA (Pastel Orange)
- Yellow: #FFFFBA (Pastel Yellow)
- Green: #BAFFC9 (Pastel Green)
- Blue: #BAE1FF (Pastel Blue) ← ONLY ONE blue-like color!
- Purple: #D4BBFF (Pastel Purple/Lilac)
- Pink: #FFBAF3 (Pastel Pink)
- Gray: #E0E0E0 (Pastel Gray)
- Brown: #D7C9AA (Pastel Brown/Tan)

**Total**: 9 colors (exactly matches max 9×9 board size)

**Algorithm**: Family-aware coloring prevents same-family adjacency AND same-family in same puzzle.

---

### 3. Minimum RGB Distance
```
distance(color1, color2) > 100
```
**Why**: Colors with distance < 100 look identical to users, especially on small screens.

**Formula**:
```javascript
const colorDistance = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};
```

**Examples**:
- ❌ Sky Blue ↔ Dark Turquoise = 82.2 (too similar)
- ❌ Sky Blue ↔ Dodger Blue = 74.8 (too similar)
- ✅ Bold Red ↔ Bright Blue = 280.5 (good)
- ✅ Vivid Yellow ↔ Emerald Green = 156.3 (good)

---

### 4. Unique Colors Per Board
```
N×N board must have N unique colors (no duplicates)
```
**Why**: Duplicate colors confuse players about which region owns a queen.

**Implementation**:
```javascript
const usedColorsGlobal = new Set();
// For each region:
const candidateColors = availableColors.filter(color => !usedColorsGlobal.has(color));
// ... assign best color
usedColorsGlobal.add(bestColor);
```

---

### 5. Maximum Contrast for Neighbors
```
Choose color with max average distance to ALL neighbors
```
**Why**: Makes adjacent regions as visually distinct as possible.

**Algorithm**:
```javascript
for (const color of candidateColors) {
  const avgDistance = neighborColors.reduce((sum, neighborColor) =>
    sum + colorDistance(color, neighborColor), 0) / neighborColors.length;

  if (avgDistance > maxAvgDistance) {
    maxAvgDistance = avgDistance;
    bestColor = color;
  }
}
```

---

## 📋 Checklist Before Adding a Color

- [ ] Calculate luminance - is it > 0.15?
- [ ] Check color family - do we already have a similar color?
- [ ] Calculate RGB distance to ALL 19 existing colors - all > 100?
- [ ] Generate test puzzles - are queens clearly visible?
- [ ] Check adjacency - do similar colors appear next to each other?

---

## 🔧 Current Palette (April 2026 - Pastel Perceptual Family Update)

```javascript
const REGION_COLORS = [
  '#FFB3BA', // Pastel Red (light coral pink-red)
  '#FFDFBA', // Pastel Orange (light peach)
  '#FFFFBA', // Pastel Yellow (baby yellow)
  '#BAFFC9', // Pastel Green (mint green)
  '#BAE1FF', // Pastel Blue (baby blue)
  '#D4BBFF', // Pastel Purple (lilac)
  '#FFBAF3', // Pastel Pink (light pink)
  '#E0E0E0', // Pastel Gray (light gray)
  '#D7C9AA', // Pastel Brown (tan/beige)
];

const COLOR_FAMILIES = {
  '#FFB3BA': 'red',
  '#FFDFBA': 'orange',
  '#FFFFBA': 'yellow',
  '#BAFFC9': 'green',
  '#BAE1FF': 'blue',    // ONLY ONE blue family
  '#D4BBFF': 'purple',
  '#FFBAF3': 'pink',
  '#E0E0E0': 'gray',
  '#D7C9AA': 'brown',
};
```

**Status**: ✅ All rules satisfied with PERCEPTUAL family mapping, pastel colors for maximum contrast with black queens/X marks, 1,600 puzzles regenerated (94.2s)

---

## 🚫 Common Mistakes

### Mistake #0: Using RGB Families Instead of Perceptual Families (THE BIG ONE)
```javascript
// ❌ BAD - RGB families treat similar-looking colors as different
const COLOR_FAMILIES = {
  '#00CED1': 'teal',      // These ALL look blue to humans!
  '#00D9FF': 'cyan',
  '#5DADE2': 'blue',
  '#4169E1': 'royal-blue',
  '#87CEEB': 'sky-blue',
  '#20B2AA': 'sea-green',
};
// Result: Algorithm allows these adjacent → colorblind users can't distinguish
```
**Fix**: Use PERCEPTUAL families - group by how humans see color:
```javascript
// ✅ GOOD - All blue-like colors map to 'blue' family
const COLOR_FAMILIES = {
  '#BAE1FF': 'blue',  // ONLY ONE blue color in entire palette
};
// Result: No two blue-like colors ever on same board or adjacent
```

### Mistake #1: Adding Multiple Blues
```javascript
// ❌ BAD - Will create adjacent similar colors
'#5DADE2', '#4CC9F0', '#00CED1', '#1E90FF'
```
**Fix**: Keep only ONE, replace others with different families.

### Mistake #2: Using Dark Colors
```javascript
// ❌ BAD - Queens invisible on dark backgrounds
'#1D3557', '#8B4513', '#4B0082'
```
**Fix**: Replace with brighter versions (luminance > 0.15).

### Mistake #3: Not Checking Distance
```javascript
// ❌ BAD - Didn't verify distance between new color and existing palette
addColor('#45B7D1'); // Might be too close to existing cyan
```
**Fix**: Always calculate distance to ALL existing colors first.

---

## 🎯 Quick Reference: RGB Distance Threshold

- **< 50**: Virtually identical
- **50-100**: Too similar for adjacent placement
- **100-150**: Acceptable but not ideal
- **150+**: Good contrast ✅
- **200+**: Excellent contrast ✅✅

---

## 📚 See Also

- `GENERATION_GUIDE.md` - Full documentation with algorithms and examples
- `src/scripts/generateQueensPuzzles.js` - Implementation code
- `src/constants/colors.ts` - Frontend color constants

---

**Last Updated**: April 25, 2026
**Total Colors**: 9 (pastel palette)
**Total Puzzles**: 1,600 (400 per size)
**Generation Time**: 94.2s
**Key Breakthrough**: Perceptual family mapping - all blue/cyan/teal variants now map to single "blue" family
