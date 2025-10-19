"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImportCSV } from "./import-csv"
import { ManualEntry } from "./manual-entry"
import { ResultsList } from "./results-list"
import { Upload, Plus, List } from "lucide-react"
import type { LotteryResult } from "@/lib/types"

interface ResultsManagerProps {
  initialResults: LotteryResult[]
}

export function ResultsManager({ initialResults }: ResultsManagerProps) {
  const [results, setResults] = useState<LotteryResult[]>(initialResults)

  const handleResultAdded = (newResult: LotteryResult) => {
    setResults((prev) => [newResult, ...prev])
  }

  const handleResultsImported = (importedResults: LotteryResult[]) => {
    setResults((prev) => [...importedResults, ...prev])
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center">
            <List className="h-4 w-4 mr-2" />
            Lista de Resultados
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Recentes</CardTitle>
              <CardDescription>Últimos 20 resultados cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsList results={results} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar Resultados via CSV</CardTitle>
              <CardDescription>Faça upload de um arquivo CSV com os resultados da Lotofácil</CardDescription>
            </CardHeader>
            <CardContent>
              <ImportCSV onImportComplete={handleResultsImported} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Resultado Manual</CardTitle>
              <CardDescription>Insira um resultado individual da Lotofácil</CardDescription>
            </CardHeader>
            <CardContent>
              <ManualEntry onResultAdded={handleResultAdded} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
