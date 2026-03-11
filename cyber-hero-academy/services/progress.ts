import { createClient } from '@/lib/supabase/client';
import { getLevelFromXP, calculateQuizXP } from '@/lib/utils';
import type { Progress, UserBadge } from '@/types';

/** Upsert progress record and award XP to the user */
export async function saveProgress(params: {
  userId: string;
  moduleId: string;
  lessonId: string;
  score: number;        // percentage 0–100
}): Promise<{ xpAwarded: number; newBadges: UserBadge[] }> {
  const { userId, moduleId, lessonId, score } = params;
  const supabase = createClient();
  const xpAwarded = calculateQuizXP(score);

  // Upsert lesson progress
  const { error: progError } = await supabase.from('progress').upsert(
    {
      user_id:           userId,
      module_id:         moduleId,
      lesson_id:         lessonId,
      completion_status: 'completed',
      score,
      xp_awarded:        xpAwarded,
      completed_at:      new Date().toISOString(),
    },
    { onConflict: 'user_id,module_id,lesson_id' }
  );
  if (progError) throw new Error(progError.message);

  // Increment user XP and recalculate level
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('xp')
    .eq('id', userId)
    .single();
  if (profileError) throw new Error(profileError.message);

  const newXP    = (profile?.xp ?? 0) + xpAwarded;
  const newLevel = getLevelFromXP(newXP);

  await supabase
    .from('user_profiles')
    .update({ xp: newXP, level: newLevel })
    .eq('id', userId);

  // Badge check
  const newBadges = await checkAndAwardBadges(userId, moduleId, score);

  return { xpAwarded, newBadges };
}

/** Check badge conditions and award any newly earned badges */
async function checkAndAwardBadges(
  userId: string,
  moduleId: string,
  score: number
): Promise<UserBadge[]> {
  const supabase    = createClient();
  const awardedBadges: UserBadge[] = [];

  // Fetch all badges and already-earned ones
  const [{ data: allBadges }, { data: earnedBadges }] = await Promise.all([
    supabase.from('badges').select('*'),
    supabase.from('user_badges').select('badge_id').eq('user_id', userId),
  ]);

  const earnedIds = new Set((earnedBadges ?? []).map((b) => b.badge_id));

  // Count completed modules for this user
  const { count: completedModuleCount } = await supabase
    .from('progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completion_status', 'completed')
    .is('lesson_id', null);

  for (const badge of allBadges ?? []) {
    if (earnedIds.has(badge.id)) continue; // Already earned

    let shouldAward = false;

    if (badge.condition_type === 'perfect_score' && score === 100) {
      shouldAward = true;
    } else if (badge.condition_type === 'mission_complete') {
      if (badge.condition_value === 1) {
        // "First Mission" or specific mission badges
        shouldAward = true;
      } else if (badge.condition_value === 3 && (completedModuleCount ?? 0) >= 3) {
        shouldAward = true;
      }
    }

    if (shouldAward) {
      const { error } = await supabase.from('user_badges').insert({
        user_id:   userId,
        badge_id:  badge.id,
        earned_at: new Date().toISOString(),
      });
      if (!error) awardedBadges.push({ user_id: userId, badge_id: badge.id, earned_at: new Date().toISOString(), badge });
    }
  }

  return awardedBadges;
}

/** Fetch all progress records for a user */
export async function getUserProgress(userId: string): Promise<Progress[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Fetch badges earned by a user */
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data ?? [];
}
