import { Team, TeamCode, DraftableTeam } from '@/types';

export const TEAMS: Record<TeamCode, Team> = {
  GEN: {
    code: 'GEN',
    name: '젠지 이스포츠',
    shortName: 'Gen.G',
    roster: {
      top: 'Kiin',
      jungle: 'Canyon',
      mid: 'Chovy',
      adc: 'Ruler',
      support: 'Duro',
    },
  },
  HLE: {
    code: 'HLE',
    name: '한화생명 이스포츠',
    shortName: 'HLE',
    roster: {
      top: 'Zeus',
      jungle: 'Kanavi',
      mid: 'Zeka',
      adc: 'Gumayusi',
      support: 'Delight',
    },
  },
  T1: {
    code: 'T1',
    name: 'T1',
    shortName: 'T1',
    roster: {
      top: 'Doran',
      jungle: 'Oner',
      mid: 'Faker',
      adc: 'Peyz',
      support: 'Keria',
    },
  },
  KT: {
    code: 'KT',
    name: 'KT 롤스터',
    shortName: 'KT',
    roster: {
      top: 'Perfect',
      jungle: 'Cuzz',
      mid: 'Bdd',
      adc: 'Aiming',
      support: 'Ghost',
    },
  },
  DK: {
    code: 'DK',
    name: '디플러스 기아',
    shortName: 'DK',
    roster: {
      top: 'Siwoo',
      jungle: 'Lucid',
      mid: 'ShowMaker',
      adc: 'Smash',
      support: 'Career',
    },
  },
  BFX: {
    code: 'BFX',
    name: 'BNK FearX',
    shortName: 'FearX',
    roster: {
      top: 'Clear',
      jungle: 'Raptor',
      mid: 'VicLa',
      adc: 'Diable',
      support: 'Kellin',
    },
  },
  NS: {
    code: 'NS',
    name: '농심 레드포스',
    shortName: 'NS',
    roster: {
      top: 'Kingen',
      jungle: 'Sponge',
      mid: 'Scout',
      adc: 'Taeyoon',
      support: 'Lehends',
    },
  },
  BRO: {
    code: 'BRO',
    name: 'OK저축은행 브리온',
    shortName: 'BRO',
    roster: {
      top: 'Casting',
      jungle: 'GIDEON',
      mid: 'Fisher',
      adc: 'Teddy',
      support: 'Namgung',
    },
  },
  DRX: {
    code: 'DRX',
    name: 'DRX',
    shortName: 'DRX',
    roster: {
      top: 'Rich',
      jungle: 'Vincenzo',
      mid: 'Ucal',
      adc: 'Jiwoo',
      support: 'Andil',
    },
  },
  DNF: {
    code: 'DNF',
    name: 'DN 프릭스',
    shortName: 'DNF',
    roster: {
      top: 'DuDu',
      jungle: 'Pyosik',
      mid: 'Clozer',
      adc: 'deokdam',
      support: 'Peter',
    },
  },
};

// 드래프트 대상 팀 목록 (GEN, HLE 제외)
export const DRAFTABLE_TEAMS: DraftableTeam[] = [
  'T1', 'KT', 'DK', 'BFX', 'NS', 'BRO', 'DRX', 'DNF'
];

// 픽 순서 정의 (스네이크 드래프트)
export const PICK_ORDER = {
  GEN_FIRST: ['GEN', 'HLE', 'HLE', 'GEN', 'GEN', 'HLE', 'HLE', 'GEN'] as const,
  HLE_FIRST: ['HLE', 'GEN', 'GEN', 'HLE', 'HLE', 'GEN', 'GEN', 'HLE'] as const,
};

// 팀 로고 경로 헬퍼
export function getTeamLogoPath(teamCode: TeamCode): string {
  return `/logos/${teamCode.toLowerCase()}.svg`;
}
