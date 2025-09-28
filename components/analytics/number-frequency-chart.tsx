"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface NumberFrequencyChartProps {
  results: any[]
}

export function NumberFrequencyChart({ results }: NumberFrequencyChartProps) {
  const frequencyData = useMemo(() => {
    const frequency: { [key: number]: number } = {}

    // Initialize all numbers 1-25 with 0 frequency
    for (let i = 1; i <= 25; i++) {
      frequency[i] = 0
    }

    // Count frequency of each number
    results.forEach((result) => {
      if (result.numbers && Array.isArray(result.numbers)) {
        result.numbers.forEach((num: number) => {
          if (num >= 1 && num <= 25) {
            frequency[num]++
          }
        })
      }
    })

    // Convert to chart data format
    return Object.entries(frequency)
      .map(([number, count]) => ({
        number: Number.parseInt(number),
        frequency: count,
        percentage: results.length > 0 ? ((count / results.length) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => a.number - b.number)
  }, [results])

  const averageFrequency = useMemo(() => {
    const total = frequencyData.reduce((sum, item) => sum + item.frequency, 0)
    return total / 25
  }, [frequencyData])

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Frequência média: {averageFrequency.toFixed(1)} aparições por número
      </div>

      <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
        <BarChart
          data={frequencyData}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="number" tick={{ fontSize: 10 }} interval={0} className="text-xs sm:text-sm" />
          <YAxis tick={{ fontSize: 10 }} className="text-xs sm:text-sm" />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} vezes (${frequencyData.find((d) => d.frequency === value)?.percentage}%)`,
              "Frequência",
            ]}
            labelFormatter={(label) => `Número ${label}`}
            contentStyle={{
              fontSize: "12px",
              padding: "8px",
            }}
          />
          <Bar dataKey="frequency" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
