import { DraftResult, DraftPick, DraftableTeam, TeamCode, DraftState } from '@/types';
import { DRAFTABLE_TEAMS, PICK_ORDER } from '@/data/teams';

// 드래프트 초기 상태 생성
export function createDraftState(firstPick: 'GEN' | 'HLE'): DraftState {
  return {
    firstPick,
    currentPickIndex: 0,
    baronTeam: ['GEN'],
    elderTeam: ['HLE'],
    pickOrder: [],
    availableTeams: [...DRAFTABLE_TEAMS],
  };
}

// 현재 픽 순서의 팀 가져오기
export function getCurrentPickingTeam(state: DraftState): 'GEN' | 'HLE' {
  const order = state.firstPick === 'GEN'
    ? PICK_ORDER.GEN_FIRST
    : PICK_ORDER.HLE_FIRST;
  return order[state.currentPickIndex];
}

// 팀 선택
export function selectTeam(state: DraftState, team: DraftableTeam): DraftState {
  const pickingTeam = getCurrentPickingTeam(state);

  const newPick: DraftPick = {
    pickNumber: state.currentPickIndex + 1,
    team: pickingTeam,
    picked: team,
  };

  const newBaronTeam = pickingTeam === 'GEN'
    ? [...state.baronTeam, team]
    : state.baronTeam;

  const newElderTeam = pickingTeam === 'HLE'
    ? [...state.elderTeam, team]
    : state.elderTeam;

  return {
    ...state,
    currentPickIndex: state.currentPickIndex + 1,
    baronTeam: newBaronTeam as TeamCode[],
    elderTeam: newElderTeam as TeamCode[],
    pickOrder: [...state.pickOrder, newPick],
    availableTeams: state.availableTeams.filter(t => t !== team),
  };
}

// 드래프트 완료 여부
export function isDraftComplete(state: DraftState): boolean {
  return state.currentPickIndex >= 8;
}

// DraftState를 DraftResult로 변환
export function toResult(state: DraftState): DraftResult {
  return {
    firstPick: state.firstPick,
    baronTeam: state.baronTeam,
    elderTeam: state.elderTeam,
    pickOrder: state.pickOrder,
  };
}

// 결과를 URL-safe 문자열로 직렬화
export function serializeDraftResult(result: DraftResult): string {
  const baronPicks = result.baronTeam.slice(1).join(',');
  const elderPicks = result.elderTeam.slice(1).join(',');
  return `${result.firstPick}-${baronPicks}-${elderPicks}`;
}

// URL에서 결과 복원
export function deserializeDraftResult(encoded: string): DraftResult | null {
  try {
    const parts = encoded.split('-');
    if (parts.length !== 3) return null;

    const [firstPick, baronStr, elderStr] = parts;
    if (firstPick !== 'GEN' && firstPick !== 'HLE') return null;

    const baronPicks = baronStr.split(',') as DraftableTeam[];
    const elderPicks = elderStr.split(',') as DraftableTeam[];

    if (baronPicks.length !== 4 || elderPicks.length !== 4) return null;

    const pickOrder = firstPick === 'GEN'
      ? PICK_ORDER.GEN_FIRST
      : PICK_ORDER.HLE_FIRST;

    const picks: DraftPick[] = [];
    let baronIdx = 0;
    let elderIdx = 0;

    for (let i = 0; i < 8; i++) {
      const pickingTeam = pickOrder[i];
      const picked = pickingTeam === 'GEN'
        ? baronPicks[baronIdx++]
        : elderPicks[elderIdx++];

      picks.push({
        pickNumber: i + 1,
        team: pickingTeam,
        picked,
      });
    }

    return {
      firstPick: firstPick as 'GEN' | 'HLE',
      baronTeam: ['GEN', ...baronPicks] as TeamCode[],
      elderTeam: ['HLE', ...elderPicks] as TeamCode[],
      pickOrder: picks,
    };
  } catch {
    return null;
  }
}
