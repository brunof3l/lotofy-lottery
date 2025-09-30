"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Trophy, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Target, 
  TrendingUp,
  Calendar,
  Download,
  Sparkles
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PrizeResult {
  prediction_id: string
  contest_number: number
  predicted_numbers: number[]
  drawn_numbers: number[]
  matches: number[]
  misses: number[]
  match_count: number
  prize_level: number | null
  prize_description: string | null
  is_winner: boolean
  created_at: string
  prediction_method: string
  confidence_score?: number
}

interface PrizeStatistics {
  totalPredictions: number
  totalWinners: number
  winRate: number
  averageMatches: number
  bestResult: number
  prizeDistribution: Record<string, number>
}

interface PrizeCheckerProps {
  userId: string
}

export function PrizeChecker({ userId }: PrizeCheckerProps) {
  const [prizeResults, setPrizeResults] = useState<PrizeResult[]>([])
  const [statistics, setStatistics] = useState<PrizeStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const fetchPrizeResults = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/check-prizes')
      const data = await response.json()

      if (data.success) {
        if (data.data.results) {
          setPrizeResults(data.data.results)
          setStatistics(data.data.statistics)
        } else {
          // Formato diferente para GET
          setPrizeResults(data.data.recentResults || [])
          setStatistics({
            totalPredictions: data.data.totalPredictions,
            totalWinners: data.data.totalWinners,
            winRate: data.data.totalPredictions > 0 ? (data.data.totalWinners / data.data.totalPredictions) * 100 : 0,
            averageMatches: 0,
            bestResult: 0,
            prizeDistribution: data.data.prizeBreakdown || {}
          })
        }
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao carregar prêmios",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao verificar prêmios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const syncLatestResult = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/sync-latest-result', {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: data.message,
        })
        setLastSync(new Date().toLocaleString('pt-BR'))
        
        // Recarregar prêmios após sincronização
        setTimeout(() => {
          fetchPrizeResults()
        }, 1000)
      } else {
        toast({
          title: "Erro",
          description: data.message || "Falha na sincronização",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao sincronizar resultado",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const getNumberColor = (number: number, isMatch: boolean) => {
    if (isMatch) {
      // Cores para números que acertou
      if (number <= 5) return "bg-green-500 text-white"
      if (number <= 10) return "bg-green-600 text-white"
      if (number <= 15) return "bg-green-700 text-white"
      if (number <= 20) return "bg-green-800 text-white"
      return "bg-green-900 text-white"
    } else {
      // Cores para números que errou
      if (number <= 5) return "bg-red-100 text-red-700 border border-red-300"
      if (number <= 10) return "bg-red-200 text-red-700 border border-red-400"
      if (number <= 15) return "bg-red-300 text-red-700 border border-red-500"
      if (number <= 20) return "bg-red-400 text-red-700 border border-red-600"
      return "bg-red-500 text-white border border-red-700"
    }
  }

  const getPrizeLevelColor = (level: number | null) => {
    switch (level) {
      case 1: return "bg-yellow-100 text-yellow-800 border border-yellow-300"
      case 2: return "bg-orange-100 text-orange-800 border border-orange-300"
      case 3: return "bg-blue-100 text-blue-800 border border-blue-300"
      case 4: return "bg-purple-100 text-purple-800 border border-purple-300"
      case 5: return "bg-green-100 text-green-800 border border-green-300"
      default: return "bg-gray-100 text-gray-800 border border-gray-300"
    }
  }

  useEffect(() => {
    fetchPrizeResults()
  }, [])

  if (loading && prizeResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Verificador de Prêmios</span>
          </CardTitle>
          <CardDescription>Carregando resultados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Verificador de Prêmios</span>
            </CardTitle>
            <CardDescription>
              Verifique se suas previsões foram premiadas
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchPrizeResults}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncLatestResult}
              disabled={syncing}
            >
              <Download className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              Sincronizar
            </Button>
          </div>
        </div>
        {lastSync && (
          <p className="text-xs text-muted-foreground">
            Última sincronização: {lastSync}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{statistics.totalPredictions}</div>
              <div className="text-sm text-muted-foreground">Previsões</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{statistics.totalWinners}</div>
              <div className="text-sm text-muted-foreground">Ganhadores</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{statistics.winRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Acerto</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{statistics.bestResult}</div>
              <div className="text-sm text-muted-foreground">Melhor Resultado</div>
            </div>
          </div>
        )}

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Resultados Recentes</TabsTrigger>
            <TabsTrigger value="winners">Ganhadores</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {prizeResults.length === 0 ? (
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  Nenhuma previsão verificada ainda. Faça previsões e sincronize os resultados!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {prizeResults.slice(0, 10).map((result) => (
                  <div key={result.prediction_id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Concurso {result.contest_number}</Badge>
                        {result.is_winner ? (
                          <Badge className={getPrizeLevelColor(result.prize_level)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {result.prize_description}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            {result.match_count} acertos
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(result.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Seus números:</div>
                      <div className="grid grid-cols-5 gap-1">
                        {result.predicted_numbers.map((number) => (
                          <div
                            key={number}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getNumberColor(number, result.matches.includes(number))}`}
                          >
                            {number}
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.is_winner && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Parabéns! Você ganhou: {result.prize_description}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="winners" className="space-y-4">
            {prizeResults.filter(r => r.is_winner).length === 0 ? (
              <Alert>
                <Trophy className="h-4 w-4" />
                <AlertDescription>
                  Você ainda não ganhou nenhum prêmio. Continue fazendo previsões!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {statistics && Object.entries(statistics.prizeDistribution).map(([prize, count]) => (
                  <div key={prize} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{prize}</span>
                    </div>
                    <Badge variant="secondary">{count}x</Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
