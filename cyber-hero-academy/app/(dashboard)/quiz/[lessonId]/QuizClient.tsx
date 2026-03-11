'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Zap, ChevronRight, Trophy } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { saveProgress } from '@/services/progress';
import { cn } from '@/lib/utils';
import type { Quiz, QuizResult } from '@/types';

interface Lesson { id: string; title: string; module_id: string; }
interface Module  { id: string; title: string; color_accent: string; icon: string; }

interface Props {
  lesson:  Lesson;
  module:  Module | null;
  quizzes: Quiz[];
  userId:  string;
}

export default function QuizClient({ lesson, module: mod, quizzes, userId }: Props) {
  const [currentQ,   setCurrentQ]   = useState(0);
  const [answers,    setAnswers]     = useState<Record<string, string>>({});
  const [submitted,  setSubmitted]   = useState(false);
  const [result,     setResult]      = useState<QuizResult | null>(null);
  const [saving,     setSaving]      = useState(false);
  const [newBadges,  setNewBadges]   = useState<string[]>([]);

  const quiz    = quizzes[currentQ];
  const isLast  = currentQ === quizzes.length - 1;
  const selected = answers[quiz?.id ?? ''];

  const handleSelect = (optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [quiz.id]: optionId }));
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentQ((q) => q + 1);
      setSubmitted(false);
    }
  };

  const handleSubmitAnswer = () => {
    setSubmitted(true);
  };

  const handleFinishQuiz = async () => {
    // Calculate score
    let correct = 0;
    quizzes.forEach((q) => {
      if (answers[q.id] === q.correct_answer) correct++;
    });
    const scorePercent = Math.round((correct / quizzes.length) * 100);
    const isPerfect    = scorePercent === 100;
    const xpEarned     = scorePercent === 100 ? 50 : scorePercent >= 80 ? 30 : scorePercent >= 60 ? 15 : 5;

    setResult({ totalQuestions: quizzes.length, correctAnswers: correct, score: scorePercent, xpEarned, isPerfect });

    // Persist progress
    setSaving(true);
    try {
      const { newBadges: badges } = await saveProgress({
        userId,
        moduleId: lesson.module_id,
        lessonId: lesson.id,
        score:    scorePercent,
      });
      setNewBadges(badges.map((b) => b.badge?.name ?? '').filter(Boolean));
    } catch {
      // Non-blocking — result is still shown
    } finally {
      setSaving(false);
    }
  };

  // ─── Results screen ───────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {result.isPerfect ? '🏆' : result.score >= 80 ? '🎉' : result.score >= 60 ? '👍' : '📚'}
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            {result.isPerfect
              ? 'Perfect Score!'
              : result.score >= 80
              ? 'Great job!'
              : result.score >= 60
              ? 'Good effort!'
              : 'Keep learning!'}
          </h1>
          <p className="text-gray-400">
            You answered {result.correctAnswers} of {result.totalQuestions} questions correctly.
          </p>
        </div>

        {/* Score card */}
        <div
          className="rounded-2xl border p-6 mb-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${mod?.color_accent ?? '#7C3AED'}15 0%, transparent 100%)`,
            borderColor: `${mod?.color_accent ?? '#7C3AED'}30`,
          }}
        >
          <div className="text-6xl font-black text-white mb-1">{result.score}%</div>
          <ProgressBar
            value={result.score}
            showPercent={false}
            color={result.score === 100 ? 'yellow' : result.score >= 60 ? 'green' : 'purple'}
            className="mt-3"
          />
        </div>

        {/* XP earned */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="xp-chip text-lg px-4 py-2">
            <Zap className="w-4 h-4" />
            +{result.xpEarned} XP earned!
          </div>
        </div>

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="rounded-2xl border border-brand-yellow/30 bg-brand-yellow/5 p-4 mb-6 text-center">
            <Trophy className="w-6 h-6 text-brand-yellow mx-auto mb-2" />
            <p className="text-brand-yellow font-bold text-sm">New badge{newBadges.length > 1 ? 's' : ''} unlocked!</p>
            <p className="text-gray-300 text-sm">{newBadges.join(', ')}</p>
          </div>
        )}

        {/* Review answers */}
        <div className="space-y-3 mb-8">
          <h2 className="text-lg font-bold text-white">Review</h2>
          {quizzes.map((q, idx) => {
            const userAnswer    = answers[q.id];
            const isCorrect     = userAnswer === q.correct_answer;
            const correctOption = q.options.find((o) => o.id === q.correct_answer);

            return (
              <div
                key={q.id}
                className={cn(
                  'rounded-xl p-4 border',
                  isCorrect ? 'border-brand-green/30 bg-brand-green/5' : 'border-brand-red/30 bg-brand-red/5'
                )}
              >
                <div className="flex items-start gap-3">
                  {isCorrect
                    ? <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Q{idx + 1}. {q.question}</p>
                    {!isCorrect && (
                      <p className="text-xs text-brand-green mb-1">
                        Correct: {correctOption?.text}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/missions" className="flex-1">
            <Button variant="secondary" className="w-full">
              Back to Missions
            </Button>
          </Link>
          <Link href="/rewards" className="flex-1">
            <Button className="w-full flex items-center gap-2">
              View Rewards
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Quiz screen ──────────────────────────────────────────────────────────
  const isCorrect  = submitted && selected === quiz.correct_answer;
  const isWrong    = submitted && selected !== quiz.correct_answer;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-black text-white">{lesson.title} — Quiz</h1>
          <span className="text-sm text-gray-500">
            {currentQ + 1} / {quizzes.length}
          </span>
        </div>
        <ProgressBar
          value={Math.round(((currentQ) / quizzes.length) * 100)}
          showPercent={false}
          size="sm"
        />
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
        <div className="text-xs text-brand-cyan uppercase tracking-wider font-bold mb-3">
          Question {currentQ + 1}
        </div>
        <p className="text-lg font-bold text-white leading-relaxed">{quiz.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {quiz.options.map((opt) => {
          const isSelected  = selected === opt.id;
          const isCorrectOpt = opt.id === quiz.correct_answer;
          const showCorrect  = submitted && isCorrectOpt;
          const showWrong    = submitted && isSelected && !isCorrectOpt;

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={submitted}
              className={cn(
                'w-full text-left px-5 py-4 rounded-xl border transition-all font-medium',
                !submitted && !isSelected && 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 text-gray-300',
                !submitted && isSelected && 'border-brand-purple bg-brand-purple/20 text-white',
                showCorrect && 'border-brand-green bg-brand-green/20 text-white',
                showWrong   && 'border-brand-red bg-brand-red/20 text-white',
                submitted && !isSelected && !isCorrectOpt && 'border-white/5 bg-transparent text-gray-600 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'w-6 h-6 rounded-full border text-xs flex items-center justify-center font-bold flex-shrink-0',
                    !submitted && !isSelected && 'border-white/20 text-gray-500',
                    !submitted && isSelected && 'border-brand-purple bg-brand-purple text-white',
                    showCorrect && 'border-brand-green bg-brand-green text-white',
                    showWrong   && 'border-brand-red bg-brand-red text-white',
                  )}
                >
                  {opt.id.toUpperCase()}
                </span>
                {opt.text}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div
          className={cn(
            'rounded-xl p-4 mb-6 border flex items-start gap-3',
            isCorrect ? 'bg-brand-green/10 border-brand-green/30' : 'bg-brand-red/10 border-brand-red/30'
          )}
        >
          {isCorrect
            ? <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
            : <XCircle    className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
          }
          <div>
            <p className={cn('font-bold text-sm mb-1', isCorrect ? 'text-brand-green' : 'text-brand-red')}>
              {isCorrect ? 'Correct!' : 'Not quite.'}
            </p>
            {quiz.explanation && (
              <p className="text-sm text-gray-300 leading-relaxed">{quiz.explanation}</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end gap-3">
        {!submitted ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selected}
          >
            Check Answer
          </Button>
        ) : isLast ? (
          <Button onClick={handleFinishQuiz} loading={saving} size="lg" className="flex items-center gap-2">
            See Results
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex items-center gap-2">
            Next Question
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
