import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LessonClient from './LessonClient';

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (!lesson) notFound();

  const { data: mod } = await supabase
    .from('modules')
    .select('id, title, color_accent, icon')
    .eq('id', lesson.module_id)
    .single();

  // Count quizzes for this lesson so the CTA knows whether to offer quiz
  const { count: quizCount } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true })
    .eq('lesson_id', lessonId);

  return (
    <LessonClient
      lesson={lesson}
      module={mod}
      userId={user.id}
      hasQuiz={(quizCount ?? 0) > 0}
    />
  );
}
