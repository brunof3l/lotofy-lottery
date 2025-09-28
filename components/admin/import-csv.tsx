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

interface ImportCSVProps {
  onImportComplete: (results: any[]) => void
}

export function ImportCSV({ onImportComplete }: ImportCSVProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any[]>([])
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

  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n").filter((line) => line.trim())
    const results = []
    const errors = []

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
      const importedResults = []

      for (let i = 0; i < parsedResults.length; i += batchSize) {
        const batch = parsedResults.slice(i, i + batchSize)

        const response = await fetch("/api/admin/import-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ results: batch }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao importar resultados")
        }

        const data = await response.json()
        importedResults.push(...data.imported)

        setProgress(Math.round(((i + batch.length) / parsedResults.length) * 100))
      }

      setResults(importedResults)
      onImportComplete(importedResults)

      toast({
        title: "Importação concluída",
        description: `${importedResults.length} resultados importados com sucesso.`,
      })
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="csv-file">Arquivo CSV</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            ref={fileInputRef}
            disabled={importing}
          />
          <p className="text-xs text-muted-foreground mt-1">Formato esperado: concurso,data,num1,num2,...,num15</p>
        </div>

        {file && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Arquivo selecionado: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={handleImport} disabled={!file || importing} className="w-full">
          {importing ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-pulse" />
              Importando... {progress}%
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Importar Resultados
            </>
          )}
        </Button>

        {importing && <Progress value={progress} className="w-full" />}
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Erros encontrados:</p>
              <ul className="text-sm space-y-1">
                {errors.slice(0, 5).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {errors.length > 5 && <li>• ... e mais {errors.length - 5} erros</li>}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {results.length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{results.length} resultados importados com sucesso!</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
