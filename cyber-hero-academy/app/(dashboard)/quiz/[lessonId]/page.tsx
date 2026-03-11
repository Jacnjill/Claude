import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import QuizClient from './QuizClient';

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { lessonId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: lesson }, { data: quizzes }] = await Promise.all([
    supabase.from('lessons').select('id, title, module_id').eq('id', lessonId).single(),
    supabase.from('quizzes').select('*').eq('lesson_id', lessonId).order('order_index'),
  ]);

  if (!lesson || !quizzes?.length) notFound();

  const { data: mod } = await supabase
    .from('modules')
    .select('id, title, color_accent, icon')
    .eq('id', lesson.module_id)
    .single();

  return (
    <QuizClient
      lesson={lesson}
      module={mod}
      quizzes={quizzes}
      userId={user.id}
    />
  );
}
