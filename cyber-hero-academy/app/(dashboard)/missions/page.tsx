import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MissionsClient from './MissionsClient';

export default async function MissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: modules }, { data: progress }] = await Promise.all([
    supabase.from('modules').select('*').order('order_index'),
    supabase.from('progress').select('*').eq('user_id', user.id),
  ]);

  return <MissionsClient modules={modules ?? []} progress={progress ?? []} />;
}
