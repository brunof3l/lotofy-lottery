import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { CaixaApiService } from "@/lib/services/caixa-api"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "10", 10)

  try {
    // 1) Obter o maior contest_number já salvo
    const { data: latestDb, error: latestDbError } = await supabase
      .from("lottery_results")
      .select("contest_number")
      .order("contest_number", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (latestDbError) throw latestDbError

    // 2) Consultar o mais recente da Caixa
    const latestCaixa = await CaixaApiService.getLatestResult()

    // 3) Se não houver dados no banco ou se a Caixa estiver com concurso mais novo, upsert
    let upsertFailed = false
    if (latestCaixa && (!latestDb || latestCaixa.contest_number > latestDb.contest_number)) {
      const { error: upsertError } = await admin
        .from("lottery_results")
        .upsert(
          {
            contest_number: latestCaixa.contest_number,
            draw_date: latestCaixa.draw_date,
            numbers: latestCaixa.numbers,
          },
          { onConflict: "contest_number" }
        )
      if (upsertError) {
        upsertFailed = true
        console.error('Upsert lottery_results falhou:', upsertError.message || upsertError)
      }
    }

    // 4) Retornar a lista atualizada
    const { data, error } = await supabase
      .from("lottery_results")
      .select("*")
      .order("contest_number", { ascending: false })
      .limit(limit)

    if (error) throw error

    // Se o upsert falhou por permissão mas temos latest da Caixa, injeta no topo para exibição.
    let finalData = data || []
    if (upsertFailed && latestCaixa) {
      const exists = finalData.some(r => r.contest_number === latestCaixa.contest_number)
      if (!exists) {
        finalData = [
          {
            id: 'volatile',
            contest_number: latestCaixa.contest_number,
            draw_date: latestCaixa.draw_date,
            numbers: latestCaixa.numbers,
            created_at: new Date().toISOString(),
          },
          ...finalData,
        ]
      }
    }

    return NextResponse.json({ data: finalData })
  } catch (error) {
    console.error("Error fetching lottery results:", error)
    return NextResponse.json({ error: "Failed to fetch lottery results" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = createAdminClient()

  try {
    // Agora criação via service role; sem exigir autenticação do usuário
    const body = await request.json()
    const { contest_number, draw_date, numbers } = body

    // Validate input
    if (!contest_number || !draw_date || !numbers || numbers.length !== 15) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    const { data, error } = await admin
      .from("lottery_results")
      .insert({
        contest_number,
        draw_date,
        numbers,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error creating lottery result:", error)
    return NextResponse.json({ error: "Failed to create lottery result" }, { status: 500 })
  }
}
