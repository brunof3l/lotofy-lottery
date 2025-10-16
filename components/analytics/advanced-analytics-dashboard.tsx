"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NumberFrequencyChart } from "./number-frequency-chart"
import { PatternAnalysis } from "./pattern-analysis"
import { TrendAnalysis } from "./trend-analysis"
import { PredictionAccuracy } from "./prediction-accuracy"
import { HotColdNumbers } from "./hot-cold-numbers"
import { DistributionAnalysis } from "./distribution-analysis"
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Thermometer, 
  PieChart,
  Download,
  RefreshCw,
  Calendar,
  Users,
  Trophy
} from "lucide-react"
import { useState } from "react"

interface AdvancedAnalyticsDashboardProps {
  recentResults: any[]
  userPredictions: any[]
  allResults: any[]
  userId: string
}

export function AdvancedAnalyticsDashboard({ 
  recentResults, 
  userPredictions, 
  allResults, 
  userId 
}: AdvancedAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [refreshing, setRefreshing] = useState(false)

  const methodDistribution: Record<string, number> = userPredictions.reduce((acc: Record<string, number>, p: any) => {
    const key = String(p?.prediction_method ?? 'unknown')
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simular refresh - em produção, isso recarregaria os dados
    setTimeout(() => setRefreshing(false), 1000)
  }

  const getOverallStats = () => {
    const totalPredictions = userPredictions.length
    const totalResults = allResults.length
    const avgConfidence = userPredictions.reduce((acc, p) => acc + (p.confidence_score || 0), 0) / Math.max(totalPredictions, 1)
    
    // Calcular acertos (simplificado)
    const predictionsWithResults = userPredictions.filter(p => p.contest_number)
    const correctPredictions = predictionsWithResults.length // Simplificado
    
    return {
      totalPredictions,
      totalResults,
      avgConfidence: Math.round(avgConfidence * 100),
      accuracy: totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0
    }
  }

  const stats = getOverallStats()

  return (
    <div className="space-y-6">
      {/* Header com estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Previsões</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPredictions}</div>
            <p className="text-xs text-muted-foreground">Suas previsões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground">Precisão média</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confiança Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgConfidence}%</div>
            <p className="text-xs text-muted-foreground">Confiança das previsões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados Analisados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResults}</div>
            <p className="text-xs text-muted-foreground">Sorteios históricos</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Análises Detalhadas</h2>
          <Badge variant="secondary">{allResults.length} resultados analisados</Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabs de análise */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3">
            <BarChart3 className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Visão Geral</span>
            <span className="sm:hidden">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="frequency" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3">
            <BarChart3 className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Frequência</span>
            <span className="sm:hidden">Freq.</span>
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3">
            <PieChart className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Padrões</span>
            <span className="sm:hidden">Pad.</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3">
            <TrendingUp className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Tendências</span>
            <span className="sm:hidden">Tend.</span>
          </TabsTrigger>
          <TabsTrigger value="accuracy" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3">
            <Target className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Precisão</span>
            <span className="sm:hidden">Prec.</span>
          </TabsTrigger>
          <TabsTrigger value="hotcold" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3">
            <Thermometer className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Quentes/Frios</span>
            <span className="sm:hidden">Q/F</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo das Suas Previsões</CardTitle>
                <CardDescription>Estatísticas pessoais de performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.totalPredictions}</div>
                    <div className="text-sm text-muted-foreground">Previsões</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Acertos</div>
                  </div>
                </div>
                
                {userPredictions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confiança média:</span>
                      <span className="font-medium">{stats.avgConfidence}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${stats.avgConfidence}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métodos Mais Usados</CardTitle>
                <CardDescription>Distribuição dos métodos de previsão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(methodDistribution).map(([method, count]) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{method.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(count / userPredictions.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="frequency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Frequência dos Números</CardTitle>
              <CardDescription className="text-sm">
                Análise da frequência de cada número nos últimos sorteios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NumberFrequencyChart results={allResults} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <PatternAnalysis results={allResults} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <TrendAnalysis results={allResults} />
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <PredictionAccuracy userPredictions={userPredictions} results={recentResults} userId={userId} />
        </TabsContent>

        <TabsContent value="hotcold" className="space-y-4">
          <HotColdNumbers results={allResults} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
