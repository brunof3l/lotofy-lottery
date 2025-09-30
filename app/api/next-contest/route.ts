import { NextResponse } from "next/server"
import { CaixaApiService } from "@/lib/services/caixa-api"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const latestResult = await CaixaApiService.getLatestResult()

    if (!latestResult) {
      return NextResponse.json(
        { error: "Não foi possível obter informações do próximo concurso" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        next_contest: latestResult.next_contest,
        next_contest_date: latestResult.next_contest_date,
        estimated_prize: latestResult.estimated_next_prize,
        current_contest: latestResult.contest_number,
        current_contest_date: latestResult.draw_date
      }
    })
  } catch (error) {
    console.error("Erro ao buscar próximo concurso:", error)
    return NextResponse.json(
      { 
        error: "Erro interno do servidor", 
        message: error instanceof Error ? error.message : "Erro desconhecido"
      }, 
      { status: 500 }
    )
  }
}
