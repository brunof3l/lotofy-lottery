"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { useLotteryResults } from "@/lib/hooks/use-lottery-data"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentResults() {
  const { results, loading, error } = useLotteryResults(5)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultados Recentes</CardTitle>
          <CardDescription>Últimos sorteios da Lotofácil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 gap-2">
                {[...Array(15)].map((_, j) => (
                  <Skeleton key={j} className="w-8 h-8 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultados Recentes</CardTitle>
          <CardDescription>Erro ao carregar resultados: {error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Recentes</CardTitle>
        <CardDescription>Últimos sorteios da Lotofácil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {results.map((result) => (
          <div key={result.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Concurso {result.contest_number}</span>
                <Badge variant="outline" className="text-xs">
                  {new Date(result.draw_date).toLocaleDateString("pt-BR")}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 gap-2">
              {result.numbers.map((number) => (
                <div
                  key={number}
                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold"
                >
                  {number}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
