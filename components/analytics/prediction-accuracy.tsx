"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, Award } from "lucide-react"

interface MatchItem {
  prediction: { prediction_method?: string; numbers?: number[]; created_at: string }
  result: { numbers?: number[]; draw_date: string }
  hits: number
  date: string
}

type MethodStats = Record<string, { total: number; hits: number }>

interface AccuracyState {
  totalPredictions: number
  matches: MatchItem[]
  averageHits: number
  bestPrediction: MatchItem | null
  methodStats: MethodStats
}

interface PredictionAccuracyProps {
  userPredictions: any[]
  results: any[]
  userId: string
}

export function PredictionAccuracy({ userPredictions, results, userId }: PredictionAccuracyProps) {
  const accuracy = useMemo<AccuracyState>(() => {
    if (userPredictions.length === 0) {
      return {
        totalPredictions: 0,
        matches: [],
        averageHits: 0,
        bestPrediction: null,
        methodStats: {},
      }
    }

    const matches: MatchItem[] = []
    let totalHits = 0
    let bestHits = 0
    let bestPrediction: MatchItem | null = null
    const methodStats: MethodStats = {}

    userPredictions.forEach((prediction) => {
      // Find corresponding result
      const result = results.find(
        (r) => new Date(r.draw_date).toDateString() === new Date(prediction.created_at).toDateString(),
      )

      if (result && result.numbers && prediction.numbers) {
        const hits = prediction.numbers.filter((num: number) => result.numbers.includes(num)).length

        matches.push({
          prediction,
          result,
          hits,
          date: prediction.created_at,
        })

        totalHits += hits

        if (hits > bestHits) {
          bestHits = hits
          bestPrediction = { prediction, result, hits, date: prediction.created_at }
        }

        // Method statistics
        const method = prediction.prediction_method || "unknown"
        if (!methodStats[method]) {
          methodStats[method] = { total: 0, hits: 0 }
        }
        methodStats[method].total++
        methodStats[method].hits += hits
      }
    })

    return {
      totalPredictions: userPredictions.length,
      matches,
      averageHits: matches.length > 0 ? totalHits / matches.length : 0,
      bestPrediction,
      methodStats,
    }
  }, [userPredictions, results])

  const getHitsBadgeVariant = (hits: number) => {
    if (hits >= 11) return "default" // Excellent
    if (hits >= 8) return "secondary" // Good
    return "outline" // Average
  }

  const getHitsColor = (hits: number) => {
    if (hits >= 11) return "text-green-600"
    if (hits >= 8) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {accuracy.totalPredictions === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma previsão encontrada</h3>
            <p className="text-muted-foreground text-center">
              Faça suas primeiras previsões para ver a análise de precisão aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Previsões</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracy.totalPredictions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média de Acertos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracy.averageHits.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">números por previsão</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Melhor Resultado</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracy.bestPrediction?.hits || 0}</div>
                <p className="text-xs text-muted-foreground">acertos máximos</p>
              </CardContent>
            </Card>
          </div>

          {/* Method Statistics */}
          {Object.keys(accuracy.methodStats).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas por Método</CardTitle>
                <CardDescription>Performance de cada método de previsão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(accuracy.methodStats).map(([method, stats]) => {
                    const avgHits = stats.total > 0 ? stats.hits / stats.total : 0
                    const methodName =
                      method === "statistical"
                        ? "Estatístico"
                        : method === "manual"
                          ? "Manual"
                          : method === "random"
                            ? "Aleatório"
                            : method

                    return (
                      <div key={method} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{methodName}</p>
                          <p className="text-xs text-muted-foreground">{stats.total} previsões</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-bold">{avgHits.toFixed(1)} acertos</p>
                          <Progress value={(avgHits / 15) * 100} className="w-20 h-2" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Matches */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Acertos</CardTitle>
              <CardDescription>Suas últimas previsões e resultados</CardDescription>
            </CardHeader>
            <CardContent>
              {accuracy.matches.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma previsão com resultado correspondente encontrada.
                </p>
              ) : (
                <div className="space-y-4">
                  {accuracy.matches.slice(0, 10).map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{new Date(match.date).toLocaleDateString("pt-BR")}</Badge>
                          <Badge variant={getHitsBadgeVariant(match.hits)} className={getHitsColor(match.hits)}>
                            {match.hits} acertos
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Método:{" "}
                          {match.prediction.prediction_method === "statistical"
                            ? "Estatístico"
                            : match.prediction.prediction_method === "manual"
                              ? "Manual"
                              : match.prediction.prediction_method === "random"
                                ? "Aleatório"
                                : match.prediction.prediction_method}
                        </div>
                      </div>
                      <div className="text-right">
                        <Progress value={(match.hits / 15) * 100} className="w-24 h-2 mb-1" />
                        <p className="text-xs text-muted-foreground">{((match.hits / 15) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
