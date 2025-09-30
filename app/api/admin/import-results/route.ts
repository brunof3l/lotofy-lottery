import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
    const { results } = body

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "Invalid results data" }, { status: 400 })
    }

    const imported = []
    const errors = []

    for (const result of results) {
      try {
        // Check if contest already exists
        const { data: existing } = await supabase
          .from("lottery_results")
          .select("id")
          .eq("contest_number", result.contest_number)
          .single()

        if (existing) {
          errors.push(`Concurso ${result.contest_number} já existe`)
          continue
        }

        // Insert new result
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

        imported.push(data)
      } catch (error) {
        console.error(`Error importing contest ${result.contest_number}:`, error)
        errors.push(`Erro no concurso ${result.contest_number}: ${error}`)
      }
    }

    return NextResponse.json({
      imported,
      errors,
      summary: {
        total: results.length,
        imported: imported.length,
        errors: errors.length,
      },
    })
  } catch (error) {
    console.error("Import API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
