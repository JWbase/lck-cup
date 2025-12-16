'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TeamCompositionStat, TeamCode } from '@/types';
import { getAllStats } from '@/lib/stats';
import { getTeamLogoPath, TEAMS } from '@/data/teams';
import { isSupabaseConfigured } from '@/lib/supabase';

interface StatsRankingProps {
  refreshTrigger?: number;
}

export function StatsRanking({ refreshTrigger }: StatsRankingProps) {
  const [baronStats, setBaronStats] = useState<TeamCompositionStat[]>([]);
  const [elderStats, setElderStats] = useState<TeamCompositionStat[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'baron' | 'elder'>('baron');

  useEffect(() => {
    async function fetchStats() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const stats = await getAllStats();
      setBaronStats(stats.baron);
      setElderStats(stats.elder);
      setTotalCount(stats.totalCount);
      setLoading(false);
    }

    fetchStats();
  }, [refreshTrigger]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mt-8 p-4 bg-gray-800/50 rounded-xl text-center">
        <p className="text-gray-400 text-sm">
          통계 기능을 사용하려면 Supabase 설정이 필요합니다.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8 p-4 bg-gray-800/50 rounded-xl text-center">
        <p className="text-gray-400 animate-pulse">통계 로딩 중...</p>
      </div>
    );
  }

  const stats = activeTab === 'baron' ? baronStats : elderStats;

  return (
    <div className="mt-8 sm:mt-12">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          역대 시뮬레이터 순위
        </h2>
        <p className="text-sm text-gray-400">
          총 {totalCount.toLocaleString()}회 시뮬레이션
        </p>
      </div>

      {/* 탭 */}
      <div className="flex justify-center gap-2 mb-4 sm:mb-6">
        <button
          onClick={() => setActiveTab('baron')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer
            ${activeTab === 'baron'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
          `}
        >
          바론팀 TOP 20
        </button>
        <button
          onClick={() => setActiveTab('elder')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer
            ${activeTab === 'elder'
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
          `}
        >
          장로팀 TOP 20
        </button>
      </div>

      {/* 순위 리스트 */}
      {stats.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl">
          <p className="text-gray-400">아직 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {stats.map((stat, index) => (
            <RankingItem
              key={stat.id}
              rank={index + 1}
              stat={stat}
              teamType={activeTab}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RankingItem({
  rank,
  stat,
  teamType,
}: {
  rank: number;
  stat: TeamCompositionStat;
  teamType: 'baron' | 'elder';
}) {
  const bgColor = teamType === 'baron' ? 'bg-purple-900/20' : 'bg-red-900/20';
  const borderColor = teamType === 'baron' ? 'border-purple-500/30' : 'border-red-500/30';
  const accentColor = teamType === 'baron' ? 'text-purple-400' : 'text-red-400';

  // 1~3등 특별 스타일
  const rankStyle = rank <= 3
    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    : 'bg-gray-700/50 text-gray-400 border-gray-600';

  return (
    <div className={`
      p-3 sm:p-4 rounded-xl border ${borderColor} ${bgColor}
      flex items-center gap-2 sm:gap-4
    `}>
      {/* 순위 */}
      <div className={`
        w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
        font-bold text-sm sm:text-base border ${rankStyle}
      `}>
        {rank}
      </div>

      {/* 팀 로고들 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {stat.teams.map((code) => (
            <TeamLogo key={code} code={code} />
          ))}
        </div>
      </div>

      {/* 득표수 및 퍼센티지 */}
      <div className="text-right flex-shrink-0">
        <p className={`font-bold text-base sm:text-lg ${accentColor}`}>
          {stat.count.toLocaleString()}표
        </p>
        <p className="text-xs sm:text-sm text-gray-400">
          {stat.percentage?.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}

function TeamLogo({ code }: { code: TeamCode }) {
  return (
    <div className="flex items-center gap-1 bg-gray-800/50 px-1.5 sm:px-2 py-1 rounded-lg">
      <div className="relative w-5 h-5 sm:w-6 sm:h-6">
        <Image
          src={getTeamLogoPath(code)}
          alt={code}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-xs sm:text-sm text-white font-medium">{code}</span>
    </div>
  );
}
