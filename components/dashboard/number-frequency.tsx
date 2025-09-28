"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useNumberStatistics } from "@/lib/hooks/use-lottery-data"
import { Skeleton } from "@/components/ui/skeleton"

export function NumberFrequency() {
  const { statistics, loading, error } = useNumberStatistics()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Frequência dos Números</CardTitle>
          <CardDescription>Carregando estatísticas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-3">
            {[...Array(25)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-10 h-10 rounded-full mb-1" />
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Frequência dos Números</CardTitle>
          <CardDescription>Erro ao carregar estatísticas: {error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const hotNumbers = statistics.filter((n) => n.hot_cold_status === "hot").sort((a, b) => b.frequency - a.frequency)
  const coldNumbers = statistics.filter((n) => n.hot_cold_status === "cold").sort((a, b) => a.frequency - b.frequency)
  const neutralNumbers = statistics
    .filter((n) => n.hot_cold_status === "neutral")
    .sort((a, b) => b.frequency - a.frequency)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "hot":
        return <TrendingUp className="h-3 w-3" />
      case "cold":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "destructive"
      case "cold":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Frequência dos Números</CardTitle>
        <CardDescription>Baseado nos últimos sorteios da Lotofácil</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hot" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hot">Números Quentes ({hotNumbers.length})</TabsTrigger>
            <TabsTrigger value="cold">Números Frios ({coldNumbers.length})</TabsTrigger>
            <TabsTrigger value="neutral">Números Neutros ({neutralNumbers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="hot" className="space-y-4">
            <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-3">
              {hotNumbers.map((num) => (
                <div key={num.number_value} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center font-bold text-sm mb-1">
                    {num.number_value}
                  </div>
                  <Badge variant={getStatusColor(num.hot_cold_status)} className="text-xs">
                    {getStatusIcon(num.hot_cold_status)}
                    {num.frequency}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cold" className="space-y-4">
            <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-3">
              {coldNumbers.map((num) => (
                <div key={num.number_value} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm mb-1">
                    {num.number_value}
                  </div>
                  <Badge variant={getStatusColor(num.hot_cold_status)} className="text-xs">
                    {getStatusIcon(num.hot_cold_status)}
                    {num.frequency}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="neutral" className="space-y-4">
            <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-3">
              {neutralNumbers.map((num) => (
                <div key={num.number_value} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm mb-1">
                    {num.number_value}
                  </div>
                  <Badge variant={getStatusColor(num.hot_cold_status)} className="text-xs">
                    {getStatusIcon(num.hot_cold_status)}
                    {num.frequency}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
