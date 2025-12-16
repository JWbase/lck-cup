// 팀 코드 타입
export type TeamCode = 'GEN' | 'HLE' | 'T1' | 'KT' | 'DK' | 'BFX' | 'NS' | 'BRO' | 'DRX' | 'DNF';

// 드래프트 가능 팀 (GEN, HLE 제외)
export type DraftableTeam = Exclude<TeamCode, 'GEN' | 'HLE'>;

// 로스터 타입
export interface Roster {
  top: string;
  jungle: string;
  mid: string;
  adc: string;
  support: string;
}

// 팀 정보 타입
export interface Team {
  code: TeamCode;
  name: string;
  shortName: string;
  roster: Roster;
}

// 개별 픽 정보
export interface DraftPick {
  pickNumber: number;
  team: 'GEN' | 'HLE';
  picked: DraftableTeam;
}

// 드래프트 결과 타입
export interface DraftResult {
  firstPick: 'GEN' | 'HLE';
  baronTeam: TeamCode[];
  elderTeam: TeamCode[];
  pickOrder: DraftPick[];
}

// 드래프트 진행 상태
export interface DraftState {
  firstPick: 'GEN' | 'HLE';
  currentPickIndex: number; // 0-7
  baronTeam: TeamCode[];
  elderTeam: TeamCode[];
  pickOrder: DraftPick[];
  availableTeams: DraftableTeam[];
}

// 앱 상태
export type AppPhase = 'selection' | 'drafting' | 'result';

// 팀 구성 통계 (순서 무관, 정렬된 팀 코드로 식별)
export interface TeamCompositionStat {
  id: string;
  composition_key: string; // 정렬된 팀 코드 (예: "BFX,DK,GEN,NS,T1")
  team_type: 'baron' | 'elder';
  teams: TeamCode[];
  count: number;
  percentage?: number;
}

// DB에 저장되는 드래프트 결과
export interface DraftResultRecord {
  id?: string;
  first_pick: 'GEN' | 'HLE';
  baron_composition: string; // 정렬된 팀 코드
  elder_composition: string; // 정렬된 팀 코드
  baron_teams: TeamCode[];
  elder_teams: TeamCode[];
  created_at?: string;
}
