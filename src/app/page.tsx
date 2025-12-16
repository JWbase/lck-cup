'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { createDraftState, selectTeam, isDraftComplete, toResult } from '@/lib/draft';
import { saveDraftResult } from '@/lib/stats';
import { DraftResult, DraftState, DraftableTeam, AppPhase } from '@/types';
import { ResultBoard } from '@/components/ResultBoard';
import { DraftBoard } from '@/components/DraftBoard';
import { StatsRanking } from '@/components/StatsRanking';

export default function HomePage() {
  const [phase, setPhase] = useState<AppPhase>('selection');
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [result, setResult] = useState<DraftResult | null>(null);
  const [statsTrigger, setStatsTrigger] = useState(0);

  const handleStartDraft = (firstPick: 'GEN' | 'HLE') => {
    setDraftState(createDraftState(firstPick));
    setPhase('drafting');
  };

  const handleSelectTeam = (team: DraftableTeam) => {
    if (!draftState) return;

    const newState = selectTeam(draftState, team);
    setDraftState(newState);

    if (isDraftComplete(newState)) {
      const draftResult = toResult(newState);
      setResult(draftResult);
      setPhase('result');

      // 결과 저장
      saveDraftResult(draftResult).then(() => {
        setStatsTrigger(prev => prev + 1);
      });
    }
  };

  const handleReset = () => {
    setPhase('selection');
    setDraftState(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* 헤더 */}
      <header className="text-center mb-6 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
          2026 LCK CUP
        </h1>
        <p className="text-base sm:text-xl text-gray-400">
          팀 편성 시뮬레이터
        </p>
      </header>

      {/* 선픽 선택 */}
      {phase === 'selection' && (
        <div>
          <div className="text-center">
            <p className="text-sm sm:text-lg text-gray-300 mb-6 sm:mb-8 px-4">
              GEN이 선픽 권한을 가집니다.<br />
              선픽을 가져갈지, HLE에게 줄지 선택하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                variant="baron"
                size="lg"
                onClick={() => handleStartDraft('GEN')}
                className="w-full sm:w-auto"
              >
                GEN 선픽
              </Button>
              <Button
                variant="elder"
                size="lg"
                onClick={() => handleStartDraft('HLE')}
                className="w-full sm:w-auto"
              >
                HLE 선픽
              </Button>
            </div>
          </div>

          {/* 메인 화면에서도 통계 표시 */}
          <StatsRanking refreshTrigger={statsTrigger} />
        </div>
      )}

      {/* 드래프트 진행 */}
      {phase === 'drafting' && draftState && (
        <div>
          <DraftBoard state={draftState} onSelectTeam={handleSelectTeam} />

          <div className="text-center mt-6 sm:mt-8">
            <Button
              variant="secondary"
              size="md"
              onClick={handleReset}
            >
              처음부터 다시하기
            </Button>
          </div>
        </div>
      )}

      {/* 결과 화면 */}
      {phase === 'result' && result && (
        <div>
          {/* 선픽 정보 */}
          <div className="text-center mb-6 sm:mb-8">
            <span className={`
              inline-block px-4 py-2 rounded-full text-sm font-medium
              ${result.firstPick === 'GEN'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-red-500/20 text-red-400'}
            `}>
              {result.firstPick} 선픽
            </span>
          </div>

          {/* 결과 보드 */}
          <ResultBoard result={result} />

          {/* 다시하기 버튼 */}
          <div className="text-center mt-6 sm:mt-8">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleReset}
            >
              다시하기
            </Button>
          </div>

          {/* 결과 화면에서 통계 표시 */}
          <StatsRanking refreshTrigger={statsTrigger} />
        </div>
      )}

      {/* 푸터 */}
      <footer className="text-center mt-12 sm:mt-16 text-gray-500 text-xs sm:text-sm pb-4">
        <p>2026 LCK CUP Draft Simulator</p>
      </footer>
    </div>
  );
}
