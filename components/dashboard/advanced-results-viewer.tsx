"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Search, Download, Eye } from "lucide-react"
import { useLotteryResults } from "@/lib/hooks/use-lottery-data"
import { Skeleton } from "@/components/ui/skeleton"

interface AdvancedResultsViewerProps {
  limit?: number
}

export function AdvancedResultsViewer({ limit = 50 }: AdvancedResultsViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "contest">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState<string>("list")
  
  const { results, loading, error } = useLotteryResults(limit)

  const filteredResults = results
    .filter(result => 
      result.contest_number.toString().includes(searchTerm) ||
      new Date(result.draw_date).toLocaleDateString("pt-BR").includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === "contest") {
        return sortOrder === "asc" 
          ? a.contest_number - b.contest_number
          : b.contest_number - a.contest_number
      } else {
        return sortOrder === "asc"
          ? new Date(a.draw_date).getTime() - new Date(b.draw_date).getTime()
          : new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime()
      }
    })

  const getNumberColor = (number: number) => {
    // Cores baseadas em faixas de números
    if (number <= 5) return "bg-red-500"
    if (number <= 10) return "bg-blue-500"
    if (number <= 15) return "bg-green-500"
    if (number <= 20) return "bg-yellow-500"
    return "bg-purple-500"
  }

  const getFrequencyStats = () => {
    const frequency: { [key: number]: number } = {}
    
    results.forEach(result => {
      result.numbers.forEach(number => {
        frequency[number] = (frequency[number] || 0) + 1
      })
    })

    const sortedFrequency = Object.entries(frequency)
      .map(([number, count]) => ({ number: parseInt(number), count }))
      .sort((a, b) => b.count - a.count)

    return {
      mostFrequent: sortedFrequency.slice(0, 5),
      leastFrequent: sortedFrequency.slice(-5).reverse()
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultados da Lotofácil</CardTitle>
          <CardDescription>Carregando resultados...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-5 gap-2">
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
          <CardTitle>Resultados da Lotofácil</CardTitle>
          <CardDescription>Erro ao carregar resultados: {error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const stats = getFrequencyStats()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Resultados da Lotofácil</span>
        </CardTitle>
        <CardDescription>
          Histórico completo de sorteios e análises estatísticas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="search">Buscar</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={sortBy} onValueChange={(value: "date" | "contest") => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="contest">Concurso</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Decrescente</SelectItem>
                  <SelectItem value="asc">Crescente</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredResults.map((result) => (
                <div key={result.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Concurso {result.contest_number}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(result.draw_date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {result.numbers.map((number) => (
                      <div
                        key={number}
                        className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold ${getNumberColor(number)}`}
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Números Mais Frequentes</CardTitle>
                  <CardDescription>Top 5 números que mais saíram</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.mostFrequent.map((item) => (
                      <div key={item.number} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">#{item.number}</Badge>
                          <span className="text-sm">{item.count} vezes</span>
                        </div>
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(item.count / Math.max(...stats.mostFrequent.map(s => s.count))) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Números Menos Frequentes</CardTitle>
                  <CardDescription>Top 5 números que menos saíram</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.leastFrequent.map((item) => (
                      <div key={item.number} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">#{item.number}</Badge>
                          <span className="text-sm">{item.count} vezes</span>
                        </div>
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(item.count / Math.max(...stats.mostFrequent.map(s => s.count))) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Faixas</CardTitle>
                <CardDescription>Quantidade de números por faixa de 1-25</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { range: "1-5", color: "bg-red-500", count: results.reduce((acc, r) => acc + r.numbers.filter(n => n >= 1 && n <= 5).length, 0) },
                    { range: "6-10", color: "bg-blue-500", count: results.reduce((acc, r) => acc + r.numbers.filter(n => n >= 6 && n <= 10).length, 0) },
                    { range: "11-15", color: "bg-green-500", count: results.reduce((acc, r) => acc + r.numbers.filter(n => n >= 11 && n <= 15).length, 0) },
                    { range: "16-20", color: "bg-yellow-500", count: results.reduce((acc, r) => acc + r.numbers.filter(n => n >= 16 && n <= 20).length, 0) },
                    { range: "21-25", color: "bg-purple-500", count: results.reduce((acc, r) => acc + r.numbers.filter(n => n >= 21 && n <= 25).length, 0) }
                  ].map((faixa) => (
                    <div key={faixa.range} className="text-center space-y-2">
                      <div className={`w-8 h-8 rounded-full ${faixa.color} mx-auto`} />
                      <div className="text-sm font-medium">{faixa.range}</div>
                      <div className="text-xs text-muted-foreground">{faixa.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por concurso ou data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {searchTerm && (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {filteredResults.length} resultado(s) encontrado(s) para &ldquo;{searchTerm}&rdquo;
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {filteredResults.slice(0, 10).map((result) => (
                      <div key={result.id} className="border border-border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Concurso {result.contest_number}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(result.draw_date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          {result.numbers.map((number) => (
                            <div
                              key={number}
                              className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ${getNumberColor(number)}`}
                            >
                              {number}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
