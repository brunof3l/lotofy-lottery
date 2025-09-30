"use client"

import { useState } from "react"
import { CaixaApiService, ProcessedLotofacilResult } from "@/lib/services/caixa-api"

export function useCaixaApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncLatestResult = async () => {
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

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao sincronizar'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getLatestResult = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/sync-latest-result')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Falha ao buscar resultado')
      }

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar resultado'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getNextContest = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/next-contest')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Falha ao buscar próximo concurso')
      }

      return data.data
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
