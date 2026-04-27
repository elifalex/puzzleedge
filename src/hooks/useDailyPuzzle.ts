import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { queensEngine } from '../engines/queens';
import { QueensPuzzle, TangoPuzzle } from '../constants/types';
import { getDailyPuzzle } from '../data/tangoPuzzleLoader';

// Calculate daily seed based on day of year
function getDailySeed(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear;
}

// Get difficulty based on day of week
function getDailyDifficulty(): 'easy' | 'medium' | 'hard' {
  const day = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  if (day === 0 || day === 1) return 'easy'; // Sunday, Monday
  if (day === 5 || day === 6) return 'hard'; // Friday, Saturday
  return 'medium'; // Tuesday, Wednesday, Thursday
}

export function useDailyPuzzle(gameType: 'queens' | 'tango') {
  const getDailyCompletion = useGameStore((s) => s.getDailyCompletion);
  const [puzzle, setPuzzle] = useState<QueensPuzzle | TangoPuzzle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPuzzle = async () => {
      setLoading(true);
      try {
        if (gameType === 'queens') {
          const seed = queensEngine.getDailySeed();
          const loadedPuzzle = await queensEngine.generate('medium', seed);
          setPuzzle(loadedPuzzle);
        } else if (gameType === 'tango') {
          const seed = getDailySeed();
          const difficulty = getDailyDifficulty();
          const loadedPuzzle = await getDailyPuzzle(difficulty, seed);
          setPuzzle(loadedPuzzle);
        }
      } catch (error) {
        console.error('Failed to load daily puzzle:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [gameType]);

  const today = new Date().toISOString().split('T')[0];
  const completion = getDailyCompletion(gameType, today);

  return {
    puzzle: puzzle!,
    loading,
    isCompleted: !!completion,
    completion,
    seed: puzzle?.seed || 0,
  };
}
