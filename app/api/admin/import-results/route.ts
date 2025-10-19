import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as XLSX from "xlsx"
import fs from "fs"
import path from "path"
import type { LotteryResult } from "@/lib/types"

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
    throw new Error(`Arquivo não encontrado: ${filePath}`)
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

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated and is admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { results, source } = body || {}

    let resultsToImport = Array.isArray(results) ? results : []

    // Import from local Excel if requested
    if (source === "excel") {
      const filePath = path.join(process.cwd(), "resultados", "Lotofácil.xlsx")
      try {
        resultsToImport = parseExcelResults(filePath)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return NextResponse.json({ error: `Falha ao ler Excel: ${message}` }, { status: 400 })
      }
    }

    if (!Array.isArray(resultsToImport) || resultsToImport.length === 0) {
      return NextResponse.json({ error: "Invalid results data" }, { status: 400 })
    }

    const imported: LotteryResult[] = []
    const errors: string[] = []

    for (const result of resultsToImport as { contest_number: number; draw_date: string; numbers: number[] }[]) {
      try {
        const { data: existing } = await supabase
          .from("lottery_results")
          .select("id")
          .eq("contest_number", result.contest_number)
          .single()

        if (existing) {
          errors.push(`Concurso ${result.contest_number} já existe`)
          continue
        }

        const { data, error } = await supabase
          .from("lottery_results")
          .insert({
            contest_number: result.contest_number,
            draw_date: result.draw_date,
            numbers: result.numbers,
          })
          .select()
          .single()

        if (error) throw error
        imported.push(data as LotteryResult)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        console.error(`Error importing contest ${result.contest_number}:`, message)
        errors.push(`Erro no concurso ${result.contest_number}: ${message}`)
      }
    }

    return NextResponse.json({
      imported,
      errors,
      summary: { total: resultsToImport.length, imported: imported.length, errors: errors.length },
    })
  } catch (error) {
    console.error("Import API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
