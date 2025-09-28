"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TrendAnalysisProps {
  results: any[]
}

export function TrendAnalysis({ results }: TrendAnalysisProps) {
  const trendData = useMemo(() => {
    // Group results by month and analyze trends
    const monthlyData: { [key: string]: { sum: number; count: number; avgSum: number } } = {}

    results.forEach((result) => {
      if (!result.numbers || !result.draw_date) return

      const date = new Date(result.draw_date)
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

      const sum = result.numbers.reduce((acc: number, num: number) => acc + num, 0)

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { sum: 0, count: 0, avgSum: 0 }
      }

      monthlyData[monthKey].sum += sum
      monthlyData[monthKey].count += 1
    })

    // Calculate averages and format for chart
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        avgSum: Math.round(data.sum / data.count),
        count: data.count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // Last 12 months
  }, [results])

  const overallStats = useMemo(() => {
    if (results.length === 0) return { avgSum: 0, minSum: 0, maxSum: 0 }

    const sums = results
      .map((result) => (result.numbers ? result.numbers.reduce((acc: number, num: number) => acc + num, 0) : 0))
      .filter((sum) => sum > 0)

    return {
      avgSum: Math.round(sums.reduce((acc, sum) => acc + sum, 0) / sums.length),
      minSum: Math.min(...sums),
      maxSum: Math.max(...sums),
    }
  }, [results])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Soma Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgSum}</div>
            <p className="text-xs text-muted-foreground">dos números sorteados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Menor Soma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.minSum}</div>
            <p className="text-xs text-muted-foreground">registrada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maior Soma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.maxSum}</div>
            <p className="text-xs text-muted-foreground">registrada</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendência da Soma dos Números</CardTitle>
          <CardDescription>Evolução da soma média dos números sorteados ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const [year, month] = value.split("-")
                  return `${month}/${year.slice(-2)}`
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => {
                  const [year, month] = value.split("-")
                  return `${month}/${year}`
                }}
                formatter={(value: number) => [value, "Soma Média"]}
              />
              <Line
                type="monotone"
                dataKey="avgSum"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
