-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create admin user (you can change this email to your admin email)
-- This will be executed after the profile trigger creates the profile
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'brunynho3l@gmail.com';

-- Create admin statistics view
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_month,
  (SELECT COUNT(*) FROM public.user_predictions) as total_predictions,
  (SELECT COUNT(*) FROM public.lottery_results) as total_contests,
  (SELECT MAX(contest_number) FROM public.lottery_results) as latest_contest;
