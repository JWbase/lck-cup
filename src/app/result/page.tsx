'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { deserializeDraftResult } from '@/lib/draft';
import { ResultBoard } from '@/components/ResultBoard';
import { Button } from '@/components/ui/Button';

function ResultContent() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  const result = data ? deserializeDraftResult(data) : null;

  if (!result) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          잘못된 링크입니다
        </h1>
        <p className="text-gray-400 mb-8">
          유효하지 않은 결과 데이터입니다.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            시뮬레이터로 이동
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          2026 LCK CUP 결과
        </h1>
        <p className="text-gray-400">
          친구가 공유한 드래프트 결과입니다
        </p>
      </header>

      {/* 선픽 정보 */}
      <div className="text-center mb-8">
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

      {/* 나도 해보기 버튼 */}
      <div className="text-center mt-8">
        <Link href="/">
          <Button variant="primary" size="lg">
            나도 해보기
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Suspense fallback={
        <div className="text-center text-white">
          로딩 중...
        </div>
      }>
        <ResultContent />
      </Suspense>

      {/* 푸터 */}
      <footer className="text-center mt-16 text-gray-500 text-sm">
        <p>2026 LCK CUP Draft Simulator</p>
      </footer>
    </div>
  );
}
