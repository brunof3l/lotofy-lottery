import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CaixaApiService } from "@/lib/services/caixa-api"

export const dynamic = "force-dynamic"

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

    // Verificar se é admin (opcional - pode ser removido se quiser que qualquer usuário possa sincronizar)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    // Comentado para permitir que qualquer usuário sincronize
    // if (!profile || profile.role !== "admin") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    // Sincronizar o último resultado
    const syncResult = await CaixaApiService.syncLatestResult(supabase)

    if (!syncResult.success) {
      return NextResponse.json(
        { 
          error: "Falha na sincronização", 
          message: syncResult.message 
        }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: syncResult.message,
      data: syncResult.data
    })
  } catch (error) {
    console.error("Erro na sincronização:", error)
    return NextResponse.json(
      { 
        error: "Erro interno do servidor", 
        message: error instanceof Error ? error.message : "Erro desconhecido"
      }, 
      { status: 500 }
    )
  }
}

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
        : `Concurso ${latestResult.contest_number} disponível para sincronização`
    })
  } catch (error) {
    console.error("Erro ao buscar último resultado:", error)
    return NextResponse.json(
      { 
        error: "Erro interno do servidor", 
        message: error instanceof Error ? error.message : "Erro desconhecido"
      }, 
      { status: 500 }
    )
  }
}
