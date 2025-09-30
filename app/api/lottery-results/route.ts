import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { CaixaApiService } from "@/lib/services/caixa-api"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get("limit") || "10"

  try {
    let { data, error } = await supabase
      .from("lottery_results")
      .select("*")
      .order("contest_number", { ascending: false })
      .limit(Number.parseInt(limit))

    if (error) throw error

    // Se não houver resultados ainda, sincroniza o último automaticamente
    if (!data || data.length === 0) {
      const sync = await CaixaApiService.syncLatestResult(admin)
      if (sync.success) {
        const res = await supabase
          .from("lottery_results")
          .select("*")
          .order("contest_number", { ascending: false })
          .limit(Number.parseInt(limit))
        data = res.data ?? []
      }
    }

    return NextResponse.json({ data })
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
