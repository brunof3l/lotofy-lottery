-- Create users profile table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lottery results table for historical data
CREATE TABLE IF NOT EXISTS public.lottery_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_number INTEGER NOT NULL UNIQUE,
  draw_date DATE NOT NULL,
  numbers INTEGER[] NOT NULL CHECK (array_length(numbers, 1) = 15),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user predictions table
CREATE TABLE IF NOT EXISTS public.user_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contest_number INTEGER,
  predicted_numbers INTEGER[] NOT NULL CHECK (array_length(predicted_numbers, 1) = 15),
  prediction_method TEXT NOT NULL, -- 'statistical', 'random', 'manual'
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create statistical analysis table
CREATE TABLE IF NOT EXISTS public.number_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number_value INTEGER NOT NULL CHECK (number_value >= 1 AND number_value <= 25),
  frequency INTEGER NOT NULL DEFAULT 0,
  last_appearance_contest INTEGER,
  days_since_last_draw INTEGER DEFAULT 0,
  hot_cold_status TEXT CHECK (hot_cold_status IN ('hot', 'cold', 'neutral')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lottery_results_contest ON public.lottery_results(contest_number);
CREATE INDEX IF NOT EXISTS idx_lottery_results_date ON public.lottery_results(draw_date);
CREATE INDEX IF NOT EXISTS idx_user_predictions_user ON public.user_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_predictions_contest ON public.user_predictions(contest_number);
CREATE INDEX IF NOT EXISTS idx_number_statistics_value ON public.number_statistics(number_value);
CREATE INDEX IF NOT EXISTS idx_number_statistics_frequency ON public.number_statistics(frequency DESC);
