"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, RefreshCw } from "lucide-react"
import { useGeneratePrediction, useUserPredictions } from "@/lib/hooks/use-lottery-data"
import { toast } from "@/hooks/use-toast"

interface PredictionGeneratorProps {
  userId: string
}

export function PredictionGenerator({ userId }: PredictionGeneratorProps) {
  const [prediction, setPrediction] = useState<{ numbers: number[]; confidence: number; method: string } | null>(null)
  const [method, setMethod] = useState<string>("statistical")
  const { generatePrediction, loading: generating } = useGeneratePrediction()
  const { savePrediction } = useUserPredictions()
  const [saving, setSaving] = useState(false)

  const handleGeneratePrediction = async () => {
    try {
      const result = await generatePrediction(method)
      setPrediction(result)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar previsão. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleSavePrediction = async () => {
    if (!prediction) return

    setSaving(true)
    try {
      await savePrediction({
        predicted_numbers: prediction.numbers,
        prediction_method: prediction.method,
        confidence_score: prediction.confidence,
      })

      toast({
        title: "Sucesso",
        description: "Previsão salva com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar previsão. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-base sm:text-lg">Gerador de Previsões</span>
        </CardTitle>
        <CardDescription className="text-sm">Gere jogos baseados em análise estatística</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Método de Previsão</label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="statistical">Análise Estatística</SelectItem>
              <SelectItem value="ai">Inteligência Artificial</SelectItem>
              <SelectItem value="hot">Números Quentes</SelectItem>
              <SelectItem value="balanced">Balanceado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGeneratePrediction} disabled={generating} className="w-full">
          {generating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Previsão
            </>
          )}
        </Button>

        {prediction && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm font-medium">Sua Previsão</span>
                <Badge variant="secondary" className="w-fit">
                  Confiança: {Math.round(prediction.confidence * 100)}%
                </Badge>
              </div>
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {prediction.numbers.map((number) => (
                  <div
                    key={number}
                    className="aspect-square rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-bold min-h-[32px] sm:min-h-[40px]"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSavePrediction}
              variant="outline"
              className="w-full bg-transparent"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar Previsão"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
