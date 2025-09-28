"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, X, Save } from "lucide-react"

interface ManualEntryProps {
  onResultAdded: (result: any) => void
}

export function ManualEntry({ onResultAdded }: ManualEntryProps) {
  const [contestNumber, setContestNumber] = useState("")
  const [drawDate, setDrawDate] = useState("")
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleNumberClick = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== number))
    } else if (selectedNumbers.length < 15) {
      setSelectedNumbers((prev) => [...prev, number].sort((a, b) => a - b))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contestNumber || !drawDate || selectedNumbers.length !== 15) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos e selecione exatamente 15 números.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/lottery-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contest_number: Number.parseInt(contestNumber),
          draw_date: drawDate,
          numbers: selectedNumbers,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar resultado")
      }

      const data = await response.json()
      onResultAdded(data.data[0])

      // Reset form
      setContestNumber("")
      setDrawDate("")
      setSelectedNumbers([])

      toast({
        title: "Resultado adicionado",
        description: `Concurso ${contestNumber} salvo com sucesso.`,
      })
    } catch (error) {
      console.error("Error adding result:", error)
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearSelection = () => {
    setSelectedNumbers([])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contest">Número do Concurso</Label>
          <Input
            id="contest"
            type="number"
            value={contestNumber}
            onChange={(e) => setContestNumber(e.target.value)}
            placeholder="Ex: 3001"
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data do Sorteio</Label>
          <Input id="date" type="date" value={drawDate} onChange={(e) => setDrawDate(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Números Sorteados ({selectedNumbers.length}/15)</Label>
          {selectedNumbers.length > 0 && (
            <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 25 }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              type="button"
              variant={selectedNumbers.includes(number) ? "default" : "outline"}
              size="sm"
              onClick={() => handleNumberClick(number)}
              disabled={!selectedNumbers.includes(number) && selectedNumbers.length >= 15}
              className="aspect-square"
            >
              {number}
            </Button>
          ))}
        </div>

        {selectedNumbers.length > 0 && (
          <div className="space-y-2">
            <Label>Números Selecionados:</Label>
            <div className="flex flex-wrap gap-1">
              {selectedNumbers.map((number) => (
                <Badge key={number} variant="secondary">
                  {number}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading || selectedNumbers.length !== 15} className="w-full">
        {loading ? (
          <>
            <Plus className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar Resultado
          </>
        )}
      </Button>
    </form>
  )
}
