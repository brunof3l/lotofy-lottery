-- Adicionar colunas para rastreamento de prêmios
ALTER TABLE public.user_predictions 
ADD COLUMN IF NOT EXISTS contest_number INTEGER,
ADD COLUMN IF NOT EXISTS prize_level INTEGER,
ADD COLUMN IF NOT EXISTS is_winner BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS checked_at TIMESTAMP WITH TIME ZONE;

-- Criar tabela para histórico de verificações de prêmios
CREATE TABLE IF NOT EXISTS public.prize_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  prediction_id UUID NOT NULL REFERENCES public.user_predictions(id) ON DELETE CASCADE,
  contest_number INTEGER NOT NULL,
  predicted_numbers INTEGER[] NOT NULL,
  drawn_numbers INTEGER[] NOT NULL,
  matches INTEGER[] NOT NULL,
  misses INTEGER[] NOT NULL,
  match_count INTEGER NOT NULL,
  prize_level INTEGER,
  prize_description TEXT,
  is_winner BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_predictions_contest ON public.user_predictions(contest_number);
CREATE INDEX IF NOT EXISTS idx_user_predictions_winner ON public.user_predictions(is_winner);
CREATE INDEX IF NOT EXISTS idx_prize_verifications_user ON public.prize_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_prize_verifications_contest ON public.prize_verifications(contest_number);
CREATE INDEX IF NOT EXISTS idx_prize_verifications_winner ON public.prize_verifications(is_winner);

-- Habilitar RLS na nova tabela
ALTER TABLE public.prize_verifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para prize_verifications
CREATE POLICY "Users can view their own prize verifications" ON public.prize_verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prize verifications" ON public.prize_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para atualizar estatísticas de prêmios do usuário
CREATE OR REPLACE FUNCTION update_user_prize_stats(user_uuid UUID)
RETURNS TABLE (
  total_predictions BIGINT,
  total_winners BIGINT,
  win_rate NUMERIC,
  best_result INTEGER,
  prize_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_predictions,
    COUNT(*) FILTER (WHERE is_winner = true) as total_winners,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE is_winner = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as win_rate,
    COALESCE(MAX(match_count), 0) as best_result,
    jsonb_object_agg(
      prize_description, 
      count
    ) FILTER (WHERE prize_description IS NOT NULL) as prize_breakdown
  FROM (
    SELECT 
      match_count,
      prize_description,
      is_winner,
      COUNT(*) as count
    FROM public.prize_verifications 
    WHERE user_id = user_uuid
    GROUP BY match_count, prize_description, is_winner
  ) stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View para estatísticas gerais de prêmios
CREATE OR REPLACE VIEW public.prize_statistics AS
SELECT 
  COUNT(DISTINCT user_id) as total_users_with_predictions,
  COUNT(*) as total_predictions_verified,
  COUNT(*) FILTER (WHERE is_winner = true) as total_winners,
  ROUND(AVG(match_count), 2) as average_matches,
  MAX(match_count) as best_result_ever,
  jsonb_object_agg(
    prize_description, 
    count
  ) FILTER (WHERE prize_description IS NOT NULL) as prize_distribution
FROM (
  SELECT 
    user_id,
    match_count,
    prize_description,
    is_winner,
    COUNT(*) as count
  FROM public.prize_verifications 
  GROUP BY user_id, match_count, prize_description, is_winner
) stats;
