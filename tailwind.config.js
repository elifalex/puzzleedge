/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        ui: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
