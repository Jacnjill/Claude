import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { difficultyColor } from '@/lib/utils';
import { ChevronRight, BookOpen } from 'lucide-react';

interface Props {
  params: Promise<{ moduleId: string }>;
}

export default async function MissionDetailPage({ params }: Props) {
  const { moduleId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: mod }, { data: lessons }, { data: progress }] = await Promise.all([
    supabase.from('modules').select('*').eq('id', moduleId).single(),
    supabase.from('lessons').select('id, title, order_index').eq('module_id', moduleId).order('order_index'),
    supabase.from('progress').select('*').eq('user_id', user.id).eq('module_id', moduleId),
  ]);

  if (!mod) notFound();

  const completedLessonIds = new Set(
    (progress ?? []).filter((p) => p.completion_status === 'completed' && p.lesson_id).map((p) => p.lesson_id)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/missions" className="hover:text-white transition-colors">Missions</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">{mod.title}</span>
      </div>

      {/* Module Header */}
      <div
        className="rounded-3xl p-8 mb-8 border"
        style={{
          background: `linear-gradient(135deg, ${mod.color_accent}15 0%, transparent 100%)`,
          borderColor: `${mod.color_accent}30`,
        }}
      >
        <div className="text-5xl mb-4">{mod.icon}</div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="text-3xl font-black text-white">{mod.title}</h1>
          <span className={`difficulty-pill ${difficultyColor(mod.difficulty)}`}>
            {mod.difficulty}
          </span>
        </div>
        <p className="text-gray-300 leading-relaxed">{mod.description}</p>
      </div>

      {/* Lessons list */}
      <h2 className="text-xl font-black text-white mb-4">Lessons</h2>

      <div className="space-y-3">
        {(lessons ?? []).map((lesson, idx) => {
          const isDone = completedLessonIds.has(lesson.id);

          return (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.id}`}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  backgroundColor: isDone ? `${mod.color_accent}20` : 'rgba(255,255,255,0.05)',
                  color: isDone ? mod.color_accent : '#6b7280',
                  border: `1px solid ${isDone ? mod.color_accent + '40' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Lesson {idx + 1}</span>
                </div>
                <h3 className="font-bold text-white group-hover:text-brand-cyan transition-colors">
                  {lesson.title}
                </h3>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
