-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.number_statistics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Lottery results policies (public read access)
CREATE POLICY "Anyone can view lottery results" ON public.lottery_results
  FOR SELECT USING (true);

-- Permite que qualquer um insira resultados, ideal para uma API pública ou um script de servidor.
CREATE POLICY "Anyone can insert lottery results" ON public.lottery_results
  FOR INSERT WITH CHECK (true);

-- User predictions policies
CREATE POLICY "Users can view their own predictions" ON public.user_predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions" ON public.user_predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictions" ON public.user_predictions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions" ON public.user_predictions
  FOR DELETE USING (auth.uid() = user_id);

-- Number statistics policies (public read access)
CREATE POLICY "Anyone can view number statistics" ON public.number_statistics
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can update statistics" ON public.number_statistics
  FOR UPDATE WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert statistics" ON public.number_statistics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
