/**
 * PuzzleEdge Design System - Color Palette
 * Sharp professional-playful aesthetic for LinkedIn professionals
 */

export const colors = {
  background: '#0A0A0F',
  surface: '#13131A',
  surfaceRaised: '#1C1C27',
  border: '#2A2A3D',
  accent: '#4F6EF7',
  accentHover: '#6B87FF',
  accentGlow: 'rgba(79, 110, 247, 0.15)',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  textPrimary: '#F0F0F8',
  textSecondary: '#8888AA',
  textMuted: '#555570',
} as const;

// Game-specific region colors for Queens puzzle
// Vibrant color palette - ONE color per PERCEPTUAL family for maximum accessibility
// Optimized for colorblind users, high contrast with black queens/X marks
// All colors have luminance > 0.15 for visibility
// Maximum board size is 9×9, so 9 unique colors is sufficient
export const queenRegionColors = [
  '#FF6B6B', // Vibrant Red
  '#FFA500', // Vibrant Orange
  '#FFD700', // Vibrant Yellow (Gold)
  '#4ECB71', // Vibrant Green
  '#5DADE2', // Vibrant Blue
  '#9B59B6', // Vibrant Purple
  '#FF69B4', // Vibrant Pink (Hot Pink)
  '#C0C0C0', // Silver Gray
  '#CD853F', // Vibrant Brown (Peru)
] as const;

export type Color = typeof colors[keyof typeof colors];
export type QueenRegionColor = typeof queenRegionColors[number];
