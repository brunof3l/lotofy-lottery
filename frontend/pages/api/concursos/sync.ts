import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../../utils/supabaseServer';

const CAIXA_URL = 'https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest';

function parseDateBRtoISO(dateBR: string): string {
  const [d, m, y] = dateBR.split('/').map(Number);
  const iso = new Date(Date.UTC(y, (m || 1) - 1, d || 1)).toISOString().slice(0, 10);
  return iso;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const r = await fetch(CAIXA_URL, { cache: 'no-store' });
    if (!r.ok) throw new Error('Falha ao consultar API da Caixa');
    const payload = await r.json();

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
    res.status(200).json(data ?? record);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
}
