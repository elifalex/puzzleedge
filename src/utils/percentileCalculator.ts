/**
 * Percentile Calculator
 * Provides deterministic percentile rankings based on completion time
 * Ensures: Better time = Better percentile (monotonic)
 */

/**
 * Calculate percentile rank based on completion time for Mini Sudoku
 * Returns a percentile value (1-99) where lower is better
 *
 * Based on realistic 6×6 Mini Sudoku completion time distributions:
 * - Elite: < 40s (Top 1-5%)
 * - Excellent: 40-70s (Top 5-10%)
 * - Very Good: 70-100s (Top 10-25%)
 * - Good: 100-150s (Top 25-50%)
 * - Average: 150-240s (Top 50-75%)
 * - Below Average: 240-360s (Top 75-90%)
 * - Struggling: 360+ (Top 90-99%)
 */
export function calculateMiniSudokuPercentile(timeInSeconds: number): number {
  // Elite players (Top 1-5%)
  if (timeInSeconds <= 40) {
    // Linear interpolation: 0s = 1%, 40s = 5%
    return Math.max(1, Math.round(1 + (timeInSeconds / 40) * 4));
  }

  // Excellent players (Top 5-10%)
  if (timeInSeconds <= 70) {
    // 40s = 5%, 70s = 10%
    return Math.round(5 + ((timeInSeconds - 40) / 30) * 5);
  }

  // Very good players (Top 10-25%)
  if (timeInSeconds <= 100) {
    // 70s = 10%, 100s = 25%
    return Math.round(10 + ((timeInSeconds - 70) / 30) * 15);
  }

  // Good players (Top 25-50%)
  if (timeInSeconds <= 150) {
    // 100s = 25%, 150s = 50%
    return Math.round(25 + ((timeInSeconds - 100) / 50) * 25);
  }

  // Average players (Top 50-75%)
  if (timeInSeconds <= 240) {
    // 150s = 50%, 240s = 75%
    return Math.round(50 + ((timeInSeconds - 150) / 90) * 25);
  }

  // Below average players (Top 75-90%)
  if (timeInSeconds <= 360) {
    // 240s = 75%, 360s = 90%
    return Math.round(75 + ((timeInSeconds - 240) / 120) * 15);
  }

  // Struggling players (Top 90-99%)
  // 360s+ = 90-99%
  const percentile = Math.round(90 + Math.min(((timeInSeconds - 360) / 300) * 9, 9));
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
