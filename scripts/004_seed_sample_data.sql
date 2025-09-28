-- Insert some sample lottery results for testing
INSERT INTO public.lottery_results (contest_number, draw_date, numbers) VALUES
(3200, '2024-01-15', ARRAY[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 2, 4]),
(3201, '2024-01-17', ARRAY[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 1, 3, 5]),
(3202, '2024-01-19', ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
(3203, '2024-01-22', ARRAY[11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]),
(3204, '2024-01-24', ARRAY[1, 5, 9, 13, 17, 21, 25, 3, 7, 11, 15, 19, 23, 2, 6])
ON CONFLICT (contest_number) DO NOTHING;
