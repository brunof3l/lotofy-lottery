import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../../utils/supabaseServer';

const CAIXA_URL = 'https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest';

type CaixaLatest = {
  loteria: string;
  concurso: number;
  data: string; // dd/MM/yyyy
  dezenas: string[];
  [key: string]: any;
};

function parseDateBRtoISO(dateBR: string): string {
  const [d, m, y] = dateBR.split('/').map(Number);
  const iso = new Date(Date.UTC(y, (m || 1) - 1, d || 1)).toISOString().slice(0, 10);
  return iso;
}

async function fetchCaixaLatest(): Promise<CaixaLatest> {
  const res = await fetch(CAIXA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao consultar API da Caixa');
  return res.json();
}

async function upsertConcurso(payload: CaixaLatest) {
  const record = {
    numero: payload.concurso,
    data_apuracao: parseDateBRtoISO(payload.data),
    dezenas: payload.dezenas,
    payload,
  };
  const { data, error } = await supabaseServer
    .from('concursos')
    .upsert(record, { onConflict: 'numero' })
    .select()
    .single();
  if (error) throw error;
  return data ?? record;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // tenta pegar o último do banco
    const { data: latestDb } = await supabaseServer
      .from('concursos')
      .select('*')
      .order('numero', { ascending: false })
      .limit(1)
      .maybeSingle();

    // sempre tenta atualizar com o mais recente da Caixa
    const latestCaixa = await fetchCaixaLatest();
    const saved = await upsertConcurso(latestCaixa);

    // retorna aquele com maior numero (entre banco e caixa)
    const best = !latestDb || (saved && saved.numero >= latestDb.numero) ? saved : latestDb;
    res.status(200).json(best);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
}
