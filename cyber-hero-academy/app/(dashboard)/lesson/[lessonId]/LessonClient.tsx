'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import SpeechBubble from '@/components/ui/SpeechBubble';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Lesson, ComicPanel } from '@/types';

interface Module {
  id: string;
  title: string;
  color_accent: string;
  icon: string;
}

interface Props {
  lesson:  Lesson;
  module:  Module | null;
  userId:  string;
  hasQuiz: boolean;
}

/** Map speaker names to speech bubble variants */
function speakerVariant(speaker: string): 'hero' | 'villain' | 'narrator' {
  if (speaker === 'Villain') return 'villain';
  if (speaker === 'Narrator') return 'narrator';
  return 'hero';
}

export default function LessonClient({ lesson, module: mod, hasQuiz }: Props) {
  const router = useRouter();
  const panels: ComicPanel[] = lesson.comic_panels ?? [];

  const [currentPanel, setCurrentPanel] = useState(0);
  const isFirst = currentPanel === 0;
  const isLast  = currentPanel === panels.length - 1;

  const panel = panels[currentPanel];

  const handleNext = () => {
    if (!isLast) setCurrentPanel((p) => p + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentPanel((p) => p - 1);
  };

  const handleFinish = () => {
    if (hasQuiz) {
      router.push(`/quiz/${lesson.id}`);
    } else {
      router.push(`/missions/${lesson.module_id}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={`/missions/${lesson.module_id}`} className="hover:text-white flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          {mod?.title ?? 'Mission'}
        </Link>
      </div>

      {/* Lesson title */}
      <h1 className="text-2xl font-black text-white mb-2">{lesson.title}</h1>

      {/* Story intro */}
      {lesson.story_content && (
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{lesson.story_content}</p>
      )}

      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-6">
        {panels.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPanel(idx)}
            className={cn(
              'h-2 rounded-full transition-all',
              idx === currentPanel
                ? 'w-6 bg-brand-purple'
                : idx < currentPanel
                ? 'w-2 bg-brand-purple/50'
                : 'w-2 bg-white/20'
            )}
          />
        ))}
        <span className="ml-auto text-xs text-gray-500">
          Panel {currentPanel + 1} / {panels.length}
        </span>
      </div>

      {/* Comic Panel */}
      <div
        className="comic-panel min-h-[320px] flex flex-col justify-between p-0 mb-6 overflow-hidden"
        style={{ borderColor: mod?.color_accent ?? '#7C3AED' }}
      >
        {/* Caption bar */}
        {panel?.caption && (
          <div
            className="px-5 py-2 text-xs font-black uppercase tracking-widest text-white"
            style={{ backgroundColor: mod?.color_accent ?? '#7C3AED' }}
          >
            {panel.caption}
          </div>
        )}

        {/* Panel image placeholder */}
        <div
          className="flex-1 flex items-center justify-center min-h-[160px] text-8xl"
          style={{ background: `linear-gradient(135deg, ${mod?.color_accent ?? '#7C3AED'}10 0%, transparent 100%)` }}
        >
          {mod?.icon ?? '🛡️'}
        </div>

        {/* Dialogue */}
        <div className="p-5 border-t-4 border-white bg-white/5">
          <SpeechBubble
            speaker={panel?.speaker ?? ''}
            text={panel?.dialogue ?? ''}
            variant={speakerVariant(panel?.speaker ?? '')}
            side={panel?.speaker === 'Villain' ? 'right' : 'left'}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={isFirst}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {isLast ? (
          <Button onClick={handleFinish} size="lg" className="flex items-center gap-2">
            {hasQuiz ? 'Take the Quiz' : 'Complete Lesson'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex items-center gap-2">
            Next Panel
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
