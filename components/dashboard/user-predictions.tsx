"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Target } from "lucide-react"
import { useUserPredictions } from "@/lib/hooks/use-lottery-data"
import { Skeleton } from "@/components/ui/skeleton"

export function UserPredictions() {
  const { predictions, loading, error } = useUserPredictions()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Minhas Previsões</span>
          </CardTitle>
          <CardDescription>Carregando suas previsões...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 p-4 border border-border rounded-lg">
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-5 gap-1">
                {[...Array(15)].map((_, j) => (
                  <Skeleton key={j} className="w-6 h-6 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-3 w-24" />
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
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Minhas Previsões</span>
          </CardTitle>
          <CardDescription>Erro ao carregar previsões: {error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Minhas Previsões</span>
        </CardTitle>
        <CardDescription>Suas últimas previsões salvas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {predictions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Você ainda não tem previsões salvas. Gere sua primeira previsão!
          </p>
        ) : (
          predictions.map((prediction) => (
            <div key={prediction.id} className="space-y-3 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(prediction.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {prediction.confidence_score && (
                  <Badge variant="outline">{Math.round(prediction.confidence_score * 100)}% confiança</Badge>
                )}
              </div>

              <div className="grid grid-cols-5 gap-1">
                {prediction.predicted_numbers.map((number) => (
                  <div
                    key={number}
                    className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium"
                  >
                    {number}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Método: {prediction.prediction_method}</span>
                {prediction.contest_number && <span>Concurso: {prediction.contest_number}</span>}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
