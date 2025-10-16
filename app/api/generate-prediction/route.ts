import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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
    const { method } = body

    // Get number statistics for intelligent prediction
    const { data: stats, error: statsError } = await supabase
      .from("number_statistics")
      .select("*")
      .order("number_value", { ascending: true })

    if (statsError) throw statsError

    let prediction: number[] = []
    let confidence = 0.75

    switch (method) {
      case "statistical":
        // Use frequency-based selection
        prediction = generateStatisticalPrediction(stats)
        confidence = 0.85
        break
      case "ai":
        // Simulate AI prediction (in real app, this would call ML model)
        prediction = generateAIPrediction(stats)
        confidence = 0.78
        break
      case "hot":
        // Focus on hot numbers
        prediction = generateHotNumbersPrediction(stats)
        confidence = 0.72
        break
      case "balanced":
        // Balanced approach
        prediction = generateBalancedPrediction(stats)
        confidence = 0.8
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

function generateStatisticalPrediction(stats: any[]): number[] {
  // Select numbers based on frequency and recency
  const weighted = stats.map((stat) => ({
    number: stat.number_value,
    weight: stat.frequency * (1 / Math.max(stat.days_since_last_draw, 1)),
  }))

  weighted.sort((a, b) => b.weight - a.weight)

  const prediction: number[] = []
  const used = new Set<number>()

  // Take top weighted numbers with some randomization
  for (let i = 0; i < weighted.length && prediction.length < 15; i++) {
    const shouldInclude = Math.random() < 0.7 || prediction.length < 10
    if (shouldInclude && !used.has(weighted[i].number)) {
      prediction.push(weighted[i].number)
      used.add(weighted[i].number)
    }
  }

  // Fill remaining slots randomly
  while (prediction.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  return prediction
}

function generateAIPrediction(stats: any[]): number[] {
  // Simulate AI prediction with pattern recognition
  const hotNumbers = stats.filter((s) => s.hot_cold_status === "hot").map((s) => s.number_value)
  const neutralNumbers = stats.filter((s) => s.hot_cold_status === "neutral").map((s) => s.number_value)
  const coldNumbers = stats.filter((s) => s.hot_cold_status === "cold").map((s) => s.number_value)

  const prediction: number[] = []
  const used = new Set<number>()

  // 60% hot, 30% neutral, 10% cold
  const hotCount = Math.floor(15 * 0.6)
  const neutralCount = Math.floor(15 * 0.3)
  const coldCount = 15 - hotCount - neutralCount

  // Add hot numbers
  for (let i = 0; i < hotCount && hotNumbers.length > 0; i++) {
    const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)]
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  // Add neutral numbers
  for (let i = 0; i < neutralCount && neutralNumbers.length > 0; i++) {
    const num = neutralNumbers[Math.floor(Math.random() * neutralNumbers.length)]
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  // Add cold numbers
  for (let i = 0; i < coldCount && coldNumbers.length > 0; i++) {
    const num = coldNumbers[Math.floor(Math.random() * coldNumbers.length)]
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  // Fill remaining slots
  while (prediction.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  return prediction
}

function generateHotNumbersPrediction(stats: any[]): number[] {
  const hotNumbers = stats
    .filter((s) => s.hot_cold_status === "hot")
    .sort((a, b) => b.frequency - a.frequency)
    .map((s) => s.number_value)

  const prediction: number[] = []
  const used = new Set<number>()

  // Use mostly hot numbers
  for (let i = 0; i < Math.min(12, hotNumbers.length); i++) {
    prediction.push(hotNumbers[i])
    used.add(hotNumbers[i])
  }

  // Fill remaining with random
  while (prediction.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1
    if (!used.has(num)) {
      prediction.push(num)
      used.add(num)
    }
  }

  return prediction
}

function generateBalancedPrediction(stats: any[]): number[] {
  const prediction: number[] = []
  const used = new Set<number>()

  // Balanced selection across all ranges
  const ranges = [
    [1, 5],
    [6, 10],
    [11, 15],
    [16, 20],
    [21, 25],
  ]

  // Select 3 numbers from each range
  ranges.forEach(([start, end]) => {
    const rangeCount = 3
    let added = 0
    while (added < rangeCount) {
      const num = Math.floor(Math.random() * (end - start + 1)) + start
      if (!used.has(num)) {
        prediction.push(num)
        used.add(num)
        added++
      }
    }
  })

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
