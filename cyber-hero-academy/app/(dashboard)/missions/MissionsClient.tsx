'use client';

import Link from 'next/link';
import { Swords, Lock } from 'lucide-react';
import { difficultyColor } from '@/lib/utils';
import type { Module, Progress } from '@/types';

interface Props {
  modules:  Module[];
  progress: Progress[];
}

export default function MissionsClient({ modules, progress }: Props) {
  const completedIds  = new Set(progress.filter((p) => p.completion_status === 'completed').map((p) => p.module_id));
  const inProgressIds = new Set(progress.filter((p) => p.completion_status === 'in_progress').map((p) => p.module_id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
          <Swords className="w-6 h-6 text-brand-purple" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Mission Center</h1>
          <p className="text-gray-400 text-sm">
            {completedIds.size} of {modules.length} missions completed
          </p>
        </div>
      </div>

      {/* Mission grid */}
      <div className="space-y-4">
        {modules.map((mod, idx) => {
          const isCompleted  = completedIds.has(mod.id);
          const isInProgress = inProgressIds.has(mod.id);
          const isLocked     = idx > 0 && !completedIds.has(modules[idx - 1].id);

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border p-6 transition-all ${
                isLocked
                  ? 'border-white/5 bg-white/2 opacity-60'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{
                    backgroundColor: `${mod.color_accent}20`,
                    border: `2px solid ${mod.color_accent}40`,
                  }}
                >
                  {isLocked ? <Lock className="w-6 h-6 text-gray-600" /> : mod.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-black text-white">{mod.title}</h2>
                    <span className={`difficulty-pill ${difficultyColor(mod.difficulty)}`}>
                      {mod.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="text-xs font-bold text-brand-green bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-full">
                        ✓ Completed
                      </span>
                    )}
                    {isInProgress && !isCompleted && (
                      <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{mod.description}</p>
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <div className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-600 text-sm font-bold cursor-not-allowed">
                      Complete previous mission first
                    </div>
                  ) : (
                    <Link
                      href={`/missions/${mod.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                      style={{
                        backgroundColor: `${mod.color_accent}20`,
                        border: `1px solid ${mod.color_accent}40`,
                        color: mod.color_accent,
                      }}
                    >
                      {isCompleted ? 'Replay Mission' : isInProgress ? 'Continue' : 'Start Mission'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
