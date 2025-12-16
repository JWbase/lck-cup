'use client';

import { DraftResult, TeamCode } from '@/types';
import { TEAMS } from '@/data/teams';
import { TeamCard } from './TeamCard';
import { Button } from './ui/Button';
import { serializeDraftResult } from '@/lib/draft';
import { useState } from 'react';

interface ResultBoardProps {
  result: DraftResult;
}

export function ResultBoard({ result }: ResultBoardProps) {
  const [copied, setCopied] = useState(false);

  const getPickNumber = (teamCode: TeamCode): number | undefined => {
    const pick = result.pickOrder.find(p => p.picked === teamCode);
    return pick?.pickNumber;
  };

  const handleShare = async () => {
    const encoded = serializeDraftResult(result);
    const url = `${window.location.origin}/result?data=${encoded}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {/* 공유 버튼 */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <Button
          variant="primary"
          size="md"
          onClick={handleShare}
          className="w-full sm:w-auto mx-4 sm:mx-0"
        >
          {copied ? '복사 완료!' : '링크 복사하기'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        {/* 바론팀 */}
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-purple-400">바론팀</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {result.baronTeam.map((teamCode, index) => (
              <TeamCard
                key={teamCode}
                team={TEAMS[teamCode]}
                variant="baron"
                pickNumber={index === 0 ? undefined : getPickNumber(teamCode)}
                isLeader={index === 0}
              />
            ))}
          </div>
        </div>

        {/* 장로팀 */}
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-red-400">장로팀</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {result.elderTeam.map((teamCode, index) => (
              <TeamCard
                key={teamCode}
                team={TEAMS[teamCode]}
                variant="elder"
                pickNumber={index === 0 ? undefined : getPickNumber(teamCode)}
                isLeader={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
