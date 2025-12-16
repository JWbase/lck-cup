import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 연결 여부 확인
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your-project-url' &&
    supabaseUrl.startsWith('https://')
  );
}

// 조건부로 클라이언트 생성
let _supabase: SupabaseClient | null = null;

export const supabase = (() => {
  if (!_supabase && isSupabaseConfigured()) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
})() as SupabaseClient;

// 안전한 supabase 접근
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}
