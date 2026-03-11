'use client';

import { useEffect, useState } from 'react';
import { getUserProgress } from '@/services/progress';
import type { Progress } from '@/types';

/**
 * Fetches all progress records for the given user and provides a refetch function.
 */
export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading]   = useState(true);

  const fetchProgress = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const data = await getUserProgress(userId);
      setProgress(data);
    } catch {
      // silently fail; progress defaults to empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { progress, loading, refetch: fetchProgress };
}
