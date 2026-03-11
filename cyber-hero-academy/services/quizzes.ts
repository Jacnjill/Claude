import { createClient } from '@/lib/supabase/client';
import type { Quiz } from '@/types';

/** Fetch all quiz questions for a lesson */
export async function getQuizzesForLesson(lessonId: string): Promise<Quiz[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index');

  if (error) throw new Error(error.message);
  return data ?? [];
}
