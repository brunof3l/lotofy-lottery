-- Function to update number statistics after new lottery result
CREATE OR REPLACE FUNCTION update_number_statistics()
RETURNS TRIGGER AS $$
DECLARE
  num INTEGER;
  current_contest INTEGER;
BEGIN
  current_contest := NEW.contest_number;
  
  -- Update statistics for each number in the result
  FOREACH num IN ARRAY NEW.numbers
  LOOP
    INSERT INTO public.number_statistics (number_value, frequency, last_appearance_contest, days_since_last_draw)
    VALUES (num, 1, current_contest, 0)
    ON CONFLICT (number_value) DO UPDATE SET
      frequency = number_statistics.frequency + 1,
      last_appearance_contest = current_contest,
      days_since_last_draw = 0,
      updated_at = NOW();
  END LOOP;
  
  -- Update days_since_last_draw for numbers not in this draw
  UPDATE public.number_statistics 
  SET days_since_last_draw = days_since_last_draw + 1,
      updated_at = NOW()
  WHERE number_value != ALL(NEW.numbers);
  
  -- Update hot/cold status based on frequency and recency
  UPDATE public.number_statistics
  SET hot_cold_status = CASE
    WHEN frequency >= (SELECT AVG(frequency) * 1.2 FROM public.number_statistics) AND days_since_last_draw <= 10 THEN 'hot'
    WHEN frequency <= (SELECT AVG(frequency) * 0.8 FROM public.number_statistics) OR days_since_last_draw >= 30 THEN 'cold'
    ELSE 'neutral'
  END,
  updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic statistics update
DROP TRIGGER IF EXISTS trigger_update_statistics ON public.lottery_results;
CREATE TRIGGER trigger_update_statistics
  AFTER INSERT ON public.lottery_results
  FOR EACH ROW
  EXECUTE FUNCTION update_number_statistics();

-- Function to initialize number statistics (1-25)
CREATE OR REPLACE FUNCTION initialize_number_statistics()
RETURNS VOID AS $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..25 LOOP
    INSERT INTO public.number_statistics (number_value, frequency, hot_cold_status)
    VALUES (i, 0, 'neutral')
    ON CONFLICT (number_value) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Initialize the statistics
SELECT initialize_number_statistics();
