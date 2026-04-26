import { useGameStore } from '../store/gameStore';

export function useStreak(gameType: string) {
  const streak = useGameStore((s) => s.streaks[gameType]);

  return {
    current: streak?.current || 0,
    longest: streak?.longest || 0,
    lastPlayed: streak?.lastPlayed,
  };
}
