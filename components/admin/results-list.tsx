import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Hash } from "lucide-react"

interface ResultsListProps {
  results: any[]
}

export function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nenhum resultado encontrado</div>
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Hash className="h-4 w-4 mr-1" />
                  Concurso {result.contest_number}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(result.draw_date).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {result.numbers.map((number: number, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {number.toString().padStart(2, "0")}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
