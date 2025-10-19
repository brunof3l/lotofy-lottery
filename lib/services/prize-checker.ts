// lib/services/prize-checker.ts
import type { SupabaseClient } from '@supabase/supabase-js'

export interface PrizeCheckResult {
  prediction_id: string
  contest_number: number
  predicted_numbers: number[]
  drawn_numbers: number[]
  matches: number[]
  misses: number[]
  prize_level: number | null
  prize_description: string | null
  is_winner: boolean
  created_at: string
}

export interface PrizeLevel {
  level: number
  description: string
  matches_required: number
  typical_prize: number
}

export interface UserPrediction {
  id: string
  user_id: string
  contest_number: number
  predicted_numbers: number[]
  created_at: string
}

export interface LotteryResult {
  contest_number: number
  numbers: number[]
}

const LOTOFACIL_PRIZE_LEVELS: PrizeLevel[] = [
  { level: 1, description: "15 acertos", matches_required: 15, typical_prize: 1500000 },
  { level: 2, description: "14 acertos", matches_required: 14, typical_prize: 2000 },
  { level: 3, description: "13 acertos", matches_required: 13, typical_prize: 30 },
  { level: 4, description: "12 acertos", matches_required: 12, typical_prize: 12 },
  { level: 5, description: "11 acertos", matches_required: 11, typical_prize: 6 },
]

export class PrizeCheckerService {
  /**
   * Verifica quantos números coincidem entre duas listas
   */
  static checkMatches(predictedNumbers: number[], drawnNumbers: number[]): {
    matches: number[]
    misses: number[]
    matchCount: number
  } {
    const matches = predictedNumbers.filter(num => drawnNumbers.includes(num))
    const misses = predictedNumbers.filter(num => !drawnNumbers.includes(num))
    
    return {
      matches,
      misses,
      matchCount: matches.length
    }
  }

  /**
   * Determina o nível de prêmio baseado no número de acertos
   */
  static getPrizeLevel(matchCount: number): {
    level: number | null
    description: string | null
    isWinner: boolean
  } {
    const prizeLevel = LOTOFACIL_PRIZE_LEVELS.find(level => level.matches_required === matchCount)
    
    if (prizeLevel) {
      return {
        level: prizeLevel.level,
        description: prizeLevel.description,
        isWinner: true
      }
    }

    return {
      level: null,
      description: matchCount >= 11 ? `${matchCount} acertos (sem prêmio)` : `${matchCount} acertos`,
      isWinner: false
    }
  }

  /**
   * Verifica prêmios para todas as previsões de um usuário em um concurso específico
   */
  static async checkUserPredictionsForContest(
    userId: string, 
    contestNumber: number, 
    supabase: SupabaseClient
  ): Promise<PrizeCheckResult[]> {
    try {
      // Buscar previsões do usuário para o concurso
      const { data: predictions, error: predictionsError } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('user_id', userId)
        .eq('contest_number', contestNumber)

      if (predictionsError) {
        throw predictionsError
      }

      if (!predictions || predictions.length === 0) {
        return []
      }

      // Buscar resultado do concurso
      const { data: result, error: resultError } = await supabase
        .from('lottery_results')
        .select('numbers')
        .eq('contest_number', contestNumber)
        .single()

      if (resultError || !result) {
        throw new Error(`Resultado do concurso ${contestNumber} não encontrado`)
      }

      const drawnNumbers = (result as LotteryResult).numbers
      const prizeResults: PrizeCheckResult[] = []

      // Verificar cada previsão
      for (const prediction of predictions as UserPrediction[]) {
        const { matches, misses, matchCount } = this.checkMatches(
          prediction.predicted_numbers,
          drawnNumbers
        )

        const { level, description, isWinner } = this.getPrizeLevel(matchCount)

        const prizeResult: PrizeCheckResult = {
          prediction_id: prediction.id,
          contest_number: contestNumber,
          predicted_numbers: prediction.predicted_numbers,
          drawn_numbers: drawnNumbers,
          matches,
          misses,
          prize_level: level,
          prize_description: description,
          is_winner: isWinner,
          created_at: prediction.created_at
        }

        prizeResults.push(prizeResult)
      }

      return prizeResults
    } catch (error) {
      console.error('Erro ao verificar prêmios:', error)
      throw error
    }
  }

  /**
   * Verifica prêmios para todas as previsões de um usuário em todos os concursos
   */
  static async checkAllUserPredictions(
    userId: string, 
    supabase: SupabaseClient
  ): Promise<{
    totalPredictions: number
    totalWinners: number
    prizeBreakdown: Record<string, number>
    recentResults: PrizeCheckResult[]
  }> {
    try {
      // Buscar todas as previsões do usuário com concurso
      const { data: predictions, error: predictionsError } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('user_id', userId)
        .not('contest_number', 'is', null)
        .order('contest_number', { ascending: false })

      if (predictionsError) {
        throw predictionsError
      }

      if (!predictions || predictions.length === 0) {
        return {
          totalPredictions: 0,
          totalWinners: 0,
          prizeBreakdown: {},
          recentResults: []
        }
      }

      // Agrupar por concurso
      const predictionsByContest = (predictions as UserPrediction[]).reduce((acc, prediction) => {
        if (!acc[prediction.contest_number]) {
          acc[prediction.contest_number] = []
        }
        acc[prediction.contest_number].push(prediction)
        return acc
      }, {} as Record<number, UserPrediction[]>)

      let totalWinners = 0
      const prizeBreakdown: Record<string, number> = {}
      const allResults: PrizeCheckResult[] = []

      // Verificar cada concurso
      for (const contestNumber of Object.keys(predictionsByContest)) {
        try {
          const contestResults = await this.checkUserPredictionsForContest(
            userId, 
            parseInt(contestNumber), 
            supabase
          )

          allResults.push(...contestResults)

          // Contar ganhadores
          contestResults.forEach(result => {
            if (result.is_winner) {
              totalWinners++
              const key = result.prize_description || 'Desconhecido'
              prizeBreakdown[key] = (prizeBreakdown[key] || 0) + 1
            }
          })
        } catch (error) {
          console.error(`Erro ao verificar concurso ${contestNumber}:`, error)
        }
      }

      // Pegar os 10 resultados mais recentes
      const recentResults = allResults
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)

      return {
        totalPredictions: predictions.length,
        totalWinners,
        prizeBreakdown,
        recentResults
      }
    } catch (error) {
      console.error('Erro ao verificar todas as previsões:', error)
      throw error
    }
  }

  /**
   * Calcula estatísticas de performance do usuário
   */
  static calculatePerformanceStats(prizeResults: PrizeCheckResult[]): {
    totalPredictions: number
    totalWinners: number
    winRate: number
    averageMatches: number
    bestResult: number
    prizeDistribution: Record<string, number>
  } {
    if (prizeResults.length === 0) {
      return {
        totalPredictions: 0,
        totalWinners: 0,
        winRate: 0,
        averageMatches: 0,
        bestResult: 0,
        prizeDistribution: {}
      }
    }

    const totalPredictions = prizeResults.length
    const totalWinners = prizeResults.filter(r => r.is_winner).length
    const winRate = (totalWinners / totalPredictions) * 100
    
    const averageMatches = prizeResults.reduce((sum, r) => sum + r.matches.length, 0) / totalPredictions
    const bestResult = Math.max(...prizeResults.map(r => r.matches.length))
    
    const prizeDistribution = prizeResults.reduce((acc, result) => {
      if (result.is_winner && result.prize_description) {
        acc[result.prize_description] = (acc[result.prize_description] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return {
      totalPredictions,
      totalWinners,
      winRate,
      averageMatches,
      bestResult,
      prizeDistribution
    }
  }
}
