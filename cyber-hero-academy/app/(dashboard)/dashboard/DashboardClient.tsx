'use client';

import Link from 'next/link';
import { Shield, Swords, ChevronRight, Zap, Star } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { difficultyColor, getLevelTitle, xpToNextLevel } from '@/lib/utils';
import type { UserProfile, Module, Progress } from '@/types';

interface Props {
  profile:  UserProfile | null;
  modules:  Module[];
  progress: Progress[];
}

export default function DashboardClient({ profile, modules, progress }: Props) {
  const name    = profile?.name ?? 'Hero';
  const xp      = profile?.xp ?? 0;
  const level   = profile?.level ?? 1;
  const title   = getLevelTitle(level);
  const xpInfo  = xpToNextLevel(xp);

  // Map completed module ids
  const completedModuleIds = new Set(
    progress.filter((p) => p.completion_status === 'completed' && !p.lesson_id).map((p) => p.module_id)
  );

  const inProgressModuleIds = new Set(
    progress.filter((p) => p.completion_status === 'in_progress').map((p) => p.module_id)
  );

  const completedCount = completedModuleIds.size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple/30 via-brand-dark to-brand-cyan/10 border border-brand-purple/30 p-6 sm:p-8">
        {/* decorative blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-purple/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-cyan/10 rounded-full blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Raja avatar placeholder */}
          <div className="w-20 h-20 rounded-2xl bg-brand-purple/30 border-2 border-brand-purple/50 flex items-center justify-center text-4xl flex-shrink-0">
            🦸
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
                Raja says
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Welcome back, <span className="text-brand-cyan">{name}</span>!
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {completedCount === 0
                ? "Your first mission awaits. The cyber world won't defend itself — let's go!"
                : completedCount < modules.length
                ? `You've completed ${completedCount} of ${modules.length} missions. Keep pushing forward!`
                : "You've completed all missions! You're a true Cyber Hero. 🏆"}
            </p>
          </div>

          {/* Level badge */}
          <div className="flex-shrink-0 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-yellow/20 border-2 border-brand-yellow/50 flex items-center justify-center mb-1">
              <Star className="w-7 h-7 text-brand-yellow fill-current" />
            </div>
            <div className="text-brand-yellow font-bold text-sm">Lvl {level}</div>
            <div className="text-gray-400 text-xs">{title}</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total XP',        value: xp,                          icon: Zap,    color: 'text-brand-yellow' },
          { label: 'Hero Level',      value: `Level ${level}`,            icon: Star,   color: 'text-brand-purple' },
          { label: 'Missions Done',   value: completedCount,              icon: Shield, color: 'text-brand-cyan'   },
          { label: 'Missions Left',   value: modules.length - completedCount, icon: Swords, color: 'text-brand-orange' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex flex-col gap-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
          </Card>
        ))}
      </div>

      {/* XP Progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-white">XP Progress</h3>
            <p className="text-xs text-gray-500">Level {level} → {level < 5 ? `Level ${level + 1}` : 'Max Level'}</p>
          </div>
          <span className="xp-chip">
            <Zap className="w-3 h-3" />
            {xp} XP
          </span>
        </div>
        <ProgressBar value={xpInfo.percent} color="purple" />
        <p className="text-xs text-gray-500 mt-2">
          {level < 5
            ? `${xpInfo.current} / ${xpInfo.required} XP to next level`
            : 'Maximum level reached!'}
        </p>
      </Card>

      {/* Available Missions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white">Available Missions</h2>
          <Link href="/missions" className="text-sm text-brand-cyan hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const isCompleted  = completedModuleIds.has(mod.id);
            const isInProgress = inProgressModuleIds.has(mod.id);

            return (
              <Link
                key={mod.id}
                href={`/missions/${mod.id}`}
                className="group block rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 p-5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${mod.color_accent}20`, border: `1px solid ${mod.color_accent}40` }}
                  >
                    {mod.icon}
                  </div>
                  {isCompleted ? (
                    <span className="text-xs font-bold text-brand-green bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-full">
                      ✓ Done
                    </span>
                  ) : isInProgress ? (
                    <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  ) : null}
                </div>

                <h3 className="font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{mod.description}</p>

                <span className={`difficulty-pill ${difficultyColor(mod.difficulty)}`}>
                  {mod.difficulty}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
