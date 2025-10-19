"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, RefreshCw, Target, TrendingUp, Brain, Zap } from "lucide-react"
import { useGeneratePrediction, useUserPredictions } from "@/lib/hooks/use-lottery-data"
import { toast } from "@/hooks/use-toast"

export function AdvancedPredictionGenerator() {
  type GeneratedPrediction = {
    id: number
    method: string
    timestamp: string
    numbers: number[]
    confidence: number
  }

  const [predictions, setPredictions] = useState<GeneratedPrediction[]>([])
  const [method, setMethod] = useState<string>("statistical")
  const [quantity, setQuantity] = useState<number>(1)
  const [includeHotNumbers, setIncludeHotNumbers] = useState<boolean>(true)
  const [includeColdNumbers, setIncludeColdNumbers] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("generate")
  const [nextContest, setNextContest] = useState<number | null>(null)
  
  const { generatePrediction, loading: generating } = useGeneratePrediction()
  const { savePrediction } = useUserPredictions()
  const [saving, setSaving] = useState<number | null>(null)

  // Buscar próximo concurso
  useEffect(() => {
    async function fetchNextContest() {
      try {
        const response = await fetch('/api/next-contest')
        const data = await response.json()
        if (data.success) {
          setNextContest(data.data.next_contest)
        }
      } catch {
        console.error('Erro ao buscar próximo concurso')
      }
    }
    fetchNextContest()
  }, [])

  const handleGeneratePredictions = async () => {
    try {
      const newPredictions: GeneratedPrediction[] = []
      
      for (let i = 0; i < quantity; i++) {
        const result = await generatePrediction(method) as { numbers: number[]; method: string; confidence: number }
        newPredictions.push({
          numbers: result.numbers,
          confidence: result.confidence,
          id: Date.now() + i,
          method: method,
          timestamp: new Date().toISOString()
        })
      }
      
      setPredictions(prev => [...newPredictions, ...prev])
      setActiveTab("results")
      
      toast({
        title: "Sucesso",
        description: `${quantity} previsão(ões) gerada(s) com sucesso!`,
      })
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao gerar previsões. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleSavePrediction = async (prediction: GeneratedPrediction) => {
    setSaving(prediction.id)
    try {
      await savePrediction({
        predicted_numbers: prediction.numbers,
        prediction_method: prediction.method,
        confidence_score: prediction.confidence,
        contest_number: nextContest ?? undefined,
      })

      toast({
        title: "Sucesso",
        description: "Previsão salva com sucesso!",
      })
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao salvar previsão. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "statistical": return <TrendingUp className="h-4 w-4" />
      case "ai": return <Brain className="h-4 w-4" />
      case "hot": return <Zap className="h-4 w-4" />
      case "balanced": return <Target className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  const getMethodName = (method: string) => {
    switch (method) {
      case "statistical": return "Análise Estatística"
      case "ai": return "Inteligência Artificial"
      case "hot": return "Números Quentes"
      case "balanced": return "Balanceado"
      default: return "Personalizado"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <span>Gerador Avançado de Previsões</span>
        </CardTitle>
        <CardDescription>
          Configure e gere previsões personalizadas com diferentes métodos
          {nextContest && (
            <span className="block mt-1 text-xs text-blue-600">
              Próximo concurso: #{nextContest}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Gerar</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Configurações Básicas */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="method">Método de Previsão</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statistical">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Análise Estatística</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ai">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <span>Inteligência Artificial</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="hot">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4" />
                          <span>Números Quentes</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="balanced">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4" />
                          <span>Balanceado</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade de Previsões</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              {/* Configurações Avançadas */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Filtros de Números</Label>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hot-numbers" className="text-sm">
                      Incluir números quentes
                    </Label>
                    <Switch
                      id="hot-numbers"
                      checked={includeHotNumbers}
                      onCheckedChange={setIncludeHotNumbers}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cold-numbers" className="text-sm">
                      Incluir números frios
                    </Label>
                    <Switch
                      id="cold-numbers"
                      checked={includeColdNumbers}
                      onCheckedChange={setIncludeColdNumbers}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGeneratePredictions} 
              disabled={generating} 
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Gerando {quantity} previsão(ões)...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar {quantity} Previsão(ões)
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {predictions.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma previsão gerada ainda. Vá para a aba &ldquo;Gerar&rdquo; para criar suas previsões.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getMethodIcon(prediction.method)}
                        <span className="font-medium">{getMethodName(prediction.method)}</span>
                        <Badge variant="secondary">
                          {Math.round(prediction.confidence * 100)}% confiança
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(prediction.timestamp).toLocaleTimeString("pt-BR")}
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {prediction.numbers.map((number) => (
                        <div
                          key={number}
                          className="aspect-square rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold"
                        >
                          {number}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSavePrediction(prediction)}
                        variant="outline"
                        size="sm"
                        disabled={saving === prediction.id}
                      >
                        {saving === prediction.id ? "Salvando..." : "Salvar Previsão"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
