"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { Users, Database, Target, TrendingUp } from "lucide-react"

interface AdminAnalyticsProps {
  results: any[]
  predictions: any[]
  users: any[]
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
            <CardTitle className="text-sm font-medium">Média por Usuário</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.totalUsers > 0 ? Math.round(systemStats.totalPredictions / systemStats.totalUsers) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Dashboard */}
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="system">Analytics do Sistema</TabsTrigger>
          <TabsTrigger value="users">Analytics de Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <AnalyticsDashboard
            recentResults={results.slice(0, 100)}
            userPredictions={predictions}
            allResults={results}
            userId="admin"
          />
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
                          Membro desde {new Date(user.created_at).toLocaleDateString("pt-BR")}
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
