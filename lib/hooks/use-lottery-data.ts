"use client"

import { useState, useEffect } from "react"

export interface LotteryResult {
  id: string
  contest_number: number
  draw_date: string
  numbers: number[]
  created_at: string
}

export interface NumberStatistic {
  id: string
  number_value: number
  frequency: number
  last_appearance_contest: number | null
  days_since_last_draw: number
  hot_cold_status: "hot" | "cold" | "neutral"
  updated_at: string
}

export interface UserPrediction {
  id: string
  user_id: string
  contest_number: number | null
  predicted_numbers: number[]
  prediction_method: string
  confidence_score: number | null
  created_at: string
}

export function useLotteryResults(limit = 10) {
  const [results, setResults] = useState<LotteryResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch(`/api/lottery-results?limit=${limit}`)
        const data = await response.json()

        if (!response.ok) throw new Error(data.error)

        setResults(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch results")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [limit])

  return { results, loading, error }
}

export function useNumberStatistics() {
  const [statistics, setStatistics] = useState<NumberStatistic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const response = await fetch("/api/statistics")
        const data = await response.json()

        if (!response.ok) throw new Error(data.error)

        setStatistics(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  return { statistics, loading, error }
}

export function useUserPredictions() {
  const [predictions, setPredictions] = useState<UserPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const response = await fetch("/api/predictions")
        const data = await response.json()

        if (!response.ok) throw new Error(data.error)

        setPredictions(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch predictions")
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  const savePrediction = async (prediction: {
    predicted_numbers: number[]
    prediction_method: string
    confidence_score?: number
    contest_number?: number
  }) => {
    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prediction),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Refresh predictions
      setPredictions((prev) => [data.data[0], ...prev])
      return data.data[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to save prediction")
    }
  }

  return { predictions, loading, error, savePrediction }
}

export function useGeneratePrediction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePrediction = async (method: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate prediction"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { generatePrediction, loading, error }
}
