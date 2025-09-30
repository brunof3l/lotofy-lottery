import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../../utils/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { from, to, limit } = req.query as { from?: string; to?: string; limit?: string };

  let query = supabaseServer.from('concursos').select('*');
  if (from) query = query.gte('data_apuracao', from);
  if (to) query = query.lte('data_apuracao', to);
  query = query.order('numero', { ascending: false });
  if (limit) query = query.limit(Number(limit));

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data ?? []);
}
