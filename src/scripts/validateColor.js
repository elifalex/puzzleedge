/**
 * Color Validation Script for Queens Puzzle
 *
 * Usage: node src/scripts/validateColor.js "#HEX_COLOR"
 *
 * This script validates a new color against all the critical rules:
 * 1. Checks luminance (must be > 0.15)
 * 2. Calculates RGB distance to all existing colors (must be > 100)
 * 3. Identifies color family conflicts
 * 4. Provides recommendations
 */

const REGION_COLORS = [
  '#E63946', // Bold Red
  '#5DADE2', // Bright Blue
  '#FFD60A', // Vivid Yellow
  '#2ECC71', // Emerald Green
  '#9D4EDD', // Violet Purple
  '#FF6F00', // Bright Orange
  '#FF69B4', // Hot Pink
  '#A7C957', // Lime Green
  '#FB8B24', // Coral
  '#F4A460', // Sandy Brown
  '#FF1493', // Deep Magenta
  '#FFB6C1', // Light Pink
  '#9B59B6', // Amethyst Purple
  '#32CD32', // Bright Lime
  '#FF4500', // Orange Red
  '#DC143C', // Crimson
  '#00D9FF', // Cyan
  '#FFE135', // Golden Yellow
  '#C71585', // Medium Violet Red
  '#7FFF00', // Chartreuse
];

const COLOR_NAMES = [
  'Bold Red', 'Bright Blue', 'Vivid Yellow', 'Emerald Green',
  'Violet Purple', 'Bright Orange', 'Hot Pink', 'Lime Green',
  'Coral', 'Sandy Brown', 'Deep Magenta', 'Light Pink',
  'Amethyst Purple', 'Bright Lime', 'Orange Red', 'Crimson',
  'Cyan', 'Golden Yellow', 'Medium Violet Red', 'Chartreuse'
];

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val /= 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function colorDistance(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function getColorFamily(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Unknown';

  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Grayscale
  if (max - min < 30) return 'Gray/Brown';

  // Determine dominant color
  if (r > g && r > b) {
    if (g > b) return 'Orange/Red';
    return 'Red/Pink';
  } else if (g > r && g > b) {
    if (r > b) return 'Yellow/Green';
    return 'Green';
  } else if (b > r && b > g) {
    if (r > g) return 'Purple/Blue';
    return 'Blue/Cyan';
  }

  return 'Mixed';
}

function validateColor(newColor) {
  console.log('\n🔍 Color Validation Report');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`Testing Color: ${newColor}\n`);

  const rgb = hexToRgb(newColor);
  if (!rgb) {
    console.log('❌ ERROR: Invalid hex color format\n');
    return false;
  }

  console.log(`RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})`);
  console.log(`Color Family: ${getColorFamily(newColor)}\n`);

  // Test 1: Luminance
  const luminance = getLuminance(newColor);
  console.log('─────────────────────────────────────────────────');
  console.log('Test 1: Luminance Check');
  console.log(`Luminance: ${luminance.toFixed(3)}`);
  console.log(`Required: > 0.15`);

  if (luminance > 0.15) {
    console.log('✅ PASS - Color is bright enough\n');
  } else {
    console.log('❌ FAIL - Color is too dark for black queens\n');
    return false;
  }

  // Test 2: RGB Distance
  console.log('─────────────────────────────────────────────────');
  console.log('Test 2: RGB Distance to Existing Colors');
  console.log('Required: > 100 for all colors\n');

  let minDistance = Infinity;
  let closestColor = '';
  let closestName = '';
  const violations = [];

  REGION_COLORS.forEach((existingColor, idx) => {
    const distance = colorDistance(newColor, existingColor);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = existingColor;
      closestName = COLOR_NAMES[idx];
    }

    if (distance < 100) {
      violations.push({
        color: existingColor,
        name: COLOR_NAMES[idx],
        distance: distance.toFixed(1)
      });
    }
  });

  if (violations.length > 0) {
    console.log(`❌ FAIL - Too similar to ${violations.length} existing color(s):\n`);
    violations.forEach(v => {
      console.log(`  ${v.color} (${v.name}): distance = ${v.distance}`);
    });
    console.log('');
    return false;
  } else {
    console.log(`✅ PASS - Minimum distance: ${minDistance.toFixed(1)}`);
    console.log(`  Closest to: ${closestColor} (${closestName})\n`);
  }

  // Test 3: Color Family Analysis
  console.log('─────────────────────────────────────────────────');
  console.log('Test 3: Color Family Analysis\n');

  const newFamily = getColorFamily(newColor);
  const familyCounts = {};

  REGION_COLORS.forEach((color, idx) => {
    const family = getColorFamily(color);
    if (!familyCounts[family]) familyCounts[family] = [];
    familyCounts[family].push(COLOR_NAMES[idx]);
  });

  console.log('Current palette distribution:');
  Object.entries(familyCounts).sort((a, b) => b[1].length - a[1].length).forEach(([family, colors]) => {
    console.log(`  ${family}: ${colors.length} colors`);
  });

  console.log(`\nNew color family: ${newFamily}`);
  if (familyCounts[newFamily] && familyCounts[newFamily].length >= 3) {
    console.log(`⚠️  WARNING - Already have ${familyCounts[newFamily].length} ${newFamily} colors`);
    console.log(`  Existing: ${familyCounts[newFamily].join(', ')}`);
    console.log('  Consider using a different color family\n');
  } else {
    console.log(`✅ Good distribution\n`);
  }

  // Final Summary
  console.log('═══════════════════════════════════════════════════');
  console.log('Summary:\n');
  console.log(`  Luminance: ${luminance.toFixed(3)} ${luminance > 0.15 ? '✅' : '❌'}`);
  console.log(`  Min Distance: ${minDistance.toFixed(1)} ${minDistance > 100 ? '✅' : '❌'}`);
  console.log(`  Color Family: ${newFamily}`);

  if (luminance > 0.15 && minDistance > 100) {
    console.log('\n✅ COLOR APPROVED - Safe to add to palette\n');
    return true;
  } else {
    console.log('\n❌ COLOR REJECTED - Does not meet requirements\n');
    return false;
  }
}

// Run validation
const colorToTest = process.argv[2];

if (!colorToTest) {
  console.log('\n❌ Usage: node src/scripts/validateColor.js "#HEX_COLOR"');
  console.log('Example: node src/scripts/validateColor.js "#FF5733"\n');
  process.exit(1);
}

validateColor(colorToTest);
