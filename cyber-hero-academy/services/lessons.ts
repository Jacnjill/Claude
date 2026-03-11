import { createClient } from '@/lib/supabase/client';
import type { Lesson } from '@/types';

/** Fetch all lessons for a module */
export async function getLessonsForModule(moduleId: string): Promise<Lesson[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index');

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Fetch a single lesson by id */
export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) return null;
  return data;
}
