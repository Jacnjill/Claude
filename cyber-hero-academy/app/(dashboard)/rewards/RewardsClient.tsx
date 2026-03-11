'use client';

import { Trophy, Zap, Star, TrendingUp } from 'lucide-react';
import BadgeIcon from '@/components/ui/BadgeIcon';
import ProgressBar from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { getLevelTitle, xpToNextLevel, LEVEL_THRESHOLDS } from '@/lib/utils';
import type { Badge, UserProfile } from '@/types';

interface Props {
  profile:       UserProfile | null;
  allBadges:     Badge[];
  earnedBadgeIds: Set<string>;
  totalXP:       number;
}

export default function RewardsClient({ profile, allBadges, earnedBadgeIds, totalXP }: Props) {
  const level   = profile?.level ?? 1;
  const title   = getLevelTitle(level);
  const xpInfo  = xpToNextLevel(totalXP);
  const earnedCount = earnedBadgeIds.size;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 border border-brand-yellow/30 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-brand-yellow" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Your Rewards</h1>
          <p className="text-gray-400 text-sm">Track your XP, level, and earned badges</p>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-3xl border border-brand-yellow/20 bg-gradient-to-br from-brand-yellow/10 via-brand-dark to-brand-orange/5 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-brand-purple/20 border-2 border-brand-purple/40 flex items-center justify-center text-5xl flex-shrink-0">
            🦸
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-gray-400 text-sm mb-1">{profile?.email}</p>
            <h2 className="text-2xl font-black text-white mb-1">{profile?.name ?? 'Hero'}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <span className="xp-chip">
                <Star className="w-3.5 h-3.5 fill-current" />
                Level {level} — {title}
              </span>
              <span className="xp-chip">
                <Zap className="w-3.5 h-3.5" />
                {totalXP} XP
              </span>
            </div>

            <ProgressBar
              value={xpInfo.percent}
              label={level < 5 ? `Progress to Level ${level + 1}` : 'Max Level Reached'}
              color="yellow"
            />
            {level < 5 && (
              <p className="text-xs text-gray-500 mt-1">
                {xpInfo.current} / {xpInfo.required} XP
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Level progression */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-brand-purple" />
          <h2 className="text-lg font-black text-white">Level Progression</h2>
        </div>

        <div className="space-y-3">
          {LEVEL_THRESHOLDS.map((threshold) => {
            const isCurrentLevel = threshold.level === level;
            const isUnlocked     = totalXP >= threshold.xpRequired;

            return (
              <div
                key={threshold.level}
                className={`flex items-center gap-4 p-3 rounded-xl ${
                  isCurrentLevel ? 'bg-brand-purple/15 border border-brand-purple/30' : 'opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                    isUnlocked ? 'bg-brand-purple/30 text-brand-violet' : 'bg-white/5 text-gray-600'
                  }`}
                >
                  {threshold.level}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${isCurrentLevel ? 'text-white' : 'text-gray-400'}`}>
                    {threshold.title}
                    {isCurrentLevel && <span className="ml-2 text-xs text-brand-cyan">(Current)</span>}
                  </p>
                  <p className="text-xs text-gray-600">{threshold.xpRequired} XP required</p>
                </div>
                {isUnlocked && (
                  <span className="text-brand-green text-lg">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Badges */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-yellow" />
            <h2 className="text-lg font-black text-white">Badges</h2>
          </div>
          <span className="text-sm text-gray-500">{earnedCount} / {allBadges.length} earned</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {allBadges.map((badge) => (
            <BadgeIcon
              key={badge.id}
              icon={badge.icon}
              name={badge.name}
              earned={earnedBadgeIds.has(badge.id)}
              size="md"
            />
          ))}
        </div>

        {earnedCount === 0 && (
          <p className="text-center text-gray-600 text-sm mt-4">
            Complete missions to earn your first badge!
          </p>
        )}
      </Card>

    </div>
  );
}
