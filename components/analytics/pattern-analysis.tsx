"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface PatternAnalysisProps {
  results: any[]
}

export function PatternAnalysis({ results }: PatternAnalysisProps) {
  const patterns = useMemo(() => {
    let consecutiveCount = 0
    const oddEvenBalance = { odd: 0, even: 0 }
    const rangeDistribution = { low: 0, mid: 0, high: 0 }
    const sumRanges = { low: 0, mid: 0, high: 0 }

    results.forEach((result) => {
      if (!result.numbers || !Array.isArray(result.numbers)) return

      const numbers = result.numbers.sort((a: number, b: number) => a - b)

      // Check for consecutive numbers
      let hasConsecutive = false
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i + 1] - numbers[i] === 1) {
          hasConsecutive = true
          break
        }
      }
      if (hasConsecutive) consecutiveCount++

      // Odd/Even analysis
      const oddCount = numbers.filter((n: number) => n % 2 === 1).length
      const evenCount = numbers.length - oddCount
      oddEvenBalance.odd += oddCount
      oddEvenBalance.even += evenCount

      // Range distribution (1-8, 9-17, 18-25)
      numbers.forEach((num: number) => {
        if (num <= 8) rangeDistribution.low++
        else if (num <= 17) rangeDistribution.mid++
        else rangeDistribution.high++
      })

      // Sum ranges
      const sum = numbers.reduce((acc: number, num: number) => acc + num, 0)
      if (sum <= 150) sumRanges.low++
      else if (sum <= 200) sumRanges.mid++
      else sumRanges.high++
    })

    const total = results.length

    return {
      consecutive: {
        count: consecutiveCount,
        percentage: total > 0 ? (consecutiveCount / total) * 100 : 0,
      },
      oddEven: [
        { name: "Ímpares", value: oddEvenBalance.odd, color: "#8884d8" },
        { name: "Pares", value: oddEvenBalance.even, color: "#82ca9d" },
      ],
      ranges: [
        { name: "1-8", value: rangeDistribution.low, color: "#8884d8" },
        { name: "9-17", value: rangeDistribution.mid, color: "#82ca9d" },
        { name: "18-25", value: rangeDistribution.high, color: "#ffc658" },
      ],
      sums: [
        { name: "Baixa (≤150)", value: sumRanges.low, color: "#8884d8" },
        { name: "Média (151-200)", value: sumRanges.mid, color: "#82ca9d" },
        { name: "Alta (>200)", value: sumRanges.high, color: "#ffc658" },
      ],
    }
  }, [results])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Números Consecutivos</CardTitle>
          <CardDescription className="text-sm">Frequência de sorteios com números consecutivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {patterns.consecutive.count} de {results.length} sorteios
              </span>
              <span className="text-sm text-muted-foreground">{patterns.consecutive.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={patterns.consecutive.percentage} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Distribuição Ímpar/Par</CardTitle>
          <CardDescription className="text-sm">Proporção de números ímpares e pares</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180} className="sm:h-[200px]">
            <PieChart>
              <Pie
                data={patterns.oddEven}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {patterns.oddEven.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Distribuição por Faixas</CardTitle>
          <CardDescription className="text-sm">Números por faixas de valores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180} className="sm:h-[200px]">
            <PieChart>
              <Pie
                data={patterns.ranges}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {patterns.ranges.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Soma dos Números</CardTitle>
          <CardDescription className="text-sm">Distribuição das somas dos números sorteados</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180} className="sm:h-[200px]">
            <PieChart>
              <Pie
                data={patterns.sums}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {patterns.sums.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
