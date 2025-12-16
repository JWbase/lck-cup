'use client';

import Image from 'next/image';
import { DraftState, DraftableTeam, TeamCode } from '@/types';
import { TEAMS, getTeamLogoPath } from '@/data/teams';
import { getCurrentPickingTeam } from '@/lib/draft';

interface DraftBoardProps {
  state: DraftState;
  onSelectTeam: (team: DraftableTeam) => void;
}

export function DraftBoard({ state, onSelectTeam }: DraftBoardProps) {
  const currentTeam = getCurrentPickingTeam(state);
  const isBaron = currentTeam === 'GEN';

  return (
    <div className="space-y-6">
      {/* 현재 픽 정보 */}
      <div className="text-center">
        <div className={`
          inline-flex items-center gap-3 px-6 py-3 rounded-2xl
          ${isBaron ? 'bg-purple-500/20' : 'bg-red-500/20'}
        `}>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image
              src={getTeamLogoPath(currentTeam)}
              alt={currentTeam}
              fill
              className="object-contain"
            />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm text-gray-400">
              {state.currentPickIndex + 1}번째 픽
            </p>
            <p className={`text-lg sm:text-xl font-bold ${isBaron ? 'text-purple-400' : 'text-red-400'}`}>
              {currentTeam === 'GEN' ? '바론팀' : '장로팀'} 차례
            </p>
          </div>
        </div>
      </div>

      {/* 현재 팀 구성 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* 바론팀 */}
        <div className={`p-3 sm:p-4 rounded-xl ${isBaron ? 'bg-purple-500/20 ring-2 ring-purple-500' : 'bg-purple-500/10'}`}>
          <h3 className="text-sm sm:text-base font-bold text-purple-400 mb-2 sm:mb-3 flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full" />
            바론팀
          </h3>
          <div className="space-y-1.5 sm:space-y-2">
            {state.baronTeam.map((code) => (
              <TeamBadge key={code} code={code} variant="baron" />
            ))}
          </div>
        </div>

        {/* 장로팀 */}
        <div className={`p-3 sm:p-4 rounded-xl ${!isBaron ? 'bg-red-500/20 ring-2 ring-red-500' : 'bg-red-500/10'}`}>
          <h3 className="text-sm sm:text-base font-bold text-red-400 mb-2 sm:mb-3 flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
            장로팀
          </h3>
          <div className="space-y-1.5 sm:space-y-2">
            {state.elderTeam.map((code) => (
              <TeamBadge key={code} code={code} variant="elder" />
            ))}
          </div>
        </div>
      </div>

      {/* 선택 가능한 팀 */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-300 mb-3 sm:mb-4 text-center">
          팀을 선택하세요
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {state.availableTeams.map((code) => (
            <button
              key={code}
              onClick={() => onSelectTeam(code)}
              className={`
                p-3 sm:p-4 rounded-xl border-2 transition-all
                ${isBaron
                  ? 'border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/20'
                  : 'border-red-500/30 hover:border-red-500 hover:bg-red-500/20'}
                bg-gray-800/50 cursor-pointer
                active:scale-95
              `}
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2">
                <Image
                  src={getTeamLogoPath(code)}
                  alt={code}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white font-bold text-sm sm:text-base">{code}</p>
              <p className="text-gray-500 text-xs truncate">{TEAMS[code].shortName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 픽 순서 가이드 */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          픽 순서: {state.firstPick === 'GEN'
            ? 'GEN → HLE → HLE → GEN → GEN → HLE → HLE → GEN'
            : 'HLE → GEN → GEN → HLE → HLE → GEN → GEN → HLE'}
        </p>
      </div>
    </div>
  );
}

function TeamBadge({ code, variant }: { code: TeamCode; variant: 'baron' | 'elder' }) {
  const team = TEAMS[code];
  const isLeader = code === 'GEN' || code === 'HLE';

  return (
    <div className={`
      flex items-center gap-2 p-1.5 sm:p-2 rounded-lg
      ${variant === 'baron' ? 'bg-purple-900/30' : 'bg-red-900/30'}
    `}>
      <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
        <Image
          src={getTeamLogoPath(code)}
          alt={code}
          fill
          className="object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white font-semibold text-xs sm:text-sm truncate">{code}</p>
        {isLeader && (
          <p className="text-[10px] sm:text-xs text-gray-400">대장</p>
        )}
      </div>
    </div>
  );
}
