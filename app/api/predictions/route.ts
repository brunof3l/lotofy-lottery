import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
   const supabase = await createClient()

   try {
     const {
       data: { user },
     } = await supabase.auth.getUser()
     if (!user) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
     }

     const { data, error } = await supabase
       .from("user_predictions")
       .select("*")
       .eq("user_id", user.id)
       .order("created_at", { ascending: false })
       .limit(10)

     if (error) throw error

     return NextResponse.json({ data })
   } catch (error) {
     console.error("Error fetching predictions:", error)
     return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 })
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
    const { predicted_numbers, prediction_method, confidence_score, contest_number } = body

    // Validate input
    if (!predicted_numbers || predicted_numbers.length !== 15 || !prediction_method) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("user_predictions")
      .insert({
        user_id: user.id,
        predicted_numbers,
        prediction_method,
        confidence_score: confidence_score || null,
        contest_number: contest_number || null,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error creating prediction:", error)
    return NextResponse.json({ error: "Failed to create prediction" }, { status: 500 })
  }
}
