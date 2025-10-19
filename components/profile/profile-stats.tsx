"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp, Target, Award } from "lucide-react"
import type { UserPrediction, UserProfile } from "@/lib/types"

interface ProfileStatsProps {
  userStats: UserPrediction[]
  profile: UserProfile
}

export function ProfileStats({ userStats, profile }: ProfileStatsProps) {
  const totalPredictions = userStats.length
  // 'correct' não existe em UserPrediction; sem resultados não é possível calcular acertos aqui.
  const correctPredictions = 0
  const accuracy = 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Previsões Totais</CardTitle>
          <Calendar className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPredictions}</div>
          <p className="text-xs text-muted-foreground">Desde que você entrou</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acertos</CardTitle>
          <Target className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{correctPredictions}</div>
          <p className="text-xs text-muted-foreground">Previsões corretas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Precisão</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accuracy}%</div>
          <p className="text-xs text-muted-foreground">Taxa de acertos estimada</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nível</CardTitle>
          <Award className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile?.role === "admin" ? "Admin" : "Usuário"}</div>
          <p className="text-xs text-muted-foreground">Tipo de conta</p>
        </CardContent>
      </Card>
    </div>
  )
}
