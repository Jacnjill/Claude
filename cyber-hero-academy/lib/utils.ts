import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LEVEL_THRESHOLDS } from '@/types';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Calculate level from XP */
export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xpRequired) level = threshold.level;
  }
  return level;
}

/** Get title for a given level */
export function getLevelTitle(level: number): string {
  return LEVEL_THRESHOLDS.find((t) => t.level === level)?.title ?? 'Recruit';
}

/** XP needed to reach the next level */
export function xpToNextLevel(xp: number): { current: number; required: number; percent: number } {
  const currentLevel  = getLevelFromXP(xp);
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1);
  const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel)!;

  if (!nextThreshold) {
    // Max level reached
    return { current: xp, required: currentThreshold.xpRequired, percent: 100 };
  }

  const currentXP  = xp - currentThreshold.xpRequired;
  const requiredXP = nextThreshold.xpRequired - currentThreshold.xpRequired;
  return {
    current:  currentXP,
    required: requiredXP,
    percent:  Math.min(Math.round((currentXP / requiredXP) * 100), 100),
  };
}

/** Difficulty colour mapping */
export function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Beginner':     return 'text-brand-green border-brand-green';
    case 'Intermediate': return 'text-brand-yellow border-brand-yellow';
    case 'Advanced':     return 'text-brand-red border-brand-red';
    default:             return 'text-gray-400 border-gray-400';
  }
}

/** Calculate XP awarded for a quiz score */
export function calculateQuizXP(scorePercent: number): number {
  if (scorePercent === 100) return 50;
  if (scorePercent >= 80)   return 30;
  if (scorePercent >= 60)   return 15;
  return 5;
}
