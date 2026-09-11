/**
 * Percentile Calculator
 * Provides deterministic percentile rankings based on completion time
 * Ensures: Better time = Better percentile (monotonic)
 */

type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Calculate percentile rank based on completion time for Mini Sudoku
 * Returns a percentile value (1-99) where lower is better
 *
 * Based on 6×6 Mini Sudoku research:
 * - Easy: 1-3 min average, 30-90s for skilled players
 * - Medium: 2-5 min average
 * - Hard: 4-8 min average
 */
export function calculateMiniSudokuPercentile(timeInSeconds: number, difficulty: Difficulty = 'medium'): number {
  if (difficulty === 'easy') {
    return calculateEasyPercentile(timeInSeconds);
  } else if (difficulty === 'hard') {
    return calculateHardPercentile(timeInSeconds);
  } else {
    return calculateMediumPercentile(timeInSeconds);
  }
}

/**
 * Easy 6x6 Mini Sudoku percentiles
 * - Elite: < 45s (Top 1-5%)
 * - Excellent: 45-75s / 0.75-1.25min (Top 5-10%)
 * - Very Good: 75-120s / 1.25-2min (Top 10-25%)
 * - Good: 120-180s / 2-3min (Top 25-50%)
 * - Average: 180-270s / 3-4.5min (Top 50-75%)
 * - Below Average: 270-420s / 4.5-7min (Top 75-90%)
 */
function calculateEasyPercentile(timeInSeconds: number): number {
  if (timeInSeconds <= 45) {
    return Math.max(1, Math.round(1 + (timeInSeconds / 45) * 4));
  }
  if (timeInSeconds <= 75) {
    return Math.round(5 + ((timeInSeconds - 45) / 30) * 5);
  }
  if (timeInSeconds <= 120) {
    return Math.round(10 + ((timeInSeconds - 75) / 45) * 15);
  }
  if (timeInSeconds <= 180) {
    return Math.round(25 + ((timeInSeconds - 120) / 60) * 25);
  }
  if (timeInSeconds <= 270) {
    return Math.round(50 + ((timeInSeconds - 180) / 90) * 25);
  }
  if (timeInSeconds <= 420) {
    return Math.round(75 + ((timeInSeconds - 270) / 150) * 15);
  }
  const percentile = Math.round(90 + Math.min(((timeInSeconds - 420) / 480) * 9, 9));
  return Math.min(99, percentile);
}

/**
 * Medium 6x6 Mini Sudoku percentiles
 * - Elite: < 90s / 1.5min (Top 1-5%)
 * - Excellent: 90-150s / 1.5-2.5min (Top 5-10%)
 * - Very Good: 150-210s / 2.5-3.5min (Top 10-25%)
 * - Good: 210-300s / 3.5-5min (Top 25-50%)
 * - Average: 300-420s / 5-7min (Top 50-75%)
 * - Below Average: 420-600s / 7-10min (Top 75-90%)
 */
function calculateMediumPercentile(timeInSeconds: number): number {
  // Elite players (Top 1-5%) - Under 1.5 minutes
  if (timeInSeconds <= 90) {
    // Linear interpolation: 0s = 1%, 90s = 5%
    return Math.max(1, Math.round(1 + (timeInSeconds / 90) * 4));
  }

  // Excellent players (Top 5-10%) - 1.5 to 2.5 minutes
  if (timeInSeconds <= 150) {
    // 90s = 5%, 150s = 10%
    return Math.round(5 + ((timeInSeconds - 90) / 60) * 5);
  }

  // Very good players (Top 10-25%) - 2.5 to 3.5 minutes
  if (timeInSeconds <= 210) {
    // 150s = 10%, 210s = 25%
    return Math.round(10 + ((timeInSeconds - 150) / 60) * 15);
  }

  // Good players (Top 25-50%) - 3.5 to 5 minutes
  if (timeInSeconds <= 300) {
    // 210s = 25%, 300s = 50%
    return Math.round(25 + ((timeInSeconds - 210) / 90) * 25);
  }

  // Average players (Top 50-75%) - 5 to 7 minutes
  if (timeInSeconds <= 420) {
    // 300s = 50%, 420s = 75%
    return Math.round(50 + ((timeInSeconds - 300) / 120) * 25);
  }

  // Below average players (Top 75-90%) - 7 to 10 minutes
  if (timeInSeconds <= 600) {
    // 420s = 75%, 600s = 90%
    return Math.round(75 + ((timeInSeconds - 420) / 180) * 15);
  }

  // Struggling players (Top 90-99%) - 10+ minutes
  // 600s+ = 90-99%
  const percentile = Math.round(90 + Math.min(((timeInSeconds - 600) / 600) * 9, 9));
  return Math.min(99, percentile);
}

/**
 * Hard 6x6 Mini Sudoku percentiles
 * - Elite: < 180s / 3min (Top 1-5%)
 * - Excellent: 180-270s / 3-4.5min (Top 5-10%)
 * - Very Good: 270-360s / 4.5-6min (Top 10-25%)
 * - Good: 360-480s / 6-8min (Top 25-50%)
 * - Average: 480-600s / 8-10min (Top 50-75%)
 * - Below Average: 600-840s / 10-14min (Top 75-90%)
 */
function calculateHardPercentile(timeInSeconds: number): number {
  if (timeInSeconds <= 180) {
    return Math.max(1, Math.round(1 + (timeInSeconds / 180) * 4));
  }
  if (timeInSeconds <= 270) {
    return Math.round(5 + ((timeInSeconds - 180) / 90) * 5);
  }
  if (timeInSeconds <= 360) {
    return Math.round(10 + ((timeInSeconds - 270) / 90) * 15);
  }
  if (timeInSeconds <= 480) {
    return Math.round(25 + ((timeInSeconds - 360) / 120) * 25);
  }
  if (timeInSeconds <= 600) {
    return Math.round(50 + ((timeInSeconds - 480) / 120) * 25);
  }
  if (timeInSeconds <= 840) {
    return Math.round(75 + ((timeInSeconds - 600) / 240) * 15);
  }
  const percentile = Math.round(90 + Math.min(((timeInSeconds - 840) / 840) * 9, 9));
  return Math.min(99, percentile);
}

/**
 * Get a friendly percentile message for display
 */
export function getPercentileMessage(percentile: number): string {
  if (percentile <= 1) return "Top 1% of players today! 🏆";
  if (percentile <= 5) return "Top 5% of players today! ⭐";
  if (percentile <= 10) return "Top 10% of players today! 🔥";
  if (percentile <= 25) return "Top 25% of players today! ✨";
  if (percentile <= 50) return "Top 50% of players today! 👍";
  if (percentile <= 75) return "Top 75% of players today! 📈";
  if (percentile <= 90) return "Top 90% of players today! 🎯";
  return "Keep practicing! 💪";
}

/**
 * Get percentile tier color for visual feedback
 */
export function getPercentileTierColor(percentile: number): string {
  if (percentile <= 5) return '#FFD700'; // Gold
  if (percentile <= 10) return '#FF6B35'; // Orange-red
  if (percentile <= 25) return '#4F6EF7'; // Blue
  if (percentile <= 50) return '#22C55E'; // Green
  if (percentile <= 75) return '#8888AA'; // Gray-blue
  return '#6B7280'; // Gray
}
