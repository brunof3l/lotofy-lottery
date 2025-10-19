import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { CaixaApiService } from "@/lib/services/caixa-api"

export const dynamic = "force-dynamic"

// Agora sem exigir autenticação e usando service role no servidor
export async function POST() {
  try {
    const supabase = createAdminClient()

    // Sincronizar o último resultado
    const syncResult = await CaixaApiService.syncLatestResult(supabase)

    if (!syncResult.success) {
      return NextResponse.json(
        {
          error: "Falha na sincronização",
          message: syncResult.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: syncResult.message,
      data: syncResult.data,
    })
  } catch (error) {
    console.error("Erro na sincronização:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
        { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Buscar o último resultado da API sem salvar no banco
    const latestResult = await CaixaApiService.getLatestResult()

    if (!latestResult) {
      return NextResponse.json(
        { error: "Não foi possível obter o último resultado" },
        { status: 500 }
      )
    }

    // Verificar se já existe no banco
    const exists = await CaixaApiService.checkContestExists(latestResult.contest_number, supabase)

    return NextResponse.json({
      success: true,
      data: latestResult,
      exists_in_database: exists,
      message: exists
        ? `Concurso ${latestResult.contest_number} já existe no banco`
        : `Concurso ${latestResult.contest_number} disponível para sincronização`,
    })
  } catch (error) {
    console.error("Erro ao buscar último resultado:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}
