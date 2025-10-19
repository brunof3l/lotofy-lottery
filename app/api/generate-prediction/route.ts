import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import type { NumberStatistic } from "@/lib/types"

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
    const { method, recency_alpha } = body
    const alpha = typeof recency_alpha === "number" && Number.isFinite(recency_alpha) ? recency_alpha : 1.6

    // Get number statistics for intelligent prediction
    const { data: stats, error: statsError } = await supabase
      .from("number_statistics")
      .select("*")
      .order("number_value", { ascending: true })

    if (statsError) throw statsError

    const statsTyped: NumberStatistic[] = (stats ?? []) as NumberStatistic[]

    let prediction: number[] = []
    let confidence = 0.75

    switch (method) {
      case "statistical":
        // Use frequency + strong recency weighting
        prediction = generateStatisticalPrediction(statsTyped, alpha)
        confidence = 0.86
        break
      case "ai":
        // Simulate AI prediction (placeholder)
        prediction = generateAIPrediction(statsTyped)
        confidence = 0.78
        break
      case "hot":
        // Focus on hot numbers with recency bias
        prediction = generateHotNumbersPrediction(statsTyped, alpha)
        confidence = 0.74
        break
      case "balanced":
        // Balanced approach with recency bias per faixa
        prediction = generateBalancedPrediction(statsTyped, alpha)
        confidence = 0.82
        break
      default:
        prediction = generateRandomPrediction()
        confidence = 0.65
    }

    return NextResponse.json({
      data: {
        numbers: prediction.sort((a, b) => a - b),
        method,
        confidence,
      },
    })
  } catch (error) {
    console.error("Error generating prediction:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}

function generateStatisticalPrediction(stats: NumberStatistic[], alpha: number): number[] {
  // Weighted by frequency and strong recency (days_since_last_draw)
  const weighted = stats.map((stat) => ({
    number: stat.number_value,
    weight: (stat.frequency + 1) * Math.pow(1 / Math.max(stat.days_since_last_draw, 1), alpha),
  }))

  weighted.sort((a, b) => b.weight - a.weight)

  const prediction: number[] = []
  const used = new Set<number>()

  // Choose top weighted numbers, with slight randomness to avoid overfitting
  for (let i = 0; i < weighted.length && prediction.length < 15; i++) {
    const includeBias = 0.75 // slightly higher inclusion chance
    const shouldInclude = Math.random() < includeBias || prediction.length < 10
    if (shouldInclude && !used.has(weighted[i].number)) {
      prediction.push(weighted[i].number)
      used.add(weighted[i].number)
    }
  }

  // Fill remaining slots randomly (ensuring uniqueness)
  while (prediction.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  return prediction
}

function generateAIPrediction(stats: NumberStatistic[]): number[] {
  // Simulated AI prediction using hot/cold status only (placeholder)
  const hotNumbers = stats.filter((s) => s.hot_cold_status === "hot").map((s) => s.number_value)
  const neutralNumbers = stats.filter((s) => s.hot_cold_status === "neutral").map((s) => s.number_value)
  const coldNumbers = stats.filter((s) => s.hot_cold_status === "cold").map((s) => s.number_value)

  const prediction: number[] = []
  const used = new Set<number>()

  const hotCount = Math.floor(15 * 0.6)
  const neutralCount = Math.floor(15 * 0.3)
  const coldCount = 15 - hotCount - neutralCount

  for (let i = 0; i < hotCount && hotNumbers.length > 0; i++) {
    const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)]
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }
  for (let i = 0; i < neutralCount && neutralNumbers.length > 0; i++) {
    const num = neutralNumbers[Math.floor(Math.random() * neutralNumbers.length)]
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }
  for (let i = 0; i < coldCount && coldNumbers.length > 0; i++) {
    const num = coldNumbers[Math.floor(Math.random() * coldNumbers.length)]
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  while (prediction.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  return prediction
}

function generateHotNumbersPrediction(stats: NumberStatistic[], alpha: number): number[] {
  // Sort hot by combined weight (frequency + strong recency)
  const hotWeighted = stats
    .filter((s) => s.hot_cold_status === "hot")
    .map((s) => ({
      number: s.number_value,
      weight: (s.frequency + 1) * Math.pow(1 / Math.max(s.days_since_last_draw, 1), alpha),
    }))
    .sort((a, b) => b.weight - a.weight)

  const prediction: number[] = []
  const used = new Set<number>()

  for (let i = 0; i < Math.min(12, hotWeighted.length); i++) {
    const n = hotWeighted[i].number
    if (!used.has(n)) {
      prediction.push(n)
      used.add(n)
    }
  }

  while (prediction.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  return prediction
}

function generateBalancedPrediction(stats: NumberStatistic[], alpha: number): number[] {
  const prediction: number[] = []
  const used = new Set<number>()

  const ranges: [number, number][] = [
    [1, 5],
    [6, 10],
    [11, 15],
    [16, 20],
    [21, 25],
  ]

  // For each range, pick top by recency-weighted score
  for (const [start, end] of ranges) {
    const candidates = stats
      .filter((s) => s.number_value >= start && s.number_value <= end)
      .map((s) => ({
        number: s.number_value,
        weight: (s.frequency + 1) * Math.pow(1 / Math.max(s.days_since_last_draw, 1), alpha),
      }))
      .sort((a, b) => b.weight - a.weight)

    let added = 0
    for (const c of candidates) {
      if (added >= 3) break
      if (!used.has(c.number)) {
        prediction.push(c.number)
        used.add(c.number)
        added++
      }
    }
  }

  // If sum less than 15 due to missing stats, fill randomly
  while (prediction.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  return prediction
}

function generateRandomPrediction(): number[] {
  const prediction: number[] = []
  const used = new Set<number>()

  while (prediction.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  return prediction
}
