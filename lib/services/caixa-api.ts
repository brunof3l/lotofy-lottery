// lib/services/caixa-api.ts

export interface CaixaLotofacilResult {
  loteria: string
  concurso: number
  data: string
  local: string
  dezenasOrdemSorteio: string[]
  dezenas: string[]
  trevos: any[]
  timeCoracao: any
  mesSorte: any
  premiacoes: Array<{
    descricao: string
    faixa: number
    ganhadores: number
    valorPremio: number
  }>
  estadosPremiados: any[]
  observacao: string
  acumulou: boolean
  proximoConcurso: number
  dataProximoConcurso: string
  localGanhadores: Array<{
    ganhadores: number
    municipio: string
    nomeFatansiaUL: string
    serie: string
    posicao: number
    uf: string
  }>
  valorArrecadado: number
  valorAcumuladoConcurso_0_5: number
  valorAcumuladoConcursoEspecial: number
  valorAcumuladoProximoConcurso: number
  valorEstimadoProximoConcurso: number
}

export interface ProcessedLotofacilResult {
  contest_number: number
  draw_date: string
  numbers: number[]
  draw_order: number[]
  total_winners: number
  total_revenue: number
  accumulated: boolean
  next_contest: number
  next_contest_date: string
  estimated_next_prize: number
}

const CAIXA_API_BASE = 'https://loteriascaixa-api.herokuapp.com/api'

export class CaixaApiService {
  /**
   * Busca o último resultado da Lotofácil
   */
  static async getLatestResult(): Promise<ProcessedLotofacilResult | null> {
    try {
      const response = await fetch(`${CAIXA_API_BASE}/lotofacil/latest`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CaixaLotofacilResult = await response.json()
      
      return this.processResult(data)
    } catch (error) {
      console.error('Erro ao buscar último resultado da Lotofácil:', error)
      return null
    }
  }

  /**
   * Busca resultado de um concurso específico
   */
  static async getResultByContest(contestNumber: number): Promise<ProcessedLotofacilResult | null> {
    try {
      const response = await fetch(`${CAIXA_API_BASE}/lotofacil/${contestNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CaixaLotofacilResult = await response.json()
      
      return this.processResult(data)
    } catch (error) {
      console.error(`Erro ao buscar concurso ${contestNumber}:`, error)
      return null
    }
  }

  /**
   * Processa o resultado da API da Caixa para o formato do nosso banco
   */
  private static processResult(data: CaixaLotofacilResult): ProcessedLotofacilResult {
    // Converter strings para números
    const numbers = data.dezenas.map(num => parseInt(num))
    const drawOrder = data.dezenasOrdemSorteio.map(num => parseInt(num))
    
    // Converter data do formato DD/MM/YYYY para YYYY-MM-DD
    const [day, month, year] = data.data.split('/')
    const drawDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    
    // Converter data do próximo concurso
    const [nextDay, nextMonth, nextYear] = data.dataProximoConcurso.split('/')
    const nextContestDate = `${nextYear}-${nextMonth.padStart(2, '0')}-${nextDay.padStart(2, '0')}`
    
    // Calcular total de ganhadores
    const totalWinners = data.premiacoes.reduce((sum, premio) => sum + premio.ganhadores, 0)

    return {
      contest_number: data.concurso,
      draw_date: drawDate,
      numbers,
      draw_order: drawOrder,
      total_winners: totalWinners,
      total_revenue: data.valorArrecadado,
      accumulated: data.acumulou,
      next_contest: data.proximoConcurso,
      next_contest_date: nextContestDate,
      estimated_next_prize: data.valorEstimadoProximoConcurso,
    }
  }

  /**
   * Verifica se um concurso já existe no banco
   */
  static async checkContestExists(contestNumber: number, supabase: any): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('lottery_results')
        .select('id')
        .eq('contest_number', contestNumber)
        .single()

      return !error && !!data
    } catch (error) {
      console.error('Erro ao verificar se concurso existe:', error)
      return false
    }
  }

  /**
   * Sincroniza o último resultado com o banco de dados
   */
  static async syncLatestResult(supabase: any): Promise<{
    success: boolean
    data?: ProcessedLotofacilResult
    message: string
  }> {
    try {
      // Buscar último resultado da API
      const latestResult = await this.getLatestResult()
      
      if (!latestResult) {
        return {
          success: false,
          message: 'Não foi possível obter o último resultado da API'
        }
      }

      // Verificar se já existe no banco
      const exists = await this.checkContestExists(latestResult.contest_number, supabase)
      
      if (exists) {
        return {
          success: true,
          data: latestResult,
          message: `Concurso ${latestResult.contest_number} já existe no banco`
        }
      }

      // Inserir no banco
      const { data, error } = await supabase
        .from('lottery_results')
        .upsert({
          contest_number: latestResult.contest_number,
          draw_date: latestResult.draw_date,
          numbers: latestResult.numbers,
        }, { onConflict: 'contest_number' })
        .select()
        .single()

      if (error) {
        return {
          success: false,
          message: (error as any)?.message || 'Erro de escrita no Supabase (talvez RLS sem service role)'
        }
      }

      return {
        success: true,
        data: latestResult,
        message: `Concurso ${latestResult.contest_number} sincronizado com sucesso`
      }
    } catch (error) {
      console.error('Erro ao sincronizar último resultado:', error)
      return {
        success: false,
        message: `Erro ao sincronizar: ${error}`
      }
    }
  }
}
