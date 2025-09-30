import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PrizeCheckerService } from "@/lib/services/prize-checker"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar se o usuário está autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const contestNumber = url.searchParams.get('contest')

    let result

    if (contestNumber) {
      // Verificar prêmios para um concurso específico
      const contestNum = parseInt(contestNumber)
      if (isNaN(contestNum)) {
        return NextResponse.json(
          { error: "Número do concurso inválido" },
          { status: 400 }
        )
      }

      result = await PrizeCheckerService.checkUserPredictionsForContest(
        user.id,
        contestNum,
        supabase
      )
    } else {
      // Verificar todas as previsões do usuário
      result = await PrizeCheckerService.checkAllUserPredictions(
        user.id,
        supabase
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("Erro ao verificar prêmios:", error)
    return NextResponse.json(
      { 
        error: "Erro interno do servidor", 
        message: error instanceof Error ? error.message : "Erro desconhecido"
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar se o usuário está autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { contestNumber, predictionIds } = body

    if (!contestNumber) {
      return NextResponse.json(
        { error: "Número do concurso é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar previsões específicas se IDs foram fornecidos
    let predictions
    if (predictionIds && predictionIds.length > 0) {
      const { data, error } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('user_id', user.id)
        .eq('contest_number', contestNumber)
        .in('id', predictionIds)

      if (error) throw error
      predictions = data || []
    } else {
      const { data, error } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('user_id', user.id)
        .eq('contest_number', contestNumber)

      if (error) throw error
      predictions = data || []
    }

    if (predictions.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Nenhuma previsão encontrada para este concurso"
      })
    }

    // Buscar resultado do concurso
    const { data: result, error: resultError } = await supabase
      .from('lottery_results')
      .select('numbers')
      .eq('contest_number', contestNumber)
      .single()

    if (resultError || !result) {
      return NextResponse.json(
        { error: `Resultado do concurso ${contestNumber} não encontrado` },
        { status: 404 }
      )
    }

    const drawnNumbers = result.numbers
    const prizeResults = []

    // Verificar cada previsão
    for (const prediction of predictions) {
      const { matches, misses, matchCount } = PrizeCheckerService.checkMatches(
        prediction.predicted_numbers,
        drawnNumbers
      )

      const { level, description, isWinner } = PrizeCheckerService.getPrizeLevel(matchCount)

      prizeResults.push({
        prediction_id: prediction.id,
        contest_number: contestNumber,
        predicted_numbers: prediction.predicted_numbers,
        drawn_numbers: drawnNumbers,
        matches,
        misses,
        match_count: matchCount,
        prize_level: level,
        prize_description: description,
        is_winner: isWinner,
        created_at: prediction.created_at,
        prediction_method: prediction.prediction_method,
        confidence_score: prediction.confidence_score
      })
    }

    // Calcular estatísticas
    const stats = PrizeCheckerService.calculatePerformanceStats(prizeResults)

    return NextResponse.json({
      success: true,
      data: {
        results: prizeResults,
        statistics: stats,
        contest_info: {
          contest_number: contestNumber,
          drawn_numbers: drawnNumbers,
          total_predictions_checked: predictions.length
        }
      }
    })
  } catch (error) {
    console.error("Erro ao verificar prêmios:", error)
    return NextResponse.json(
      { 
        error: "Erro interno do servidor", 
        message: error instanceof Error ? error.message : "Erro desconhecido"
      }, 
      { status: 500 }
    )
  }
}
