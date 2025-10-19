"use client"

import { useState } from "react"
import type { ProcessedLotofacilResult } from "@/lib/services/caixa-api"
import type { NextContestInfo } from "@/lib/types"

export function useCaixaApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  type SyncLatestResultResponse = {
    success: boolean
    message: string
    data?: ProcessedLotofacilResult
  }

  const syncLatestResult = async (): Promise<SyncLatestResultResponse> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sync-latest-result', {
        method: 'POST'
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Falha na sincronização')
      }

      return data as SyncLatestResultResponse
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao sincronizar'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getLatestResult = async (): Promise<ProcessedLotofacilResult> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sync-latest-result')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Falha ao buscar resultado')
      }

      return data.data as ProcessedLotofacilResult
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar resultado'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getNextContest = async (): Promise<NextContestInfo> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/next-contest')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Falha ao buscar próximo concurso')
      }

      return data.data as NextContestInfo
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar próximo concurso'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    syncLatestResult,
    getLatestResult,
    getNextContest,
    loading,
    error
  }
}
