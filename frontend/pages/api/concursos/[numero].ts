import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../../utils/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { numero } = req.query;
  const parsed = Number(numero);
  if (!parsed) return res.status(400).json({ error: 'numero inválido' });

  const { data, error } = await supabaseServer
    .from('concursos')
    .select('*')
    .eq('numero', parsed)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Concurso não encontrado' });
  res.status(200).json(data);
}
