import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../../utils/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabaseServer
      .from('concursos')
      .select('dezenas')
      .order('numero', { ascending: false })
      .limit(1000);

    if (error) throw error;

    const freq = Array(25).fill(0);
    (data || []).forEach((row: any) => {
      (row.dezenas || []).forEach((d: string | number) => {
        const n = typeof d === 'string' ? parseInt(d, 10) : d;
        if (n >= 1 && n <= 25) freq[n - 1]++;
      });
    });

    const result = freq.map((f, i) => ({ dezena: i + 1, frequencia: f }));
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
}
