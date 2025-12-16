import Image from 'next/image';
import { Team } from '@/types';
import { getTeamLogoPath } from '@/data/teams';

interface TeamCardProps {
  team: Team;
  variant?: 'baron' | 'elder' | 'neutral';
  showRoster?: boolean;
  pickNumber?: number;
  isLeader?: boolean;
}

const variantStyles = {
  baron: 'border-purple-500 bg-purple-900/30',
  elder: 'border-red-500 bg-red-900/30',
  neutral: 'border-gray-500 bg-gray-800/50',
};

export function TeamCard({
  team,
  variant = 'neutral',
  showRoster = true,
  pickNumber,
  isLeader = false,
}: TeamCardProps) {
  return (
    <div className={`
      border-2 rounded-xl p-3 sm:p-4
      ${variantStyles[variant]}
    `}>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
          <Image
            src={getTeamLogoPath(team.code)}
            alt={`${team.name} 로고`}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <h3 className="text-base sm:text-xl font-bold text-white">{team.code}</h3>
            {isLeader && (
              <span className={`
                text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium
                ${variant === 'baron' ? 'bg-purple-500/50 text-purple-200' : 'bg-red-500/50 text-red-200'}
              `}>
                대장
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-400 truncate">{team.name}</p>
        </div>
        {pickNumber && (
          <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">#{pickNumber}</span>
        )}
      </div>

      {showRoster && (
        <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
          <div>
            <p className="text-gray-500 text-[10px] sm:text-xs">TOP</p>
            <p className="text-white font-medium text-xs sm:text-sm truncate">{team.roster.top}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] sm:text-xs">JGL</p>
            <p className="text-white font-medium text-xs sm:text-sm truncate">{team.roster.jungle}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] sm:text-xs">MID</p>
            <p className="text-white font-medium text-xs sm:text-sm truncate">{team.roster.mid}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] sm:text-xs">ADC</p>
            <p className="text-white font-medium text-xs sm:text-sm truncate">{team.roster.adc}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] sm:text-xs">SUP</p>
            <p className="text-white font-medium text-xs sm:text-sm truncate">{team.roster.support}</p>
          </div>
        </div>
      )}
    </div>
  );
}
