import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { CaixaApiService } from "@/lib/services/caixa-api"
import { type NextRequest, NextResponse } from "next/server"
import type { LotteryResult } from "@/lib/types"
import * as XLSX from "xlsx"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function buildRowsFromSheet(sheet: XLSX.WorkSheet): Array<(string | number | null)[]> {
  const cellKeys = Object.keys(sheet).filter((k) => /^[A-Z]+\d+$/.test(k))
  let maxRow = 0
  let maxCol = 0
  const cells = new Map<string, string | number | null>()
  for (const key of cellKeys) {
    const { r, c } = XLSX.utils.decode_cell(key)
    maxRow = Math.max(maxRow, r)
    maxCol = Math.max(maxCol, c)
    const cellObj = (sheet as Record<string, unknown>)[key]
    let valOut: string | number | null = null
    if (cellObj && typeof cellObj === "object" && "v" in (cellObj as Record<string, unknown>)) {
      const v = (cellObj as { v: unknown }).v
      if (typeof v === "number" || typeof v === "string") {
        valOut = v
      } else if (typeof v === "boolean") {
        valOut = v ? 1 : 0
      } else {
        valOut = null
      }
    }
    cells.set(`${r}:${c}`, valOut)
  }
  const rows: Array<(string | number | null)[]> = []
  for (let r = 0; r <= maxRow; r++) {
    const row: (string | number | null)[] = []
    for (let c = 0; c <= maxCol; c++) {
      const val = cells.get(`${r}:${c}`)
      row.push(val ?? null)
    }
    rows.push(row)
  }
  return rows
}

function parseExcelResults(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return []
  }
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  let rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true }) as unknown as Array<(string | number | null)[]>
  if (!rows || rows.length <= 1) {
    rows = buildRowsFromSheet(sheet)
  }

  // Detect header
  let headerRowIndex = 0
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i] || []
    const joined = row.map((v) => String(v ?? "").toLowerCase()).join(" ")
    if (joined.includes("concurso") || joined.includes("data")) {
      headerRowIndex = i
      break
    }
  }
  const header = (rows[headerRowIndex] || []).map((v) => String(v ?? "").toLowerCase())
  const contestIdx = header.findIndex((h: string) => h.includes("concurso"))
  const dateIdx = header.findIndex((h: string) => h.includes("data"))

  const results: { contest_number: number; draw_date: string; numbers: number[] }[] = []
  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r] || []
    const rawContest = contestIdx >= 0 ? row[contestIdx] : row[0]
    const rawDate = dateIdx >= 0 ? row[dateIdx] : row[1]
    const contest_number = parseInt(String(rawContest).replace(/[^0-9]/g, ""), 10)
    if (!Number.isFinite(contest_number)) continue

    let draw_date: string | null = null
    if (typeof rawDate === "number") {
      const date = XLSX.SSF.parse_date_code(rawDate)
      if (date) {
        const jsDate = new Date(Date.UTC(date.y, date.m - 1, date.d))
        draw_date = jsDate.toISOString().slice(0, 10)
      }
    } else if (typeof rawDate === "string") {
      const trimmed = rawDate.trim()
      const parts = trimmed.split(/[\/\-]/)
      if (parts.length >= 3) {
        if (parts[0].length === 4) {
          draw_date = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`
        } else {
          draw_date = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
        }
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        draw_date = trimmed
      }
    }

    const nums: number[] = []
    const seen = new Set<number>()
    for (const cell of row) {
      const n = parseInt(String(cell ?? "").trim(), 10)
      if (Number.isFinite(n) && n >= 1 && n <= 25) {
        if (!seen.has(n)) {
          seen.add(n)
          nums.push(n)
        }
      }
    }
    if (nums.length !== 15) continue
    if (!draw_date) continue
    nums.sort((a, b) => a - b)
    results.push({ contest_number, draw_date, numbers: nums })
  }
  return results
}

function getExcelRecentResults(limit: number): LotteryResult[] {
  try {
    const filePath = path.join(process.cwd(), "resultados", "Lotofácil.xlsx")
    const parsed = parseExcelResults(filePath)
    if (!parsed || parsed.length === 0) return []
    return parsed
      .sort((a, b) => b.contest_number - a.contest_number)
      .slice(0, limit)
      .map((r) => ({
        id: `local-${r.contest_number}`,
        contest_number: r.contest_number,
        draw_date: r.draw_date,
        numbers: r.numbers,
        created_at: new Date().toISOString(),
      }))
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "10", 10)

  const excelRecent = getExcelRecentResults(limit)

  // Se a planilha trouxe dados, priorizar e retornar imediatamente
  if (excelRecent.length > 0) {
    return NextResponse.json({ data: excelRecent })
  }

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

    // Mesclar: planilha local tem prioridade, depois banco e por fim Caixa
    const byContest = new Map<number, LotteryResult>()
    for (const r of excelRecent) {
      byContest.set(r.contest_number, r)
    }
    const dbData: LotteryResult[] = (data ?? []) as LotteryResult[]
    for (const r of dbData) {
      if (!byContest.has(r.contest_number)) byContest.set(r.contest_number, r)
    }
    // Se o upsert falhou por permissão mas temos latest da Caixa, injeta no topo para exibição.
    if (upsertFailed && latestCaixa && !byContest.has(latestCaixa.contest_number)) {
      byContest.set(latestCaixa.contest_number, {
        id: 'volatile',
        contest_number: latestCaixa.contest_number,
        draw_date: latestCaixa.draw_date,
        numbers: latestCaixa.numbers,
        created_at: new Date().toISOString(),
      })
    }

    const finalData = Array.from(byContest.values())
      .sort((a, b) => b.contest_number - a.contest_number)
      .slice(0, limit)

    return NextResponse.json({ data: finalData })
  } catch (error) {
    console.error("Error fetching lottery results:", error)
    // Evitar 500: retornar lista vazia para não quebrar UI
    return NextResponse.json({ data: [] })
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
