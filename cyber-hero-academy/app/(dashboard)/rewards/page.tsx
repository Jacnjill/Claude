import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import RewardsClient from './RewardsClient';

export default async function RewardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: profile }, { data: allBadges }, { data: userBadges }, { data: progress }] =
    await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('badges').select('*'),
      supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', user.id),
      supabase.from('progress').select('xp_awarded').eq('user_id', user.id),
    ]);

  const earnedBadgeIds = new Set((userBadges ?? []).map((b) => b.badge_id));
  const totalXPFromProgress = (progress ?? []).reduce((sum, p) => sum + (p.xp_awarded ?? 0), 0);

  return (
    <RewardsClient
      profile={profile}
      allBadges={allBadges ?? []}
      earnedBadgeIds={earnedBadgeIds}
      totalXP={profile?.xp ?? totalXPFromProgress}
    />
  );
}
