import { createClient } from '@/lib/supabase/client';
import type { Module, ModuleWithProgress, Progress } from '@/types';

/** Fetch all modules ordered by order_index */
export async function getModules(): Promise<Module[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('order_index');

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Fetch modules with the current user's progress attached */
export async function getModulesWithProgress(userId: string): Promise<ModuleWithProgress[]> {
  const supabase = createClient();

  const [{ data: modules, error: modError }, { data: progress, error: progError }] =
    await Promise.all([
      supabase.from('modules').select('*').order('order_index'),
      supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .is('lesson_id', null), // module-level progress rows have no lesson_id
    ]);

  if (modError)  throw new Error(modError.message);
  if (progError) throw new Error(progError.message);

  const progressMap = new Map<string, Progress>();
  (progress ?? []).forEach((p) => progressMap.set(p.module_id, p));

  // Count lessons per module
  const { data: lessonCounts } = await supabase
    .from('lessons')
    .select('module_id');

  const countMap = new Map<string, number>();
  (lessonCounts ?? []).forEach((l) => {
    countMap.set(l.module_id, (countMap.get(l.module_id) ?? 0) + 1);
  });

  return (modules ?? []).map((m) => ({
    ...m,
    progress: progressMap.get(m.id) ?? null,
    lessonCount: countMap.get(m.id) ?? 0,
  }));
}
