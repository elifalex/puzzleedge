import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { queensEngine } from '../engines/queens';
import { QueensPuzzle } from '../constants/types';

export function useDailyPuzzle(gameType: 'queens') {
  const getDailyCompletion = useGameStore((s) => s.getDailyCompletion);
  const [puzzle, setPuzzle] = useState<QueensPuzzle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPuzzle = async () => {
      setLoading(true);
      try {
        const seed = queensEngine.getDailySeed();
        const loadedPuzzle = await queensEngine.generate('medium', seed);
        setPuzzle(loadedPuzzle);
      } catch (error) {
        console.error('Failed to load daily puzzle:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, []);

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
