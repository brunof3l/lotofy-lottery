import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get("limit") || "10"

  try {
    const { data, error } = await supabase
      .from("lottery_results")
      .select("*")
      .order("contest_number", { ascending: false })
      .limit(Number.parseInt(limit))

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching lottery results:", error)
    return NextResponse.json({ error: "Failed to fetch lottery results" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { contest_number, draw_date, numbers } = body

    // Validate input
    if (!contest_number || !draw_date || !numbers || numbers.length !== 15) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    const { data, error } = await supabase
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
