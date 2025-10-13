-- Add display_name column to profiles for public leaderboard
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add show_on_leaderboard column for opt-in privacy
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS show_on_leaderboard BOOLEAN DEFAULT true;

-- Create a public view for leaderboard that respects privacy
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
  COALESCE(display_name, 'User #' || ROW_NUMBER() OVER (ORDER BY points DESC)) as display_name,
  points
FROM public.profiles
WHERE show_on_leaderboard = true
ORDER BY points DESC
LIMIT 50;

-- Grant access to the view
GRANT SELECT ON public.leaderboard_view TO authenticated, anon;