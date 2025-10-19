"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { Users, Database, Target, TrendingUp } from "lucide-react"
import type { LotteryResult, UserPrediction, UserProfile } from "@/lib/types"


interface AdminAnalyticsProps {
  results: LotteryResult[]
  predictions: UserPrediction[]
  users: UserProfile[]
  systemStats: {
    totalResults: number
    totalPredictions: number
    totalUsers: number
  }
}

export function AdminAnalytics({ results, predictions, users, systemStats }: AdminAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados Cadastrados</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalResults}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsões Feitas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalPredictions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendência Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Estável</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Analytics do Sistema</CardTitle>
              <CardDescription>Visão geral das métricas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard
                recentResults={results.slice(0, 100)}
                userPredictions={predictions}
                allResults={results}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Recentes</CardTitle>
              <CardDescription>Listagem dos últimos resultados cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.slice(0, 20).map((r) => (
                  <div key={r.contest_number} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Concurso {r.contest_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {r.draw_date ? new Date(r.draw_date).toLocaleDateString("pt-BR") : "-"}
                      </p>
                    </div>
                    <div className="text-sm">{r.numbers?.join(", ")}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Previsões Recentes</CardTitle>
              <CardDescription>Listagem das previsões dos usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {predictions.slice(0, 20).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Usuário {p.user_id}</p>
                      <p className="text-sm text-muted-foreground">
                        Método {p.prediction_method || "-"}
                      </p>
                    </div>
                    <div className="text-sm">{p.predicted_numbers?.join(", ")}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Atividade dos Usuários</CardTitle>
              <CardDescription>Estatísticas de uso e engajamento dos usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 10).map((user) => {
                  const userPredictions = predictions.filter((p) => p.user_id === user.id)
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.full_name || "Usuário sem nome"}</p>
                        <p className="text-sm text-muted-foreground">
                          Membro desde {user.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{userPredictions.length}</p>
                        <p className="text-sm text-muted-foreground">previsões</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
