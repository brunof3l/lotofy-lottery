"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DistributionAnalysisProps {
  results: any[]
}

export function DistributionAnalysis({ results }: DistributionAnalysisProps) {
  const distributionData = useMemo(() => {
    const sumDistribution: { [key: string]: number } = {}
    const oddEvenDistribution: { [key: string]: number } = {}

    results.forEach((result) => {
      if (!result.numbers || !Array.isArray(result.numbers)) return

      // Sum distribution
      const sum = result.numbers.reduce((acc: number, num: number) => acc + num, 0)
      const sumRange = Math.floor(sum / 25) * 25 // Group by 25s
      const sumKey = `${sumRange}-${sumRange + 24}`
      sumDistribution[sumKey] = (sumDistribution[sumKey] || 0) + 1

      // Odd/Even distribution
      const oddCount = result.numbers.filter((n: number) => n % 2 === 1).length
      const oddEvenKey = `${oddCount} ímpares`
      oddEvenDistribution[oddEvenKey] = (oddEvenDistribution[oddEvenKey] || 0) + 1
    })

    return {
      sums: Object.entries(sumDistribution)
        .map(([range, count]) => ({ range, count }))
        .sort((a, b) => {
          const aStart = Number.parseInt(a.range.split("-")[0])
          const bStart = Number.parseInt(b.range.split("-")[0])
          return aStart - bStart
        }),
      oddEven: Object.entries(oddEvenDistribution)
        .map(([distribution, count]) => ({ distribution, count }))
        .sort((a, b) => {
          const aOdds = Number.parseInt(a.distribution.split(" ")[0])
          const bOdds = Number.parseInt(b.distribution.split(" ")[0])
          return aOdds - bOdds
        }),
    }
  }, [results])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição das Somas</CardTitle>
          <CardDescription>Frequência das somas dos números sorteados por faixas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData.sums} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, "Frequência"]}
                labelFormatter={(label) => `Soma: ${label}`}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição Ímpar/Par</CardTitle>
          <CardDescription>Frequência da quantidade de números ímpares por sorteio</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData.oddEven} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="distribution" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [value, "Frequência"]} />
              <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
