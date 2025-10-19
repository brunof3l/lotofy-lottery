"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import type { LotteryResult } from "@/lib/types"

interface ImportCSVProps {
  onImportComplete: (results: LotteryResult[]) => void
}

export function ImportCSV({ onImportComplete }: ImportCSVProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<LotteryResult[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setErrors([])
      setResults([])
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive",
      })
    }
  }

  const parseCSV = (csvText: string): { results: LotteryResult[]; errors: string[] } => {
    const lines = csvText.split("\n").filter((line) => line.trim())
    const results: LotteryResult[] = []
    const errors: string[] = []

    // Skip header if present
    const startIndex = lines[0].includes("concurso") || lines[0].includes("Concurso") ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const columns = line.split(",").map((col) => col.trim().replace(/"/g, ""))

      if (columns.length < 17) {
        // contest_number + date + 15 numbers
        errors.push(`Linha ${i + 1}: Dados insuficientes`)
        continue
      }

      const contestNumber = Number.parseInt(columns[0])
      const drawDate = columns[1]
      const numbers = columns
        .slice(2, 17)
        .map((num) => Number.parseInt(num))
        .filter((num) => !isNaN(num))

      if (isNaN(contestNumber)) {
        errors.push(`Linha ${i + 1}: Número do concurso inválido`)
        continue
      }

      if (numbers.length !== 15) {
        errors.push(`Linha ${i + 1}: Deve conter exatamente 15 números`)
        continue
      }

      if (numbers.some((num) => num < 1 || num > 25)) {
        errors.push(`Linha ${i + 1}: Números devem estar entre 1 e 25`)
        continue
      }

      results.push({
        contest_number: contestNumber,
        draw_date: drawDate,
        numbers: numbers.sort((a, b) => a - b),
      })
    }

    return { results, errors }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)
    setErrors([])

    try {
      const csvText = await file.text()
      const { results: parsedResults, errors: parseErrors } = parseCSV(csvText)

      if (parseErrors.length > 0) {
        setErrors(parseErrors)
      }

      if (parsedResults.length === 0) {
        toast({
          title: "Nenhum resultado válido",
          description: "O arquivo não contém resultados válidos para importar.",
          variant: "destructive",
        })
        return
      }

      // Import results in batches
      const batchSize = 10
      const importedResults: LotteryResult[] = []

      for (let i = 0; i < parsedResults.length; i += batchSize) {
        const batch = parsedResults.slice(i, i + batchSize)

        // Simulate an API call to import batch
        await new Promise((resolve) => setTimeout(resolve, 200))

        importedResults.push(...batch)
        setProgress(Math.round(((i + batch.length) / parsedResults.length) * 100))
      }

      setResults(importedResults)
      onImportComplete(importedResults)

      toast({
        title: "Importação concluída",
        description: `${importedResults.length} resultados foram importados com sucesso!`,
      })
    } catch (error) {
      console.error("Erro ao importar CSV:", error)
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao processar o arquivo CSV.",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="csv-file">Arquivo CSV</Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          ref={fileInputRef}
        />
      </div>

      {file && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary" />
            <div className="text-sm">
              <p className="font-medium">{file.name}</p>
              <p className="text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>

          <Button onClick={handleImport} disabled={importing} className="w-full">
            {importing ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar CSV
              </>
            )}
          </Button>

          {importing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">Progresso: {progress}%</p>
            </div>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.length} erro(s) encontrados. Verifique as linhas inválidas e tente novamente.
              </AlertDescription>
            </Alert>
          )}

          {results.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {results.length} resultado(s) pronto(s) para importação.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
