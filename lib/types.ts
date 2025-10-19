// Tipos compartilhados para o projeto

export interface LotteryResult {
  id?: string
  contest_number: number
  draw_date: string
  numbers: number[]
  created_at?: string
}

export interface UserPrediction {
  id: string
  user_id: string
  contest_number: number | null
  predicted_numbers: number[]
  prediction_method: string
  confidence_score: number | null
  created_at: string
}

export interface UserProfile {
  id: string
  email?: string
  full_name?: string
  role?: 'user' | 'admin'
  created_at?: string
}

export interface User {
  id: string
  email?: string
}

export interface NumberStatistic {
  id: string
  number_value: number
  frequency: number
  last_appearance_contest: number | null
  days_since_last_draw: number
  hot_cold_status: 'hot' | 'cold' | 'neutral'
  updated_at: string
}
// Informação do próximo concurso
export interface NextContestInfo {
  next_contest: number
  next_contest_date: string
  estimated_prize: number
  current_contest: number
  current_contest_date: string
}