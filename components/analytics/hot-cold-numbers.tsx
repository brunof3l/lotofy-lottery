"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Snowflake, TrendingUp } from "lucide-react"
import type { LotteryResult } from "@/lib/types"

interface HotColdNumbersProps {
  results: LotteryResult[]
}

export function HotColdNumbers({ results }: HotColdNumbersProps) {
  const analysis = useMemo(() => {
    // Analyze last 50 results for hot/cold
    const recentResults = results.slice(0, 50)
    const frequency: { [key: number]: number } = {}

    // Initialize all numbers
    for (let i = 1; i <= 25; i++) {
      frequency[i] = 0
    }

    // Count frequency in recent results
    recentResults.forEach((result) => {
      if (result.numbers && Array.isArray(result.numbers)) {
        result.numbers.forEach((num: number) => {
          if (num >= 1 && num <= 25) {
            frequency[num]++
          }
        })
      }
    })

    // Sort by frequency
    const sortedNumbers = Object.entries(frequency)
      .map(([num, freq]) => ({ number: Number.parseInt(num), frequency: freq }))
      .sort((a, b) => b.frequency - a.frequency)

    const hot = sortedNumbers.slice(0, 8) // Top 8 most frequent
    const cold = sortedNumbers.slice(-8).reverse() // Bottom 8 least frequent
    const average = sortedNumbers.slice(8, 17) // Middle numbers

    return { hot, cold, average, totalResults: recentResults.length }
  }, [results])

  const getTemperatureColor = (frequency: number, max: number) => {
    const ratio = frequency / max
    if (ratio > 0.7) return "text-red-500"
    if (ratio > 0.4) return "text-orange-500"
    if (ratio > 0.2) return "text-yellow-500"
    return "text-blue-500"
  }

  const maxFrequency = Math.max(...analysis.hot.map((n) => n.frequency))

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">Análise baseada nos últimos {analysis.totalResults} sorteios</div>

      <Tabs defaultValue="hot" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hot" className="flex items-center">
            <Flame className="h-4 w-4 mr-2" />
            Números Quentes
          </TabsTrigger>
          <TabsTrigger value="cold" className="flex items-center">
            <Snowflake className="h-4 w-4 mr-2" />
            Números Frios
          </TabsTrigger>
          <TabsTrigger value="average" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Números Médios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hot">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flame className="h-5 w-5 mr-2 text-red-500" />
                Números Mais Sorteados
              </CardTitle>
              <CardDescription>Números com maior frequência nos últimos sorteios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.hot.map((item, index) => (
                  <div key={item.number} className="text-center space-y-2">
                    <Badge
                      variant="secondary"
                      className={`text-lg p-3 ${getTemperatureColor(item.frequency, maxFrequency)}`}
                    >
                      {item.number.toString().padStart(2, "0")}
                    </Badge>
                    <div className="text-sm text-muted-foreground">{item.frequency} vezes</div>
                    <div className="text-xs text-muted-foreground">#{index + 1} mais frequente</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cold">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Snowflake className="h-5 w-5 mr-2 text-blue-500" />
                Números Menos Sorteados
              </CardTitle>
              <CardDescription>Números com menor frequência nos últimos sorteios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.cold.map((item, index) => (
                  <div key={item.number} className="text-center space-y-2">
                    <Badge variant="outline" className="text-lg p-3 text-blue-500 border-blue-500">
                      {item.number.toString().padStart(2, "0")}
                    </Badge>
                    <div className="text-sm text-muted-foreground">{item.frequency} vezes</div>
                    <div className="text-xs text-muted-foreground">#{8 - index} menos frequente</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="average">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-yellow-500" />
                Números com Frequência Média
              </CardTitle>
              <CardDescription>Números com frequência equilibrada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {analysis.average.map((item) => (
                  <div key={item.number} className="text-center space-y-2">
                    <Badge variant="secondary" className="text-lg p-3">
                      {item.number.toString().padStart(2, "0")}
                    </Badge>
                    <div className="text-sm text-muted-foreground">{item.frequency} vezes</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
