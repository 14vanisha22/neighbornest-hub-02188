-- Drop the security definer view (it's causing security warnings)
DROP VIEW IF EXISTS public.leaderboard_view;

-- Update the handle_new_user function to set display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name, created_at)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'full_name',
    NOW()
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Create RLS policy for public leaderboard access
CREATE POLICY "Public can view leaderboard participants"
ON public.profiles
FOR SELECT
USING (show_on_leaderboard = true);

-- Comment explaining the security model
COMMENT ON COLUMN public.profiles.show_on_leaderboard IS 'When true, user display_name and points are visible on public leaderboard';
COMMENT ON COLUMN public.profiles.display_name IS 'Public username shown on leaderboard instead of full_name';