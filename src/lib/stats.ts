import { getSupabase, isSupabaseConfigured } from './supabase';
import { DraftResult, TeamCode, TeamCompositionStat, DraftResultRecord } from '@/types';

// 팀 구성을 정렬된 키로 변환 (순서 무관하게 비교하기 위함)
export function createCompositionKey(teams: TeamCode[]): string {
  return [...teams].sort().join(',');
}

// 드래프트 결과 저장
export async function saveDraftResult(result: DraftResult): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn('Supabase not configured');
    return false;
  }

  const record: Omit<DraftResultRecord, 'id' | 'created_at'> = {
    first_pick: result.firstPick,
    baron_composition: createCompositionKey(result.baronTeam),
    elder_composition: createCompositionKey(result.elderTeam),
    baron_teams: result.baronTeam,
    elder_teams: result.elderTeam,
  };

  const { error } = await supabase
    .from('draft_results')
    .insert(record);

  if (error) {
    console.error('Failed to save draft result:', error);
    return false;
  }

  return true;
}

// 팀 구성별 통계 조회 (TOP 20)
export async function getCompositionStats(
  teamType: 'baron' | 'elder',
  limit: number = 20
): Promise<TeamCompositionStat[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  // 전체 데이터 조회
  const { data, error } = await supabase
    .from('draft_results')
    .select('baron_composition, elder_composition, baron_teams, elder_teams')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch stats:', error);
    return [];
  }

  // 구성별 집계
  const countMap = new Map<string, { count: number; teams: TeamCode[] }>();

  data.forEach((row) => {
    const key = teamType === 'baron' ? row.baron_composition : row.elder_composition;
    const teams = (teamType === 'baron' ? row.baron_teams : row.elder_teams) as TeamCode[];

    if (countMap.has(key)) {
      countMap.get(key)!.count++;
    } else {
      countMap.set(key, { count: 1, teams });
    }
  });

  // 배열로 변환 및 정렬
  const total = data.length;
  const stats: TeamCompositionStat[] = Array.from(countMap.entries())
    .map(([key, value], index) => ({
      id: `${teamType}-${index}`,
      composition_key: key,
      team_type: teamType,
      teams: value.teams,
      count: value.count,
      percentage: total > 0 ? (value.count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return stats;
}

// 전체 통계 조회
export async function getAllStats(): Promise<{
  baron: TeamCompositionStat[];
  elder: TeamCompositionStat[];
  totalCount: number;
}> {
  const supabase = getSupabase();
  if (!supabase) {
    return { baron: [], elder: [], totalCount: 0 };
  }

  const [baronStats, elderStats, countResult] = await Promise.all([
    getCompositionStats('baron', 20),
    getCompositionStats('elder', 20),
    supabase.from('draft_results').select('*', { count: 'exact', head: true }),
  ]);

  return {
    baron: baronStats,
    elder: elderStats,
    totalCount: countResult.count || 0,
  };
}
