"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImportCSV } from "./import-csv"
import { ManualEntry } from "./manual-entry"
import { ResultsList } from "./results-list"
import { Upload, Plus, List } from "lucide-react"
import type { LotteryResult } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface ResultsManagerProps {
  initialResults: LotteryResult[]
}

interface SeedSummary {
  total_rows: number
  inserted: number
  parse_errors: number
  upsert_errors: number
}

export function ResultsManager({ initialResults }: ResultsManagerProps) {
  const [results, setResults] = useState<LotteryResult[]>(initialResults)
  const [excelImportLoading, setExcelImportLoading] = useState(false)
  const [excelImportSummary, setExcelImportSummary] = useState<{ total: number; imported: number; errors: number } | null>(null)
  const [excelImportErrors, setExcelImportErrors] = useState<string[]>([])
  const [seedLoading, setSeedLoading] = useState(false)
  const [seedSummary, setSeedSummary] = useState<SeedSummary | null>(null)
  const [seedErrors, setSeedErrors] = useState<string[]>([])
  const { toast } = useToast()

  const handleResultAdded = (newResult: LotteryResult) => {
    setResults((prev) => [newResult, ...prev])
  }

  const handleResultsImported = (importedResults: LotteryResult[]) => {
    setResults((prev) => [...importedResults, ...prev])
  }

  async function handleImportExcel() {
    try {
      setExcelImportLoading(true)
      setExcelImportErrors([])
      setExcelImportSummary(null)
      const res = await fetch("/api/admin/import-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "excel" }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Falha ao importar do Excel")
      }
      const imported = (data?.imported || []) as LotteryResult[]
      if (imported.length > 0) {
        setResults((prev) => [...imported, ...prev])
      }
      setExcelImportSummary(data?.summary || null)
      setExcelImportErrors(Array.isArray(data?.errors) ? data.errors : [])
      toast({ title: "Importação concluída", description: "Excel processado com sucesso" })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setExcelImportErrors([msg])
      toast({ title: "Erro na importação", description: msg, variant: "destructive" })
    } finally {
      setExcelImportLoading(false)
    }
  }

  async function handleSeedCsv() {
    try {
      setSeedLoading(true)
      setSeedErrors([])
      setSeedSummary(null)
      const res = await fetch("/api/admin/seed-results", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Falha ao popular a partir de CSV")
      }
      const summary: SeedSummary = data?.summary as SeedSummary
      setSeedSummary(summary || null)
      toast({ title: "Seed concluído", description: `Inseridos: ${summary?.inserted ?? 0} | Total: ${summary?.total_rows ?? 0}` })

      // Atualizar lista de resultados após o seed
      const listRes = await fetch("/api/lottery-results?limit=20")
      const listJson = await listRes.json()
      const fresh = (listJson?.data || []) as LotteryResult[]
      if (Array.isArray(fresh) && fresh.length > 0) {
        setResults(fresh)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setSeedErrors([msg])
      toast({ title: "Erro ao popular", description: msg, variant: "destructive" })
    } finally {
      setSeedLoading(false)
    }
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

          <Card>
            <CardHeader>
              <CardTitle>Importar do Excel local</CardTitle>
              <CardDescription>
                Usa o arquivo <code>resultados/Lotofácil.xlsx</code> no projeto e insere no banco
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white disabled:bg-muted"
                onClick={handleImportExcel}
                disabled={excelImportLoading}
              >
                {excelImportLoading ? "Importando..." : "Importar do Excel"}
              </button>
              {excelImportSummary && (
                <div className="text-sm text-muted-foreground">
                  <div>
                    Importados: {excelImportSummary.imported} / Total: {excelImportSummary.total} | Erros: {excelImportSummary.errors}
                  </div>
                </div>
              )}
              {excelImportErrors.length > 0 && (
                <div className="text-sm text-red-500">
                  {excelImportErrors.map((e, i) => (
                    <div key={i}>{e}</div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular a partir de CSV</CardTitle>
              <CardDescription>
                Lê o arquivo CSV em <code>resultado</code> ou <code>resultados</code> e faz upsert em lote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white disabled:bg-muted"
                onClick={handleSeedCsv}
                disabled={seedLoading}
              >
                {seedLoading ? "Processando..." : "Popular a partir de CSV"}
              </button>
              {seedSummary && (
                <div className="text-sm text-muted-foreground">
                  <div>
                    Inseridos: {seedSummary.inserted} / Total: {seedSummary.total_rows} | Erros de parse: {seedSummary.parse_errors} | Erros de upsert: {seedSummary.upsert_errors}
                  </div>
                </div>
              )}
              {seedErrors.length > 0 && (
                <div className="text-sm text-red-500">
                  {seedErrors.map((e, i) => (
                    <div key={i}>{e}</div>
                  ))}
                </div>
              )}
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
