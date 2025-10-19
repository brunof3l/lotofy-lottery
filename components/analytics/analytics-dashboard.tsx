"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NumberFrequencyChart } from "./number-frequency-chart"
import { PatternAnalysis } from "./pattern-analysis"
import { TrendAnalysis } from "./trend-analysis"
import { PredictionAccuracy } from "./prediction-accuracy"
import { HotColdNumbers } from "./hot-cold-numbers"
import { BarChart3, TrendingUp, Target, Thermometer, PieChart } from "lucide-react"
import type { LotteryResult, UserPrediction } from "@/lib/types"

interface AnalyticsDashboardProps {
  recentResults: LotteryResult[]
  userPredictions: UserPrediction[]
  allResults: LotteryResult[]
}

export function AnalyticsDashboard({ recentResults, userPredictions, allResults }: AnalyticsDashboardProps) {
  const methodDistribution: Record<string, number> = userPredictions.reduce((acc: Record<string, number>, p: UserPrediction) => {
    const key = String(p?.prediction_method ?? 'unknown')
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Análises</h2>
          <Badge variant="secondary">{allResults.length} resultados</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
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

        <TabsContent value="overview" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Distribuição de Métodos</h3>
              <div className="space-y-2 mt-2">
                {Object.entries(methodDistribution).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <span className="text-sm">
                      {method === 'statistical' ? 'Estatístico' : method === 'manual' ? 'Manual' : method === 'random' ? 'Aleatório' : method}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="frequency" className="space-y-4">
          <NumberFrequencyChart results={allResults} />
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <PatternAnalysis results={allResults} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <TrendAnalysis results={allResults} />
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <PredictionAccuracy userPredictions={userPredictions} results={recentResults} />
        </TabsContent>

        <TabsContent value="hotcold" className="space-y-4">
          <HotColdNumbers results={allResults} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
