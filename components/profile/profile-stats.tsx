import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Target, Award } from "lucide-react"

interface ProfileStatsProps {
  userStats: any[]
  profile: any
}

export function ProfileStats({ userStats, profile }: ProfileStatsProps) {
  const totalPredictions = userStats.length
  const statisticalPredictions = userStats.filter((p) => p.prediction_method === "statistical").length
  const manualPredictions = userStats.filter((p) => p.prediction_method === "manual").length
  const randomPredictions = userStats.filter((p) => p.prediction_method === "random").length

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
      })
    : "Data não disponível"

  return (
    <div className="space-y-6">
      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Membro desde</p>
            <p className="font-medium">{memberSince}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipo de conta</p>
            <Badge variant="secondary">{profile?.role === "admin" ? "Administrador" : "Usuário"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Estatísticas de Previsões
          </CardTitle>
          <CardDescription>Suas atividades no sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total de previsões</span>
            <span className="font-bold text-2xl text-primary">{totalPredictions}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Estatísticas</span>
              <span className="text-sm font-medium">{statisticalPredictions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Manuais</span>
              <span className="text-sm font-medium">{manualPredictions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Aleatórias</span>
              <span className="text-sm font-medium">{randomPredictions}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {totalPredictions >= 1 && (
              <Badge variant="secondary" className="mr-2 mb-2">
                <Target className="h-3 w-3 mr-1" />
                Primeira Previsão
              </Badge>
            )}
            {totalPredictions >= 10 && (
              <Badge variant="secondary" className="mr-2 mb-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                10 Previsões
              </Badge>
            )}
            {statisticalPredictions >= 5 && (
              <Badge variant="secondary" className="mr-2 mb-2">
                <Award className="h-3 w-3 mr-1" />
                Analista
              </Badge>
            )}
            {totalPredictions === 0 && (
              <p className="text-sm text-muted-foreground">Faça sua primeira previsão para desbloquear conquistas!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
