"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NumberFrequencyChart } from "./number-frequency-chart"
import { PatternAnalysis } from "./pattern-analysis"
import { TrendAnalysis } from "./trend-analysis"
import { PredictionAccuracy } from "./prediction-accuracy"
import { HotColdNumbers } from "./hot-cold-numbers"
import { DistributionAnalysis } from "./distribution-analysis"
import { BarChart3, TrendingUp, Target, Zap, Thermometer, PieChart } from "lucide-react"

interface AnalyticsDashboardProps {
  recentResults: any[]
  userPredictions: any[]
  allResults: any[]
  userId: string
}

export function AnalyticsDashboard({ recentResults, userPredictions, allResults, userId }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="frequency" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
          <TabsTrigger
            value="frequency"
            className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3"
          >
            <BarChart3 className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Frequência</span>
            <span className="sm:hidden">Freq.</span>
          </TabsTrigger>
          <TabsTrigger
            value="patterns"
            className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3"
          >
            <PieChart className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Padrões</span>
            <span className="sm:hidden">Padr.</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3">
            <TrendingUp className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Tendências</span>
            <span className="sm:hidden">Tend.</span>
          </TabsTrigger>
          <TabsTrigger
            value="accuracy"
            className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3"
          >
            <Target className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Precisão</span>
            <span className="sm:hidden">Prec.</span>
          </TabsTrigger>
          <TabsTrigger value="hotcold" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3">
            <Thermometer className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Quentes/Frios</span>
            <span className="sm:hidden">Q/F</span>
          </TabsTrigger>
          <TabsTrigger
            value="distribution"
            className="flex flex-col sm:flex-row items-center text-xs sm:text-sm p-2 sm:p-3"
          >
            <Zap className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">Distribuição</span>
            <span className="sm:hidden">Dist.</span>
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="distribution" className="space-y-4">
          <DistributionAnalysis results={allResults} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
