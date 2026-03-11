import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('order_index');

  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id);

  return (
    <DashboardClient
      profile={profile}
      modules={modules ?? []}
      progress={progress ?? []}
    />
  );
}
